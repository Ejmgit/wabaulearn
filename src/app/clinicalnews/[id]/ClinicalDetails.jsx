"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ArrowLeft, Star, Tag, AlignLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

// ─── Smart heading extraction ─────────────────────────────────────────────────
// Works for ANY article structure:
//  1. Articles with h1/h2/h3/h4 styled blocks  → use those
//  2. Articles with only bullet lists (e.g. "General Examination")
//     → treat top-level (level 1) list items whose text has no trailing
//       punctuation and reads like a section label as "h2" headings,
//       and look for bold-only paragraphs (style=normal, single strong child)
//       as h1 equivalents.

function extractHeadings(blocks) {
  const validBlocks = (blocks || []).filter(
    (b) => typeof b === "object" && b && b._type === "block",
  );

  const HEADING_STYLES = ["h1", "h2", "h3", "h4"];

  // ── Strategy A: article has real heading blocks ──────────────────────────
  const realHeadings = validBlocks.filter((b) =>
    HEADING_STYLES.includes(b.style),
  );

  if (realHeadings.length > 0) {
    let sectionIndex = 0;
    return realHeadings
      .map((block) => {
        const text = (block.children || [])
          .map((c) => c.text)
          .join("")
          .trim();
        if (!text) return null;
        const depth = parseInt(block.style.replace("h", ""), 10);
        if (depth === 1) sectionIndex++;
        const id = `heading-${slugify(text)}-${block._key}`;
        return { id, text, depth, sectionIndex, _key: block._key };
      })
      .filter(Boolean);
  }

  // ── Strategy B: article uses bold normal paragraphs + bullets ────────────
  // Treat:
  //   • style=normal with ALL children marked "strong" → depth 1 (section)
  //   • style=normal / listItem=bullet / level=1 with no trailing punctuation
  //     and ≤ 60 chars → depth 2 (sub-section)
  const headings = [];
  let sectionIndex = 0;

  validBlocks.forEach((block) => {
    const children = block.children || [];
    const text = children
      .map((c) => c.text)
      .join("")
      .trim();
    if (!text || text.length > 120) return;

    // Bold paragraph as top-level heading
    const allBold =
      children.length > 0 &&
      children.every(
        (c) => Array.isArray(c.marks) && c.marks.includes("strong"),
      );
    if (block.style === "normal" && !block.listItem && allBold) {
      sectionIndex++;
      const id = `heading-${slugify(text)}-${block._key}`;
      headings.push({ id, text, depth: 1, sectionIndex, _key: block._key });
      return;
    }

    // Top-level bullet that reads like a label (short, no trailing sentence punct)
    const isLabel =
      block.listItem === "bullet" &&
      (block.level ?? 1) === 1 &&
      text.length <= 60 &&
      !/[.?!,;:]$/.test(text);

    if (isLabel) {
      const id = `heading-${slugify(text)}-${block._key}`;
      headings.push({ id, text, depth: 2, sectionIndex, _key: block._key });
    }
  });

  return headings;
}

// ─── Build a stable heading→id map for the renderer ──────────────────────────

function buildIdMap(blocks) {
  const map = {};
  const HEADING_STYLES = ["h1", "h2", "h3", "h4"];
  const validBlocks = (blocks || []).filter(
    (b) => typeof b === "object" && b && b._type === "block",
  );
  const hasRealHeadings = validBlocks.some((b) =>
    HEADING_STYLES.includes(b.style),
  );
  let sectionIndex = 0;

  validBlocks.forEach((block) => {
    const children = block.children || [];
    const text = children
      .map((c) => c.text)
      .join("")
      .trim();
    if (!text) return;

    if (hasRealHeadings && HEADING_STYLES.includes(block.style)) {
      const depth = parseInt(block.style.replace("h", ""), 10);
      if (depth === 1) sectionIndex++;
      map[block._key] = {
        id: `heading-${slugify(text)}-${block._key}`,
        sectionIndex,
        depth,
      };
      return;
    }

    if (!hasRealHeadings) {
      const allBold =
        children.length > 0 &&
        children.every(
          (c) => Array.isArray(c.marks) && c.marks.includes("strong"),
        );
      if (block.style === "normal" && !block.listItem && allBold) {
        sectionIndex++;
        map[block._key] = {
          id: `heading-${slugify(text)}-${block._key}`,
          sectionIndex,
          depth: 1,
        };
        return;
      }
      const isLabel =
        block.listItem === "bullet" &&
        (block.level ?? 1) === 1 &&
        text.length <= 60 &&
        !/[.?!,;:]$/.test(text);
      if (isLabel) {
        map[block._key] = {
          id: `heading-${slugify(text)}-${block._key}`,
          sectionIndex,
          depth: 2,
        };
      }
    }
  });
  return map;
}

// ─── Inline children renderer ─────────────────────────────────────────────────

function renderChildren(children) {
  return (children || []).map((c, i) => {
    const marks = Array.isArray(c.marks) ? c.marks : [];
    if (marks.includes("strong") && marks.includes("em"))
      return (
        <strong key={c._key || i}>
          <em>{c.text}</em>
        </strong>
      );
    if (marks.includes("strong"))
      return (
        <strong key={c._key || i} className="font-bold text-white">
          {c.text}
        </strong>
      );
    if (marks.includes("em"))
      return (
        <em key={c._key || i} className="italic text-slate-300">
          {c.text}
        </em>
      );
    return <span key={c._key || i}>{c.text}</span>;
  });
}

// ─── Single block renderer ────────────────────────────────────────────────────

function PortableBlock({ block, idMap }) {
  if (!block || typeof block !== "object" || block._type !== "block")
    return null;

  const children = block.children || [];
  const text = children
    .map((c) => c.text)
    .join("")
    .trim();
  const meta = idMap[block._key];
  const HEADING_STYLES = ["h1", "h2", "h3", "h4"];

  // ── Real heading block ───────────────────────────────────────────────────
  if (HEADING_STYLES.includes(block.style)) {
    const id = meta?.id ?? `heading-${slugify(text)}`;
    const sectionNum = meta?.sectionIndex ?? null;

    if (block.style === "h1") {
      return (
        <div id={id} className="scroll-mt-24 mt-10 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {renderChildren(children)}
            </h2>
          </div>
          <div className="h-px bg-slate-800/80" />
        </div>
      );
    }
    if (block.style === "h2") {
      return (
        <div id={id} className="scroll-mt-24 mt-8 mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
          <h3 className="text-lg font-semibold text-white">
            {renderChildren(children)}
          </h3>
        </div>
      );
    }
    if (block.style === "h3") {
      return (
        <h4
          id={id}
          className="scroll-mt-24 text-base font-semibold text-cyan-300 mt-6 mb-2"
        >
          {renderChildren(children)}
        </h4>
      );
    }
    if (block.style === "h4") {
      return (
        <h5
          id={id}
          className="scroll-mt-24 text-sm font-bold uppercase tracking-widest text-slate-400 mt-5 mb-1"
        >
          {renderChildren(children)}
        </h5>
      );
    }
  }

  // ── Bullet list item ─────────────────────────────────────────────────────
  if (block.listItem === "bullet") {
    const depth = block.level ?? 1;
    const indentMap = ["pl-0", "pl-5", "pl-10", "pl-14"];
    const indent = indentMap[Math.min(depth - 1, 3)];
    const dotColors = ["bg-cyan-500", "bg-slate-500", "bg-slate-700"];
    const dotColor = dotColors[Math.min(depth - 1, 2)];

    // Strategy B: top-level short label → render as a sub-section heading
    if (meta && meta.depth === 2) {
      return (
        <div
          id={meta.id}
          className={`scroll-mt-24 ${indent} mt-5 mb-2 flex items-center gap-2`}
        >
          <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
          <p className="text-base font-semibold text-white">
            {renderChildren(children)}
          </p>
        </div>
      );
    }

    return (
      <div className={`flex gap-2.5 ${indent} my-1.5`}>
        <span
          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
        />
        <p className="text-[15px] text-slate-300 leading-relaxed">
          {renderChildren(children)}
        </p>
      </div>
    );
  }

  // ── Normal paragraph ─────────────────────────────────────────────────────
  if (!text) return <div className="h-2" />;

  // Strategy B: all-bold normal paragraph → section heading
  if (meta && meta.depth === 1) {
    const sectionNum = meta.sectionIndex;
    return (
      <div id={meta.id} className="scroll-mt-24 mt-10 mb-6">
        <div className="flex items-center gap-3 mb-3">
          {sectionNum > 0 && (
            <span className="font-mono text-xs text-amber-500/80 tracking-widest">
              {String(sectionNum).padStart(2, "0")}
            </span>
          )}
          <span className="text-slate-600 text-sm">—</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {renderChildren(children)}
          </h2>
        </div>
        <div className="h-px bg-slate-800/80" />
      </div>
    );
  }

  return (
    <p className="text-[15px] text-slate-300 leading-[1.8] my-3">
      {renderChildren(children)}
    </p>
  );
}

// ─── Article body ─────────────────────────────────────────────────────────────

function ArticleBody({ blocks }) {
  const idMap = useMemo(() => buildIdMap(blocks), [blocks]);
  const filtered = (blocks || []).filter(
    (b) => typeof b === "object" && b && b._type === "block",
  );

  return (
    <div>
      {filtered.map((block) => (
        <PortableBlock key={block._key} block={block} idMap={idMap} />
      ))}
    </div>
  );
}

// ─── Table of Contents ────────────────────────────────────────────────────────

function TableOfContents({ headings, activeId, onSelect }) {
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    onSelect?.();
  }

  if (!headings.length) {
    return (
      <div className="text-[11px] text-slate-600 italic px-2">
        No sections found in this article.
      </div>
    );
  }

  // Group depth-1 headings as top-level, everything else as children of the
  // nearest preceding depth-1 heading
  const sections = [];
  let current = null;

  headings.forEach((h) => {
    if (h.depth === 1) {
      current = { heading: h, children: [] };
      sections.push(current);
    } else if (current) {
      current.children.push(h);
    } else {
      if (!sections.length) sections.push({ heading: null, children: [] });
      sections[sections.length - 1].children.push(h);
    }
  });

  return (
    <nav aria-label="Table of contents">
      <p className="text-[9px] font-bold tracking-[0.25em] text-green-500 uppercase mb-4 px-1">
        Table of Contents
      </p>
      <ul className="space-y-0.5">
        {sections?.map((sec, si) => (
          <li key={sec.heading?.id ?? `sec-${si}`}>
            {sec.heading && (
              <button
                onClick={() => scrollTo(sec.heading.id)}
                className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-md
                  transition-colors duration-150 group
                  ${
                    activeId === sec.heading.id
                      ? "text-green-400 bg-green-950/40"
                      : "text-gray-300 hover:text-white hover:bg-slate-800/60"
                  }`}
              >
                <span className="text-[10px] text-slate-600 font-mono w-5 shrink-0 text-right">
                  {si + 1}
                </span>
                <span className="text-sm font-medium truncate">
                  {sec.heading.text}
                </span>
              </button>
            )}

            {sec.children.length > 0 && (
              <ul className="ml-7 mt-0.5 space-y-0.5 border-l border-slate-800/80 pl-3">
                {sec.children.map((child) => (
                  <li key={child.id}>
                    <button
                      onClick={() => scrollTo(child.id)}
                      className={`w-full text-left text-xs py-1 px-1 rounded transition-colors duration-150 truncate block
                        ${
                          activeId === child.id
                            ? "text-green-400"
                            : "text-slate-500 hover:text-slate-200"
                        }`}
                    >
                      {child.text}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Reading progress ─────────────────────────────────────────────────────────

function ReadingProgress({ progress }) {
  return (
    <div className="mt-6 pt-4 border-t border-slate-800/60">
      <div className="flex items-center justify-between text-[9px] tracking-[0.2em] uppercase text-gray-400 mb-2">
        <span>Reading Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-600 rounded-full origin-left"
          style={{ scaleX: progress / 100 }}
        />
      </div>
    </div>
  );
}

// ─── Main ClinicalDetail ──────────────────────────────────────────────────────

export default function ClinicalDetail({ post, onBack, backHref }) {
  const [activeId, setActiveId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef(null);

  // Recompute headings whenever the article changes
  const headings = useMemo(
    () => extractHeadings(post?.body || []),
    [post?._id, post?.body], // re-run when post changes
  );

  const router = useRouter();
  const tag = getTag(post || {});

  // Unified back navigation — works for both prop styles
  const handleBack =
    onBack ?? (() => (backHref ? router.push(backHref) : router.back()));

  // ── Scroll tracker ────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    setProgress(
      docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0,
    );

    // Find the last heading above the fold (offset 120px for sticky bar)
    let found = null;
    for (const h of [...headings].reverse()) {
      const el = document.getElementById(h.id);
      if (el && el.getBoundingClientRect().top <= 120) {
        found = h.id;
        break;
      }
    }
    setActiveId(found ?? (headings.length ? headings[0].id : null));
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Reset scroll + active state when article changes
    window.scrollTo(0, 0);
    setProgress(0);
    setActiveId(headings.length ? headings[0].id : null);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, post?._id]);

  // Lock body scroll on mobile drawer
  useEffect(() => {
    document.body.style.overflow = tocOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [tocOpen]);

  if (!post) return null;

  return (
    <motion.div
      key={post._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen text-white"
    >
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back to feed</span>
          </button>

          {/* Mobile progress bar */}
          <div className="flex-1 lg:hidden">
            <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-500 rounded-full origin-left"
                style={{ scaleX: progress / 100 }}
              />
            </div>
          </div>

          {/* Mobile TOC button */}
          <button
            onClick={() => setTocOpen(true)}
            className="lg:hidden ml-auto flex items-center gap-1.5 text-xs text-slate-400
                       hover:text-white transition-colors border border-slate-700
                       rounded-md px-2.5 py-1 shrink-0"
          >
            <AlignLeft size={12} />
            Contents
          </button>
        </div>
      </div>

      {/* ── Mobile TOC drawer ── */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTocOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#161b22]
                         border-r border-slate-800 overflow-y-auto p-5 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-semibold text-white">Contents</p>
                <button
                  onClick={() => setTocOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <TableOfContents
                headings={headings}
                activeId={activeId}
                onSelect={() => setTocOpen(false)}
              />
              <ReadingProgress progress={progress} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Page layout ── */}
      <div className="max-w-screen-xl mx-auto flex">
        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden lg:flex flex-col w-64 shrink-0 sticky top-12
                          self-start h-[calc(100vh-3rem)] overflow-y-auto"
        >
          <div className="py-8 pr-4 pl-3 flex flex-col h-full">
            <TableOfContents headings={headings} activeId={activeId} />
            <div className="mt-auto">
              <ReadingProgress progress={progress} />
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main
          ref={contentRef}
          className="flex-1 min-w-0 max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 py-10"
        >
          {/* Header */}
          <header className="mb-10">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-600/50
                             bg-cyan-950/60 px-2.5 py-0.5 text-[10px] font-semibold
                             tracking-widest text-cyan-400 uppercase mb-4"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {post?.review[0]?.title}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-5 mt-2">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
              <span className="text-sm text-slate-400">
                By{" "}
                <span className="text-white font-medium">
                  {post.author?.name}
                </span>
              </span>
              <span className="text-slate-700 text-xs">·</span>
              <span className="text-xs text-slate-500">
                Updated {formatDate(post.publishedAt)}
              </span>
              <span
                className="inline-flex items-center gap-1 rounded border border-emerald-700/50
                               bg-emerald-950/50 px-2 py-0.5 text-[9px] font-bold
                               tracking-widest text-emerald-400 uppercase"
              >
                Peer Reviewed · WABAU Editorial Board
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em]
                               uppercase text-cyan-500 border border-cyan-800/50 rounded-full px-2.5 py-1"
              >
                <Tag size={9} />
                {tag}
              </span>
            </div>
          </header>

          <div className="h-px bg-slate-800/60 mb-8" />

          {/* Article body */}
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <ArticleBody blocks={post.body || []} />
          </motion.article>

          <div className="mt-16 pt-8 border-t border-slate-800/60">
            <button
              onClick={handleBack}
              className="flex items-center cursor-pointer gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to feed
            </button>
          </div>
        </main>

        {/* Right spacer for very wide screens */}
        <div className="hidden xl:block w-48 shrink-0" />
      </div>
    </motion.div>
  );
}
