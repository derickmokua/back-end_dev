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
  Linkedin
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
// Decorative / below-fold / interaction-only — lazy
const MatrixRain = lazy(() => import("../components/MatrixRain"));
const DecryptGame = lazy(() => import("../components/DecryptGame"));
const RubyChatbot = lazy(() => import("../components/RubyChatbot"));
const BirthdayAnimation = lazy(() => import("../components/effects/BirthdayAnimation"));
const BlogModal = lazy(() => import("../components/BlogModal"));
import useHashnodePosts from "../hooks/useHashnode";

export default function Home() {
  const [typedHero, setTypedHero] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  const [isContactUnlocked, setIsContactUnlocked] = useState(false);
  // Mount non-critical UI after idle so first paint stays HTML → small JS only
  const [mountChatbot, setMountChatbot] = useState(false);
  const [mountDecor, setMountDecor] = useState(false);

  // Birthday HUD State
  const [showBirthdayHUD, setShowBirthdayHUD] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);

  const fullHeroText = "> initializing_secure_ops_tunnel...";

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
              <span className="text-terminal-cyan/70 font-mono">root@</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-green to-terminal-cyan font-black">mokua</span>
              <span className="text-terminal-green animate-pulse font-black text-xl leading-none">_</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-6 items-center text-xs font-bold uppercase tracking-wider">
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="hover:text-terminal-green transition-colors">About</a>
              <a href="#skills" onClick={(e) => scrollToSection(e, "#skills")} className="hover:text-terminal-green transition-colors">Skills</a>
              <a href="#services" onClick={(e) => scrollToSection(e, "#services")} className="hover:text-terminal-cyan transition-colors">Services</a>
              <a href="#projects" onClick={(e) => scrollToSection(e, "#projects")} className="hover:text-terminal-green transition-colors">Projects</a>
              <a href="#blog" onClick={(e) => scrollToSection(e, "#blog")} className="hover:text-terminal-cyan transition-colors">Articles</a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, "#testimonials")} className="hover:text-terminal-green transition-colors">Signals</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="hover:text-terminal-green transition-colors">Contact</a>
              
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
              <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="py-2 border-b border-terminal-green/5 hover:text-terminal-green">About</a>
              <a href="#skills" onClick={(e) => scrollToSection(e, "#skills")} className="py-2 border-b border-terminal-green/5 hover:text-terminal-green">Skills</a>
              <a href="#services" onClick={(e) => scrollToSection(e, "#services")} className="py-2 border-b border-terminal-green/5 hover:text-terminal-cyan">Services</a>
              <a href="#projects" onClick={(e) => scrollToSection(e, "#projects")} className="py-2 border-b border-terminal-green/5 hover:text-terminal-green">Projects</a>
              <a href="#blog" onClick={(e) => scrollToSection(e, "#blog")} className="py-2 border-b border-terminal-green/5 hover:text-terminal-cyan">Articles</a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, "#testimonials")} className="py-2 border-b border-terminal-green/5 hover:text-terminal-green">Signals</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="py-2 hover:text-terminal-green font-bold">Contact</a>
              <Link
                to="/chat"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-t border-terminal-green/10 mt-1 text-terminal-cyan flex items-center gap-2 font-bold"
              >
                <Terminal size={14} /> Ruby AI Assistant
              </Link>
            </div>
          )}
        </nav>

        {/* Main stacked sections */}
        <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 space-y-24 md:space-y-32">
          
          {/* HERO SECTION — eager TerminalSection so LCP text is not behind a lazy chunk */}
          <TerminalSection command="visitor@mokua-host: ~/sys/boot">
            <div className="absolute top-0 -left-10 w-72 h-72 bg-terminal-green/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-terminal-green bg-terminal-green/5 rounded border border-terminal-green/20">
                <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping" />
                Available for new projects
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                Backend Architect &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-green to-terminal-cyan">
                  AI Safety Researcher
                </span>
              </h1>

              <div className="flex items-center gap-2 text-terminal-muted text-xs sm:text-sm font-bold min-h-[22px] overflow-hidden">
                <Terminal size={14} className="text-terminal-green flex-shrink-0" />
                <span className="truncate">
                  {typedHero}
                  <span className="terminal-cursor" />
                </span>
              </div>

              <p className="max-w-2xl text-sm md:text-base text-terminal-text/80 leading-relaxed pl-4 border-l border-terminal-green/25 font-sans">
                I build secure, AI-powered backend systems for teams across Africa and beyond —
                turning complex ideas into reliable products that scale.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                  className="px-5 py-3 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold rounded text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,255,159,0.3)] flex items-center gap-2"
                >
                  Get In Touch
                </a>
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, "#projects")}
                  className="px-5 py-3 border border-terminal-green/30 hover:border-terminal-green hover:bg-terminal-green/5 text-terminal-green rounded text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  View My Work
                </a>
              </div>
            </div>
          </TerminalSection>

          {/* ABOUT SECTION */}
          <section id="about" className="space-y-6">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 01. ABOUT
            </h2>
            <div className="space-y-4 text-sm md:text-base text-terminal-text/85 leading-loose font-sans pl-4 border-l-2 border-terminal-green/20">
              <p>
                I'm Derick Mokua — a backend developer and AI engineer based in Nairobi, Kenya.
              </p>
              <p>
                I build <strong className="text-terminal-green font-bold">secure, scalable backend systems</strong> and integrate AI into real-world products. My focus is on making powerful technology work reliably in environments where reliability matters most.
              </p>
              <p>
                Currently researching how to make AI models safer and more trustworthy for high-stakes use cases across Africa.
              </p>
            </div>
          </section>

          {/* SKILLS SECTION */}
          <section id="skills" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 02. TECHNICAL_ARSENAL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3 className="text-xs font-bold text-terminal-cyan border-b border-terminal-cyan/20 pb-1.5 uppercase tracking-widest">
                    {category.category}
                  </h3>
                  <div className="space-y-2.5">
                    {category.items.map((skill) => (
                      <div
                        key={skill.name}
                        className="bg-terminal-card border border-terminal-green/10 hover:border-terminal-green/30 p-3 rounded transition-all group"
                      >
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="font-medium text-terminal-text group-hover:text-terminal-green transition-colors font-bold">
                            {skill.icon} {skill.name}
                          </span>
                          <span className="text-terminal-green font-bold">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-black h-1 rounded overflow-hidden">
                          <div
                            className="bg-terminal-green h-full rounded transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section id="projects" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 03. SELECTED_WORKS
            </h2>
            <div className="space-y-4">
              {/* Flagship */}
              {projects[0] && (
                <div className="w-full bg-terminal-card border border-terminal-green/20 p-6 rounded-lg glow-border-green relative overflow-hidden group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-terminal-green transition-colors">
                        {projects[0].title.split(":")[0]}
                      </h3>
                      {projects[0].subtitle && (
                        <span className="text-[9px] text-terminal-muted uppercase tracking-wide">
                          {projects[0].subtitle}
                        </span>
                      )}
                    </div>
                    <span className="bg-terminal-green/10 border border-terminal-green/25 text-terminal-green text-[9px] px-2.5 py-0.5 rounded uppercase font-bold tracking-wide">
                      {projects[0].status}
                    </span>
                  </div>
                  <p className="text-xs text-terminal-text/80 leading-relaxed mb-5 font-sans">
                    {projects[0].desc}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {projects[0].tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-black/60 border border-terminal-cyan/15 text-terminal-cyan text-[9px] px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {projects[0].github && (
                      <a
                        href={projects[0].github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 rounded transition-all"
                      >
                        <Github size={12} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Other projects */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projects.slice(1).map((project) => {
                  const demoIsInternal = project.demo && project.demo.startsWith("/");
                  return (
                    <div
                      key={project.title}
                      className="bg-terminal-card border border-terminal-green/10 hover:border-terminal-green/30 p-4 rounded transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2.5">
                          <h4 className="text-xs font-bold text-white leading-tight">
                            {project.title.split(":")[0]}
                          </h4>
                          <span className="text-[8px] bg-terminal-cyan/10 border border-terminal-cyan/20 text-terminal-cyan px-1.5 rounded uppercase font-bold tracking-tight">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-terminal-muted leading-relaxed mb-4 font-sans">
                          {project.desc}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-black/50 text-terminal-cyan border border-terminal-cyan/10 text-[8px] px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {(project.github || project.demo) && (
                          <div className="flex items-center gap-3 pt-1 border-t border-terminal-green/10">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-terminal-green hover:text-white transition-colors"
                              >
                                <Github size={11} />
                                Code
                              </a>
                            )}
                            {project.demo && (
                              demoIsInternal ? (
                                <Link
                                  to={project.demo}
                                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-terminal-cyan hover:text-white transition-colors"
                                >
                                  <ExternalLink size={11} />
                                  Try demo
                                </Link>
                              ) : (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-terminal-cyan hover:text-white transition-colors"
                                >
                                  <ExternalLink size={11} />
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
          </section>

          {/* SERVICES SECTION */}
          <section id="services" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">
              <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
                // 04. SERVICES
              </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-terminal-card border border-terminal-green/15 p-5 rounded hover:border-terminal-cyan/45 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[10px] text-terminal-muted leading-relaxed mb-4">
                      {service.desc}
                    </p>
                  </div>
                  <ul className="space-y-1.5 border-t border-terminal-green/5 pt-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-[9px] text-terminal-cyan flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-terminal-cyan rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ARTICLES SECTION */}
          <section id="blog" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 05. ARTICLES
            </h2>
            <div className="space-y-4">
              {blogLoading ? (
                <div className="text-xs text-terminal-cyan animate-pulse">
                  {">"} Syncing with publication database...
                </div>
              ) : (
                activePosts.map((post) => (
                  <div
                    key={post.title}
                    onClick={() => setSelectedBlogPost(post)}
                    className="block p-5 border border-terminal-green/10 rounded-lg bg-terminal-card hover:border-terminal-cyan/35 hover:bg-terminal-cyan/5 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between text-[9px] text-terminal-cyan mb-1.5 font-bold uppercase tracking-wider">
                      <span>{post.date}</span>
                      <span>Transmitted // Record</span>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-2 group-hover:text-terminal-cyan transition-colors flex items-center gap-1.5">
                      {post.title}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-terminal-muted" />
                    </h3>
                    <p className="text-[11px] text-terminal-text/75 line-clamp-2 leading-relaxed font-sans">
                      {post.desc}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* TESTIMONIALS SECTION */}
          <section id="testimonials" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 06. TESTIMONIALS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-terminal-card border border-terminal-green/10 p-5 rounded text-xs flex flex-col justify-between"
                >
                  <p className="text-terminal-text/80 italic mb-4 leading-relaxed font-sans">
                    "{test.text}"
                  </p>
                  <div className="flex items-center gap-2.5 border-t border-terminal-green/5 pt-3">
                    <div className="w-8 h-8 rounded bg-terminal-green/10 border border-terminal-green/25 text-terminal-green font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {test.initials}
                    </div>
                     <div className="min-w-0">
                       <h3 className="font-bold text-white text-[11px] truncate">{test.name}</h3>
                       <p className="text-[9px] text-terminal-cyan truncate">{test.role} @ {test.company}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="border-l-2 border-terminal-green/20 pl-4 space-y-6 md:pl-6 relative before:absolute before:-left-[9px] before:top-1.5 before:w-4 before:h-4 before:bg-terminal-bg before:border-2 before:border-terminal-green/40 before:rounded-full">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 07. CONTACT
            </h2>
            <div className="w-full bg-terminal-card border border-terminal-green/15 p-8 md:p-12 rounded-lg glow-border-cyan relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-terminal-green/5 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-xl mx-auto space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Let&apos;s work together
                  </h3>
                  <p className="text-sm md:text-base text-terminal-text/80 leading-relaxed font-sans">
                    Open to new projects, collaborations, and interesting problems.
                    Send a message — I usually reply within a day.
                  </p>
                </div>
                <Suspense fallback={<p className="text-terminal-muted text-sm">Loading contact…</p>}>
                  <DecryptGame
                    isUnlockedInitially={isContactUnlocked}
                    onUnlocked={() => setIsContactUnlocked(true)}
                  />
                </Suspense>
              </div>
            </div>
          </section>

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
