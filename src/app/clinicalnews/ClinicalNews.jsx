"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Star, BookOpen } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractText(blocks) {
  return (blocks || [])
    .filter((b) => typeof b === "object" && b?._type === "block")
    .flatMap((b) => (b.children || []).map((c) => c.text))
    .join(" ");
}

function getExcerpt(blocks, chars = 160) {
  const text = extractText(blocks);
  return text.length > chars ? text.slice(0, chars).trimEnd() + "…" : text;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StarRating({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-600"
          }
        />
      ))}
      <span className="text-slate-400 text-xs ml-1">{rating}/5</span>
    </div>
  );
}

function getTag(post) {
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const c = post.categories[0];
    if (typeof c === "string") return c;
    if (typeof c === "object" && c !== null && "title" in c) return c.title;
  }
  const t = (post.title || "").toLowerCase();
  if (t.includes("malaria")) return "Parasitic Infections";
  if (t.includes("typhoid") || t.includes("bacterial"))
    return "Bacterial Infections";
  if (t.includes("examination")) return "Clinical Skills";
  return "Clinical Update";
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ClinicalCard({ post }) {
  const router = useRouter();
  const tag = getTag(post);
  const excerpt = getExcerpt(post.body);

  return (
    <motion.button
      layout
      onClick={() => router.push(`/clinicalnews/${post._id}`)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full text-left group relative rounded-xl border border-slate-700/60
                 bg-slate-900/80 backdrop-blur-sm p-5 hover:border-cyan-700/60
                 hover:bg-slate-800/80 transition-colors duration-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-600/50
                         bg-cyan-950/60 px-2.5 py-0.5 text-[10px] font-semibold
                         tracking-widest text-cyan-400 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {post?.review[0]?.title}
        </span>
      </div>

      {/* Category */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase">
          {tag}
        </span>
      </div>

      {/* Title */}
      <h2
        className="text-base font-bold text-white leading-snug mb-2
                     group-hover:text-cyan-100 transition-colors"
      >
        {post.title}
      </h2>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {excerpt}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <span className="text-slate-600 text-xs font-medium">
          {post.author?.name}
        </span>
      </div>

      {/* Hover accent */}
      <span
        className="absolute left-0 top-0 bottom-0 right-0 w-0.5 rounded-full bg-green-600
                       scale-y-0 group-hover:scale-y-100 transition-transform
                       duration-200 origin-center"
      />
    </motion.button>
  );
}

// ─── Page component (used by app/clinicalnews/page.jsx) ───────────────────────

export default function ClinicalNewsCard({ postData }) {
  return (
    <div className="min-h-screen flex flex-col mx-auto xl:px-0 px-4 xl:container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl  px-4 py-8"
      >
        <div className="mb-8">
          <p className="text-[10px] font-bold tracking-[0.25em] text-green-500 uppercase mb-2">
            Clinical Feed
          </p>
          <h1 className="text-2xl font-bold text-white">Trending Articles</h1>
          <p className="text-sm text-slate-400 mt-1">
            Peer reviewed evidence for Sub-Saharan African practice
          </p>
        </div>

        <div className="space-y-3">
          {(postData || [])?.map((post, i) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <ClinicalCard post={post} />
            </motion.div>
          ))}
        </div>

        {(!postData || postData.length === 0) && (
          <div className="text-center py-20 text-slate-500">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No articles found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
