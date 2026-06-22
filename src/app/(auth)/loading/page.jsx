"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserContext from "../../../Context/UserContext";
import { motion } from "framer-motion";

function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const { profile } = useContext(UserContext);
  const route = useRouter();

  // ⏳ Progress bar animation
  useEffect(() => {
    const duration = 2000;
    const interval = 100;
    const steps = duration / interval;
    const increment = 100 / steps;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, []);

  // redirect after progress completes
  useEffect(() => {
    if (progress !== 100) return;

    if (profile !== null) {
      route.push("/");
    } else {
      route.push("/register");
    }
  }, [profile, progress, route]);

  return (
    <div className="flex flex-col bg-[#0c0f0e] items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-Playfair text-white">
          Wabau.
        </h1>
      </motion.div>

      <div className="w-full mt-4 justify-center flex items-center gap-x-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-44 md:max-w-48 h-2 bg-gray-200 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-green-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-xs font-raleway font-bold text-gray-100">
            {Math.round(progress)} %
          </h1>
        </motion.div>
      </div>
    </div>
  );
}

export default LoadingPage;
