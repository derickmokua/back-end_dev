import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Github, Menu, X, Terminal } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "Cases", href: "#cases" },
  { label: "About", href: "#think" },
  { label: "Lab", href: "#lab" },
  { label: "Services", href: "#services" },
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

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
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
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          className="group flex items-center gap-1 font-mono text-base font-bold tracking-tight select-none outline-none focus-visible:ring-1 focus-visible:ring-[#ff2830] rounded-md px-1 py-0.5"
          aria-label="Derick Mokua Home"
        >
          <span className="text-[#ff2830] group-hover:drop-shadow-[0_0_8px_rgba(255,40,48,0.7)] transition-all">@</span>
          <span className="text-[#f5f5f5] group-hover:text-white transition-colors">derick</span>
          <span className="text-[#ff2830] group-hover:drop-shadow-[0_0_8px_rgba(255,40,48,0.7)] transition-all">mokua</span>
        </Link>

        {/* ── Obsidian Pill Navigation Dock (Desktop) ── */}
        <div className="hidden lg:flex items-center">
          <div
            onMouseLeave={() => setHoveredIndex(null)}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-transparent border-0 shadow-none"
          >
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.href;
              const isHovered = hoveredIndex === index;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    scrollToSection(e, item.href);
                    setActiveSection(item.href);
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  className={`relative px-3 py-1.5 text-[12.5px] font-mono transition-all duration-200 select-none border-0 outline-none focus:outline-none rounded-md ${
                    isHovered
                      ? "text-[#ff2830] font-semibold"
                      : isActive
                      ? "text-white font-medium"
                      : "text-[#a3a3a3] hover:text-[#ff2830]"
                  }`}
                  style={{
                    textShadow: isHovered
                      ? "0 0 10px rgba(255, 40, 48, 0.9), 0 0 20px rgba(255, 40, 48, 0.45)"
                      : "none",
                  }}
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
        <div className="flex items-center gap-2">
          {/* GitHub Profile Button (No border) */}
          <a
            href="https://github.com/derickmokua"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-transparent border-0 hover:bg-[#ff2830]/10 text-[#a3a3a3] hover:text-[#ff2830] flex items-center justify-center transition-all duration-200 focus:outline-none shadow-none"
            title="GitHub Profile"
            aria-label="GitHub Profile"
          >
            <Github size={17} />
          </a>

          {/* Mobile Menu Toggle Button (No border) */}
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
              className="group px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#b3b3b3] hover:text-[#ff2830] hover:bg-[#ff2830]/8 border-0 transition-all duration-150 flex items-center justify-between"
            >
              <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,40,48,0.7)] transition-all">
                {item.label}
              </span>
              <span className="text-[#555] group-hover:text-[#ff2830] text-[10px] transition-colors">→</span>
            </a>
          ))}

          <Link
            to="/chat"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 px-3.5 py-2.5 rounded-xl bg-[#ff2830]/10 border-0 text-[#ff2830] hover:bg-[#ff2830]/18 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-none"
          >
            <Terminal size={14} /> Launch Ruby AI
          </Link>
        </div>
      )}
    </nav>
  );
}
