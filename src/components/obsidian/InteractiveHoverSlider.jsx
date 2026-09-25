import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Layers, Github, ExternalLink } from "lucide-react";

export default function InteractiveHoverSlider({
  projects,
  metrics,
  selectedIndex = 0,
  onSelectProject,
  onOpenArchitecture,
  onScrollToCases
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  // Active index defaults to selectedIndex if not hovering, or hoveredIndex during interaction
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeProject = projects[activeIndex] || projects[0];
  const activeMetrics = metrics[activeIndex] || metrics[0];

  return (
    <div className="work-slider-root grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* LEFT: Interactive Selector List */}
      <div 
        role="tablist" 
        aria-label="Selected projects" 
        className="lg:col-span-5 flex flex-col space-y-1.5 relative select-none"
      >
        {projects.map((p, i) => {
          const isSelected = selectedIndex === i;
          const isHovered = hoveredIndex === i;
          const baseTitle = p.title.split(":")[0];

          return (
            <button
              key={p.title}
              role="tab"
              aria-selected={isSelected}
              className={`relative z-10 w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex items-center justify-between group outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc)] ${
                isSelected
                  ? "border-[#ff2830]/40 text-white"
                  : "border-[#333333] hover:border-[#444444] text-[#f5f5f5]"
              }`}
              onClick={() => onSelectProject(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
            >
              {/* Animated Floating Indicator Pill */}
              {(isSelected || isHovered) && (
                <motion.div
                  layoutId={shouldReduceMotion ? undefined : "active-project-pill"}
                  className={`absolute inset-0 rounded-xl pointer-events-none ${
                    isSelected
                      ? "bg-[rgba(255,40,48,0.12)] border border-[#ff2830]"
                      : "bg-[#252525]/80 border border-[#444444]"
                  }`}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 450, damping: 35 }
                  }
                  style={{ zIndex: -1 }}
                />
              )}

              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`font-mono text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                    isSelected
                      ? "text-[#ff5c63] bg-[#ff2830]/10"
                      : "text-[#a3a3a3] group-hover:text-white"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <span className="block font-bold text-sm text-[#f5f5f5] group-hover:text-white transition-colors truncate">
                    {baseTitle}
                  </span>
                  <small className="block text-xs text-[#a3a3a3] truncate mt-0.5 font-sans">
                    {p.subtitle || p.tags.slice(0, 2).join(" • ")}
                  </small>
                </div>
              </div>

              <span
                className={`font-mono text-base transition-transform duration-200 ml-2 ${
                  isSelected
                    ? "text-[#ff2830] translate-x-1"
                    : "text-[#a3a3a3] group-hover:text-white group-hover:translate-x-0.5"
                }`}
                aria-hidden="true"
              >
                ›
              </span>
            </button>
          );
        })}
      </div>

      {/* RIGHT: Smooth Transition Preview Panel */}
      <div className="lg:col-span-7 bg-[#202020] border border-[#333333] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.title}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-12 h-full"
          >
            {/* Left Column: Metadata & CTAs */}
            <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#ff5c63] font-semibold">
                    {activeProject.category || "Featured System"}
                  </span>
                  {activeProject.status && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border border-[#333333] bg-[#181818] text-[#a3a3a3]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2830] animate-pulse" />
                      {activeProject.status}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#f5f5f5] tracking-tight mb-2">
                  {activeProject.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed mb-6 font-sans">
                  {activeProject.desc}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {onScrollToCases && (
                    <button
                      type="button"
                      onClick={onScrollToCases}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#ff2830] hover:bg-[#ff3b43] text-white transition-all shadow-md active:scale-95"
                    >
                      View case study →
                    </button>
                  )}

                  {onOpenArchitecture && (
                    <button
                      type="button"
                      onClick={onOpenArchitecture}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#181818] hover:bg-[#282828] text-[#f5f5f5] border border-[#333333] hover:border-[#ff2830] transition-colors flex items-center gap-1.5"
                    >
                      <Layers size={13} className="text-[#ff2830]" />
                      Architecture
                    </button>
                  )}

                  {activeProject.github && (
                    <a
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#181818] hover:bg-[#282828] text-[#f5f5f5] border border-[#333333] hover:border-[#ff2830] transition-colors flex items-center gap-1.5"
                      href={activeProject.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github size={13} />
                      Code ↗
                    </a>
                  )}

                  {activeProject.demo && (
                    activeProject.demo.startsWith("/") ? (
                      <a
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#181818] hover:bg-[#282828] text-[#ff6870] border border-[#333333] hover:border-[#ff2830] transition-colors flex items-center gap-1.5"
                        href={activeProject.demo}
                      >
                        <ExternalLink size={13} />
                        Live demo ↗
                      </a>
                    ) : (
                      <a
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#181818] hover:bg-[#282828] text-[#ff6870] border border-[#333333] hover:border-[#ff2830] transition-colors flex items-center gap-1.5"
                        href={activeProject.demo}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={13} />
                        Live site ↗
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Tags / Stack */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#333333]">
                {activeProject.tags.map((chip) => (
                  <span
                    key={chip}
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded-md border border-[#333333] bg-[#181818]/60 text-[#a3a3a3]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Preview / Real Project Telemetry Metrics */}
            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#333333] bg-gradient-to-br from-[#1b1516] via-[#141414] to-[#181818] p-5 flex flex-col justify-center">
              <div className="space-y-3" aria-hidden="true">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#a3a3a3] flex items-center justify-between pb-1 border-b border-[#333333]">
                  <span>Telemetry Live</span>
                  <span className="text-[#ff2830]">NODE 01: ACTIVE</span>
                </div>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#242424] border border-[#383838] rounded-lg p-2.5 shadow-inner">
                    <small className="font-mono text-[9px] text-[#a3a3a3] block uppercase truncate">
                      {activeMetrics.st1Label}
                    </small>
                    <b className="font-mono text-sm sm:text-base text-white block mt-0.5 truncate">
                      {activeMetrics.st1Val}
                    </b>
                  </div>

                  <div className="bg-[#242424] border border-[#383838] rounded-lg p-2.5 shadow-inner">
                    <small className="font-mono text-[9px] text-[#a3a3a3] block uppercase truncate">
                      {activeMetrics.st2Label}
                    </small>
                    <b className="font-mono text-sm sm:text-base text-white block mt-0.5 truncate">
                      {activeMetrics.st2Val}
                    </b>
                  </div>

                  <div className="bg-[#242424] border border-[#383838] rounded-lg p-2.5 shadow-inner">
                    <small className="font-mono text-[9px] text-[#a3a3a3] block uppercase truncate">
                      {activeMetrics.st3Label}
                    </small>
                    <b className="font-mono text-sm sm:text-base text-white block mt-0.5 truncate">
                      {activeMetrics.st3Val}
                    </b>
                  </div>
                </div>

                {/* Dynamic SVG Sparkline Graph */}
                <div className="bg-[#121212] border border-[#333333] rounded-lg p-3 overflow-hidden shadow-inner relative">
                  <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono text-[#a3a3a3]">
                    <span>Throughput Stream</span>
                    <span className="text-[#ff2830]">p99 Verified</span>
                  </div>
                  <svg
                    viewBox="0 0 300 90"
                    preserveAspectRatio="none"
                    className="w-full h-18 stroke-[#ff2830]"
                  >
                    <defs>
                      <linearGradient id={`grad-${activeIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff2830" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff2830" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="#ff2830"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={activeMetrics.points}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
