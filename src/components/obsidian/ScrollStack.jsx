import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Shield, Cpu, Zap, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function ScrollStack({
  onOpenArchitecture,
  onSelectProject,
  onScrollToWork
}) {
  const shouldReduceMotion = useReducedMotion();

  const caseStudies = [
    {
      id: "kukuconnect",
      num: "01",
      title: "KukuConnect",
      tagline: "From notebooks to a modern poultry management platform.",
      desc: "Architected a fault-tolerant offline-first poultry management system tailored for Kenyan farmers. Incorporates SMS/USSD ingress pipelines and edge sync so operations never pause during network dropouts.",
      isDominant: true,
      chips: ["SaaS", "Agriculture", "Real-World Impact", "Offline-First"],
      metrics: [
        { label: "Active Flock", val: "1,248" },
        { label: "Hatch Rate", val: "98%" },
        { label: "Offline Cache", val: "100%" }
      ],
      action: {
        type: "modal",
        label: "Read full case study ↗",
        handler: onOpenArchitecture
      }
    },
    {
      id: "saibae",
      num: "02",
      title: "Saibae",
      tagline: "An AI-powered WhatsApp assistant for everyday needs.",
      desc: "Designed and deployed an intelligent conversational gateway bridging complex large language models with everyday WhatsApp chat. Built with strict safety guards, deterministic token filtering, and context caching.",
      isDominant: false,
      chips: ["AI Engineering", "WhatsApp Gateway", "Zero-Leak", "Automation"],
      metrics: [
        { label: "Latency", val: "<800ms" },
        { label: "Safety Checks", val: "100%" },
        { label: "Model", val: "Gemini 1.5" }
      ],
      action: {
        type: "link",
        label: "Launch live demo ↗",
        to: "/chat"
      }
    },
    {
      id: "whatslove",
      num: "03",
      title: "WhatsLove",
      tagline: "A conversational product connecting people in real time.",
      desc: "Engineered high-concurrency real-time messaging services using WebSocket protocol with Redis pub/sub backplanes. Enforces end-to-end conversation privacy and sub-15ms message dispatch.",
      isDominant: false,
      chips: ["Django", "WebSockets", "Redis Pub/Sub", "Real-Time"],
      metrics: [
        { label: "P99 Latency", val: "14ms" },
        { label: "Tx Delivery", val: "99.9%" },
        { label: "State Sync", val: "Instant" }
      ],
      action: {
        type: "callback",
        label: "Explore technical specs ↗",
        handler: () => {
          if (onSelectProject) onSelectProject(3);
          if (onScrollToWork) onScrollToWork();
        }
      }
    }
  ];

  return (
    <div className="scroll-stack-container relative space-y-6 pt-2 pb-8">
      {caseStudies.map((cs, idx) => {
        // Sticky offset for stacked cards effect
        const stickyTop = 84 + idx * 22;

        return (
          <motion.div
            key={cs.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.35,
              delay: shouldReduceMotion ? 0 : idx * 0.08,
              ease: "easeOut"
            }}
            style={{
              position: "sticky",
              top: `${stickyTop}px`,
              zIndex: 10 + idx
            }}
            className="w-full"
          >
            <div
              className={`rounded-2xl transition-all duration-300 shadow-xl overflow-hidden ${
                cs.isDominant
                  ? "bg-gradient-to-br from-[#221719] via-[#691829] to-[#c71e35] text-white border-2 border-[#ff2830]/80 shadow-[0_12px_40px_rgba(255,40,48,0.22)]"
                  : "bg-[#202020] text-[#f5f5f5] border border-[#333333] hover:border-[#ff2830]/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              }`}
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-10 justify-between items-start md:items-center">
                {/* Content Left */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
                        cs.isDominant
                          ? "bg-white text-[#c71e35] border-white shadow-sm"
                          : "bg-[#181818] text-[#a3a3a3] border-[#333333]"
                      }`}
                    >
                      {cs.num}
                    </span>

                    <span
                      className={`font-mono text-xs font-semibold tracking-wider uppercase ${
                        cs.isDominant ? "text-white/90" : "text-[#ff2830]"
                      }`}
                    >
                      {cs.isDominant ? "Dominant Flagship Case Study" : "Production Case Study"}
                    </span>
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      cs.isDominant ? "text-white" : "text-[#f5f5f5]"
                    }`}
                  >
                    {cs.title}
                  </h3>

                  <p
                    className={`text-sm sm:text-base font-medium leading-relaxed max-w-2xl ${
                      cs.isDominant ? "text-white/95" : "text-[#f5f5f5]/85"
                    }`}
                  >
                    {cs.tagline}
                  </p>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
                      cs.isDominant ? "text-white/80" : "text-[#a3a3a3]"
                    }`}
                  >
                    {cs.desc}
                  </p>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {cs.chips.map((chip) => (
                      <span
                        key={chip}
                        className={`font-mono text-[11px] px-2.5 py-0.5 rounded-md border ${
                          cs.isDominant
                            ? "bg-white/10 text-white border-white/30"
                            : "bg-[#181818] text-[#a3a3a3] border-[#333333]"
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Metrics & Action */}
                <div className="w-full md:w-64 flex flex-col justify-between gap-5 self-stretch border-t md:border-t-0 md:border-l border-white/15 md:pl-8 pt-4 md:pt-0">
                  <div className="grid grid-cols-3 md:grid-cols-1 gap-2.5">
                    {cs.metrics.map((m) => (
                      <div
                        key={m.label}
                        className={`p-2.5 rounded-lg border ${
                          cs.isDominant
                            ? "bg-black/25 border-white/20"
                            : "bg-[#181818] border-[#333333]"
                        }`}
                      >
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wider block ${
                            cs.isDominant ? "text-white/70" : "text-[#a3a3a3]"
                          }`}
                        >
                          {m.label}
                        </span>
                        <b
                          className={`font-mono text-sm sm:text-base block mt-0.5 ${
                            cs.isDominant ? "text-white" : "text-[#ff2830]"
                          }`}
                        >
                          {m.val}
                        </b>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    {cs.action.type === "modal" && (
                      <button
                        type="button"
                        onClick={cs.action.handler}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white text-[#b8182d] hover:bg-neutral-100 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                      >
                        {cs.action.label}
                      </button>
                    )}

                    {cs.action.type === "link" && (
                      <Link
                        to={cs.action.to}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#ff2830] hover:bg-[#ff3b43] text-white transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                      >
                        {cs.action.label}
                      </Link>
                    )}

                    {cs.action.type === "callback" && (
                      <button
                        type="button"
                        onClick={cs.action.handler}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#181818] hover:bg-[#252525] text-[#f5f5f5] border border-[#333333] hover:border-[#ff2830] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                      >
                        {cs.action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
