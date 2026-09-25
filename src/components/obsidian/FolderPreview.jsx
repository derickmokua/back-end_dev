import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Folder, FolderOpen, ChevronRight } from "lucide-react";

export default function FolderPreview({
  label,
  description,
  items = [],
  isSelected = false,
  onClick,
  previewCards = []
}) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const active = isSelected || isHovered;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff2830]/60 rounded-2xl select-none"
    >
      {/* Ambient glow on active */}
      <div
        className="absolute -inset-px rounded-2xl transition-all duration-500 pointer-events-none"
        style={{
          background: active
            ? "linear-gradient(135deg, rgba(255,40,48,0.12) 0%, transparent 60%)"
            : "transparent",
          borderRadius: "16px",
        }}
      />

      {/* 3-D folder stack */}
      <div className="relative h-72 w-full" style={{ perspective: "1000px" }}>

        {/* ── FOLDER TAB ── */}
        <div
          className={`absolute top-0 left-0 h-8 rounded-t-xl z-10 flex items-center px-3 gap-1.5 transition-all duration-300 ${
            active
              ? "w-36 bg-[#ff2830] text-white"
              : "w-28 bg-[#1e1e1e] text-[#a3a3a3] border border-b-0 border-[#2e2e2e]"
          }`}
        >
          {active
            ? <FolderOpen size={12} className="text-white shrink-0" />
            : <Folder size={12} className="text-[#ff5c63] shrink-0" />
          }
          <span className="font-mono text-[9px] uppercase tracking-widest font-bold truncate">
            {active ? "opened" : "DIR"}
          </span>
        </div>

        {/* ── FOLDER BACK WALL (depth layer) ── */}
        <div
          className={`absolute top-7 inset-x-0 bottom-0 rounded-b-2xl rounded-tr-2xl border transition-all duration-300 z-0 ${
            active
              ? "bg-[#1a1a1a] border-[#ff2830]/35 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.03)]"
              : "bg-[#161616] border-[#252525] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          }`}
        />

        {/* ── PREVIEW CARDS (fan out on hover) ── */}
        <div className="absolute inset-x-4 top-8 bottom-[72px] pointer-events-none z-10 flex items-center justify-center">
          {previewCards.map((card, idx) => {
            const isFirst = idx === 0;
            const targetY = active && !shouldReduceMotion ? (isFirst ? -28 : -16) : 8;
            const targetRotate = active && !shouldReduceMotion ? (isFirst ? -6 : 5) : (isFirst ? -1.5 : 1.5);
            const targetScale = active && !shouldReduceMotion ? (isFirst ? 1.04 : 1.0) : 0.95;

            return (
              <motion.div
                key={card.title || idx}
                animate={{ y: targetY, rotate: targetRotate, scale: targetScale }}
                transition={{ type: "spring", stiffness: 280, damping: 22, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                className={`absolute w-[90%] rounded-xl border p-3 flex flex-col justify-between shadow-2xl ${
                  isFirst
                    ? "bg-[#141414] border-[#2e2e2e] z-10 h-36"
                    : "bg-[#1a1a1a] border-[#252525] z-5 h-36"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#252525]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2830] shrink-0" />
                    <span className="font-mono text-[9px] font-bold text-[#ff5c63] uppercase tracking-wider">
                      {card.badge || "PROJECT"}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#555]">{card.tech}</span>
                </div>

                {/* Card body */}
                <div className="py-1.5 flex-1 flex flex-col justify-center gap-0.5">
                  <span className="block font-bold text-[11px] text-white leading-tight truncate">
                    {card.title}
                  </span>
                  <small className="block text-[10px] text-[#666] font-sans leading-snug line-clamp-2">
                    {card.caption}
                  </small>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between pt-1.5 border-t border-[#252525] font-mono text-[9px]">
                  <span className="text-[#555]">{card.status || "Deployed"}</span>
                  <span className="text-[#ff5c63] font-semibold">● online</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── FRONT FLAP (lifts on hover) ── */}
        <motion.div
          animate={active && !shouldReduceMotion ? { rotateX: -14, y: 2 } : { rotateX: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          style={{ transformOrigin: "bottom center" }}
          className={`absolute inset-x-0 bottom-0 top-[72px] rounded-2xl border flex flex-col justify-between z-20 transition-colors duration-300 overflow-hidden ${
            active
              ? "bg-[#1e1e1e] border-[#ff2830]/45 shadow-[0_2px_24px_rgba(255,40,48,0.12)]"
              : "bg-[#1c1c1c] border-[#2a2a2a]"
          }`}
        >
          {/* Red accent line at top when active */}
          <div
            className={`h-px w-full transition-all duration-300 ${active ? "bg-gradient-to-r from-[#ff2830] via-[#ff5c63] to-transparent" : "bg-transparent"}`}
          />

          <div className="flex flex-col flex-1 justify-between p-4">
            {/* Label + arrow */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <b className={`block font-mono text-[13px] font-bold leading-tight transition-colors duration-200 truncate ${active ? "text-[#ff5c63]" : "text-[#e0e0e0]"}`}>
                  {label}
                </b>
                <small className="block text-[11px] text-[#666] mt-1 leading-snug font-sans">
                  {description}
                </small>
              </div>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  active ? "bg-[#ff2830] text-white" : "bg-[#252525] text-[#555]"
                }`}
              >
                <ChevronRight size={13} strokeWidth={2.5} />
              </div>
            </div>

            {/* Bottom meta */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#252525] font-mono text-[10px]">
              <span className="text-[#444]">{items.length} files</span>
              <span className="text-[#333]">·</span>
              <span className={`truncate ${active ? "text-[#ff5c63]" : "text-[#444]"}`}>
                {items.slice(0, 2).join(", ")}{items.length > 2 ? " …" : ""}
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
