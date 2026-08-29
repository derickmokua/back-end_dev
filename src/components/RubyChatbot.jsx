import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Trash2, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";

const INITIAL_MESSAGE = {
  id: 1,
  text: "Connection established. I am **Ruby**, Derick's AI security & architecture proxy. Ask me about his work in **Backend Architecture**, **Zero-Trust APIs**, or **LLM Safety**.",
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
    if (isOpen) {
      setTimeout(scrollToBottom, 50);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isTyping]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
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

      const botMsg = {
        id: Date.now() + 1,
        text: data.reply || "Acknowledged. Operational logic completed.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: Date.now() + 1,
        text: "ALERT: Backend secure connection interrupted. Please re-query database.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendQuery(inputValue);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const renderMessageContent = (text) => {
    try {
      const parsed = marked.parse(text);
      const clean = DOMPurify.sanitize(parsed);
      return <div className="ruby-message" dangerouslySetInnerHTML={{ __html: clean }} />;
    } catch (e) {
      return <p className="ruby-message whitespace-pre-wrap">{text}</p>;
    }
  };

  return (
    <div className="font-mono text-xs z-40">
      {/* Floating launcher bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 px-4 h-11 bg-terminal-card border border-terminal-green/30 hover:border-terminal-green text-terminal-green rounded-full flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,255,159,0.2)] hover:shadow-[0_0_25px_rgba(0,255,159,0.4)] transition-all hover:scale-105 focus:outline-none select-none font-bold uppercase tracking-wider text-[10px] relative"
            title="Chat with Ruby AI (Esc to close)"
          >
            <div className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping absolute" />
              <span className="w-1.5 h-1.5 bg-terminal-green rounded-full absolute" />
            </div>
            <Bot size={14} className="text-terminal-cyan" />
            <span>Ask Ruby AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-40 w-full sm:w-[380px] h-[100dvh] sm:h-[480px] bg-terminal-card border-t sm:border border-terminal-green/30 rounded-none sm:rounded-xl shadow-[0_0_30px_rgba(0,255,159,0.15)] flex flex-col justify-between overflow-hidden glow-border-green"
          >
            {/* Terminal Header Bar */}
            <div className="bg-[#05060A] px-3.5 py-2.5 border-b border-terminal-green/20 flex items-center justify-between select-none relative z-10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 items-center opacity-80">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-500/30"></div>
                </div>
                <div className="flex items-center gap-1.5 pl-2 text-[10px] text-terminal-green font-bold tracking-wider">
                  <ShieldCheck size={13} className="text-terminal-green" />
                  <span>RUBY_AI :: v1.5</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="p-1 text-terminal-muted hover:text-terminal-cyan transition-colors focus:outline-none"
                  title="Reset conversation"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-terminal-muted hover:text-white transition-colors focus:outline-none"
                  title="Close (Esc)"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Sub-header status ticker */}
            <div className="bg-black/60 px-3.5 py-1 border-b border-terminal-green/10 flex items-center justify-between text-[9px] text-terminal-muted select-none">
              <span className="flex items-center gap-1 text-terminal-green font-mono">
                <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-pulse" />
                TUNNEL_SECURE
              </span>
              <span className="text-terminal-cyan/80">LATENCY: 14ms</span>
            </div>

            {/* Message Area */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#05060A]/80 scrollbar-thin scrollbar-thumb-terminal-green/20"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center text-terminal-green flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,159,0.2)]">
                      <Bot size={12} />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[82%]`}>
                    <div
                      className={`px-3.5 py-2.5 rounded-lg text-[11px] leading-relaxed shadow-md ${
                        msg.sender === "user"
                          ? "bg-terminal-green/15 border border-terminal-green/40 text-terminal-text rounded-tr-none font-sans"
                          : "bg-[#0C0F17] border-l-2 border-l-terminal-green border-y border-r border-terminal-green/15 text-slate-100 rounded-tl-none font-sans"
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                    </div>
                    <span className="text-[9px] text-terminal-muted/60 mt-1 px-1">{msg.timestamp}</span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-6 h-6 rounded-full bg-terminal-cyan/10 border border-terminal-cyan/30 flex items-center justify-center text-terminal-cyan flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,229,255,0.2)]">
                      <User size={12} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center text-terminal-green flex-shrink-0">
                    <Bot size={12} />
                  </div>
                  <div className="bg-[#0C0F17] border border-terminal-cyan/20 px-3 py-2 rounded-lg text-[11px] text-terminal-cyan flex items-center gap-2 shadow-sm">
                    <Loader2 size={12} className="animate-spin text-terminal-cyan" />
                    <span>Ruby is analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 border-t border-terminal-green/10 bg-[#08090E] flex flex-nowrap overflow-x-auto gap-1.5 select-none scrollbar-none">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => sendQuery(item.query)}
                  disabled={isTyping}
                  className="px-2.5 py-1 border border-terminal-cyan/25 hover:border-terminal-cyan hover:bg-terminal-cyan/10 text-terminal-cyan bg-[#0F121A] rounded-full text-[9px] transition-all whitespace-nowrap focus:outline-none flex items-center gap-1 disabled:opacity-50"
                >
                  <Zap size={9} className="text-terminal-cyan" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="p-2.5 bg-[#05060A] border-t border-terminal-green/15">
              <form 
                onSubmit={handleSendMessage} 
                className="bg-[#0F121A] border border-terminal-green/25 focus-within:border-terminal-green/60 rounded-lg px-3 py-2 flex items-center gap-2 transition-all duration-200"
              >
                <span className="text-terminal-green font-bold text-xs select-none">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a technical or architecture question..."
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder:text-terminal-muted/40 text-xs font-mono"
                  maxLength={200}
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="px-3 py-1.5 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold uppercase rounded text-[10px] transition-all disabled:bg-terminal-green/10 disabled:text-terminal-green/30 disabled:cursor-not-allowed flex items-center gap-1 focus:outline-none shadow-[0_0_8px_rgba(0,255,159,0.25)]"
                >
                  <Send size={10} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
