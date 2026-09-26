import React from "react";

export default function ObsidianSectionDivider({ label }) {
  return (
    <div className="relative w-full py-8 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* Subtle outer gradient horizon line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-[#262626] to-transparent" />
      
      {/* Core brand red laser beam */}
      <div className="absolute inset-x-[20%] top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-[#ff2830]/45 to-transparent" />
      
      {/* Center ambient glow flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-10 bg-[#ff2830]/10 blur-xl rounded-full" />

      {/* Obsidian Junction Node */}
      {label ? (
        <span className="relative z-10 px-3 py-1 rounded-full bg-[#101010] border border-[#2e2e2e] font-mono text-[9.5px] uppercase tracking-widest text-[#737373] flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2830] animate-pulse" />
          <span>{label}</span>
        </span>
      ) : (
        <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#141414] border border-[#ff2830]/50 flex items-center justify-center shadow-[0_0_8px_rgba(255,40,48,0.4)]">
          <span className="w-1 h-1 rounded-full bg-[#ff2830]" />
        </span>
      )}
    </div>
  );
}
