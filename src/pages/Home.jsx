import React, { useState, useEffect, Suspense, lazy } from "react";
// framer-motion is NOT imported here — it is ~117KB and only used by
// lazy chat/blog/birthday chunks. CSS handles mobile menu + back-to-top.
import {
  Terminal,
  ExternalLink,
  Github,
  Menu,
  X,
  ArrowUp,
  Activity,
  Linkedin,
  Search,
  Layers,
  Check,
  Copy
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  skills,
  projects,
  services,
  testimonials,
  blogPosts as staticBlogPosts,
  birthdayConfig
} from "../data/portfolioData";
// Hero shell is tiny and wraps LCP text — keep eager
import TerminalSection from "../components/TerminalSection";
import InteractiveHeroCLI from "../components/InteractiveHeroCLI";
// Decorative / below-fold / interaction-only — lazy
const MatrixRain = lazy(() => import("../components/MatrixRain"));
const DecryptGame = lazy(() => import("../components/DecryptGame"));
const RubyChatbot = lazy(() => import("../components/RubyChatbot"));
const BirthdayAnimation = lazy(() => import("../components/effects/BirthdayAnimation"));
const BlogModal = lazy(() => import("../components/BlogModal"));
const CommandPalette = lazy(() => import("../components/CommandPalette"));
const ArchitectureModal = lazy(() => import("../components/ArchitectureModal"));
import useHashnodePosts from "../hooks/useHashnode";

export default function Home() {
  const [typedHero, setTypedHero] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const [isContactUnlocked, setIsContactUnlocked] = useState(false);
  // Mount non-critical UI after idle so first paint stays HTML → small JS only
  const [mountChatbot, setMountChatbot] = useState(false);
  const [mountDecor, setMountDecor] = useState(false);

  // Birthday HUD State
  const [showBirthdayHUD, setShowBirthdayHUD] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);

  const fullHeroText = "> initializing_secure_ops_tunnel...";

  // Global shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Check Birthday
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();
    if (birthdayConfig && currentMonth === birthdayConfig.month && currentDate === birthdayConfig.day) {
      setIsBirthday(true);
    }
  }, []);

  /**
   * Defer heavy non-LCP UI until the user interacts (or a long fallback).
   * Short idle timeouts still fire during Lighthouse and re-introduce
   * motion-*.js (~40KB gz) into "unused JavaScript" + request chains.
   */
  useEffect(() => {
    let fallbackDecor;
    let fallbackChat;
    let doneDecor = false;
    let doneChat = false;

    const mountDecorNow = () => {
      if (doneDecor) return;
      doneDecor = true;
      setMountDecor(true);
    };
    const mountChatNow = () => {
      if (doneChat) return;
      doneChat = true;
      setMountChatbot(true);
    };

    const onInteract = () => {
      mountDecorNow();
      // Chatbot pulls framer-motion + marked — load only after intent
      mountChatNow();
    };

    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((evt) =>
      window.addEventListener(evt, onInteract, {
        once: true,
        passive: true,
        capture: true,
      })
    );

    // Matrix rain is small; allow a moderate fallback for ambience
    fallbackDecor = setTimeout(mountDecorNow, 6000);
    // Chatbot/motion: stay off PSI's network-quiet window entirely
    fallbackChat = setTimeout(mountChatNow, 15000);

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, onInteract, { capture: true })
      );
      if (fallbackDecor != null) clearTimeout(fallbackDecor);
      if (fallbackChat != null) clearTimeout(fallbackChat);
    };
  }, []);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullHeroText.length) {
        setTypedHero(fullHeroText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Fetch Hashnode posts dynamically via custom hook
  const { posts: apiPosts, loading: blogLoading } = useHashnodePosts();
  const activePosts = apiPosts && apiPosts.length > 0 ? apiPosts : staticBlogPosts;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text font-mono selection:bg-terminal-green selection:text-black overflow-x-hidden relative">
      
      {/* Subtle digital rain — after idle only (not on critical JS path) */}
      {mountDecor && (
        <Suspense fallback={null}>
          <MatrixRain />
        </Suspense>
      )}

      {/* Cyber grid overlay */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 cyber-grid-overlay animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Ambient background glows */}
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-terminal-green/3 rounded-full blur-[130px] pointer-events-none z-0 select-none" />
      <div className="fixed bottom-[15%] right-[-10%] w-[600px] h-[600px] bg-terminal-cyan/2.5 rounded-full blur-[150px] pointer-events-none z-0 select-none" />

      {/* Main content layers */}
      <div className="relative z-10">
        
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-40 bg-terminal-bg/90 backdrop-blur-md border-b border-terminal-green/10 shadow-lg shadow-black/50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              to="/"
              onClick={scrollToTop}
              className="text-lg font-bold tracking-tighter hover:glow-green transition-all flex items-center gap-0.5"
            >
              <span className="text-terminal-cyan font-mono">root@</span>
              <span className="text-terminal-green font-black">derick</span>
              <span className="text-terminal-green animate-pulse font-black text-xl leading-none">_</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-5 items-center text-xs font-bold uppercase tracking-wider">
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="hover:text-terminal-green transition-colors">About</a>
              <a href="#skills" onClick={(e) => scrollToSection(e, "#skills")} className="hover:text-terminal-green transition-colors">Skills</a>
              <a href="#projects" onClick={(e) => scrollToSection(e, "#projects")} className="hover:text-terminal-green transition-colors">Projects</a>
              <a href="#services" onClick={(e) => scrollToSection(e, "#services")} className="hover:text-terminal-green transition-colors">Services</a>
              <a href="#blog" onClick={(e) => scrollToSection(e, "#blog")} className="hover:text-terminal-green transition-colors">Articles</a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, "#testimonials")} className="hover:text-terminal-green transition-colors">Testimonials</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="hover:text-terminal-green transition-colors">Contact</a>

              {/* Live Telemetry Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#08090E] border border-terminal-green/20 rounded-full text-[10px] text-terminal-muted font-mono select-none">
                <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping" />
                <span className="text-terminal-green font-bold">LIVE</span>
                <span className="text-terminal-muted/60">// NAIROBI UTC+3</span>
              </div>

              {/* Command Palette Trigger */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-terminal-green/10 text-terminal-muted hover:text-terminal-green border border-white/10 hover:border-terminal-green/30 rounded text-[10px] font-mono transition-colors"
                title="Open Command Palette (Ctrl+K)"
              >
                <Search size={11} />
                <span className="hidden xl:inline">Search</span>
                <kbd className="text-[9px] px-1 bg-white/10 rounded">⌘K</kbd>
              </button>
              
              <a
                href="https://github.com/derickmokua"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-terminal-green hover:bg-terminal-green/5 rounded transition-all focus:outline-none"
                title="View GitHub Profile"
              >
                <Github size={16} />
              </a>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="p-1.5 text-terminal-green hover:bg-terminal-green/5 rounded transition-colors focus:outline-none"
                title="Search"
              >
                <Search size={16} />
              </button>
              <a
                href="https://github.com/derickmokua"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-terminal-green hover:bg-terminal-green/5 rounded transition-colors focus:outline-none"
                title="GitHub"
              >
                <Github size={16} />
              </a>
              <button
                className="p-1.5 text-terminal-green hover:bg-terminal-green/5 rounded transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav — CSS fade only (no framer-motion on critical path) */}
          {isMenuOpen && (
            <div
              className="md:hidden w-full bg-terminal-card border-b border-terminal-green/25 p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-wider shadow-2xl animate-fade-slide-in"
            >
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="py-2 border-b border-white/5 hover:text-terminal-green">About</a>
              <a href="#skills" onClick={(e) => scrollToSection(e, "#skills")} className="py-2 border-b border-white/5 hover:text-terminal-green">Skills</a>
              <a href="#projects" onClick={(e) => scrollToSection(e, "#projects")} className="py-2 border-b border-white/5 hover:text-terminal-green">Projects</a>
              <a href="#services" onClick={(e) => scrollToSection(e, "#services")} className="py-2 border-b border-white/5 hover:text-terminal-green">Services</a>
              <a href="#blog" onClick={(e) => scrollToSection(e, "#blog")} className="py-2 border-b border-white/5 hover:text-terminal-green">Articles</a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, "#testimonials")} className="py-2 border-b border-white/5 hover:text-terminal-green">Testimonials</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="py-2 hover:text-terminal-green font-bold">Contact</a>
              <Link
                to="/chat"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-t border-white/10 mt-1 text-terminal-cyan flex items-center gap-2 font-bold"
              >
                <Terminal size={14} /> Ruby AI Assistant
              </Link>
            </div>
          )}
        </nav>

        {/* Main stacked sections */}
        <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 space-y-24 md:space-y-32">
          
          {/* HERO SECTION */}
          <TerminalSection command="visitor@derick-host: ~/sys/boot">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-terminal-green bg-terminal-green/10 rounded-full border border-terminal-green/25 font-mono">
                <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping" />
                AVAILABLE FOR NEW PROJECTS
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
                Backend Architect &{" "}
                <span className="text-terminal-green">
                  AI Safety Researcher
                </span>
              </h1>

              <div className="flex items-center gap-2 text-terminal-muted text-xs sm:text-sm font-bold min-h-[22px] overflow-hidden font-mono">
                <Terminal size={14} className="text-terminal-green flex-shrink-0" />
                <span className="truncate">
                  {typedHero}
                  <span className="terminal-cursor" />
                </span>
              </div>

              <p className="max-w-2xl text-sm md:text-base text-terminal-text/85 leading-relaxed font-sans">
                I build secure, AI powered backend systems for teams across Africa and beyond turning complex ideas into reliable products that scale.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                  className="px-5 py-3 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  Get In Touch
                </a>
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, "#projects")}
                  className="px-5 py-3 border border-terminal-green/30 hover:border-terminal-green hover:bg-terminal-green/10 text-terminal-green rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  View My Work
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("derickmokua@outlook.com");
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  }}
                  className="px-4 py-3 bg-[#08090E] border border-white/10 hover:border-terminal-green/30 text-terminal-text hover:text-terminal-green rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2 font-mono"
                  title="Copy email to clipboard"
                >
                  {emailCopied ? <Check size={13} className="text-terminal-green" /> : <Copy size={13} />}
                  <span>{emailCopied ? "Email Copied" : "Copy Email"}</span>
                </button>
              </div>

              {/* Interactive Hero CLI Command Prompt */}
              <InteractiveHeroCLI />
            </div>
          </TerminalSection>

          {/* ABOUT SECTION */}
          <TerminalSection id="about" command="visitor@derick-host: ~/about">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 01. ABOUT</span>
              </h2>
              <div className="space-y-4 text-sm md:text-base text-terminal-text leading-relaxed font-sans max-w-3xl">
                <p>
                  I'm Derick Mokua a backend developer and AI engineer based in Nairobi, Kenya.
                </p>
                <p>
                  I build <strong className="text-terminal-green font-semibold">secure, scalable backend systems</strong> and integrate AI into real world products. My focus is on making powerful technology work reliably in environments where reliability matters most.
                </p>
                <p className="text-terminal-muted text-sm">
                  Currently researching how to make AI models safer and more trustworthy for high stakes use cases across Africa.
                </p>
              </div>
            </div>
          </TerminalSection>

          {/* SKILLS SECTION */}
          <TerminalSection id="skills" command="visitor@derick-host: ~/skills">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 02. SKILLS</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {skills.map((category) => (
                  <div 
                    key={category.category} 
                    className="bg-[#08090E]/60 border border-white/10 hover:border-terminal-green/30 p-5 rounded-xl space-y-4 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <h3 className="text-xs font-bold text-terminal-cyan uppercase tracking-wider font-mono">
                        {category.category}
                      </h3>
                      <span className="text-[10px] text-terminal-cyan font-mono font-bold">
                        {category.items.length} tools
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <span
                          key={skill.name}
                          className="bg-black/50 border border-white/10 hover:border-terminal-green/30 text-terminal-text hover:text-terminal-green text-xs px-3 py-1.5 rounded-lg transition-colors font-sans font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TerminalSection>

          {/* PROJECTS SECTION */}
          <TerminalSection id="projects" command="visitor@derick-host: ~/projects">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 03. PROJECTS</span>
              </h2>
              <div className="space-y-5">
                {/* Flagship */}
                {projects[0] && (
                  <div className="w-full bg-[#08090E]/60 border border-white/10 hover:border-terminal-green/30 p-6 sm:p-7 rounded-xl transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-terminal-green transition-colors">
                          {projects[0].title.split(":")[0]}
                        </h3>
                        {projects[0].subtitle && (
                          <span className="text-[10px] text-terminal-muted uppercase tracking-wide">
                            {projects[0].subtitle}
                          </span>
                        )}
                      </div>
                      <span className="bg-terminal-green/10 border border-terminal-green/25 text-terminal-green text-[10px] px-3 py-0.5 rounded-full uppercase font-bold tracking-wide">
                        {projects[0].status}
                      </span>
                    </div>
                    <p className="text-sm text-terminal-text leading-relaxed mb-5 font-sans">
                      {projects[0].desc}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {projects[0].tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-black/60 border border-white/10 text-terminal-cyan text-[10px] px-2.5 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setIsArchModalOpen(true)}
                          aria-label={`Open system architecture diagram for ${projects[0].title.split(":")[0]}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-terminal-cyan/10 hover:bg-terminal-cyan text-terminal-cyan hover:text-black border border-terminal-cyan/30 rounded-lg transition-all"
                        >
                          <Layers size={13} />
                          Architecture
                        </button>
                        {projects[0].github && (
                          <a
                            href={projects[0].github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View source code for ${projects[0].title.split(":")[0]} on GitHub`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 rounded-lg transition-all"
                          >
                            <Github size={13} />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Other projects */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {projects.slice(1).map((project) => {
                    const demoIsInternal = project.demo && project.demo.startsWith("/");
                    const projectBaseTitle = project.title.split(":")[0];
                    return (
                      <div
                        key={project.title}
                        className="bg-[#08090E]/60 border border-white/10 hover:border-terminal-green/30 p-5 rounded-xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {projectBaseTitle}
                            </h4>
                            <span className="text-[9px] bg-terminal-cyan/10 border border-terminal-cyan/20 text-terminal-cyan px-2 py-0.5 rounded uppercase font-bold tracking-tight">
                              {project.status}
                            </span>
                          </div>
                          <p className="text-xs text-terminal-muted leading-relaxed mb-4 font-sans">
                            {project.desc}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="bg-black/50 text-terminal-cyan border border-white/10 text-[9px] px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {(project.github || project.demo) && (
                            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View source code for ${projectBaseTitle} on GitHub`}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-terminal-green hover:text-white transition-colors"
                                >
                                  <Github size={12} />
                                  Code
                                </a>
                              )}
                              {project.demo && (
                                demoIsInternal ? (
                                  <Link
                                    to={project.demo}
                                    aria-label={`Open interactive demo for ${projectBaseTitle}`}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-terminal-cyan hover:text-white transition-colors"
                                  >
                                    <ExternalLink size={12} />
                                    Demo
                                  </Link>
                                ) : (
                                  <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open live project for ${projectBaseTitle}`}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-terminal-cyan hover:text-white transition-colors"
                                  >
                                    <ExternalLink size={12} />
                                    Live
                                  </a>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TerminalSection>

          {/* SERVICES SECTION */}
          <TerminalSection id="services" command="visitor@derick-host: ~/services">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 04. SERVICES</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="bg-[#08090E]/60 border border-white/10 hover:border-terminal-green/30 p-5 md:p-6 rounded-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5 font-mono">
                        {service.title}
                      </h3>
                      <p className="text-xs text-terminal-muted leading-relaxed mb-4 font-sans">
                        {service.desc}
                      </p>
                    </div>
                    <ul className="space-y-2 border-t border-white/5 pt-3.5">
                      {service.features.map((feature) => (
                        <li key={feature} className="text-xs text-terminal-cyan flex items-center gap-2 font-mono">
                          <span className="w-1.5 h-1.5 bg-terminal-cyan rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </TerminalSection>

          {/* ARTICLES SECTION */}
          <TerminalSection id="blog" command="visitor@derick-host: ~/articles">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 05. ARTICLES</span>
              </h2>
              <div className="space-y-3.5">
                {blogLoading ? (
                  <div className="text-xs text-terminal-cyan animate-pulse font-mono">
                    {">"} Syncing with publication database...
                  </div>
                ) : (
                  activePosts.map((post) => (
                    <div
                      key={post.title}
                      onClick={() => setSelectedBlogPost(post)}
                      className="p-5 md:p-6 border border-white/10 rounded-xl bg-[#08090E]/60 hover:border-terminal-green/30 hover:bg-[#121622] transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between text-[10px] text-terminal-cyan mb-2 font-mono font-bold uppercase tracking-wider">
                        <span>{post.date}</span>
                        <span>Transmitted Record</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 group-hover:text-terminal-green transition-colors flex items-center gap-1.5 font-sans">
                        {post.title}
                        <ExternalLink size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-terminal-muted" />
                      </h3>
                      <p className="text-xs text-terminal-text line-clamp-2 leading-relaxed font-sans">
                        {post.desc}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TerminalSection>

          {/* TESTIMONIALS SECTION */}
          <TerminalSection id="testimonials" command="visitor@derick-host: ~/testimonials">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 06. TESTIMONIALS</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {testimonials.map((test, idx) => (
                  <div
                    key={idx}
                    className="bg-[#08090E]/60 border border-white/10 hover:border-terminal-green/30 p-5 md:p-6 rounded-xl text-xs flex flex-col justify-between transition-all"
                  >
                    <p className="text-terminal-text italic mb-4 leading-relaxed font-sans text-xs">
                      "{test.text}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-white/5 pt-3.5">
                      <div className="w-8 h-8 rounded-full bg-terminal-green/10 border border-terminal-green/25 text-terminal-green font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                        {test.initials}
                      </div>
                       <div className="min-w-0">
                         <h3 className="font-bold text-white text-xs truncate font-sans">{test.name}</h3>
                         <p className="text-[10px] text-terminal-cyan truncate font-mono">{test.role} @ {test.company}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TerminalSection>

          {/* CONTACT SECTION */}
          <TerminalSection id="contact" command="visitor@derick-host: ~/contact">
            <div className="space-y-6">
              <h2 className="text-xs font-mono font-bold tracking-widest text-terminal-green uppercase flex items-center gap-2">
                <span>// 07. CONTACT</span>
              </h2>
              <div className="w-full relative overflow-hidden">
                <div className="flex flex-col justify-center relative z-10 h-full max-w-2xl mx-auto">
                  <DecryptGame
                    isUnlockedInitially={isContactUnlocked}
                    onUnlocked={() => setIsContactUnlocked(true)}
                  />
                </div>
              </div>
            </div>
          </TerminalSection>

          {/* Footer */}
          <footer className="border-t border-terminal-green/10 pt-8 text-[10px] text-terminal-muted font-mono flex flex-col items-center gap-5 select-none pb-10">
            {/* Social Icons */}
            <div className="flex items-center gap-5">
              {/* X / Twitter */}
              <a
                href="https://x.com/derick_mokua"
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                aria-label="Visit Derick Mokua on X (Twitter)"
                className="text-terminal-muted social-icon-btn social-glow-x"
              >
                {/* Real X logo */}
                <svg width="15" height="15" viewBox="0 0 300 300" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/derickmokua"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                aria-label="Visit Derick Mokua on LinkedIn"
                className="text-terminal-muted social-icon-btn social-glow-linkedin"
              >
                <Linkedin size={16} />
              </a>
              {/* Telegram */}
              <a
                href="https://t.me/derick_mokua"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                aria-label="Contact Derick Mokua on Telegram"
                className="text-terminal-muted social-icon-btn social-glow-telegram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com/@derickmokua"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                aria-label="Visit Derick Mokua on TikTok"
                className="text-terminal-muted social-icon-btn social-glow-tiktok"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                </svg>
              </a>
            </div>
            {/* Copyright */}
            <span className="text-center">© 2026 Derick Mokua // Nairobi, KE</span>
          </footer>

        </main>

        {/* Chatbot loads after first paint — keeps heavy deps off the critical path */}
        {mountChatbot && (
          <Suspense fallback={null}>
            <RubyChatbot />
          </Suspense>
        )}

        {/* Floating Back to top helper — CSS only */}
        {showBackToTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-35 w-9 h-9 bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green rounded-full flex items-center justify-center transition-all focus:outline-none shadow-lg shadow-black/40 animate-fade-scale-in"
            title="Back to top"
          >
            <ArrowUp size={16} />
          </button>
        )}

        {/* Blog Overlay Modal — motion ships inside the lazy BlogModal chunk only */}
        {selectedBlogPost && (
          <Suspense fallback={null}>
            <BlogModal
              post={selectedBlogPost}
              onClose={() => setSelectedBlogPost(null)}
            />
          </Suspense>
        )}

        {/* Global Command Palette */}
        {isCommandPaletteOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
            />
          </Suspense>
        )}

        {/* Architecture Pipeline Modal */}
        {isArchModalOpen && (
          <Suspense fallback={null}>
            <ArchitectureModal
              isOpen={isArchModalOpen}
              onClose={() => setIsArchModalOpen(false)}
            />
          </Suspense>
        )}

      </div>

      {/* Birthday HUD Animations if active */}
      <Suspense fallback={null}>
        {showBirthdayHUD ? (
          <BirthdayAnimation HUDEnabled={true} onComplete={() => setShowBirthdayHUD(false)} />
        ) : (
          isBirthday && <BirthdayAnimation HUDEnabled={false} persist={true} />
        )}
      </Suspense>

    </div>
  );
}
