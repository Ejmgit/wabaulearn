"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

// const TRENDING = [
//   "Typhoid Fever",
//   "Artemether-Lumefantrine",
//   "XDR Typhoid resistance",
//   "Postpartum haemorrhage",
//   "Mpox guidelines 2026",
// ];

// Animation variants
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay },
  },
});

export default function HeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section
      className="relative w-full flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 120% at 60% 50%, #1a4a35 0%, #0d2b1e 45%, #081a12 100%)",
      }}
    >
      {/* Subtle dot-grid texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 w-[55%] h-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 40%, rgba(52,211,153,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full container mx-auto  py-16 md:py-20">
        {/* Eyebrow */}
        <motion.p
          variants={fadeIn(0)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-5"
        >
          <span
            className="block hidden h-px w-7"
            style={{ background: "rgba(52,211,153,0.6)" }}
          />
          <span
            className="text-[10px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: "rgba(52,211,153,0.8)" }}
          >
            Welcome back, Dr. Osei-Bonsu
          </span>
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={fadeUp(0.1)}
          initial="hidden"
          animate="visible"
          className="text-[2.6rem] md:text-[3.2rem] font-bold leading-[1.12] tracking-tight text-white mb-5"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Clinical intelligence,{" "}
          <em
            className="not-italic font-bold"
            style={{
              fontStyle: "italic",
              color: "#34d399",
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          >
            built for African
            <br />
            medicine.
          </em>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp(0.2)}
          initial="hidden"
          animate="visible"
          className="text-sm md:text-base leading-relaxed max-w-lg mb-10"
          style={{ color: "rgba(255,255,255,0.62)" }}
        >
          Evidence-scored reference, real-case CME, and living protocols
          calibrated to African disease burden, drug availability, and standard
          treatment guidelines.
        </motion.p>

        {/* Search bar */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 max-w-xl mb-7"
        >
          <div
            className="flex flex-1 items-center gap-2 rounded-lg px-4 py-3 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onFocus={() => {}}
          >
            <Search
              size={15}
              strokeWidth={2}
              style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conditions, drugs, guidelines, or CME modules..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-white/35 text-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03, brightness: 1.1 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all duration-150"
            style={{ background: "#22c55e" }}
          >
            Search
          </motion.button>
        </motion.div>

        {/* Trending pills */}
        {/* <motion.div
          variants={fadeIn(0.45)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-2"
        >
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase mr-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Trending:
          </span>
          {TRENDING.map((tag, i) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.07,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                backgroundColor: "rgba(52,211,153,0.18)",
                borderColor: "rgba(52,211,153,0.55)",
                color: "#6ee7b7",
                scale: 1.02,
              }}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
}
