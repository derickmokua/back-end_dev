import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  Terminal,
  ExternalLink,
  Github,
  Menu,
  X,
  ArrowUp,
  Linkedin,
  Layers,
  Check,
  Copy,
  Mail,
  ArrowRight,
  Shield,
  Cpu,
  Database,
  Server
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
import useHashnodePosts from "../hooks/useHashnode";

// Lazy-loaded modals and secondary interactions
const RubyChatbot = lazy(() => import("../components/RubyChatbot"));
const BirthdayAnimation = lazy(() => import("../components/effects/BirthdayAnimation"));
const BlogModal = lazy(() => import("../components/BlogModal"));
const CommandPalette = lazy(() => import("../components/CommandPalette"));
const ArchitectureModal = lazy(() => import("../components/ArchitectureModal"));
const DecryptGame = lazy(() => import("../components/DecryptGame"));

// Obsidian UI selectively integrated components
import InteractiveHoverSlider from "../components/obsidian/InteractiveHoverSlider";
import ScrollStack from "../components/obsidian/ScrollStack";
import TextFillAnimation from "../components/obsidian/TextFillAnimation";
import FolderPreview from "../components/obsidian/FolderPreview";
import TechStackBadges from "../components/TechStackBadges";

const TECH_STACK_ITEMS = [
  "Python",
  "FastAPI",
  "Django",
  "PostgreSQL",
  "Redis",
  "Next.js",
  "Docker",
  "Linux",
  "TypeScript",
  "Tailwind CSS",
  "AWS",
  "Rust"
];

const THINKING = [
  [
    "Problem → Solution",
    "Real problems. Practical solutions.",
    "I combine software engineering, AI and domain knowledge to build systems that solve real problems, not just look good in a demo.",
    "client"
  ],
  [
    "Simple Architecture",
    "Small parts. Clear jobs.",
    "A client talks to an API, slow work moves to background jobs, and one database stays the source of truth. Fewer moving pieces fail less.",
    "api"
  ],
  [
    "Real-world Impact",
    "Built for the people using it.",
    "Farmers on patchy networks, people on WhatsApp. I design for their conditions first, then for the demo.",
    "workers"
  ],
  [
    "Continuous Learning",
    "Always shipping, always studying.",
    "Data science with ALX, security-first design, and every project teaches the next one.",
    "db"
  ]
];

const PROJECT_METRICS = [
  {
    st1Label: "Total birds",
    st1Val: "1,248",
    st2Label: "Hatch rate",
    st2Val: "98%",
    st3Label: "Mortality",
    st3Val: "2.4%",
    points: "0,70 50,62 90,66 130,40 170,44 210,26 250,32 300,12"
  },
  {
    st1Label: "Sync latency",
    st1Val: "<10ms",
    st2Label: "Offline cache",
    st2Val: "100%",
    st3Label: "Conflict rate",
    st3Val: "0%",
    points: "0,80 50,68 90,55 130,45 170,38 210,30 250,22 300,16"
  },
  {
    st1Label: "Safety checks",
    st1Val: "100%",
    st2Label: "Response time",
    st2Val: "0.8s",
    st3Label: "Constrained",
    st3Val: "Passed",
    points: "0,75 50,55 90,48 130,52 170,30 210,24 250,18 300,10"
  },
  {
    st1Label: "Websocket Tx",
    st1Val: "Real-time",
    st2Label: "P99 Latency",
    st2Val: "14ms",
    st3Label: "Delivery",
    st3Val: "99.9%",
    points: "0,65 50,60 90,45 130,42 170,35 210,28 250,20 300,14"
  },
  {
    st1Label: "Tally speed",
    st1Val: "Instant",
    st2Label: "Integrity",
    st2Val: "100%",
    st3Label: "Audit logs",
    st3Val: "Verified",
    points: "0,80 50,70 90,50 130,40 170,32 210,25 250,18 300,8"
  },
  {
    st1Label: "Concurrency",
    st1Val: "High",
    st2Label: "Tx Latency",
    st2Val: "18ms",
    st3Label: "Availability",
    st3Val: "99.9%",
    points: "0,70 50,58 90,48 130,42 170,30 210,22 250,15 300,10"
  }
];

const SELECTED_WORK_TITLES = [
  "KukuConnect",
  "KukuConnect FMS",
  "Saibae",
  "WhatsLove",
  "Online Poll System"
];

const LAB_FOLDERS = [
  {
    id: "currently-building",
    label: "/ currently-building",
    description: "Active projects and offline-first experiments.",
    items: ["KukuConnect FMS", "ALX Data Science", "Gemini USSD"],
    targetProjectIndex: 0,
    previewCards: [
      {
        badge: "FMS CORE",
        tech: "FastAPI + Edge Sync",
        title: "KukuConnect FMS",
        caption: "Telemetry engine running offline-first in rural farms",
        status: "Live in Field"
      },
      {
        badge: "RAG PIPELINE",
        tech: "Gemini 1.5 Flash",
        title: "Poultry Diagnostics AI",
        caption: "Deterministic disease triage over SMS & USSD",
        status: "Active Alpha"
      }
    ]
  },
  {
    id: "client-work",
    label: "/ client-work",
    description: "Production applications & secure backends.",
    items: ["Poultry Platform", "Farm Management", "API Gateway"],
    targetProjectIndex: 1,
    previewCards: [
      {
        badge: "PROD CLIENT",
        tech: "PostgreSQL + Next.js",
        title: "KukuConnect Platform",
        caption: "Real-time flock management, mortality tracking & sales",
        status: "1,248 Birds"
      },
      {
        badge: "SECURITY",
        tech: "Zero-Trust Auth",
        title: "HMAC API Perimeters",
        caption: "Strict role-based tokens and encrypted payload verification",
        status: "Audited"
      }
    ]
  },
  {
    id: "open-source",
    label: "/ open-source",
    description: "Contributions, backend tools and utilities.",
    items: ["ALX Travel App", "Auth Middlewares", "Python Libraries"],
    targetProjectIndex: 5,
    previewCards: [
      {
        badge: "OPEN SOURCE",
        tech: "Django + PostgreSQL",
        title: "ALX Travel App",
        caption: "High-throughput reservation backend with concurrency controls",
        status: "v1.2.0"
      },
      {
        badge: "SECURITY LIB",
        tech: "Python / Rust",
        title: "Token Hardening Kit",
        caption: "Lightweight session rotation & tamper detection utilities",
        status: "Published"
      }
    ]
  },
  {
    id: "experiments",
    label: "/ experiments",
    description: "Ideas, prototypes, cipher challenges and AI bots.",
    items: ["Ruby AI Assistant", "Decrypt Game", "Matrix Rain"],
    targetProjectIndex: 2,
    previewCards: [
      {
        badge: "AI EXPERIMENT",
        tech: "Gemini 2.5 + WebSockets",
        title: "Ruby AI Autonomous Agent",
        caption: "Natural language terminal with dynamic tool calling",
        status: "Interactive"
      },
      {
        badge: "CRYPTO GAME",
        tech: "React + WebCrypto",
        title: "Decrypt Cipher Challenge",
        caption: "Interactive cryptographic cipher game built into contact section",
        status: "Online"
      }
    ]
  }
];

export default function Home() {
  const [typedHero, setTypedHero] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [selectedThinkingIndex, setSelectedThinkingIndex] = useState(0);

  // Permanently enforce dark theme
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);

  // Mount non-critical UI after interaction/idle
  const [mountChatbot, setMountChatbot] = useState(false);

  // Birthday HUD State
  const [showBirthdayHUD, setShowBirthdayHUD] = useState(false);
  const [isBirthday, setIsBirthday] = useState(false);

  const fullHeroText = "> initializing_secure_ops_tunnel... [NAIROBI_NODE]";

  // Global shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
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

  // Defer heavy UI until user interacts
  useEffect(() => {
    let fallbackChat;
    let doneChat = false;

    const mountChatNow = () => {
      if (doneChat) return;
      doneChat = true;
      setMountChatbot(true);
    };

    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((evt) =>
      window.addEventListener(evt, mountChatNow, {
        once: true,
        passive: true,
        capture: true,
      })
    );

    fallbackChat = setTimeout(mountChatNow, 12000);

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, mountChatNow, { capture: true })
      );
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
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Fetch Hashnode posts dynamically via custom hook
  const { posts: apiPosts, loading: blogLoading } = useHashnodePosts();
  const activePosts = apiPosts && apiPosts.length > 0 ? apiPosts : staticBlogPosts;

  // Scroll listener for back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 70;
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

  const copyEmail = () => {
    navigator.clipboard.writeText("derickmokua@outlook.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const activeProject = projects[selectedProjectIndex] || projects[0];
  const activeMetrics = PROJECT_METRICS[selectedProjectIndex] || PROJECT_METRICS[0];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] font-sans antialiased selection:bg-[var(--acc)] selection:text-white relative transition-colors duration-200">

      {/* STICKY HEADER */}
      <nav id="top">
        <div className="wrap">
          <Link
            to="/"
            onClick={scrollToTop}
            className="logo border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none"
            aria-label="Derick Mokua Home"
          >
            <span className="logo-handle border-0 outline-none">
              <span className="logo-at">@</span>
              <span className="logo-first">derick</span>
              <span className="logo-last">mokua</span>
            </span>
          </Link>

          <div className="links">
            <a href="#top" onClick={(e) => scrollToSection(e, "#top")}>Home</a>
            <a href="#work" onClick={(e) => scrollToSection(e, "#work")}>Work</a>
            <a href="#cases" onClick={(e) => scrollToSection(e, "#cases")}>Cases</a>
            <a href="#think" onClick={(e) => scrollToSection(e, "#think")}>About</a>
            <a href="#services" onClick={(e) => scrollToSection(e, "#services")}>Services</a>
            <a href="#lab" onClick={(e) => scrollToSection(e, "#lab")}>Lab</a>
            <a href="#blog" onClick={(e) => scrollToSection(e, "#blog")}>Articles</a>
            <a href="#testimonials" onClick={(e) => scrollToSection(e, "#testimonials")}>Testimonials</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>Contact</a>
          </div>

          <div className="right">
            {/* GitHub Profile */}
            <a
              href="https://github.com/derickmokua"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#a3a3a3] hover:text-white transition-colors focus:outline-none flex items-center justify-center"
              title="GitHub"
              aria-label="GitHub Profile"
            >
              <Github size={18} />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-[#a3a3a3] hover:text-white bg-[#202020] border border-[#333] rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#202020] border-b border-[#333] px-6 py-5 flex flex-col gap-3.5 text-xs font-medium uppercase tracking-wider animate-fade-slide-in shadow-2xl">
            <a href="#work" onClick={(e) => scrollToSection(e, "#work")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">Work</a>
            <a href="#cases" onClick={(e) => scrollToSection(e, "#cases")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">Case Studies</a>
            <a href="#think" onClick={(e) => scrollToSection(e, "#think")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">About & Architecture</a>
            <a href="#services" onClick={(e) => scrollToSection(e, "#services")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">Services</a>
            <a href="#lab" onClick={(e) => scrollToSection(e, "#lab")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">Lab / Archive</a>
            <a href="#blog" onClick={(e) => scrollToSection(e, "#blog")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">Articles</a>
            <a href="#testimonials" onClick={(e) => scrollToSection(e, "#testimonials")} className="py-2 border-b border-[#333] hover:text-[#ff2830]">Testimonials</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="py-2 hover:text-[#ff2830] font-bold">Contact</a>

            <Link
              to="/chat"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-t border-[#333] mt-1 text-[#ff2830] flex items-center gap-2 font-bold"
            >
              <Terminal size={14} /> Launch Ruby AI
            </Link>
          </div>
        )}
      </nav>

      {/* MAIN CONTAINER */}
      <main className="wrap">

        {/* HERO SECTION */}
        <section className="hero">
          <div>
            <h1>
              I build systems
              <br />
              that <em>actually</em> work.
            </h1>

            <div className="tags">
              <span>Backend engineering</span>
              <span>AI tools</span>
              <span>Secure software</span>
              <span>Scalable systems</span>
            </div>

            <p className="text-sm md:text-base text-[#f5f5f5]/85 leading-relaxed font-sans mt-4 max-w-xl">
              I build secure, AI powered backend systems for teams across Africa and beyond turning complex ideas into reliable products that scale.
            </p>

            <div className="btns">
              <a className="btn p" href="#work" onClick={(e) => scrollToSection(e, "#work")}>
                Explore my work →
              </a>

              <a className="btn" href="#contact" onClick={(e) => scrollToSection(e, "#contact")}>
                Let's build something
              </a>
            </div>
          </div>

          {/* HERO LAPTOP (CRITICAL: ALWAYS VISIBLE ON MOBILE) */}
          <div className="scene" aria-hidden="true">
            <div className="note hand">
              Same Derick.
              <br />
              More systems.
            </div>

            <div className="screen">
              from ideas
              <br />
              to real world
              <br />
              systems.
              <br />
              <br />
              <span style={{ color: "#ff2830" }}># KukuConnect Telemetry</span>
              <br />
              <span style={{ color: "#a3a3a3" }}>&gt; Ingress: GSM / USSD [OK]</span>
              <br />
              <span style={{ color: "#a3a3a3" }}>&gt; Gemini RAG pipeline: [ONLINE]</span>
              <br />
              <span style={{ color: "#a3a3a3" }}>&gt; Zero-Trust HMAC: [VERIFIED]</span>
            </div>

            <div className="base"></div>

            <div className="books">
              <span>Python</span>
              <span>FastAPI</span>
              <span>PostgreSQL</span>
              <span>AI &amp; Automation</span>
            </div>
          </div>
        </section>

        {/* 01. SELECTED WORK */}
        <section className="sec" id="work">
          <div className="sh mono">
            <span>01</span>
            <span className="t">Selected work</span>
            <span className="r">Hover or tap to preview</span>
          </div>

          <InteractiveHoverSlider
            projects={projects.filter(p => SELECTED_WORK_TITLES.includes(p.title.split(":")[0].trim()))}
            metrics={PROJECT_METRICS}
            selectedIndex={selectedProjectIndex}
            onSelectProject={setSelectedProjectIndex}
            onOpenArchitecture={() => setIsArchModalOpen(true)}
            onScrollToCases={(e) => scrollToSection(e, "#cases")}
          />
        </section>

        {/* 02. CASE STUDIES */}
        <section className="sec" id="cases">
          <div className="sh mono">
            <span>02</span>
            <span className="t">Case studies</span>
            <span className="r">Scroll to explore</span>
          </div>

          <ScrollStack
            onOpenArchitecture={() => setIsArchModalOpen(true)}
            onSelectProject={setSelectedProjectIndex}
            onScrollToWork={() => {
              const el = document.querySelector("#work");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </section>

        {/* 03. HOW I THINK & ARCHITECTURE */}
        <section className="sec" id="think">
          <div className="sh mono">
            <span>03</span>
            <span className="t">How I think</span>
          </div>

          <div className="space-y-6">
            <TextFillAnimation
              text="I care about the part after the demo: unreliable networks, messy data, permissions, failure states and whether the system still works on a bad day."
            />

            <div className="think">
              <div className="tabs" role="tablist">
                {THINKING.map((item, idx) => (
                  <button
                    key={item[0]}
                    role="tab"
                    aria-selected={selectedThinkingIndex === idx}
                    onClick={() => setSelectedThinkingIndex(idx)}
                  >
                    {item[0]}
                  </button>
                ))}
              </div>

              <div>
                <h3>{THINKING[selectedThinkingIndex][1]}</h3>
                <p>{THINKING[selectedThinkingIndex][2]}</p>
                <p>
                  <a
                    className="btn"
                    href="#contact"
                    onClick={(e) => scrollToSection(e, "#contact")}
                  >
                    More about my approach →
                  </a>
                </p>
              </div>

              <div
                className="flow"
                role="img"
                aria-label="Architecture: client to API to background jobs to database"
              >
                <div className={`node ${THINKING[selectedThinkingIndex][3] === 'client' ? 'hl' : ''}`}>
                  <div className="box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="12" rx="2" />
                      <path d="M8 20h8M12 16v4" />
                    </svg>
                  </div>
                  <b>Client</b>
                  <small>Web / Mobile / WhatsApp</small>
                </div>

                <div className="arr" aria-hidden="true"></div>

                <div className={`node ${THINKING[selectedThinkingIndex][3] === 'api' ? 'hl' : ''}`}>
                  <div className="box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 7l-5 5 5 5M15 7l5 5-5 5M13 5l-2 14" />
                    </svg>
                  </div>
                  <b>API</b>
                  <small>FastAPI</small>
                </div>

                <div className="arr" aria-hidden="true"></div>

                <div className={`node ${THINKING[selectedThinkingIndex][3] === 'workers' ? 'hl' : ''}`}>
                  <div className="wk">Workers</div>
                  <div className="box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
                    </svg>
                  </div>
                  <b>Background Jobs</b>
                  <small>Celery + Redis</small>
                </div>

                <div className="arr" aria-hidden="true"></div>

                <div className={`node ${THINKING[selectedThinkingIndex][3] === 'db' ? 'hl' : ''}`}>
                  <div className="box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <ellipse cx="12" cy="6" rx="8" ry="3" />
                      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
                    </svg>
                  </div>
                  <b>Database</b>
                  <small>PostgreSQL</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04. TECHNOLOGIES */}
        <section className="sec" id="tech">
          <div className="sh mono">
            <span>04</span>
            <span className="t">Technologies I work with</span>
            <span className="r">Drag to explore →</span>
          </div>

          <TechStackBadges />
        </section>

        {/* 05. LAB / ARCHIVE */}
        <section className="sec" id="lab">
          <div className="sh mono">
            <span>05</span>
            <span className="t">Lab / Archive</span>
            <span className="r">Open and explore →</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAB_FOLDERS.map((folder) => (
              <FolderPreview
                key={folder.id}
                label={folder.label}
                description={folder.description}
                items={folder.items}
                previewCards={folder.previewCards}
                isSelected={selectedProjectIndex === folder.targetProjectIndex}
                onClick={() => {
                  setSelectedProjectIndex(folder.targetProjectIndex);
                  const el = document.querySelector("#work");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            ))}
          </div>
        </section>

        {/* 06. SERVICES */}
        <section className="sec" id="services">
          <div className="sh mono">
            <span>06</span>
            <span className="t">Engineering Services</span>
          </div>

          <div className="cases">
            {services.map((s, idx) => (
              <div key={s.title} className="case">
                <span className="num font-mono">0{idx + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="chips">
                  {s.features.map((f) => (
                    <span key={f} className="chip">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 07. ARTICLES & RESEARCH */}
        <section className="sec" id="blog">
          <div className="sh mono">
            <span>07</span>
            <span className="t">Articles & Research</span>
            <span className="r">Click to read</span>
          </div>

          <div className="space-y-3">
            {blogLoading ? (
              <div className="mono mut text-xs py-4">Syncing publications database...</div>
            ) : (
              activePosts.map((post) => (
                <div
                  key={post.title}
                  onClick={() => setSelectedBlogPost(post)}
                  className="p-5 border border-[#333] rounded-xl bg-[#202020] hover:border-[#ff2830] transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between text-[10px] mono text-[#ff2830] mb-1.5 font-bold">
                    <span>{post.date}</span>
                    <span>Publication Record</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff2830] transition-colors flex items-center gap-2">
                    {post.title}
                    <ExternalLink size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-mut" />
                  </h3>
                  <p className="text-xs text-mut line-clamp-2 mt-1 leading-relaxed">
                    {post.desc}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 08. TESTIMONIALS */}
        <section className="sec" id="testimonials">
          <div className="sh mono">
            <span>08</span>
            <span className="t">Testimonials</span>
          </div>

          <div className="cases" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="case">
                <p className="italic text-xs leading-relaxed text-[#f5f5f5]/90 mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[#333]">
                  <div className="num font-bold text-xs bg-[#ff2830]/10 border-[#ff2830]/30 text-[#ff2830]">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <b className="block text-xs font-sans text-white truncate">{t.name}</b>
                    <small className="block mono text-[10px] text-mut truncate">{t.role} @ {t.company}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 09. CONTACT */}
        <section className="sec" id="contact">
          <div className="sh mono">
            <span>09</span>
            <span className="t">Let's work together</span>
          </div>

          <div className="contact">
            <h2>
              Have something
              <br />
              <em>worth building?</em>
            </h2>

            <div>
              <p className="mut" style={{ margin: 0, maxWidth: "46ch" }}>
                I'm interested in backend systems, AI products and interesting technical problems. Let's build something great.
              </p>

              <div className="soc">
                <a className="btn p" href="mailto:derickmokua@outlook.com">
                  Start a conversation →
                </a>

                <span className="hand">
                  From Kenya to the world.
                  <span className="mono mut" style={{ font: "12px Inter" }}>
                    <i className="dot" style={{ display: "inline-block", margin: "0 6px 0 10px" }}></i>
                    Nairobi, KE
                  </span>
                </span>
              </div>

              {/* Direct Instant Channels (DecryptGame) */}
              <div className="mt-8">
                <Suspense fallback={<div className="h-32 bg-[#202020] rounded-xl border border-[#333] animate-pulse" />}>
                  <DecryptGame />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <span>
            © 2026 Derick Mokua. All rights reserved.
          </span>

          <div className="footer-soc">
            <a
              href="https://github.com/derickmokua"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              title="GitHub"
            >
              <Github size={16} />
            </a>

            <a
              href="https://linkedin.com/in/derickmokua"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>

            <a
              href="https://x.com/derick_mokua"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter) Profile"
              title="X (Twitter)"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <a
              href="mailto:derickmokua@outlook.com"
              aria-label="Email"
              title="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION UTILITIES */}

      {/* Ruby Chatbot */}
      {mountChatbot && (
        <Suspense fallback={null}>
          <RubyChatbot />
        </Suspense>
      )}

      {/* Back to Top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-35 w-10 h-10 bg-[#202020] hover:bg-[#ff2830] text-[#a3a3a3] hover:text-white border border-[#333] hover:border-[#ff2830] rounded-full flex items-center justify-center transition-all shadow-xl animate-fade-scale-in focus:outline-none"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* Blog Overlay Modal */}
      {selectedBlogPost && (
        <Suspense fallback={null}>
          <BlogModal
            post={selectedBlogPost}
            onClose={() => setSelectedBlogPost(null)}
          />
        </Suspense>
      )}

      {/* Global Command Palette (⌘K) */}
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

      {/* Birthday Celebrations if active */}
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
