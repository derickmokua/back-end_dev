import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, Loader2, Zap, Trash2, ShieldCheck, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import BirthdayAnimation from "../components/effects/BirthdayAnimation";

const INITIAL_MESSAGE = {
  id: 1,
  text: "Connection established. I am **Ruby**, Derick's AI architecture proxy.\n\nQuery me regarding his work in **Backend Architecture**, **Zero-Trust APIs**, or **LLM Safety**. I have access to all project and technical details.",
  sender: "bot",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTIONS = [
  { label: "Tech Stack", query: "What is Derick's backend tech stack?" },
  { label: "Zero-Trust", query: "How does Derick approach zero-trust and API security?" },
  { label: "AI Safety", query: "Explain Derick's AI safety and LLM research." },
  { label: "KukuConnect", query: "Tell me about the KukuConnect architecture." },
  { label: "Availability", query: "Is Derick available for freelance or full-time work?" },
  { label: "Contact", query: "How can I contact or hire Derick?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [showChatConfetti, setShowChatConfetti] = useState(false);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [messages, isTyping]);

  const sendQuery = async (userMessageText) => {
    if (!userMessageText.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text: userMessageText.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const cleanedText = userMessageText.toLowerCase();
    if (cleanedText.includes("happy birthday")) {
      setShowChatConfetti(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "**Initializing protocol: CAKE_DAY** 🎂\n\nCommencing celebration payload... **Happy Birthday, Derick!** Wishing you a secure, high-performance year ahead! 🚀",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsTyping(false);
      }, 800);
      return;
    }

    try {
      const apiUrl = import.meta.env.DEV
        ? "https://derickmokua.co.ke/api/chat"
        : "/api/chat";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessageText.trim() }),
      });

      if (!response.ok) throw new Error("API Channel Error");
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.reply || "Acknowledged. Operational logic completed.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "ALERT: Backend secure connection interrupted. Please re-query.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendQuery(inputValue);
  };

  const renderMessageContent = (text) => {
    try {
      const parsed = marked.parse(text);
      const clean = DOMPurify.sanitize(parsed);
      return <div className="ruby-message font-sans text-[13.5px] leading-relaxed" dangerouslySetInnerHTML={{ __html: clean }} />;
    } catch {
      return <p className="ruby-message whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed">{text}</p>;
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5] flex flex-col relative selection:bg-[#ff2830] selection:text-white"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Ambient background radial */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,40,48,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-20 border-b border-[#1e1e1e] bg-[#0f0f0f]/90 backdrop-blur-md shrink-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Back */}
          <Link
            to="/"
            className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors text-xs font-medium tracking-wide group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-[#ff2830]/12 border border-[#ff2830]/30 flex items-center justify-center">
                <Bot size={15} className="text-[#ff5c63]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] border-2 border-[#0f0f0f] rounded-full" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-tight">Ruby AI</span>
                <ShieldCheck size={12} className="text-[#ff5c63]" />
              </div>
              <p className="text-[10px] text-[#555] tracking-widest uppercase font-mono">
                Zero-Trust · Nairobi
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([INITIAL_MESSAGE])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#222] hover:border-[#ff2830]/40 text-[#555] hover:text-white text-xs transition-all focus:outline-none"
              title="Clear chat"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Chat Window ── */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl w-full mx-auto px-0 sm:px-4 pb-0">

        {/* Status ribbon */}
        <div className="mx-4 sm:mx-0 mt-4 mb-2 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a1a1a] border border-[#222]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2830] animate-pulse" />
            <span className="text-[10px] font-mono text-[#ff5c63] tracking-wider uppercase font-bold">TUNNEL_SECURE</span>
          </div>
          <span className="text-[#2a2a2a]">·</span>
          <Terminal size={11} className="text-[#555]" />
          <span className="text-[10px] font-mono text-[#555]">LATENCY: 14ms</span>
          <span className="ml-auto text-[10px] font-mono text-[#3a3a3a]">
            {messages.length - 1} exchanges
          </span>
        </div>

        {/* Messages scroll area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-5"
          style={{ minHeight: "calc(100dvh - 280px)" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-xl bg-[#ff2830]/10 border border-[#ff2830]/25 flex items-center justify-center text-[#ff5c63] shrink-0 mb-0.5">
                    <Bot size={15} />
                  </div>
                )}

                <div className={`flex flex-col gap-1.5 ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[88%] sm:max-w-[76%]`}>
                  <div
                    className={`px-4 py-3 shadow-lg ${
                      msg.sender === "user"
                        ? "bg-[#ff2830]/12 border border-[#ff2830]/30 text-[#f5f5f5] rounded-2xl rounded-br-md"
                        : "bg-[#1a1a1a] border border-[#242424] border-l-2 border-l-[#ff2830]/55 text-[#e8e8e8] rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {renderMessageContent(msg.text)}
                  </div>
                  <span className="text-[10px] text-[#333] px-1">{msg.timestamp}</span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] border border-[#242424] flex items-center justify-center text-[#555] shrink-0 mb-0.5">
                    <User size={15} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-xl bg-[#ff2830]/10 border border-[#ff2830]/25 flex items-center justify-center text-[#ff5c63] shrink-0">
                <Bot size={15} />
              </div>
              <div className="bg-[#1a1a1a] border border-[#242424] border-l-2 border-l-[#ff2830]/55 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2.5">
                <Loader2 size={13} className="animate-spin text-[#ff5c63]" />
                <span className="text-[13px] text-[#a3a3a3]">Ruby is analyzing…</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Sticky Input Area ── */}
        <div className="sticky bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-[#1a1a1a] px-4 py-4 space-y-3">
          {/* Suggestion Chips */}
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {SUGGESTIONS.map((item) => (
              <button
                key={item.label}
                onClick={() => sendQuery(item.query)}
                disabled={isTyping}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#222] hover:border-[#ff2830]/50 hover:bg-[#ff2830]/8 text-[#a3a3a3] hover:text-[#ff5c63] rounded-full text-[11px] transition-all focus:outline-none disabled:opacity-40 whitespace-nowrap"
              >
                <Zap size={10} className="text-[#ff5c63] shrink-0" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 bg-[#141414] border border-[#222] focus-within:border-[#ff2830]/60 focus-within:shadow-[0_0_0_3px_rgba(255,40,48,0.08)] rounded-2xl px-4 py-3 transition-all duration-200"
          >
            <span className="text-[#ff5c63] font-bold text-base select-none leading-none font-mono">&gt;_</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about architecture, projects, or availability…"
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder:text-[#333] text-[13.5px]"
              maxLength={300}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-[#ff2830] hover:bg-[#e62028] text-white flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed shrink-0 focus:outline-none shadow-md shadow-[#ff2830]/20"
            >
              <Send size={15} />
            </button>
          </form>

          <p className="text-center text-[10px] text-[#252525]">
            Powered by Gemini · Zero-Trust filtered · All sessions are ephemeral
          </p>
        </div>
      </div>

      {showChatConfetti && (
        <BirthdayAnimation onComplete={() => setShowChatConfetti(false)} HUDEnabled={false} />
      )}
    </div>
  );
}
