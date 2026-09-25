import React, { useState, useEffect, useRef } from "react";
import { Send, X, Bot, User, Loader2, Zap, Trash2, ShieldCheck, Minimize2, ChevronDown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";

const INITIAL_MESSAGE = {
  id: 1,
  text: "Connection established. I am **Ruby**, Derick's AI architecture proxy.\n\nAsk me about his **Backend Systems**, **Zero-Trust Security**, or **AI Safety** work.",
  sender: "bot",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTIONS = [
  { label: "Tech Stack", query: "What is Derick's backend tech stack?" },
  { label: "Zero-Trust", query: "How does Derick approach zero-trust and API security?" },
  { label: "AI Safety", query: "Explain Derick's AI safety and LLM research." },
  { label: "KukuConnect", query: "Tell me about the KukuConnect architecture." },
];

export default function RubyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(scrollToBottom, 60);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [messages, isOpen, isTyping, isMinimized]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text: queryText.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    if (isMinimized) setIsMinimized(false);

    try {
      const apiUrl = import.meta.env.DEV
        ? "https://derickmokua.co.ke/api/chat"
        : "/api/chat";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText.trim() }),
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
          text: "ALERT: Backend connection interrupted. Please try again.",
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
      return <div className="ruby-message" dangerouslySetInnerHTML={{ __html: clean }} />;
    } catch {
      return <p className="ruby-message whitespace-pre-wrap">{text}</p>;
    }
  };

  const unreadCount = !isOpen ? messages.filter(m => m.sender === "bot").length - 1 : 0;

  return (
    <div className="font-mono text-xs z-50">

      {/* ── Floating Launcher ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="launcher"
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Ruby AI chat"
            title="Chat with Ruby AI"
            className="fixed bottom-20 right-5 z-50 w-14 h-14 rounded-full bg-transparent hover:bg-[#ff2830]/10 active:scale-95 transition-all duration-200 shadow-none hover:shadow-[0_8px_28px_rgba(255,40,48,0.30)] flex items-center justify-center select-none"
          >
            <MessageSquare size={24} className="text-[#ff2830]" strokeWidth={1.75} />
            {/* Live status dot */}
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-2 h-2">
              <span className="absolute w-full h-full rounded-full bg-[#ff2830] animate-ping opacity-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2830]" />
            </span>
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#ff2830] text-[10px] font-bold font-sans flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-0 right-0 sm:bottom-20 sm:right-5 z-50 w-full sm:w-[400px] h-[100dvh] sm:h-auto sm:max-h-[560px] bg-[#141414] sm:rounded-2xl border-0 sm:border border-[#2a2a2a] shadow-[0_32px_80px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#141414] shrink-0">
              <div className="flex items-center gap-3">
                {/* Animated Avatar */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2830]/20 to-[#ff2830]/5 border border-[#ff2830]/30 flex items-center justify-center">
                    <Bot size={16} className="text-[#ff5c63]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff2830] border-2 border-[#141414] animate-pulse" />
                </div>

                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-white tracking-tight">Ruby AI</span>
                    <ShieldCheck size={12} className="text-[#ff5c63]" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    <span className="text-[10px] text-[#6b7280] font-sans tracking-wider">SECURE · NAIROBI</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([INITIAL_MESSAGE])}
                  className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors focus:outline-none hidden sm:flex"
                  title={isMinimized ? "Expand" : "Minimize"}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <ChevronDown size={14} /> : <Minimize2 size={14} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  title="Close (Esc)"
                  aria-label="Close chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Collapsible Body ── */}
            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex flex-col flex-1 overflow-hidden"
                  style={{ minHeight: 0 }}
                >
                  {/* ── Message Area ── */}
                  <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#141414]"
                    style={{ maxHeight: "calc(100dvh - 220px)", minHeight: "220px" }}
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.sender === "bot" && (
                          <div className="w-7 h-7 rounded-xl bg-[#ff2830]/10 border border-[#ff2830]/25 flex items-center justify-center text-[#ff5c63] shrink-0 mb-0.5">
                            <Bot size={13} />
                          </div>
                        )}

                        <div className={`flex flex-col gap-1 ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                          <div
                            className={`px-3.5 py-2.5 text-[12.5px] leading-relaxed shadow-lg ${
                              msg.sender === "user"
                                ? "bg-[#ff2830]/15 border border-[#ff2830]/35 text-[#f5f5f5] rounded-2xl rounded-br-md font-sans"
                                : "bg-[#1e1e1e] border border-[#2a2a2a] text-[#e8e8e8] rounded-2xl rounded-bl-md font-sans border-l-2 border-l-[#ff2830]/60"
                            }`}
                          >
                            {renderMessageContent(msg.text)}
                          </div>
                          <span className="text-[10px] text-[#3a3a3a] px-1">{msg.timestamp}</span>
                        </div>

                        {msg.sender === "user" && (
                          <div className="w-7 h-7 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-[#555] shrink-0 mb-0.5">
                            <User size={13} />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-end gap-2.5 justify-start">
                        <div className="w-7 h-7 rounded-xl bg-[#ff2830]/10 border border-[#ff2830]/25 flex items-center justify-center text-[#ff5c63] shrink-0">
                          <Bot size={13} />
                        </div>
                        <div className="bg-[#1e1e1e] border border-[#2a2a2a] border-l-2 border-l-[#ff2830]/60 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                          <Loader2 size={12} className="animate-spin text-[#ff5c63]" />
                          <span className="text-[12px] text-[#a3a3a3] font-sans">Ruby is thinking…</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Quick Chips ── */}
                  <div className="px-4 py-2.5 border-t border-[#1e1e1e] bg-[#141414]">
                    <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                      {SUGGESTIONS.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => sendQuery(item.query)}
                          disabled={isTyping}
                          className="shrink-0 px-2.5 py-1 border border-[#2a2a2a] hover:border-[#ff2830]/50 hover:bg-[#ff2830]/8 text-[#a3a3a3] hover:text-[#ff5c63] bg-[#1a1a1a] rounded-full text-[10px] transition-all whitespace-nowrap focus:outline-none flex items-center gap-1 disabled:opacity-40 font-sans"
                        >
                          <Zap size={9} className="text-[#ff5c63] shrink-0" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Input ── */}
                  <div className="px-3 pb-3 pt-2 bg-[#141414] shrink-0">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] focus-within:border-[#ff2830]/60 focus-within:shadow-[0_0_0_3px_rgba(255,40,48,0.08)] rounded-xl px-3 py-2 transition-all duration-200"
                    >
                      <span className="text-[#ff5c63] font-bold text-sm select-none leading-none">&gt;</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about architecture or projects…"
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder:text-[#3a3a3a] text-[12.5px] font-sans"
                        maxLength={250}
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={isTyping || !inputValue.trim()}
                        aria-label="Send message"
                        className="w-8 h-8 rounded-lg bg-[#ff2830] hover:bg-[#e62028] text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 focus:outline-none shadow-md shadow-[#ff2830]/20"
                      >
                        <Send size={13} />
                      </button>
                    </form>
                    <p className="text-center text-[9px] text-[#2a2a2a] mt-2 font-sans">
                      Powered by Gemini · Zero-Trust Filtered
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
