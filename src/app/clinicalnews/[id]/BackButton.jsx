"use client";

// components/BackButton.jsx
// Tiny client component — used when ClinicalDetail is rendered as a server page
// and needs a working back navigation without onBack prop.

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ href }) {
  const router = useRouter();
  return (
    <button
      onClick={() => (href ? router.push(href) : router.back())}
      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
    >
      <ArrowLeft size={14} />
      <span className="hidden sm:inline">Back to feed</span>
    </button>
  );
}
