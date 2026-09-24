import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Folder, Terminal, Cpu, Database, Shield } from "lucide-react";

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
      className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#ff2830] rounded-2xl select-none"
    >
      {/* 3D Perspective Box */}
      <div 
        className="relative h-64 w-full"
        style={{ perspective: "1000px" }}
      >
        {/* FOLDER TAB (TOP-LEFT) */}
        <div
          className={`absolute top-0 left-0 w-28 h-7 rounded-t-xl border-t border-l border-r transition-colors z-0 flex items-center px-3 gap-1.5 ${
            isSelected || isHovered
              ? "bg-[#282828] border-[#ff2830]/50 text-white"
              : "bg-[#222222] border-[#333333] text-[#a3a3a3]"
          }`}
        >
          <Folder size={12} className={isSelected || isHovered ? "text-[#ff2830]" : "text-[#a3a3a3]"} />
          <span className="font-mono text-[9px] uppercase tracking-wider font-semibold truncate">
            DIR
          </span>
        </div>

        {/* FOLDER BACK WALL */}
        <div
          className={`absolute top-6 inset-x-0 bottom-0 rounded-2xl border transition-all z-0 ${
            isSelected || isHovered
              ? "bg-[#252525] border-[#ff2830]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              : "bg-[#1c1c1c] border-[#333333]"
          }`}
        />

        {/* INNER PREVIEW CARDS (ELEVATE & FAN OUT ON HOVER) */}
        <div className="absolute inset-x-3 top-5 bottom-16 pointer-events-none z-10 flex items-center justify-center">
          {previewCards.map((card, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;

            const initialY = 10;
            const targetY = isHovered && !shouldReduceMotion ? (isFirst ? -32 : -20) : 10;
            const targetRotate = isHovered && !shouldReduceMotion ? (isFirst ? -5 : 4) : (isFirst ? -1 : 1);
            const targetScale = isHovered && !shouldReduceMotion ? 1.02 : 0.96;

            return (
              <motion.div
                key={card.title || idx}
                initial={{ y: initialY, rotate: 0 }}
                animate={{
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: shouldReduceMotion ? 0 : idx * 0.04
                }}
                className={`absolute w-[88%] h-36 rounded-xl border p-3 flex flex-col justify-between shadow-2xl transition-colors ${
                  isFirst
                    ? "bg-[#161616] border-[#3a3a3a] text-white z-10"
                    : "bg-[#1a1a1a] border-[#2f2f2f] text-[#f5f5f5] z-5"
                }`}
              >
                {/* Real project preview header */}
                <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2830]" />
                    <span className="font-mono text-[9px] font-bold text-[#ff2830] uppercase">
                      {card.badge || "PROJ"}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#a3a3a3]">
                    {card.tech || "v2.0"}
                  </span>
                </div>

                {/* Real project title & mini metrics */}
                <div className="my-auto py-1">
                  <span className="block font-bold text-xs text-white truncate">
                    {card.title}
                  </span>
                  <small className="block text-[10px] text-[#a3a3a3] font-sans truncate mt-0.5">
                    {card.caption}
                  </small>
                </div>

                {/* Bottom status strip */}
                <div className="flex items-center justify-between pt-1 border-t border-[#262626] font-mono text-[9px] text-[#888]">
                  <span>{card.status || "Deployed"}</span>
                  <span className="text-[#ff2830]">› online</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOLDER FRONT FLAP (OPENS FORWARD ON HOVER) */}
        <motion.div
          animate={
            isHovered && !shouldReduceMotion
              ? { rotateX: -18, y: 4 }
              : { rotateX: 0, y: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 26
          }}
          style={{ transformOrigin: "bottom center" }}
          className={`absolute inset-x-0 bottom-0 top-18 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between z-20 transition-colors backdrop-blur-md shadow-xl ${
            isSelected || isHovered
              ? "bg-[#222222]/98 border-[#ff2830]/50"
              : "bg-[#202020]/96 border-[#333333]"
          }`}
        >
          {/* Top of front flap */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <b className="block font-mono text-sm sm:text-base font-bold text-white group-hover:text-[#ff2830] transition-colors">
                {label}
              </b>
              <small className="block text-xs text-[#a3a3a3] mt-1 leading-snug font-sans">
                {description}
              </small>
            </div>

            <span
              className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono text-xs transition-colors shrink-0 ${
                isHovered || isSelected
                  ? "bg-[#ff2830] text-white border-[#ff2830]"
                  : "bg-[#181818] text-[#a3a3a3] border-[#333333] group-hover:text-white"
              }`}
              aria-hidden="true"
            >
              ↗
            </span>
          </div>

          {/* Bottom metadata tags */}
          <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-[#303030] text-[#a3a3a3]">
            <span className="truncate">
              {items.length} items catalogued
            </span>
            <span className="text-[#ff2830] font-semibold">
              Explore →
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
