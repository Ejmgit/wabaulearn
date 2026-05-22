"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  XCircle,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Building2,
  Globe,
  BookOpen,
  Microscope,
  Stethoscope,
  Pill,
  GraduationCap,
  BarChart3,
  Cpu,
  ShieldCheck,
  Star,
  Users,
  CheckCircle,
  FileText,
  Loader,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { supabase2 } from "@/Config/Supabase";

/* ─── THEME TOKENS ─── */
const t = {
  bg: "#0c0f0e",
  surface: "#131816",
  surface2: "#1a1f1d",
  surface3: "#222826",
  border: "rgba(255,255,255,0.07)",
  ink: "#e8ede8",
  ink2: "#a8b5aa",
  ink3: "#6a7a6c",
  green: "#52c48e",
  green2: "#52c48e",
  green3: "#1a4a34",
  green4: "#0f2a1e",
  gold: "#c4922a",
  gold2: "#e8b84a",
  danger: "#f08080",
  dangerBg: "#3a1010",
  dangerBorder: "#8a2020",
};

const MotionCheckCircle = motion?.create(CheckCircle);

/* ─── ANIMATION VARIANTS ─── */
const viewVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.26, ease: "easeOut" },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.18 } },
};

const panelItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

/* ─── COUNTRY LIST ─── */
const COUNTRIES = {
  "East Africa": [
    "Kenya",
    "Uganda",
    "Tanzania",
    "Ethiopia",
    "Rwanda",
    "Burundi",
  ],
  "West Africa": ["Nigeria", "Ghana", "Senegal", "Côte d'Ivoire", "Cameroon"],
  "Southern Africa": [
    "South Africa",
    "Zambia",
    "Zimbabwe",
    "Malawi",
    "Mozambique",
  ],
  "North Africa": ["Egypt", "Sudan", "Morocco"],
  Other: ["Other African country", "Outside Africa"],
};

/* ─── SPECIALTIES ─── */
const SPECIALTIES = [
  "Infectious Diseases",
  "Internal Medicine / General Medicine",
  "Paediatrics",
  "Emergency Medicine",
  "Obstetrics & Gynaecology",
  "Surgery (General)",
  "Cardiology",
  "Oncology",
  "Neurology",
  "Psychiatry",
  "Radiology",
  "Anaesthesiology",
  "Pharmacology",
  "Public Health / Epidemiology",
  "Other",
];

/* ─── ROLES ─── */
const ROLES = [
  {
    id: "physician",
    Icon: Stethoscope,
    title: "Physician / Doctor",
    sub: "MD, MBChB, or equivalent",
  },
  {
    id: "nurse",
    Icon: User,
    title: "Nurse / NP",
    sub: "RN, BSN, advanced practice",
  },
  {
    id: "clinical_officer",
    Icon: ShieldCheck,
    title: "Clinical Officer",
    sub: "CO, ACO, or equivalent",
  },
  { id: "pharmacist", Icon: Pill, title: "Pharmacist", sub: "BPharm, PharmD" },
  {
    id: "student",
    Icon: GraduationCap,
    title: "Medical Student",
    sub: "Undergraduate or postgraduate",
  },
  {
    id: "researcher",
    Icon: Microscope,
    title: "Researcher",
    sub: "Clinical or public health",
  },
  {
    id: "public_health",
    Icon: BarChart3,
    title: "Public Health",
    sub: "MOH, NGO, global health",
  },
  {
    id: "health_tech",
    Icon: Cpu,
    title: "Health Technology",
    sub: "Digital health, HIT",
  },
];

/* ─── PASSWORD STRENGTH ─── */
function calcStrength(v) {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return score;
}
const STRENGTH_LABELS = [
  "",
  "Weak — add numbers & symbols",
  "Fair — try longer",
  "Good — almost there",
  "Strong ✓",
];
const STRENGTH_COLORS = ["", t.danger, t.gold2, t.green, t.green2];
const STRENGTH_BAR_COLORS = [
  "bg-[#8a2020]",
  "bg-[#8a2020]",
  "bg-amber-400",
  "bg-[#52c48e]",
  "bg-[#52c48e]",
];

/* ─── GOOGLE ICON ─── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      fill="#0077B5"
    />
  </svg>
);

/* ─── SHARED INPUT ─── */
function FormInput({
  icon: Icon,
  rightIcon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className = "",
}) {
  return (
    <div className="relative">
      {Icon && (
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: t.ink3 }}
        >
          <Icon size={15} />
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg px-3 py-[0.68rem] text-sm outline-none transition-all duration-150 ${Icon ? "pl-9" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
        style={{
          background: t.surface2,
          border: `1px solid ${error ? t.dangerBorder : t.border}`,
          color: t.ink,
          fontFamily: "'Outfit', sans-serif",
          backgroundColor: error ? "rgba(58,16,16,0.3)" : t.surface2,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? t.dangerBorder : t.green;
          e.target.style.background = error
            ? "rgba(58,16,16,0.3)"
            : "rgba(61,158,114,0.04)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? t.dangerBorder : t.border;
          e.target.style.background = error ? "rgba(58,16,16,0.3)" : t.surface2;
        }}
      />
    </div>
  );
}

/* ─── LABEL ─── */
function Label({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-[6px]">
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: t.ink3,
        }}
      >
        {children}
      </span>
      {right}
    </div>
  );
}

/* ─── FORM GROUP ─── */
function FormGroup({ label, labelRight, children, hint, error }) {
  return (
    <div className="mb-4">
      {label && <Label right={labelRight}>{label}</Label>}
      {children}
      {hint && (
        <p
          className="text-[11px] mt-1 leading-relaxed"
          style={{ color: hint.success ? t.green2 : t.ink3 }}
        >
          {hint.text}
        </p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] mt-1"
            style={{ color: t.danger }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── PRIMARY BUTTON ─── */
function BtnPrimary({ children, onClick, className = "", style = {} }) {
  return (
    <motion.button
      whileHover={{ y: -1, boxShadow: "0 4px 20px rgba(61,158,114,0.28)" }}
      whileTap={{ y: 0, boxShadow: "none" }}
      onClick={onClick}
      className={`w-full flex items-center text-white bg-[#1a4a34] hover:bg-[#52c48e]  hover:text-black justify-center gap-2 rounded-lg py-[0.78rem] text-sm font-semibold cursor-pointer mt-5 transition-colors ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* ─── SOCIAL BUTTON ─── */
function BtnSocial({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ borderColor: t.green, background: "rgba(61,158,114,0.05)" }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-lg py-[0.68rem] text-sm font-medium cursor-pointer mt-2"
      style={{
        background: t.surface2,
        color: t.ink2,
        border: `1px solid ${t.border}`,
        fontFamily: "'Outfit', sans-serif",
        transition: "all 0.15s",
      }}
    >
      {children}
    </motion.button>
  );
}

/* ─── OR DIVIDER ─── */
function OrDivider({ text = "or continue with" }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ background: t.border }} />
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: t.ink3,
        }}
      >
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: t.border }} />
    </div>
  );
}

/* ─── SELECT ─── */
function FormSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-lg px-3 py-[0.68rem] text-sm outline-none cursor-pointer appearance-none"
      style={{
        background: t.surface2,
        border: `1px solid ${t.border}`,
        color: value ? t.ink : t.ink3,
        fontFamily: "'Outfit', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236a7a6c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        paddingRight: "2.5rem",
      }}
      onFocus={(e) => (e.target.style.borderColor = t.green)}
      onBlur={(e) => (e.target.style.borderColor = t.border)}
    >
      {children}
    </select>
  );
}

/* ─── CHECKBOX ROW ─── */
function CheckRow({ id, checked, onChange, children }) {
  return (
    <div className="flex items-start gap-2 mb-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="mt-[2px] w-[15px] h-[15px] flex-shrink-0 cursor-pointer rounded"
        style={{ accentColor: t.green }}
      />
      <label
        htmlFor={id}
        className="text-[12px] leading-relaxed cursor-pointer"
        style={{ color: t.ink3 }}
      >
        {children}
      </label>
    </div>
  );
}

/* ─── STEP INDICATOR ─── */
function StepIndicator({ current }) {
  const steps = ["Identity", "Role", "Security", "Confirm"];
  return (
    <div className="flex items-center mb-7">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div
            key={n}
            className="flex items-center"
            style={{ flex: n < 4 ? "1" : "0" }}
          >
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  borderColor: done ? t.green2 : active ? t.green : t.border,
                  background: done ? t.green : active ? t.green3 : t.surface2,
                }}
                transition={{ duration: 0.25 }}
                className="w-7 h-7 rounded-full flex items-center justify-center relative z-10"
                style={{
                  border: "2px solid",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.58rem",
                  color: done ? "#fff" : active ? t.green2 : t.ink3,
                }}
              >
                {done ? <Check size={11} strokeWidth={3} /> : n}
              </motion.div>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.42rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: done ? t.green : active ? t.green2 : t.ink3,
                  whiteSpace: "nowrap",
                  transition: "color 0.25s",
                }}
              >
                {label}
              </span>
            </div>
            {n < 4 && (
              <motion.div
                animate={{ background: done ? t.green : t.border }}
                transition={{ duration: 0.25 }}
                className="flex-1 h-px mx-[-14px] relative"
                style={{ top: "-14px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── LEFT PANEL ─── */
function LeftPanel() {
  const stats = [
    { n: "14K+", l: "African clinicians", Icon: Users },
    { n: "1,240", l: "Clinical protocols", Icon: FileText },
    { n: "847", l: "Drug monographs", Icon: BookOpen },
  ];
  const features = [
    {
      Icon: Star,
      title: "Evidence-scored clinical reference",
      sub: "Every drug, disease, and protocol rated 1–5 stars by evidence quality",
    },
    {
      Icon: GraduationCap,
      title: "Real-case CME modules",
      sub: "Earn accredited CPD credits using anonymised African patient cases",
    },
    {
      Icon: Globe,
      title: "Africa-first clinical intelligence",
      sub: "Protocols calibrated to African disease burdens, drug availability, and STGs",
    },
    {
      Icon: Microscope,
      title: "Independent editorial oversight",
      sub: "5-member independent board audits 10% of content quarterly for bias",
    },
  ];

  return (
    <div
      className="hidden md:flex flex-col p-12 relative overflow-hidden"
      style={{
        background: t.green4,
        borderRight: `1px solid rgba(61,158,114,0.3)`,
      }}
    >
      {/* Glow effects */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(61,158,114,0.12) 0%, transparent 70%)",
          top: -100,
          right: -100,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(82,196,142,0.07) 0%, transparent 70%)",
          bottom: -50,
          left: -50,
        }}
      />

      {/* Brand */}
      <motion.div
        custom={0}
        variants={panelItemVariants}
        initial="hidden"
        animate="visible"
        className="mb-auto"
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: t.ink,
            letterSpacing: "0.08em",
          }}
        >
          Wabau <span style={{ color: t.green2 }}>Learn</span>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: t.green,
            marginTop: 2,
          }}
        >
          Clinical intelligence platform
        </div>
      </motion.div>

      {/* Quote */}
      <motion.blockquote
        custom={1}
        variants={panelItemVariants}
        initial="hidden"
        animate="visible"
        className="mt-8 mb-2"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.35rem",
          fontStyle: "italic",
          color: t.ink,
          lineHeight: 1.4,
          maxWidth: 380,
        }}
      >
        "The ancient Wabau carried the knowledge of healing as a sacred trust.
        We carry it forward."
      </motion.blockquote>
      <motion.p
        custom={2}
        variants={panelItemVariants}
        initial="hidden"
        animate="visible"
        className="mb-7"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: t.green,
        }}
      >
        — Wabau founding principle · Named after ancient Egyptian healer-priests
      </motion.p>

      {/* Stats */}
      <motion.div
        custom={3}
        variants={panelItemVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-3 mb-7"
      >
        {stats.map(({ n, l, Icon }) => (
          <div
            key={n}
            className="rounded-md p-3 text-center"
            style={{
              background: "rgba(61,158,114,0.06)",
              border: "1px solid rgba(61,158,114,0.12)",
            }}
          >
            <Icon
              size={14}
              className="mx-auto mb-1"
              style={{ color: t.green2 }}
            />
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: t.green2,
                lineHeight: 1,
              }}
            >
              {n}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.44rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: t.ink3,
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Features */}
      <div className="flex flex-col gap-3 mb-6">
        {features.map(({ Icon, title, sub }, i) => (
          <motion.div
            key={title}
            custom={4 + i}
            variants={panelItemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-start gap-3"
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(61,158,114,0.1)",
                border: "1px solid rgba(61,158,114,0.2)",
              }}
            >
              <Icon size={14} style={{ color: t.green2 }} />
            </div>
            <div>
              <div
                className="text-[13px] font-medium mb-0.5"
                style={{ color: t.ink }}
              >
                {title}
              </div>
              <div
                className="text-[11px] leading-relaxed"
                style={{ color: t.ink3 }}
              >
                {sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="pt-4 flex gap-4"
        style={{
          borderTop: "1px solid rgba(61,158,114,0.15)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.15em",
          color: t.ink3,
        }}
      >
        <span>No ads. Ever.</span>
        <span>·</span>
        <span>Editorial independence guaranteed</span>
        <span>·</span>
        <span>Data stays in Africa</span>
      </div>
    </div>
  );
}

/* ─── LOGIN VIEW ─── */
function LoginView({ onSwitch, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const route = useRouter();

  // handles user login details submission to database
  const loging = async () => {
    const { data, error } = await supabase2.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // error notifications
      setNotification({
        type: "error",
        message:
          error.message !== "Failed to fetch"
            ? error?.message
            : "Failed to login user account, please try again.",
      });
      setLoading(false);
    } else {
      // savetoken to local storage if needed
      setNotification({
        type: "success",
        message: "Success",
      });
      const { session } = data;
      //savetoken to local storage
      localStorage.setItem("token", session.access_token);

      // redirect to loading page
      route.push("loading");
    }
    setLoading(false);
  };

  const handleLogin = () => {
    const errs = {};
    if (!email || !email.includes("@"))
      errs.email = "Please enter a valid email address.";
    if (!password || password.length < 6)
      errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    if (!Object.keys(errs).length) {
      setLoading(true);
      loging();
    }
  };

  return (
    <motion.div
      key="login"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="mb-7">
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.55rem",
            fontWeight: 700,
            color: t.ink,
            marginBottom: 6,
          }}
        >
          Welcome back
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: t.ink3 }}>
          Sign in to access full clinical reference, CME modules, and your
          protocol library.
        </p>
      </div>

      <FormGroup label="Email address" error={errors.email}>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: t.ink3 }}
          >
            <Mail size={14} />
          </span>
          <input
            type="email"
            placeholder="you@hospital.or.ke"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: "" }));
            }}
            className="w-full rounded-lg pl-9 pr-3 py-[0.68rem] text-sm outline-none transition-all"
            style={{
              background: errors.email ? "rgba(58,16,16,0.3)" : t.surface2,
              border: `1px solid ${errors.email ? t.dangerBorder : t.border}`,
              color: t.ink,
              fontFamily: "'Outfit',sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.email
                ? t.dangerBorder
                : t.green;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.email
                ? t.dangerBorder
                : t.border;
            }}
          />
        </div>
      </FormGroup>

      <FormGroup
        label="Password"
        labelRight={
          <button
            onClick={onForgot}
            className="text-[11px] cursor-pointer hover:underline"
            style={{
              color: t.green2,
              background: "none",
              border: "none",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Forgot password?
          </button>
        }
        error={errors.password}
      >
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: t.ink3 }}
          >
            <Lock size={14} />
          </span>
          <input
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: "" }));
            }}
            className="w-full rounded-lg pl-9 pr-10 py-[0.68rem] text-sm outline-none transition-all"
            style={{
              background: errors.password ? "rgba(58,16,16,0.3)" : t.surface2,
              border: `1px solid ${errors.password ? t.dangerBorder : t.border}`,
              color: t.ink,
              fontFamily: "'Outfit',sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.password
                ? t.dangerBorder
                : t.green;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.password
                ? t.dangerBorder
                : t.border;
            }}
          />
          <button
            onClick={() => setShowPwd((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              background: "none",
              border: "none",
              color: t.ink3,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = t.green2)}
            onMouseLeave={(e) => (e.currentTarget.style.color = t.ink3)}
          >
            {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </FormGroup>

      <CheckRow
        id="remember"
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
      >
        Keep me signed in on this device
      </CheckRow>

      {/* Notification section */}
      {notification.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 rounded-lg px-4 py-3 text-sm"
          style={{
            background:
              notification.type === "error"
                ? "rgba(120,20,20,0.25)"
                : "rgba(20,120,60,0.25)",
            border: `1px solid ${
              notification.type === "error" ? t.dangerBorder : t.green
            }`,
            color: notification.type === "error" ? "#ffb4b4" : "#b8ffd3",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {notification?.message}
        </motion.div>
      )}

      <BtnPrimary onClick={handleLogin}>
        {loading ? (
          <>
            <Loader className="animate-spin text-2xl text-white [animation-duration:0.6s]" />{" "}
            <p className="text-white">Loading..</p>
          </>
        ) : (
          <>
            <span>Sign in to Wabau Learn</span>
            <ArrowRight size={15} />
          </>
        )}
      </BtnPrimary>

      <OrDivider />

      <p className="text-center text-[12.5px] mt-5" style={{ color: t.ink3 }}>
        New to Wabau?{" "}
        <button
          onClick={() => onSwitch("register")}
          className="cursor-pointer hover:underline"
          style={{
            color: t.green2,
            background: "none",
            border: "none",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Create a free account →
        </button>
      </p>
    </motion.div>
  );
}

/* ─── REGISTER VIEW ─── */
function RegisterView({ onSwitch }) {
  const [userData, setData] = useState({
    email: "",
    password: "",
    password2: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showNotification, setNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const strength = calcStrength(userData?.password);

  //   function which handles registration
  const handleRegister = async () => {
    setLoading(true);

    // validation section
    const errs = {};

    if (!userData?.email || !userData?.email.includes("@")) {
      errs.email = "Please enter a valid email address.";
    }

    if (!userData?.password) {
      errs.password = "Password is required.";
    } else if (userData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (!userData?.password2) {
      errs.password2 = "Please confirm your password.";
    } else if (userData.password !== userData.password2) {
      errs.password2 = "Passwords do not match!";
    }

    if (!userData?.password) {
      errs.password = "Password is required.";
    }

    if (!userData?.password2) {
      errs.password2 = "Please confirm your password.";
    }

    setErrors(errs);

    // stop register if validation fails
    if (Object.keys(errs).length > 0) {
      setLoading(false);
      return;
    }

    const { email, password } = userData;

    const { error } = await supabase2.auth.signUp({
      email,
      password,
    });

    if (error) {
      setNotification({
        type: "error",
        message:
          error.message !== "Failed to fetch"
            ? error?.message
            : "Failed to create user account, please try again.",
      });
      setLoading(false);
    } else {
      setNotifications(true);
      setLoading(false);
    }
  };

  //   function which handles input assignments
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // clear error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleClose = () => {
    setNotification(false);
    setLoading(false);
  };

  // resend verification email
  const handleClick = async (email) => {
    setIsLoading(true);

    const { data, error } = await supabase2.auth.signInWithOtp({ email });

    if (error) {
      // toast.error(error.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setData({
        email: "",
        password: "",
        password2: "",
      });
    }
  };

  return (
    <motion.div
      key="register"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative "
    >
      <div className="mb-5">
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.55rem",
            fontWeight: 700,
            color: t.ink,
            marginBottom: 6,
          }}
        >
          Create your account
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: t.ink3 }}>
          Join 14,000+ African clinicians. Free to access core reference
          content.
        </p>
      </div>

      {/* user register section */}
      <div>
        <FormGroup label="Email address" error={errors.email}>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: t.ink3 }}
            >
              <Mail size={14} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="you@hospital.or.ke"
              value={userData?.email}
              onChange={handleChange}
              className="w-full rounded-lg pl-9 pr-3 py-[0.68rem] text-sm outline-none transition-all"
              style={{
                background: errors.email ? "rgba(58,16,16,0.3)" : t.surface2,
                border: `1px solid ${errors.email ? t.dangerBorder : t.border}`,
                color: t.ink,
                fontFamily: "'Outfit',sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.email
                  ? t.dangerBorder
                  : t.green;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email
                  ? t.dangerBorder
                  : t.border;
              }}
            />
          </div>
        </FormGroup>

        {/* Password section */}
        <FormGroup label="Create password" error={errors.password}>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: t.ink3 }}
            >
              <Lock size={14} />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="Min. 8 characters"
              value={userData?.password}
              onChange={handleChange}
              className="w-full rounded-lg pl-9 pr-10 py-[0.68rem] text-sm outline-none"
              style={{
                background: errors.password ? "rgba(58,16,16,0.3)" : t.surface2,
                border: `1px solid ${errors.password ? t.dangerBorder : t.border}`,
                color: t.ink,
                fontFamily: "'Outfit',sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.password
                  ? t.dangerBorder
                  : t.green;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password
                  ? t.dangerBorder
                  : t.border;
              }}
            />
            <button
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ background: "none", border: "none", color: t.ink3 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.green2)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.ink3)}
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {/* Strength bars */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  background:
                    i <= strength ? STRENGTH_COLORS[strength] : t.surface3,
                }}
                transition={{ duration: 0.3 }}
                className="flex-1 h-0.75 rounded-full"
              />
            ))}
          </div>
          {userData?.password && (
            <p
              className="text-[10.5px] mt-1"
              style={{
                color: STRENGTH_COLORS[strength],
                fontFamily: "'DM Mono',monospace",
                letterSpacing: "0.1em",
              }}
            >
              {STRENGTH_LABELS[strength]}
            </p>
          )}
        </FormGroup>

        {/* confirm password section */}
        <FormGroup label="Confirm Password" error={errors?.password2}>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: t.ink3 }}
            >
              <Lock size={14} />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              name="password2"
              placeholder="••••••••"
              value={userData?.password2}
              onChange={handleChange}
              className="w-full rounded-lg pl-9 pr-10 py-[0.68rem] text-sm outline-none transition-all"
              style={{
                background: errors.password2
                  ? "rgba(58,16,16,0.3)"
                  : t.surface2,
                border: `1px solid ${errors.password ? t.dangerBorder : t.border}`,
                color: t.ink,
                fontFamily: "'Outfit',sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.password2
                  ? t.dangerBorder
                  : t.green;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password2
                  ? t.dangerBorder
                  : t.border;
              }}
            />
            <button
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                background: "none",
                border: "none",
                color: t.ink3,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.green2)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.ink3)}
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FormGroup>

        {/* Notification section */}
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-lg px-4 py-3 text-sm"
            style={{
              background:
                notification.type === "error"
                  ? "rgba(120,20,20,0.25)"
                  : "rgba(20,120,60,0.25)",
              border: `1px solid ${
                notification.type === "error" ? t.dangerBorder : t.green
              }`,
              color: notification.type === "error" ? "#ffb4b4" : "#b8ffd3",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {notification?.message}
          </motion.div>
        )}

        {/* Registration button */}
        <BtnPrimary onClick={handleRegister}>
          {loading ? (
            <>
              <Loader className="animate-spin text-2xl text-white [animation-duration:0.6s]" />{" "}
              <p className="text-white">Loading..</p>
            </>
          ) : (
            <>
              <span>Sign up to Wabau Learn</span>
              <ArrowRight size={15} />
            </>
          )}
        </BtnPrimary>
      </div>

      {/* back action section */}
      <AnimatePresence mode="wait">
        <div>
          <OrDivider text="or sign up with" />

          <p className="text-center text-[12px] mt-4" style={{ color: t.ink3 }}>
            Already have an account?{" "}
            <button
              onClick={() => onSwitch("login")}
              className="cursor-pointer hover:underline"
              style={{
                color: t.green2,
                background: "none",
                border: "none",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              Sign in →
            </button>
          </p>
        </div>
      </AnimatePresence>

      {showNotification && (
        <div className="absolute top-0 right-0 left-0 flex flex-col h-full items-center justify-center bottom-0 bg-inherit backdrop-blur-lg">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className=" relative w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-2xl "
          >
            <div className="flex flex-col items-center text-center">
              <MotionCheckCircle
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-20 h-20 mb-4 text-green-500"
              />
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-2xl font-raleway font-bold text-gray-800"
              >
                Success!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 text-gray-600"
              >
                Your account has been created successfully.
              </motion.p>
              <div className="w-full mb-6 space-y-2">
                <div className="flex items-center  p-3 bg-gray-100 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-500" />

                    <span className="font-medium  text-gray-700 dark:text-gray-300">
                      Email:
                    </span>
                  </div>
                  <span className="text-gray-800 ml-3">{userData?.email}</span>
                </div>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Please check your email for the verification link. If you didnt
                receive it, you can request a new one.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(userData?.email)}
                className="flex items-center cursor-pointer justify-center px-6 py-2 space-x-2 font-medium text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin text-2xl text-white [animation-duration:0.6s]" />{" "}
                    <p>Loading..</p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-row items-center gap-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Resend Verification</span>
                    </div>
                  </>
                )}
              </motion.button>
            </div>
            <div className="absolute top-2 right-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 text-gray-400 cursor-pointer rounded-full hover:bg-gray-200"
              >
                <XCircle className="text-4xl " />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── FORGOT VIEW ─── */
function ForgotView({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        key="forgot-sent"
        variants={viewVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center py-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: t.green3, border: `2px solid ${t.green}` }}
        >
          <Mail size={24} style={{ color: t.green2 }} />
        </motion.div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: t.ink,
            marginBottom: 8,
          }}
        >
          Check your inbox
        </h2>
        <p
          className="text-[13px] leading-relaxed mx-auto mb-6"
          style={{ color: t.ink3, maxWidth: 300 }}
        >
          We've sent a password reset link to your email. The link expires in 30
          minutes. Check your spam folder if it doesn't arrive within 2 minutes.
        </p>
        <BtnPrimary
          onClick={onBack}
          style={{ maxWidth: 260, margin: "0 auto" }}
        >
          Back to sign in
        </BtnPrimary>
        <p className="mt-4 text-[12px]" style={{ color: t.ink3 }}>
          Didn't receive it?{" "}
          <button
            className="cursor-pointer hover:underline"
            style={{
              color: t.green2,
              background: "none",
              border: "none",
              fontFamily: "'Outfit',sans-serif",
            }}
          >
            Resend →
          </button>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="forgot"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="mb-7">
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.55rem",
            fontWeight: 700,
            color: t.ink,
            marginBottom: 6,
          }}
        >
          Reset password
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: t.ink3 }}>
          Enter your registered email and we'll send you a secure reset link
          valid for 30 minutes.
        </p>
      </div>

      <FormGroup label="Registered email address">
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: t.ink3 }}
          >
            <Mail size={14} />
          </span>
          <input
            type="email"
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg pl-9 pr-3 py-[0.68rem] text-sm outline-none"
            style={{
              background: t.surface2,
              border: `1px solid ${t.border}`,
              color: t.ink,
              fontFamily: "'Outfit',sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = t.green)}
            onBlur={(e) => (e.target.style.borderColor = t.border)}
          />
        </div>
      </FormGroup>

      <BtnPrimary onClick={() => setSent(true)}>
        <span>Send reset link</span>
        <ArrowRight size={15} />
      </BtnPrimary>

      <p className="text-center text-[12.5px] mt-5" style={{ color: t.ink3 }}>
        Remember your password?{" "}
        <button
          onClick={onBack}
          className="cursor-pointer hover:underline"
          style={{
            color: t.green2,
            background: "none",
            border: "none",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          Back to sign in
        </button>
      </p>
    </motion.div>
  );
}

/* ─── ROOT COMPONENT ─── */
export default function WabauAuth() {
  const [view, setView] = useState("login"); // "login" | "register" | "forgot"

  // checks if user is authenticated
  useLayoutEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      redirect("/loading/");
      return;
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');}
        select option { background: #222826; }
      `}</style>

      <div
        className="flex flex-col min-h-screen"
        style={{
          background: t.bg,
          color: t.ink,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* ── TOPBAR ── */}
        <header
          className="flex items-center justify-between px-8 h-[52px] shrink-0 z-10"
          style={{
            background: t.surface,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <div className="flex items-baseline gap-2 cursor-pointer">
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: t.ink,
                letterSpacing: "0.08em",
              }}
            >
              Wabau
            </span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: t.green2,
              }}
            >
              Learn
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[12.5px]"
            style={{ color: t.ink3 }}
          >
            <span>Need help?</span>
            <a
              href="mailto:support@wabau.health"
              className="hover:underline"
              style={{ color: t.green2 }}
            >
              support@wabau.health
            </a>
            <span className="mx-1" style={{ color: t.border }}>
              ·
            </span>
            <a href="#" className="hover:underline" style={{ color: t.green2 }}>
              wabau.health
            </a>
          </div>
        </header>

        {/* ── MAIN SPLIT ── */}
        <div className="flex-1 grid md:grid-cols-2 min-h-0">
          <LeftPanel />

          {/* RIGHT: Form */}
          <div className="flex flex-col overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center px-8 py-10 w-full max-w-[520px] mx-auto">
              {/* Tab Switcher — only for login/register */}
              {view !== "forgot" && (
                <div
                  className="grid grid-cols-2 rounded-lg p-[3px] mb-8"
                  style={{
                    background: t.surface2,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  {["login", "register"].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setView(tab)}
                      className="text-center rounded-md py-[0.52rem] text-[13px] font-medium cursor-pointer transition-all"
                      animate={{
                        background: view === tab ? t.green3 : "transparent",
                        color: view === tab ? t.green2 : t.ink3,
                        borderColor:
                          view === tab
                            ? "rgba(61,158,114,0.25)"
                            : "transparent",
                      }}
                      style={{
                        border: "1px solid transparent",
                        fontFamily: "'Outfit',sans-serif",
                      }}
                    >
                      {tab === "login" ? "Sign in" : "Create account"}
                    </motion.button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {view === "login" && (
                  <LoginView
                    key="login"
                    onSwitch={setView}
                    onForgot={() => setView("forgot")}
                  />
                )}
                {view === "register" && (
                  <RegisterView key="register" onSwitch={setView} />
                )}
                {view === "forgot" && (
                  <ForgotView key="forgot" onBack={() => setView("login")} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
