// "use client";

// import React, { useContext, useEffect } from "react";
// import UserContext from "../Context/UserContext";
// import { usePathname } from "next/navigation";

// function NavBar() {
//   //   const { profile } = useContext(UserContext);
//   const pathname = usePathname();

//   return (
//     <div className={`${pathname === "/login" ? "hidden" : ""}`}>
//       <div></div>
//     </div>
//   );
// }

// export default NavBar;
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  LogIn,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Clinical News", href: "#" },
  { label: "Reference", href: "#" },
  { label: "CME", href: "#" },
  { label: "Cases", href: "#", active: true },
  { label: "Drugs", href: "#" },
];

export default function Navbar() {
  // Demo-only auth state so the component is self-contained.
  // Wire `isLoggedIn` / `user` up to real auth state in your app.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Cases");
  const menuRef = useRef(null);

  const user = {
    name: "Amara Quinn",
    email: "amara.quinn@wabau.com",
    avatarColor: "#7CC9A0",
  };

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // close dropdown on escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <nav className="w-full bg-[#15171a] border-b border-white/5 px-6 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-baseline gap-2 shrink-0 group">
          <span
            className="text-[26px] leading-none text-[#f3f1ea] tracking-tight group-hover:text-white transition-colors"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 800,
            }}
          >
            Wabau
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#7CC9A0] font-semibold">
            LEARN
          </span>
        </a>

        {/* Center nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeLink === link.label;
            return (
              <li key={link.label} className="relative">
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.label);
                  }}
                  className={`relative z-10 block px-4 py-2 text-[14px] font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-[#7CC9A0]"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {link.label}
                </a>
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-white/[0.06] rounded-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right side: auth area */}
        <div className="flex items-center">
          {!isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsLoggedIn(true)}
              className="flex items-center gap-2 bg-[#7CC9A0] hover:bg-[#8fd4ad] text-[#102017] text-[14px] font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <LogIn size={16} strokeWidth={2.5} />
              Login
            </motion.button>
          ) : (
            <div className="relative" ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition-colors duration-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-[#102017]"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {initials}
                </div>
                <span className="text-[14px] text-gray-200 font-medium hidden sm:block">
                  {user.name.split(" ")[0]}
                </span>
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
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 bg-[#1c1f23] border border-white/10 rounded-lg shadow-2xl overflow-hidden origin-top-right z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-[14px] font-semibold text-gray-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-[12px] text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <ul className="py-1">
                      <DropdownItem
                        icon={<User size={16} />}
                        label="User Profile"
                        onClick={() => setMenuOpen(false)}
                      />
                      <DropdownItem
                        icon={<LayoutDashboard size={16} />}
                        label="Dashboard"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="my-1 border-t border-white/5" />
                      <DropdownItem
                        icon={<LogOut size={16} />}
                        label="Logout"
                        danger
                        onClick={() => {
                          setIsLoggedIn(false);
                          setMenuOpen(false);
                        }}
                      />
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ icon, label, onClick, danger }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] transition-colors duration-150 ${
          danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
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
