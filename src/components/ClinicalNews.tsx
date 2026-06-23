"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, Star, ArrowLeft, BookOpen, Tag } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PortableTextChild {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

interface PortableTextBlock {
  _key: string;
  _type: string;
  children: PortableTextChild[];
  level?: number;
  listItem?: string;
  markDefs: unknown[];
  style: string;
}

interface Author {
  name: string;
  bio: PortableTextBlock[];
  image: null | { url: string };
}

interface Post {
  _id: string;
  title: string;
  publishedAt: string;
  body: (PortableTextBlock | string)[];
  author: Author;
  mainImage: null | { url: string };
  categories?: string[] | unknown;
  review?: null | number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractText(blocks: (PortableTextBlock | string)[]): string {
  return blocks
    .filter(
      (b): b is PortableTextBlock =>
        typeof b === "object" && b._type === "block",
    )
    .flatMap((b) => b.children.map((c) => c.text))
    .join(" ");
}

function getExcerpt(
  blocks: (PortableTextBlock | string)[],
  chars = 160,
): string {
  const text = extractText(blocks);
  return text.length > chars ? text.slice(0, chars).trimEnd() + "…" : text;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StarRating({ rating }: { rating: number | null }) {
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

// Derive a "tag" string from category data (handles both arrays and objects)
function getTag(post: Post): string {
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const c = post.categories[0];
    if (typeof c === "string") return c;
    if (typeof c === "object" && c !== null && "title" in c)
      return (c as { title: string }).title;
  }
  // Fallback: infer from title keywords
  const t = post.title.toLowerCase();
  if (t.includes("malaria")) return "Parasitic Infections";
  if (t.includes("typhoid") || t.includes("bacterial"))
    return "Bacterial Infections";
  if (t.includes("examination")) return "Clinical Skills";
  return "Clinical Update";
}

// ─── Portable Text renderer ───────────────────────────────────────────────────

function RenderPortableText({
  blocks,
}: {
  blocks: (PortableTextBlock | string)[];
}) {
  const filtered = blocks.filter(
    (b): b is PortableTextBlock => typeof b === "object" && "_type" in b,
  );

  return (
    <div className="space-y-3 text-slate-300 leading-relaxed">
      {filtered.map((block) => {
        const text = block.children.map((c) => {
          if (c.marks.includes("strong"))
            return (
              <strong key={c._key} className="text-white font-semibold">
                {c.text}
              </strong>
            );
          return c.text;
        });

        const indent = (block.level ?? 1) - 1;
        const ml = ["ml-0", "ml-4", "ml-8", "ml-12"][Math.min(indent, 3)];

        if (block.listItem === "bullet") {
          return (
            <div key={block._key} className={`flex gap-2 ${ml}`}>
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/70" />
              <p className="text-sm">{text}</p>
            </div>
          );
        }

        const headingStyles: Record<string, string> = {
          h1: "text-xl font-bold text-white mt-6 mb-2",
          h2: "text-lg font-semibold text-white mt-5 mb-1",
          h3: "text-base font-semibold text-cyan-300 mt-4 mb-1",
          h4: "text-sm font-semibold text-slate-200 mt-3 mb-1 uppercase tracking-wide",
        };

        if (headingStyles[block.style]) {
          return (
            <p key={block._key} className={headingStyles[block.style]}>
              {text}
            </p>
          );
        }

        return (
          <p key={block._key} className="text-sm">
            {text}
          </p>
        );
      })}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ClinicalCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const tag = getTag(post);
  const excerpt = getExcerpt(post.body);
  const views = Math.floor(Math.random() * 12000 + 1000); // demo value

  return (
    <motion.button
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full text-left group relative rounded-xl border border-slate-700/60 bg-slate-900/80 
                 backdrop-blur-sm p-5 hover:border-cyan-700/60 hover:bg-slate-800/80 
                 transition-colors duration-200 focus-visible:outline-none 
                 focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      {/* Review badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-600/50 
                         bg-cyan-950/60 px-2.5 py-0.5 text-[10px] font-semibold 
                         tracking-widest text-cyan-400 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Independent WABAU Review
        </span>
        <StarRating rating={post.review ?? 4} />
      </div>

      {/* Category tag */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase">
          {tag}
        </span>
        <span className="text-slate-600 text-[10px]">·</span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          Living Document
        </span>
      </div>

      {/* Title */}
      <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-cyan-100 transition-colors">
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
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {(views / 1000).toFixed(1)}K views
          </span>
        </div>
        <span className="text-slate-600 text-xs font-medium">
          {post.author.name}
        </span>
      </div>

      {/* Hover accent line */}
      <span
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-cyan-500 
                       scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center"
      />
    </motion.button>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function ClinicalDetail({ post, onBack }: { post: Post; onBack: () => void }) {
  const tag = getTag(post);

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen  text-white"
    >
      {/* Top nav */}
      <div className="sticky xl:container top-0 z-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 px-4 py-3">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to feed
        </motion.button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-600/50 
                           bg-cyan-950/60 px-2.5 py-0.5 text-[10px] font-semibold 
                           tracking-widest text-cyan-400 uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Independent WABAU Review
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-slate-400">
            By{" "}
            <span className="text-white font-medium">{post.author.name}</span>
          </span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-xs text-slate-500">
            Updated {formatDate(post.publishedAt)}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded border border-emerald-700/50 
                           bg-emerald-950/50 px-2 py-0.5 text-[10px] font-semibold 
                           tracking-widest text-emerald-400 uppercase"
          >
            Peer Reviewed · WABAU Editorial Board
          </span>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] 
                           uppercase text-cyan-500 border border-cyan-800/50 rounded-full px-2.5 py-1"
          >
            <Tag size={9} />
            {tag}
          </span>
          <span
            className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500 
                           border border-slate-700/50 rounded-full px-2.5 py-1"
          >
            Living Document
          </span>
        </div>

        {/* Rating box */}
        {post.review && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-4 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white mb-0.5">
                  Overall evidence strength
                </p>
                <p className="text-[10px] text-slate-500">
                  Based on peer review · Last updated{" "}
                  {formatDate(post.publishedAt)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i <= (post.review ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-slate-600"
                    }
                  />
                ))}
                <span className="text-slate-400 text-xs ml-1">
                  {post.review}/5
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <RenderPortableText blocks={post.body} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ClinicalNewsProps {
  postData: Post[];
}

export default function ClinicalNews({ postData }: ClinicalNewsProps) {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <div>
      <AnimatePresence mode="wait">
        {selected ? (
          <ClinicalDetail
            key="detail"
            post={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto px-4 py-8"
          >
            {/* Page header */}
            <div className="mb-8">
              <p className="text-[10px] font-bold tracking-[0.25em] text-green-500 uppercase mb-2">
                Clinical Feed
              </p>
              <h1 className="text-2xl font-bold text-white">
                Trending Articles
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Peer reviewed evidence for Sub-Saharan African practice
              </p>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {postData.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <ClinicalCard post={post} onClick={() => setSelected(post)} />
                </motion.div>
              ))}
            </div>

            {postData.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No articles found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
