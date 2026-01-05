import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Cpu, Globe, ExternalLink, Github, Mail, Smartphone, Database, Wind, Menu, X, ChevronRight, Star, ArrowUp, Send, Loader2, Linkedin, Phone, MessageCircle } from 'lucide-react';
import { skills, projects, services, testimonials, blogPosts as staticBlogPosts, navLinks } from '../data/portfolioData';
import useHashnodePosts from '../hooks/useHashnode';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const FadeIn = ({ children, className }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className={className}
    >
        {children}
    </motion.div>
);

const Home = () => {
    const [text, setText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [selectedBlogPost, setSelectedBlogPost] = useState(null);
    const fullText = "> initializing_gold_standard...";
    const navigate = useNavigate();

    // Contact Form State
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    // Blog Data
    const { posts, loading, error } = useHashnodePosts();

    // Typing effect
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index <= fullText.length) {
                setText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Cursor blinking effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    // Scroll Listener for BackToTop
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll handler
    const scrollToSection = (e, href) => {
        e.preventDefault();
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                setIsMenuOpen(false);
            }
        } else {
            // Handle external links or other pages
            window.location.href = href;
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Form Handlers
    const handleFormChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Configuration from .env file
        const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceID || !templateID || !publicKey) {
            console.error('EmailJS environment variables are missing.');
            setSubmitStatus('missing_config'); // Specific error state
            setTimeout(() => setSubmitStatus(null), 5000);
            setIsSubmitting(false);
            return;
        }

        const templateParams = {
            from_name: formState.name,
            from_email: formState.email,
            message: formState.message,
            to_name: 'Derick Mokua',
        };

        emailjs.send(serviceID, templateID, templateParams, publicKey)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setSubmitStatus('success');
                setFormState({ name: '', email: '', message: '' });
                setTimeout(() => setSubmitStatus(null), 5000);
            })
            .catch((err) => {
                console.error('FAILED...', err);
                if (err.text) console.error('Error Text:', err.text); // EmailJS specific error text
                setSubmitStatus('api_error');
                setTimeout(() => setSubmitStatus(null), 5000);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="min-h-screen bg-black text-zinc-200 font-mono selection:bg-gold-500 selection:text-black overflow-x-hidden">

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-zinc-900 shadow-lg shadow-gold-900/5"
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" onClick={scrollToTop} className="text-xl font-bold tracking-tighter text-gold-500 hover:text-gold-400 transition-colors">
                        derick_mokua<span className="text-zinc-600">.co.ke</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-6 items-center">
                        <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="text-sm font-medium hover:text-gold-400 transition-colors">Home</a>
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-sm font-medium hover:text-gold-400 transition-colors">
                                {link.name}
                            </a>
                        ))}
                        <Link to="/chat" className="text-sm font-medium hover:text-gold-400 transition-colors flex items-center gap-1">
                            <MessageCircle size={16} /> Chat
                        </Link>
                        <a href="https://github.com/derickmokua" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold-400 transition-colors ml-4">
                            <Github size={20} />
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-zinc-400 hover:text-gold-500" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle mobile menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-zinc-800 p-6 flex flex-col gap-4 overflow-hidden"
                        >
                            <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="text-lg hover:text-gold-400">Home</a>
                            {navLinks.map((link) => (
                                <a key={link.name} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-lg hover:text-gold-400">
                                    {link.name}
                                </a>
                            ))}
                            <Link to="/chat" className="text-lg hover:text-gold-400 flex items-center gap-2">
                                <MessageCircle size={18} /> Chat
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-20">

                {/* HERO SECTION */}
                <section id="home" className="min-h-[60vh] flex flex-col justify-center relative">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-wider text-gold-400 bg-gold-900/10 rounded-full border border-gold-500/20"
                        >
                            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></span>
                            AVAILABLE FOR HIRE
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight"
                        >
                            I bring structure to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700">
                                digital entropy.
                            </span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="h-8 mb-8 text-zinc-500 font-mono text-lg md:text-xl flex items-center gap-3"
                        >
                            <Terminal size={20} className="text-gold-500" />
                            <span>
                                {text}
                                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity text-gold-500 font-bold`}>_</span>
                            </span>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="max-w-xl text-lg text-zinc-400 leading-relaxed border-l-2 border-zinc-900 pl-6 mb-8"
                        >
                            I'm Derick. I engineer robust full-stack architectures and intelligent agents.
                            Creator of <strong className="text-gold-400">Saibae</strong>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex gap-4"
                        >
                            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="px-5 py-2.5 md:px-6 md:py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-lg transition-all flex items-center gap-2 transform hover:translate-x-1 text-sm md:text-base">
                                Start Project <ChevronRight size={18} />
                            </a>
                            <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="px-5 py-2.5 md:px-6 md:py-3 border border-zinc-800 hover:border-gold-500 text-zinc-300 hover:text-white rounded-lg transition-all text-sm md:text-base">
                                View Work
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section id="about">
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-white">
                            <Terminal className="text-gold-500" />
                            <span>About_Me</span>
                        </h2>
                        <div className="w-full bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-3xl hover:border-gold-500/30 transition-all">
                            <div className="space-y-6 text-zinc-400 leading-relaxed text-lg text-left">
                                <p>
                                    I am a passionate <span className="text-gold-400">Backend Developer</span> and <span className="text-gold-400">Cybersecurity Engineer</span> based in Nairobi. My mission is to build systems that are not only performant but inherently secure.
                                </p>
                                <p>
                                    With expertise ranging from low-level network security to high-level AI integrations, I bridge the gap between "it works" and "it's unassailable." I specialize in robust backend architectures using <strong className="text-gold-400">Node.js</strong>, <strong className="text-gold-400">Python</strong>, <strong className="text-gold-400">PostgreSQL</strong>, <strong className="text-gold-400">Redis</strong>, and <strong className="text-gold-400">Docker</strong>.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* SKILLS SECTION */}
                <section id="skills">
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-white">
                            <Cpu className="text-gold-500" />
                            <span>Technical_Arsenal</span>
                        </h2>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                            {skills.map((skill) => (
                                <motion.div variants={fadeInUp} key={skill.name} className="bg-zinc-900/30 border border-zinc-800 hover:border-gold-500/50 p-4 rounded-xl transition-all group hover:-translate-y-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-2xl">{skill.icon}</span>
                                        <span className="text-gold-500 font-bold">{skill.level}%</span>
                                    </div>
                                    <h3 className="font-medium text-zinc-200 group-hover:text-gold-400 transition-colors">{skill.name}</h3>
                                    <div className="w-full bg-black h-1.5 rounded-full mt-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="bg-gold-600 h-full rounded-full"
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </FadeIn>
                </section>

                {/* SERVICES SECTION */}
                <section id="services">
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-white">
                            <Wind className="text-gold-500" />
                            <span>Services_Offered</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={service.title}
                                    className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:border-gold-500/30 transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-900/10"
                                >
                                    <div className="text-4xl mb-4">{service.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="text-xs text-zinc-500 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-gold-500 rounded-full"></span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* PROJECTS SECTION */}
                <section id="projects">
                    <FadeIn>
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <Code className="text-gold-500" />
                                <span>Selected_Works</span>
                                <span className="text-zinc-600 text-sm font-normal mt-1 hidden md:inline"> // Premium Deployments</span>
                            </h2>

                        </div>

                        {/* Vertical Stack Container */}
                        <div className="flex flex-col gap-8">

                            {/* Project 1: Saibae (Main) */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="w-full bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl hover:border-gold-500/30 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-gold-500/10"></div>

                                <div className="flex flex-col md:flex-row gap-8 justify-between z-10 relative">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-black border border-zinc-900 rounded-xl text-gold-500 group-hover:scale-110 transition-transform duration-300">
                                                <Cpu size={28} />
                                            </div>
                                            <div className="flex gap-2 md:hidden">
                                                <a href="#" className="text-zinc-600 group-hover:text-gold-200 transition-colors cursor-pointer"><ExternalLink size={20} /></a>
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">Saibae AI Agent</h3>
                                        <p className="text-zinc-400 mb-6 text-lg leading-relaxed">
                                            A context-aware AI assistant built with Python & LLMs. Features personality profiling via Spotify API and bespoke user interactions.
                                        </p>

                                        <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
                                            <span className="bg-black border border-zinc-900 px-3 py-1.5 rounded-lg text-gold-200/80">Python</span>
                                            <span className="bg-black border border-zinc-900 px-3 py-1.5 rounded-lg text-gold-200/80">OpenAI</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex flex-col items-end justify-between">
                                        <div className="px-3 py-1 rounded-full bg-gold-900/10 text-gold-400 text-xs font-bold border border-gold-500/20 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse"></span> ONLINE
                                        </div>
                                        <a href="#" className="p-3 border border-zinc-800 rounded-full hover:bg-gold-500 hover:text-black transition-all">
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Other Projects Loop - Vertical List */}
                            {projects.slice(1).map((project, i) => (
                                <motion.div
                                    key={project.title}
                                    whileHover={{ scale: 1.01 }}
                                    className="w-full border border-zinc-800 p-8 rounded-3xl bg-zinc-900/30 hover:border-gold-500/30 transition-all flex flex-col md:flex-row justify-between items-center gap-6"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Globe className="text-gold-500 w-6 h-6" />
                                            <h3 className="text-2xl font-bold text-white leading-tight">{project.title}</h3>
                                        </div>
                                        <p className="text-zinc-500 text-base leading-relaxed pl-9">{project.desc}</p>
                                    </div>

                                    <div className="flex gap-2 self-start md:self-center">
                                        {project.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs border border-zinc-900 bg-black/50 px-3 py-1.5 rounded-md text-zinc-500 font-mono">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                        </div>
                    </FadeIn>
                </section>

                {/* BLOG SECTION */}
                <section id="blog">
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-white">
                            <Database className="text-gold-500" />
                            <span>Latest_Intel</span>
                        </h2>
                        <div className="space-y-4">
                            {/* Loading State causes layout shift, so min-height */}
                            {loading && (
                                <div className="text-zinc-500 font-mono text-sm animate-pulse">
                                    {">"} fetching_latest_intel_from_hashnode...
                                </div>
                            )}

                            {!loading && posts.length === 0 && (
                                <div className="text-zinc-500 font-mono text-sm">
                                    {">"} no_active_transmissions_found.
                                </div>
                            )}

                            {posts.map((post) => (
                                <motion.article
                                    whileHover={{ x: 10 }}
                                    key={post.title}
                                    onClick={() => setSelectedBlogPost(post)}
                                    className="flex flex-col md:flex-row gap-4 p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20 hover:border-gold-600/50 hover:bg-gold-900/5 transition-all cursor-pointer group"
                                >
                                    <div className="md:w-32 flex-shrink-0 text-gold-500 font-mono text-sm border-l-2 border-gold-500 pl-4 h-fit">
                                        {post.date}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-gold-400 transition-colors">
                                            {post.title} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
                                        </h3>
                                        <p className="text-zinc-400 mb-3">{post.desc}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-xs px-2 py-1 rounded bg-black border border-zinc-800 text-zinc-500">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* TESTIMONIALS SECTION */}
                <section id="testimonials">
                    <FadeIn>
                        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-white">
                            <Star className="text-gold-500" />
                            <span>Client_Transmissions</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {testimonials.map((test) => (
                                <div key={test.name} className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20 relative">
                                    <span className="absolute top-4 right-6 text-6xl text-gold-900 opacity-20 serif">"</span>
                                    <p className="text-zinc-300 italic mb-6 relative z-10">"{test.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center text-black font-bold">
                                            {test.initials}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{test.name}</h4>
                                            <p className="text-xs text-gold-500">{test.role} @ {test.company}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* CONTACT SECTION WITH FORM */}
                <section id="contact" className="max-w-4xl mx-auto">
                    <FadeIn>
                        <div className="grid md:grid-cols-2 gap-12 bg-zinc-900/30 border border-gold-500/20 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none"></div>

                            {/* Contact Info */}
                            <div className="flex flex-col justify-center">
                                <Smartphone className="w-12 h-12 text-gold-500 mb-6" />
                                <h2 className="text-3xl font-bold text-white mb-4">Establish Connection</h2>
                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    Ready to secure your infrastructure or build the next big thing? I'm currently available for new projects.
                                </p>
                                <div className="space-y-4">
                                    <a href="mailto:hello@derickmokua.co.ke" className="flex items-center gap-3 text-zinc-300 hover:text-gold-400 transition-colors">
                                        <Mail size={20} /> hello@derickmokua.co.ke
                                    </a>
                                    <a href="https://github.com/derickmokua" className="flex items-center gap-3 text-zinc-300 hover:text-gold-400 transition-colors">
                                        <Github size={20} /> github.com/derickmokua
                                    </a>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800">
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gold-500 mb-2 uppercase tracking-wider">Identity</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formState.name}
                                            onChange={handleFormChange}
                                            placeholder="Your Name"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gold-500 mb-2 uppercase tracking-wider">Frequency</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formState.email}
                                            onChange={handleFormChange}
                                            placeholder="your@email.com"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gold-500 mb-2 uppercase tracking-wider">Transmission</label>
                                        <textarea
                                            name="message"
                                            required
                                            value={formState.message}
                                            onChange={handleFormChange}
                                            rows="4"
                                            placeholder="Project details..."
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>Send Transmission <Send size={18} /></>
                                        )}
                                    </button>
                                    {submitStatus === 'success' && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-green-400 text-center text-sm mt-2"
                                        >
                                            Transmission Received. Stand by.
                                        </motion.p>
                                    )}
                                    {submitStatus === 'missing_config' && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-400 text-center text-sm mt-2 font-bold"
                                        >
                                            Error: Missing Configuration. Check .env file.
                                        </motion.p>
                                    )}
                                    {submitStatus === 'api_error' && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-400 text-center text-sm mt-2"
                                        >
                                            Error: Sending Failed. Details in Console.
                                        </motion.p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </FadeIn >
                </section >

                {/* Footer */}
                {/* Footer */}
                {/* Footer */}
                {/* Footer */}
                <footer className="border-t border-zinc-900 py-8 text-zinc-400 text-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        <div className="flex flex-col gap-1 mb-4 md:mb-0 text-center md:text-left">
                            <p>© 2025 Derick Mokua. All Rights Reserved.</p>
                        </div>

                        <div className="flex gap-4">
                            {[
                                { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/derick-mokua-b05165369/", label: "LinkedIn" },
                                { icon: <Github size={18} />, href: "https://github.com/derickmokua", label: "GitHub", className: "md:hidden" },
                                { icon: <MessageCircle size={18} />, href: "https://wa.me/254716883375", label: "WhatsApp" },
                                { icon: <Phone size={18} />, href: "tel:+254716883375", label: "Call" }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, color: '#e6b000' }}
                                    className={`relative group text-zinc-300 transition-colors p-2 ${social.className || ''}`}
                                >
                                    {social.icon}
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-gold-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        {social.label}
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                    </div>
                </footer>

            </main >

            {/* Back to Top */}
            < AnimatePresence >
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 left-8 text-gold-500 hover:text-gold-400 transition-transform hover:-translate-y-1 z-40"
                        aria-label="Back to top"
                    >
                        <ArrowUp size={32} />
                    </motion.button>
                )}
            </AnimatePresence >

            {/* Blog Modal */}
            < AnimatePresence >
                {selectedBlogPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedBlogPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
                        >
                            <button
                                onClick={() => setSelectedBlogPost(null)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-black/50 p-2 rounded-full"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8">
                                <div className="text-gold-500 font-mono text-sm mb-4">{selectedBlogPost.date}</div>
                                <h2 className="text-3xl font-bold text-white mb-6">{selectedBlogPost.title}</h2>

                                <div className="prose prose-invert prose-gold max-w-none">
                                    {/* Render dynamic markdown content if available */}
                                    {selectedBlogPost.markdown ? (
                                        <ReactMarkdown
                                            components={{
                                                // Custom styling for specific elements if needed, though prose-invert handles most
                                                a: ({ node, ...props }) => <a {...props} className="text-gold-500 hover:text-gold-400 underline" target="_blank" rel="noopener noreferrer" />,
                                                img: ({ node, ...props }) => <img {...props} className="rounded-xl border border-zinc-800 my-6" />,
                                                code: ({ node, inline, className, children, ...props }) => {
                                                    return inline ? (
                                                        <code className="bg-zinc-800 text-gold-200 px-1 rounded" {...props}>{children}</code>
                                                    ) : (
                                                        <code className="block bg-black p-4 rounded-lg border border-zinc-800 overflow-x-auto text-sm font-mono text-zinc-300 my-4" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {selectedBlogPost.markdown}
                                        </ReactMarkdown>
                                    ) : selectedBlogPost.content ? (
                                        // Fallback for static/legacy posts (array of strings)
                                        selectedBlogPost.content.map((paragraph, index) => (
                                            <p key={index} className="text-zinc-300 text-lg leading-relaxed mb-6">
                                                {paragraph}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-zinc-400">Content unavailable.</p>
                                    )}
                                </div>


                                <div className="bg-black p-4 rounded-xl border border-zinc-800 my-6 font-mono text-sm text-zinc-400">
                                    $ echo "Security is a process, not a product."
                                </div>


                                <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-wrap gap-2">
                                    {selectedBlogPost.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-black border border-zinc-800 rounded-full text-zinc-500 text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
};

export default Home;
