"use client";

import { useState, useRef, useLayoutEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
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
  FileText,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { supabase2 } from "@/Config/Supabase";
import UserContext from "@/Context/UserContext";

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
  green: "#3d9e72",
  green2: "#52c48e",
  green3: "#1a4a34",
  green4: "#0f2a1e",
  gold: "#c4922a",
  gold2: "#e8b84a",
  danger: "#f08080",
  dangerBg: "#3a1010",
  dangerBorder: "#8a2020",
};

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
  "bg-[#3d9e72]",
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
      className={`w-full flex items-center text-white bg-[#1a4a34] hover:bg-[#52c48e]  hover:text-black justify-center gap-2 rounded-lg py-[0.78rem] text-sm font-semibold cursor-pointer  transition-colors ${className}`}
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
        className="mt-0.5 w-3.75 h-3.75 shrink-0 cursor-pointer rounded"
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

/* ─── REGISTER VIEW ─── */
function UserRegister() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const route = useRouter();
  const { user } = useContext(UserContext);
  const [notification, setNotification] = useState(""); // fix: was `notifications`, never rendered
  const [error, setError] = useState({});

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [institution, setInstitution] = useState("");

  // Step 2
  const [specialty, setSpecialty] = useState("");
  const [regNumber, setRegNumber] = useState("");

  // Step 3 consents
  const [terms, setTerms] = useState(false); // fix: was `true` — consent must be explicit
  const [research, setResearch] = useState(false); // fix: was `true` — opt-in should default off
  const [updates, setUpdates] = useState(false);

  const handleSignin = () => {
    route.push("login");
  };

  const handleUserProfile = async () => {
    // fix: require terms before submitting
    if (!terms) {
      setNotification(
        "Please accept the Terms of Service and Privacy Policy to continue.",
      );
      return;
    }

    setNotification("");

    try {
      const { data, error } = await supabase2
        .from("profile")
        .insert([
          {
            user_id: user?.id,
            full_name: `${firstName} ${lastName}`,
            email: user?.email,
            country: country,
            hospital: institution,
            profession: selectedRole,
            specialty: specialty,
            reg_number: regNumber,
            terms_policy: terms,
            research: research,
            updates: updates,
          },
        ])
        .select();

      if (error) {
        console.error(error);
        return setNotification(error.message);
      }

      console.log("Profile created:", data);
      setStep(4);
    } catch (error) {
      console.error(error);
      setNotification("Something went wrong. Please try again.");
    }
  };

  const handleStep1 = () => {
    const errs = {};
    if (!firstName) errs.firstName = "Please enter your first name";
    if (!lastName) errs.lastName = "Please enter your last name";
    if (!institution)
      errs.hospital = "Write name of institute or hospital of affiliation";
    if (!country) errs.country = "Please select your country";
    setError(errs);

    if (Object.keys(errs).length > 0) return;
    setStep(2);
  };

  // fix: was calling setStep(3) directly — no validation ran for step 2
  const handleStep2 = () => {
    if (!selectedRole) {
      setError((p) => ({ ...p, role: "Please select your profession" }));
      return;
    }
    setError((p) => ({ ...p, role: "" }));
    setStep(3);
  };

  if (step === 4) {
    return (
      <motion.div
        key="register-success"
        variants={viewVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: t.green3, border: `2px solid ${t.green}` }}
          >
            <Check size={28} style={{ color: t.green2 }} strokeWidth={2.5} />
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
            Profile created
          </h2>
          <p
            className="text-[13px] leading-relaxed mx-auto mb-6"
            style={{ color: t.ink3, maxWidth: 320 }}
          >
            Welcome to Wabau Learn. We've sent a verification email to your
            address. Check your inbox to activate full access and CME credit
            tracking.
          </p>
          <BtnPrimary
            onClick={handleSignin}
            style={{ maxWidth: 280, margin: "0 auto" }}
          >
            <span>Sign in to your account</span>
            <ArrowRight size={15} />
          </BtnPrimary>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="register"
      variants={viewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
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
          Create user Profile
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: t.ink3 }}>
          Join 14,000+ African clinicians. Free to access core reference
          content.
        </p>
      </div>

      <StepIndicator current={step} />

      {/* fix: notification banner — was set but never rendered */}
      {notification && (
        <div
          className="text-[12px] rounded-lg px-3 py-2 mb-3"
          style={{
            background: "rgba(58,16,16,0.25)",
            border: `1px solid ${t.dangerBorder}`,
            color: t.danger ?? "#f87171",
          }}
        >
          {notification}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{
                  borderColor: t.green,
                  background: "rgba(61,158,114,0.05)",
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
                style={{
                  background: t.surface3,
                  border: `2px dashed ${t.border}`,
                }}
              >
                <User size={22} style={{ color: t.ink3 }} />
              </motion.div>
              <div>
                <div
                  className="text-[13px] font-medium mb-0.5"
                  style={{ color: t.ink }}
                >
                  Profile Details
                </div>
                <div
                  className="text-[11px] leading-relaxed"
                  style={{ color: t.ink3 }}
                >
                  Helps colleagues recognise you in shared protocol libraries
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <FormGroup label="First name" error={error?.firstName}>
                <input
                  type="text"
                  placeholder="Amara"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError((p) => ({ ...p, firstName: "" }));
                  }}
                  className="w-full rounded-lg px-3 py-[0.68rem] text-sm outline-none"
                  style={{
                    background: error.firstName
                      ? "rgba(58,16,16,0.3)"
                      : t.surface2,
                    border: `1px solid ${error.firstName ? t.dangerBorder : t.border}`,
                    color: t.ink,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = error.firstName
                      ? t.dangerBorder
                      : t.green;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error.firstName
                      ? t.dangerBorder
                      : t.border;
                  }}
                />
              </FormGroup>
              <FormGroup label="Last name" error={error?.lastName}>
                <input
                  type="text"
                  placeholder="Osei-Bonsu"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError((p) => ({ ...p, lastName: "" }));
                  }}
                  className="w-full rounded-lg px-3 py-[0.68rem] text-sm outline-none"
                  style={{
                    background: error.lastName
                      ? "rgba(58,16,16,0.3)"
                      : t.surface2,
                    border: `1px solid ${error.lastName ? t.dangerBorder : t.border}`,
                    color: t.ink,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = error.lastName
                      ? t.dangerBorder
                      : t.green;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error.lastName
                      ? t.dangerBorder
                      : t.border;
                  }}
                />
              </FormGroup>
            </div>

            <FormGroup label="Country" error={error?.country}>
              <FormSelect
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setError((p) => ({ ...p, country: "" }));
                }}
              >
                <option value="">Select your country…</option>
                {Object.entries(COUNTRIES).map(([group, opts]) => (
                  <optgroup key={group} label={group}>
                    {opts.map((o) => (
                      <option key={o} style={{ background: t.surface3 }}>
                        {o}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup label="Institution / Hospital" error={error.hospital}>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: t.ink3 }}
                >
                  <Building2 size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Kenyatta National Hospital, Nairobi"
                  value={institution}
                  onChange={(e) => {
                    setInstitution(e.target.value);
                    setError((p) => ({ ...p, hospital: "" }));
                  }}
                  className="w-full rounded-lg pl-9 pr-3 py-[0.68rem] text-sm outline-none"
                  style={{
                    background: error.hospital
                      ? "rgba(58,16,16,0.3)"
                      : t.surface2,
                    border: `1px solid ${error.hospital ? t.dangerBorder : t.border}`,
                    color: t.ink,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = error.hospital
                      ? t.dangerBorder
                      : t.green;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error.hospital
                      ? t.dangerBorder
                      : t.border;
                  }}
                />
              </div>
            </FormGroup>

            <div className="flex gap-2 mt-5">
              <BtnPrimary
                onClick={handleStep1}
                className="flex-1"
                style={{ marginTop: 0 }}
              >
                Continue — Role & specialty <ArrowRight size={14} />
              </BtnPrimary>
            </div>

            <OrDivider text="Wabau learn" />
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="mb-2"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.48rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: t.ink3,
              }}
            >
              Select your profession
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {ROLES.map(({ id, Icon, title, sub }) => (
                <motion.div
                  key={id}
                  whileHover={{
                    borderColor: t.green,
                    background: "rgba(61,158,114,0.05)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedRole(id);
                    setError((p) => ({ ...p, role: "" }));
                  }}
                  className="flex items-center gap-2 p-[0.6rem] rounded-lg cursor-pointer transition-all"
                  style={{
                    border: `1px solid ${selectedRole === id ? t.green : error.role ? t.dangerBorder : t.border}`,
                    background:
                      selectedRole === id
                        ? "rgba(61,158,114,0.08)"
                        : t.surface2,
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: selectedRole === id ? t.green2 : t.ink3,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      className="text-[12px] font-medium"
                      style={{ color: selectedRole === id ? t.green2 : t.ink }}
                    >
                      {title}
                    </div>
                    <div className="text-[10.5px]" style={{ color: t.ink3 }}>
                      {sub}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* fix: show role error inline */}
            {error.role && (
              <p
                className="text-[11px] mb-3"
                style={{ color: t.danger ?? "#f87171" }}
              >
                {error.role}
              </p>
            )}

            <FormGroup label="Primary specialty">
              <FormSelect
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Select specialty…</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} style={{ background: t.surface3 }}>
                    {s}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup
              label="Professional registration number"
              hint={{
                text: "Used only to issue verified CME certificates. Never shared externally.",
              }}
            >
              <input
                type="text"
                placeholder="e.g. KMPDC/2019/XXXX"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full rounded-lg px-3 py-[0.68rem] text-sm outline-none"
                style={{
                  background: t.surface2,
                  border: `1px solid ${t.border}`,
                  color: t.ink,
                  fontFamily: "'Outfit',sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = t.green)}
                onBlur={(e) => (e.target.style.borderColor = t.border)}
              />
            </FormGroup>

            <div className="flex items-center gap-2 mt-5">
              <motion.button
                whileHover={{ borderColor: t.green, color: t.green2 }}
                onClick={() => setStep(1)}
                className="shrink-0 flex items-center gap-1 rounded-lg px-4 py-[0.65rem] text-sm font-medium cursor-pointer"
                style={{
                  background: "transparent",
                  color: t.ink3,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                <ArrowLeft size={14} /> Back
              </motion.button>
              {/* fix: was setStep(3) directly — now validates first */}
              <BtnPrimary
                onClick={handleStep2}
                className="flex-1"
                style={{ marginTop: 0 }}
              >
                Continue — Consents <ArrowRight size={14} />{" "}
                {/* fix: was "Security" */}
              </BtnPrimary>
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mt-4 mb-2">
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.48rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: t.ink3,
                  marginBottom: 10,
                }}
              >
                Consent & preferences
              </div>
              <CheckRow
                id="terms"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  if (e.target.checked) setNotification("");
                }}
              >
                I agree to Wabau's{" "}
                <span style={{ color: t.green2 }}>Terms of Service</span> and{" "}
                <span style={{ color: t.green2 }}>Privacy Policy</span>. My
                professional data is used solely to verify credentials and issue
                CME certificates.
              </CheckRow>
              <CheckRow
                id="research"
                checked={research}
                onChange={(e) => setResearch(e.target.checked)}
              >
                I consent to anonymised, aggregated usage data contributing to
                Wabau's clinical education research programme.{" "}
                <em>(Optional — no effect on access)</em>
              </CheckRow>
              <CheckRow
                id="updates"
                checked={updates}
                onChange={(e) => setUpdates(e.target.checked)}
              >
                Send me weekly clinical digest emails — protocol updates, new
                CME modules, and Africa-relevant guideline changes.{" "}
                <em>(Optional)</em>
              </CheckRow>
            </div>

            <div className="flex gap-2 mt-4">
              <motion.button
                whileHover={{ borderColor: t.green, color: t.green2 }}
                onClick={() => setStep(2)}
                className="shrink-0 flex items-center gap-1 rounded-lg px-4 py-[0.65rem] text-sm font-medium cursor-pointer"
                style={{
                  background: "transparent",
                  color: t.ink3,
                  border: `1px solid ${t.border}`,
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                <ArrowLeft size={14} /> Back
              </motion.button>
              <BtnPrimary
                onClick={handleUserProfile}
                className="flex-1"
                style={{ marginTop: 0 }}
              >
                Review & confirm <ArrowRight size={14} />
              </BtnPrimary>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── ROOT COMPONENT ─── */
export default function WabauAuth() {
  // checks if user is authenticated
  useLayoutEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      redirect("/login");
      return;
    }
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen">
        {/* ── MAIN SPLIT ── */}
        <div className="">
          {/* RIGHT: Form */}
          <div className="flex flex-col overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center px-8 py-10 w-full max-w-xl xl:max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <UserRegister key="register" />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
