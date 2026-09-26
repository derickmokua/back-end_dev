import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Menu, X, Terminal, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Cases", href: "#cases" },
  { label: "About", href: "#think" },
  { label: "Services", href: "#services" },
  { label: "Lab", href: "#lab" },
  { label: "Articles", href: "#blog" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function ObsidianNavbar({
  scrollToSection,
  scrollToTop,
  isMenuOpen,
  setIsMenuOpen,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("#top");
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, height: 0, top: 0, opacity: 0 });
  const navContainerRef = useRef(null);
  const itemsRef = useRef([]);

  // Update pill position when hoveredIndex changes
  useEffect(() => {
    if (hoveredIndex !== null && itemsRef.current[hoveredIndex] && navContainerRef.current) {
      const itemEl = itemsRef.current[hoveredIndex];
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const itemRect = itemEl.getBoundingClientRect();

      setPillStyle({
        left: itemRect.left - containerRect.left,
        top: itemRect.top - containerRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredIndex]);

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        if (item.href === "#top") continue;
        const el = document.querySelector(item.href);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(item.href);
          return;
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("#top");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav id="top" className="sticky top-0 z-40 w-full bg-[#0d0d0d]/85 backdrop-blur-xl border-b border-[#222222] transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <Link
          to="/"
          onClick={scrollToTop}
          className="group flex items-center gap-1 font-mono text-base font-bold tracking-tight select-none outline-none focus-visible:ring-1 focus-visible:ring-[#ff2830] rounded-md px-1 py-0.5"
          aria-label="Derick Mokua Home"
        >
          <span className="text-[#ff2830] group-hover:drop-shadow-[0_0_8px_rgba(255,40,48,0.6)] transition-all">@</span>
          <span className="text-[#f5f5f5] group-hover:text-white transition-colors">derick</span>
          <span className="text-[#ff2830] group-hover:drop-shadow-[0_0_8px_rgba(255,40,48,0.6)] transition-all">mokua</span>
        </Link>

        {/* ── Obsidian Pill Navigation Dock (Desktop) ── */}
        <div className="hidden lg:flex items-center">
          <div
            ref={navContainerRef}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex items-center p-1 rounded-full bg-[#161616]/90 border border-[#2a2a2a] shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl"
          >
            {/* Smooth animated sliding hover pill */}
            <div
              className="absolute rounded-full transition-all duration-200 ease-out pointer-events-none"
              style={{
                left: `${pillStyle.left}px`,
                top: `${pillStyle.top}px`,
                width: `${pillStyle.width}px`,
                height: `${pillStyle.height}px`,
                opacity: pillStyle.opacity,
                background: "rgba(255, 40, 48, 0.12)",
                border: "1px solid rgba(255, 40, 48, 0.35)",
                boxShadow: "0 0 16px rgba(255, 40, 48, 0.22)",
              }}
            />

            {/* Navigation links */}
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.href;
              const isHovered = hoveredIndex === index;

              return (
                <a
                  key={item.label}
                  ref={(el) => (itemsRef.current[index] = el)}
                  href={item.href}
                  onClick={(e) => {
                    scrollToSection(e, item.href);
                    setActiveSection(item.href);
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  className={`relative z-10 px-3.5 py-1.5 rounded-full text-[12px] font-mono transition-colors duration-200 select-none outline-none focus-visible:ring-1 focus-visible:ring-[#ff2830] ${
                    isHovered
                      ? "text-[#ff2830] font-semibold drop-shadow-[0_0_6px_rgba(255,40,48,0.4)]"
                      : isActive
                      ? "text-white font-medium"
                      : "text-[#a3a3a3]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-[#ff2830] shadow-[0_0_6px_#ff2830]" />
                    )}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* GitHub Profile Button */}
          <a
            href="https://github.com/derickmokua"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#161616] border border-[#2a2a2a] hover:border-[#ff2830]/40 text-[#a3a3a3] hover:text-[#ff2830] hover:bg-[#ff2830]/10 flex items-center justify-center transition-all duration-200 focus:outline-none shadow-sm"
            title="GitHub Profile"
            aria-label="GitHub Profile"
          >
            <Github size={16} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-xl bg-transparent border-0 hover:bg-[#ff2830]/10 text-[#a3a3a3] hover:text-[#ff2830] flex items-center justify-center transition-all duration-200 focus:outline-none select-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Obsidian Mobile Nav Drawer ── */}
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-[#121212]/95 backdrop-blur-2xl border-b border-[#262626] px-5 py-4 flex flex-col gap-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-fade-slide-in">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                scrollToSection(e, item.href);
                setIsMenuOpen(false);
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#b3b3b3] hover:text-[#ff2830] hover:bg-[#ff2830]/10 border border-transparent hover:border-[#ff2830]/25 transition-all duration-150 flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-[#555] group-hover:text-[#ff2830] text-[10px]">→</span>
            </a>
          ))}

          <Link
            to="/chat"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 px-3.5 py-2.5 rounded-xl bg-[#ff2830]/10 border border-[#ff2830]/30 text-[#ff2830] hover:bg-[#ff2830]/18 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Terminal size={14} /> Launch Ruby AI
          </Link>
        </div>
      )}
    </nav>
  );
}
