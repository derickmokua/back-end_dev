import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  ExternalLink,
  Github,
  Mail,
  Smartphone,
  Database,
  Menu,
  X,
  Star,
  ArrowUp,
  Send,
  Loader2,
  Activity,
  Network
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
import MatrixRain from "../components/MatrixRain";
import TerminalSection from "../components/TerminalSection";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import DecryptGame from "../components/DecryptGame";
import RubyChatbot from "../components/RubyChatbot";
import BirthdayAnimation from "../components/effects/BirthdayAnimation";
import useHashnodePosts from "../hooks/useHashnode";
import DOMPurify from "dompurify";
import { marked } from "marked";

export default function Home() {
  const [typedHero, setTypedHero] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  const [isContactUnlocked, setIsContactUnlocked] = useState(false);
  const [isNetmapModalOpen, setIsNetmapModalOpen] = useState(false);

  // Form state
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  // Form handler
  const handleFormChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_default";
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_default";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    if (!publicKey) {
      console.error("EmailJS public key configuration missing");
      setSubmitStatus("missing_config");
      setTimeout(() => setSubmitStatus(null), 5000);
      setIsSubmitting(false);
      return;
    }

    const templateParams = {
      from_name: formState.name,
      from_email: formState.email,
      message: formState.message,
      to_name: "Derick Mokua",
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setSubmitStatus("success");
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus(null), 5000);
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        setSubmitStatus("api_error");
        setTimeout(() => setSubmitStatus(null), 5000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

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
      
      {/* Subtle digital rain background layer */}
      <MatrixRain />

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
              <span className="text-terminal-muted">root@</span>
              <span className="text-white">mokua</span>
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
              
              <Link
                to="/chat"
                className="px-2.5 py-1 text-terminal-cyan hover:bg-terminal-cyan/5 rounded flex items-center gap-1 transition-all"
              >
                <Terminal size={12} /> Chat
              </Link>

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

            <div className="flex md:hidden items-center gap-3">
              <a
                href="https://github.com/derickmokua"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-terminal-green rounded"
              >
                <Github size={16} />
              </a>
              <button
                className="text-terminal-green"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden w-full bg-terminal-card border-b border-terminal-green/25 p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-wider shadow-2xl"
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
                  className="py-2 text-terminal-cyan flex items-center gap-1.5 font-bold"
                >
                  <Terminal size={14} /> Ruby secure chat channel
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main stacked sections */}
        <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 space-y-20">
          
          {/* HERO SECTION */}
          <TerminalSection command="visitor@mokua-host: ~/sys/boot">
            <div className="absolute top-0 -left-10 w-72 h-72 bg-terminal-green/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-terminal-green bg-terminal-green/5 rounded border border-terminal-green/20">
                <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping" />
                SYSTEM_STATUS: ZERO_TRUST_ENCLAVE_ACTIVE
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                Backend Architect &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-green to-terminal-cyan">
                  AI Safety Researcher
                </span>
              </h1>

              <div className="flex items-center gap-2 text-terminal-muted text-sm md:text-base font-bold min-h-[24px]">
                <Terminal size={18} className="text-terminal-green" />
                <span>
                  {typedHero}
                  <span className="terminal-cursor" />
                </span>
              </div>

              <p className="max-w-2xl text-sm md:text-base text-terminal-text/80 leading-relaxed pl-4 border-l border-terminal-green/25 font-sans">
                Architecting secure, frontier-model integrations for high-stakes, resource-constrained environments in the Global South.
              </p>

              <div className="flex gap-4 pt-2">
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                  className="px-5 py-2.5 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold rounded text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,255,159,0.3)]"
                >
                  Secure Handshake
                </a>
                <a
                  href="#projects"
                  onClick={(e) => scrollToSection(e, "#projects")}
                  className="px-5 py-2.5 border border-terminal-green/30 hover:border-terminal-green hover:bg-terminal-green/5 text-terminal-green rounded text-xs uppercase tracking-wider transition-all"
                >
                  Access Archives
                </a>
              </div>
            </div>
          </TerminalSection>

          {/* ABOUT SECTION (Formatted as terminal cat readout) */}
          <TerminalSection id="about" command="visitor@mokua-host: ~/profile">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 01. ABOUT_ME_POSTURE
            </h2>
            <div className="bg-terminal-card border border-terminal-green/20 rounded-lg overflow-hidden glow-border-green">
              
              {/* Fake Terminal Header */}
              <div className="bg-black/90 px-4 py-2 border-b border-terminal-green/10 flex items-center justify-between text-[10px] text-terminal-muted select-none">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-terminal-green" />
                  <span>visitor@mokua-host:~$ cat about_me.md</span>
                </div>
                <span>1024 Bytes</span>
              </div>

              {/* Terminal Code Readout body */}
              <div className="p-4 md:p-6 space-y-4 text-xs md:text-sm font-mono leading-relaxed flex">
                {/* Line numbers column */}
                <div className="text-terminal-green/20 text-right pr-4 select-none border-r border-terminal-green/10 flex flex-col font-bold">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span>05</span>
                  <span>06</span>
                  <span>07</span>
                </div>
                {/* Main text */}
                <div className="pl-4 space-y-4 text-terminal-text/90 flex-1">
                  <p>
                    My mission is securing critical digital infrastructure in the Global South. I utilize a unique blend of technical expertise and strategic foresight to <strong className="text-terminal-green font-bold font-mono">bridge engineering depth with venture-scale safety governance</strong>.
                  </p>
                  <p>
                    I specialize in backend architecture and security moats. I don't just build apps; I engineer resilient systems that withstand adversarial conditions. My research focuses on developing safe, vector-supported prompt translation layers and zero-trust data brokers for high-stakes implementations.
                  </p>
                </div>
              </div>
            </div>
          </TerminalSection>

          {/* SKILLS SECTION */}
          <TerminalSection id="skills" command="visitor@mokua-host: ~/arsenal">
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
          </TerminalSection>

          {/* SERVICES SECTION */}
          <TerminalSection id="services" command="visitor@mokua-host: ~/daemons">
            <div className="flex items-center justify-between border-b border-terminal-green/20 pb-1.5">
              <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
                // 03. CORE_COMPETENCIES
              </h2>
              {/* Modal trigger */}
              <button
                onClick={() => setIsNetmapModalOpen(true)}
                className="text-[9px] font-bold text-terminal-cyan border border-terminal-cyan/30 hover:border-terminal-cyan bg-terminal-cyan/5 hover:bg-terminal-cyan/15 px-2 py-0.5 rounded transition-all flex items-center gap-1 focus:outline-none"
              >
                <Network size={10} />
                Trace VPC Infrastructure Map
              </button>
            </div>
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
          </TerminalSection>

          {/* PROJECTS SECTION */}
          <TerminalSection id="projects" command="visitor@mokua-host: ~/archives">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 04. SELECTED_WORKS
            </h2>
            <div className="space-y-4">
              
              {/* Flagship Case Study */}
              <div className="w-full bg-terminal-card border border-terminal-green/20 p-6 rounded-lg glow-border-green relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-terminal-green transition-colors">
                      KukuConnect (Flagship Case Study)
                    </h3>
                    <span className="text-[9px] text-terminal-muted">APPLIED AI SAFETY DEPLOYMENT</span>
                  </div>
                  <span className="bg-terminal-green/10 border border-terminal-green/25 text-terminal-green text-[9px] px-2.5 py-0.5 rounded uppercase font-bold tracking-wide">
                    Research Active
                  </span>
                </div>
                <p className="text-xs text-terminal-text/80 leading-relaxed mb-5 font-sans">
                  Mitigating hallucinations in veterinary diagnostics using the Gemini API and Retrieval-Augmented Generation (RAG). Enforces a Zero-Trust data pipeline to screen prompts and isolate queries within resource-constrained environments.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Gemini API", "RAG", "Zero-Trust", "FastAPI", "PostgreSQL"].map((tag) => (
                    <span key={tag} className="bg-black/60 border border-terminal-cyan/15 text-terminal-cyan text-[9px] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Other Projects */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {projects.slice(1).map((project) => (
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
                  </div>
                ))}
              </div>

            </div>
          </TerminalSection>

          {/* ARTICLES SECTION */}
          <TerminalSection id="blog" command="visitor@mokua-host: ~/logs">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 05. TECHNICAL_ARTICLES
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
          </TerminalSection>

          {/* TESTIMONIALS SECTION */}
          <TerminalSection id="testimonials" command="visitor@mokua-host: ~/signals">
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
                      <h4 className="font-bold text-white text-[11px] truncate">{test.name}</h4>
                      <p className="text-[9px] text-terminal-cyan truncate">{test.role} @ {test.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TerminalSection>

          {/* CONTACT SECTION WITH FORM & DECRYPT GAME */}
          <TerminalSection id="contact" command="visitor@mokua-host: ~/handshake">
            <h2 className="text-xs font-bold tracking-widest text-terminal-green uppercase">
              // 07. HANDSHAKE_PROTOCOL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-terminal-card border border-terminal-green/15 p-6 md:p-8 rounded-lg glow-border-cyan relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-terminal-green/5 to-transparent pointer-events-none" />

              {/* Coordinates left column: locked by decryption game */}
              <div className="flex flex-col justify-center relative z-10 h-full">
                <DecryptGame
                  isUnlockedInitially={isContactUnlocked}
                  onUnlocked={() => setIsContactUnlocked(true)}
                />
              </div>

              {/* Contact Form right column */}
              <div className="bg-black/50 p-4 md:p-5 rounded border border-terminal-green/10">
                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-terminal-green uppercase font-bold mb-1">
                      Sender Alias
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Commander"
                      className="w-full bg-black border border-terminal-green/20 rounded px-3 py-2 text-white placeholder-terminal-muted/30 focus:outline-none focus:border-terminal-green transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-terminal-green uppercase font-bold mb-1">
                      Sender Secure Mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleFormChange}
                      placeholder="e.g. agent@domain.local"
                      className="w-full bg-black border border-terminal-green/20 rounded px-3 py-2 text-white placeholder-terminal-muted/30 focus:outline-none focus:border-terminal-green transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-terminal-green uppercase font-bold mb-1">
                      Payload Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={handleFormChange}
                      placeholder="Enter payload string..."
                      className="w-full bg-black border border-terminal-green/20 rounded px-3 py-2 text-white placeholder-terminal-muted/30 focus:outline-none focus:border-terminal-green transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-all hover:shadow-[0_0_12px_rgba(0,255,159,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={11} />
                        Transmit Payload
                      </>
                    )}
                  </button>

                  {submitStatus === "success" && (
                    <p className="text-terminal-green text-center font-bold text-[9px] animate-pulse mt-2">
                      [+] TRANSMISSION COMPLETE: Package safely compiled.
                    </p>
                  )}
                  {submitStatus === "api_error" && (
                    <p className="text-red-400 text-center font-bold text-[9px] mt-2">
                      [-] ERROR: Secure transmission node fail.
                    </p>
                  )}
                  {submitStatus === "missing_config" && (
                    <p className="text-red-400 text-center font-bold text-[9px] mt-2">
                      [-] CONFIGURATION ERROR: Public key environment lock.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </TerminalSection>

          {/* Footer */}
          <footer className="border-t border-terminal-green/10 pt-6 text-[10px] text-terminal-muted font-mono flex flex-col sm:flex-row items-center justify-between gap-4 select-none pb-10">
            <div>
              <span>© 2026 MokuaOS v3.12.0 // Host ID: 0xDEADBEEF // Nairobi, KE</span>
            </div>
            <div className="flex gap-4 font-bold">
              <a href="https://github.com/derickmokua" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-green transition-colors">
                GitHub
              </a>
              <a href="https://linkedin.com/in/derickmokua" target="_blank" rel="noopener noreferrer" className="hover:text-terminal-cyan transition-colors">
                LinkedIn
              </a>
            </div>
          </footer>

        </main>

        {/* Floating secure chatbot widget */}
        <RubyChatbot />

        {/* Floating Back to top helper */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 z-35 p-2 bg-terminal-bg border border-terminal-green/20 text-terminal-green rounded hover:scale-105 transition-all focus:outline-none"
              title="Return to Core OS"
            >
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isNetmapModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 cursor-zoom-out"
              onClick={() => setIsNetmapModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-4xl bg-terminal-card border border-terminal-cyan/30 rounded-lg p-5 cursor-default font-mono glow-border-cyan"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-terminal-cyan/20 pb-3 mb-4 select-none">
                  <div className="flex items-center gap-2">
                    <Activity className="text-terminal-cyan animate-pulse" size={16} />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">VPC Infrastructure NetMap</h3>
                      <span className="text-[8px] text-terminal-cyan font-bold">SECURE NETWORK TRACE ROUTE</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNetmapModalOpen(false)}
                    className="p-1 text-terminal-muted hover:text-white border border-terminal-cyan/15 rounded focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Diagram */}
                <ArchitectureDiagram />

                <div className="mt-4 text-[9px] text-terminal-muted text-center select-none font-bold">
                  * Click or hover nodes inside the SVG trace block to view socket endpoints
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blog Overlay Modal */}
        <AnimatePresence>
          {selectedBlogPost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 cursor-zoom-out"
              onClick={() => setSelectedBlogPost(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-2xl bg-terminal-card border border-terminal-green/30 rounded-lg p-6 max-h-[85vh] overflow-y-auto cursor-default font-mono glow-border-green"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-terminal-green/10 pb-4 mb-4 select-none">
                  <div>
                    <span className="text-[10px] text-terminal-cyan font-bold">{selectedBlogPost.date} // Article Record</span>
                    <h3 className="text-sm md:text-base font-bold text-white mt-1">{selectedBlogPost.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedBlogPost(null)}
                    className="p-1 text-terminal-muted hover:text-white border border-terminal-green/10 rounded focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content body */}
                <div className="text-xs md:text-sm text-terminal-text/90 leading-relaxed space-y-4 ruby-message max-w-none">
                  {selectedBlogPost.html ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          marked.parse(selectedBlogPost.html, { breaks: true, gfm: true })
                        )
                      }}
                    />
                  ) : selectedBlogPost.content ? (
                    selectedBlogPost.content.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p>Content unavailable.</p>
                  )}
                </div>

                {/* Tags footer */}
                <div className="mt-6 pt-4 border-t border-terminal-green/10 flex flex-wrap gap-1.5 select-none">
                  {selectedBlogPost.tags.map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-black border border-terminal-cyan/15 text-terminal-cyan">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Birthday HUD Animations if active */}
      {showBirthdayHUD ? (
        <BirthdayAnimation HUDEnabled={true} onComplete={() => setShowBirthdayHUD(false)} />
      ) : (
        isBirthday && <BirthdayAnimation HUDEnabled={false} persist={true} />
      )}

    </div>
  );
}
