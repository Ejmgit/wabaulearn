"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase2 } from "@/Config/Supabase";

const NAV_LINKS = [
  { label: "Clinical News", href: "/" },
  { label: "Reference", href: "/reference" },
  { label: "CME", href: "/cve" },
  { label: "Cases", href: "/cases" },
  { label: "Drugs", href: "/drugs" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  const menuRef = useRef(null);
  const pathname = usePathname();

  // Fetch profile only after userData is available
  const getProfile = async (userId) => {
    const { data, error } = await supabase2
      .from("profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  // Get user from Supabase session (source of truth), sync localStorage
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase2.auth.getUser();

    if (!user) {
      // No active session — clear everything
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserData(null);
      setProfile(null);
      return;
    }

    const session = await supabase2.auth.getSession();
    const token = session?.data?.session?.access_token;
    if (token) localStorage.setItem("token", token);

    setIsLoggedIn(true);
    setUserData({ id: user.id, email: user.email });
    // Fetch profile now that we have the userId
    await getProfile(user.id);
  };

  const handleLogout = async () => {
    await supabase2.auth.signOut();
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    setMobileNavOpen(false);
    setUserData(null);
    setProfile(null);
  };

  useEffect(() => {
    getUser();

    // Listen for auth state changes (e.g. token expiry, login from another tab)
    const {
      data: { subscription },
    } = supabase2.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserData({ id: session.user.id, email: session.user.email });
        getProfile(session.user.id);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        setProfile(null);
        localStorage.removeItem("token");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Close mobile nav when route changes
  useEffect(() => {
    setMobileNavOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const displayName = profile?.full_name ?? userData?.email ?? "";
  const displayEmail = profile?.email ?? userData?.email ?? "";

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const paths = ["/loading", "/login", "/dashboard", "dashboard/userprofile"];

  return (
    <nav
      className={`${
        paths.includes(pathname) ? "md:hidden" : ""
      } ${pathname.startsWith("/studio") ? "hidden" : ""} w-full top-0 sticky z-50 bg-[#15171a] border-b border-white/5 px-6 py-3 font-sans`}
    >
      <div className="xl:container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-2 shrink-0 group">
          <span
            className="text-[26px] leading-none text-[#f3f1ea] tracking-tight group-hover:text-white transition-colors"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 800,
            }}
          >
            Wabau
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#129e5f] font-semibold">
            LEARN
          </span>
        </Link>

        {/* Center nav links — desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label} className="relative">
                <Link
                  href={link.href}
                  className={`relative z-10 block px-4 py-2 text-[14px] font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-[#7CC9A0]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-white/6 rounded-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:flex cursor-pointer hover:text-black items-center text-white gap-2 bg-[#1a4a34] hover:bg-[#8fd4ad]  text-[14px] font-semibold px-4 py-2 rounded-md transition-colors duration-200"
              >
                <LogIn size={16} strokeWidth={2.5} />
                Login/Register
              </motion.button>
            </Link>
          ) : (
            <div className="relative hidden md:block" ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/6 hover:bg-white/10 transition-colors duration-200"
              >
                <Avatar initials={initials} />
                <motion.span
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400"
                >
                  <ChevronDown size={15} />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <UserDropdown
                    initials={initials}
                    name={displayName}
                    email={displayEmail}
                    onClose={() => setMenuOpen(false)}
                    onLogout={handleLogout}
                  />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-label="Toggle mobile menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-3 pb-4 border-t border-white/5 mt-3 flex flex-col gap-1">
              {/* Nav links */}
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors duration-150 ${
                      isActive
                        ? "text-[#7CC9A0] bg-white/6"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/4"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-white/5" />

              {/* Auth section */}
              {!isLoggedIn ? (
                <Link href="/login">
                  <button className="w-full flex items-center text-white justify-center gap-2 bg-[#1a4a34] hover:bg-[#8fd4ad] text-[14px] font-semibold px-4 py-2.5 rounded-md transition-colors duration-200">
                    <LogIn size={16} strokeWidth={2.5} />
                    Login / Register
                  </button>
                </Link>
              ) : (
                <div className="flex flex-col gap-1">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Avatar initials={initials} />
                    <div>
                      <p className="text-[14px] font-semibold text-gray-100 truncate">
                        {displayName}
                      </p>
                      <p className="text-[12px] text-gray-500 truncate">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <MobileMenuItem
                    icon={<User size={16} />}
                    label="User Profile"
                    href="/profile"
                  />
                  <MobileMenuItem
                    icon={<LayoutDashboard size={16} />}
                    label="Dashboard"
                    href="/dashboard"
                  />

                  <div className="my-1 border-t border-white/5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Avatar({ initials }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-[#102017] shrink-0"
      style={{ backgroundColor: "#7CC9A0" }}
    >
      {initials}
    </div>
  );
}

function UserDropdown({ initials, name, email, onClose, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="absolute right-0 mt-5 w-56 bg-[#1c1f23] border border-white/10 rounded-lg shadow-2xl overflow-hidden origin-top-right z-50"
    >
      <div className="px-4 py-3 flex gap-x-3 items-center border-b border-white/5">
        <Avatar initials={initials} />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-gray-100 truncate">
            {name}
          </p>
          <p className="text-[12px] text-gray-500 truncate">{email}</p>
        </div>
      </div>

      <ul className="py-1">
        <DropdownItem
          icon={<User size={16} />}
          label="User Profile"
          onClick={onClose}
        />
        <DropdownItem
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          onClick={onClose}
        />
        <div className="my-1 border-t border-white/5" />
        <DropdownItem
          icon={<LogOut size={16} />}
          label="Logout"
          danger
          onClick={onLogout}
        />
      </ul>
    </motion.div>
  );
}

function DropdownItem({ icon, label, onClick, danger }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-[14px] transition-colors duration-150 ${
          danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-gray-300 hover:bg-white/6 hover:text-white"
        }`}
      >
        <span className={danger ? "text-red-400" : "text-gray-400"}>
          {icon}
        </span>
        {label}
      </button>
    </li>
  );
}

function MobileMenuItem({ icon, label, href }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] text-gray-300 hover:bg-white/6 hover:text-white transition-colors duration-150"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}
