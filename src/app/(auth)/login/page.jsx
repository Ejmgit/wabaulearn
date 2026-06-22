"use client";

import { useState, useLayoutEffect, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  XCircle,
  EyeOff,
  ArrowRight,
  Check,
  User,
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
import DataContext from "@/Context/DataContext";
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

const panelItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

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

/* ─── LEFT PANEL ─── */
function LeftPanel({ quotes }) {
  const [val, setVal] = useState(Math.floor(Math.random() * 100) + 1 || 5);

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

  // val change after every 5seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newVal = Math.floor(Math.random() * 100) + 1 || 5;
      setVal(newVal);
    }, 10000); // 5000ms = 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden md:flex flex-col p-12 relative w-full overflow-hidden"
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
        className="mb-auto "
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
        {quotes[val]?.quote}
        {/* — {quotes[val]?.author} */}
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
    setNotification({ type: "", message: "" });
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
      <div className="mb-7 ">
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
    setNotifications(false);
    setLoading(false);
    setData({
      email: "",
      password: "",
      password2: "",
    });
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
        <div className="absolute top-0 right-0 left-0 flex flex-col h-full items-center justify-center bottom-0 bg-inherit">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className=" relative w-full max-w-sm p-8 mx-4 bg-white rounded-lg shadow-2xl "
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
                className="flex items-center cursor-pointer justify-center px-6 py-2 space-x-2 font-medium text-white transition-colors duration-300 bg-green-600 rounded-full hover:bg-blue-600"
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
  const { quotes } = useContext(DataContext);

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
      <div
        className="flex flex-col min-h-screen"
        style={{
          background: t.bg,
          color: t.ink,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* ── MAIN SPLIT ── */}
        <div className="flex flex-col md:flex-row min-h-screen">
          <LeftPanel quotes={quotes} />

          {/* RIGHT: Form */}
          <div className="flex flex-col w-full overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center px-8 py-10 w-full max-w-130 mx-auto">
              {/* Tab Switcher — only for login/register */}
              {view !== "forgot" && (
                <div
                  className="grid grid-cols-2 rounded-lg p-0.75 mb-8"
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
