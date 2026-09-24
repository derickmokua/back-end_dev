import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function TextFillAnimation({
  text = "I care about the part after the demo: unreliable networks, messy data, permissions, failure states and whether the system still works on a bad day.",
  className = ""
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 45%"]
  });

  const words = text.split(" ");

  // Highlight specific critical engineering phrases in primary red #ff2830
  const isRedWord = (word) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, "");
    return ["unreliable", "networks", "failure", "states", "bad", "day"].includes(clean);
  };

  return (
    <div
      ref={containerRef}
      className={`text-fill-root p-6 sm:p-8 rounded-2xl bg-[#202020] border border-[#333333] shadow-xl relative overflow-hidden select-none ${className}`}
    >
      {/* Decorative subtle ambient corner glow */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 bg-[#ff2830]/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="flex items-center gap-2 mb-4 font-mono text-[11px] uppercase tracking-wider text-[#ff2830]">
        <span className="w-2 h-2 rounded-full bg-[#ff2830] inline-block animate-ping" />
        <span>Core Engineering Philosophy</span>
      </div>

      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug sm:leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;

          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
              isAccent={isRedWord(word)}
              shouldReduceMotion={shouldReduceMotion}
            />
          );
        })}
      </p>
    </div>
  );
}

function Word({ word, progress, range, isAccent, shouldReduceMotion }) {
  // If reduced motion is requested, render immediately active
  if (shouldReduceMotion) {
    return (
      <span
        className={`inline-block font-sans ${
          isAccent ? "text-[#ff2830] font-bold" : "text-[#f5f5f5]"
        }`}
      >
        {word}
      </span>
    );
  }

  // Dual-layer fill effect: base layer is muted text derived from #a3a3a3, overlay layer is filled text
  // Smooth scroll opacity
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block font-sans">
      {/* Base ghost/muted layer */}
      <span className="text-[#a3a3a3]/30 select-none">
        {word}
      </span>

      {/* Active filled layer */}
      <motion.span
        style={{ opacity }}
        className={`absolute inset-0 select-text ${
          isAccent ? "text-[#ff2830] font-bold" : "text-[#f5f5f5]"
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
}
