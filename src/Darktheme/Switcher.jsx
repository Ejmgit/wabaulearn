"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import useDarkSide from "./useDarkSide";
import { usePathname } from "next/navigation";

const Switcher = () => {
  const [colorTheme, setTheme] = useDarkSide();
  const [isDark, setIsDark] = useState(colorTheme === "light");
  const location = usePathname();
  const [Visible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 600) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const toggleDarkMode = () => {
    setTheme(colorTheme);
    setIsDark(!isDark);
  };

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
    duration: 0.5,
  };

  const iconVariants = {
    initial: { scale: 0, opacity: 0, rotate: -90 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0, opacity: 0, rotate: 90 },
  };

  // 👇 NEW: Allowed light-background routes
  const lightRoutes = ["/", "/donate", "/career", "/aboutus/whoweare"];
  const isLightRoute = lightRoutes.includes(location);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={toggleDarkMode}
        className="relative rounded-lg transition-all duration-500 hover:scale-110"
        aria-label="Toggle theme"
      >
        <div className="relative w-6 h-6">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="moon"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={spring}
                className="absolute inset-0"
              >
                <Moon
                  className="w-6 h-6 text-white"
                  strokeWidth={2}
                  fill="white"
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={spring}
                className="absolute inset-0"
              >
                <Sun
                  className={`w-6 h-6 ${
                    isLightRoute
                      ? Visible
                        ? "text-black"
                        : "text-white"
                      : "text-black"
                  }`}
                  strokeWidth={2}
                  fill={isLightRoute ? (Visible ? "black" : "white") : "black"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </div>
  );
};

export default Switcher;
