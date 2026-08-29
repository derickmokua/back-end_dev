import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, Loader2, Zap, Trash2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import BirthdayAnimation from "../components/effects/BirthdayAnimation";

import MatrixRain from "../components/MatrixRain";
import TerminalSection from "../components/TerminalSection";

const INITIAL_MESSAGE = {
  id: 1,
  text: "Connection established. I am **Ruby**, Derick's AI security & architecture proxy. Query me regarding his work in **Backend Architecture**, **Zero-Trust APIs**, or **LLM Safety**.",
  sender: "bot",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTIONS = [
  { label: "🏗️ Tech Stack", query: "What is Derick's backend tech stack?" },
  { label: "🔐 Zero-Trust", query: "How does Derick approach zero-trust and API security?" },
  { label: "🧠 AI Safety", query: "Explain Derick's AI safety and LLM research." },
  { label: "🐔 KukuConnect", query: "Tell me about the KukuConnect architecture." },
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
    if (cleanedText === "/birthday" || cleanedText === "happy birthday" || cleanedText.includes("happy birthday")) {
      setShowChatConfetti(true);
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          text: "**Initializing protocol: CAKE_DAY** 🎂\n\nCommencing gold confetti payload... **Happy Birthday, Derick!** Wishing you a secure, high-performance year ahead! 🚀",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
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
      return <div className="ruby-message font-mono" dangerouslySetInnerHTML={{ __html: clean }} />;
    } catch (e) {
      return <p className="ruby-message whitespace-pre-wrap font-mono">{text}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text font-mono flex flex-col selection:bg-terminal-green selection:text-black relative">
      <MatrixRain />
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
        <TerminalSection id="chat" command="visitor@derick-host: ~/secure-comms">
          <div className="flex flex-col h-[85vh] -mx-6 md:-mx-8 -my-6 md:-my-8 bg-[#08090E]/90">
            {/* Header */}
            <header className="bg-[#05060A]/95 backdrop-blur-md border-b border-terminal-green/20 p-4 sticky top-0 z-10 select-none shadow-lg rounded-t-lg">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-terminal-muted hover:text-terminal-green transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <ArrowLeft size={16} />
                  <span>Return to base</span>
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center text-terminal-green shadow-[0_0_12px_rgba(0,255,159,0.25)]">
                      <Bot size={20} />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-terminal-green border-2 border-terminal-bg rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h1 className="font-bold text-white text-sm leading-none flex items-center gap-1.5">
                      <span>RUBY_AI v1.5</span>
                      <ShieldCheck size={14} className="text-terminal-green" />
                    </h1>
                    <p className="text-[9px] text-terminal-green font-mono tracking-wider uppercase mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-terminal-green rounded-full animate-ping" />
                      SECURE_ZERO_TRUST_CHANNEL
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-terminal-muted hover:text-terminal-cyan transition-colors text-xs flex items-center gap-1.5 focus:outline-none"
                  title="Clear chat"
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline text-[10px] font-bold uppercase">Reset</span>
                </button>
              </div>
            </header>

            {/* Main chat viewport */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between overflow-hidden">
              {/* Messages scroll list */}
              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-thin scrollbar-thumb-terminal-green/20"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center text-terminal-green flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,255,159,0.2)]">
                        <Bot size={14} />
                      </div>
                    )}

                    <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}>
                      <div
                        className={`px-4 py-3 rounded-lg text-xs md:text-sm leading-relaxed shadow-lg ${
                          msg.sender === "user"
                            ? "bg-terminal-green/15 border border-terminal-green/40 text-terminal-text rounded-tr-none font-sans"
                            : "bg-[#0F121A] border-l-2 border-l-terminal-green border-y border-r border-terminal-green/20 text-slate-100 rounded-tl-none font-sans"
                        }`}
                      >
                        {renderMessageContent(msg.text)}
                      </div>
                      <span className="text-[10px] text-terminal-muted/50 mt-1.5 px-1">{msg.timestamp}</span>
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-full bg-terminal-cyan/10 border border-terminal-cyan/30 flex items-center justify-center text-terminal-cyan flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,229,255,0.2)]">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-3 justify-start">
                    <div className="w-7 h-7 rounded-full bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center text-terminal-green flex-shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="bg-[#0F121A] border border-terminal-cyan/25 px-4 py-3 rounded-lg text-xs text-terminal-cyan flex items-center gap-2">
                      <Loader2 size={13} className="animate-spin text-terminal-cyan" />
                      <span>Ruby is synthesizing analysis...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="py-2.5 flex flex-wrap gap-2 select-none">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => sendQuery(item.query)}
                    disabled={isTyping}
                    className="px-3 py-1.5 border border-terminal-cyan/25 hover:border-terminal-cyan hover:bg-terminal-cyan/10 text-terminal-cyan bg-[#0F121A] rounded-full text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap size={11} className="text-terminal-cyan" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Input box */}
              <form onSubmit={handleSendMessage} className="bg-[#0F121A] border border-terminal-green/25 focus-within:border-terminal-green/60 rounded-lg p-3 md:p-3.5 flex items-center gap-3 transition-all duration-200 glow-border-green">
                <span className="text-terminal-green font-bold text-sm md:text-base select-none pl-1">&gt;_</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a technical or architecture question..."
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder:text-terminal-muted/40 text-xs md:text-sm font-mono"
                  maxLength={250}
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="px-4 py-2 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold uppercase rounded text-xs transition-all disabled:bg-terminal-green/10 disabled:text-terminal-green/30 disabled:cursor-not-allowed flex items-center gap-1.5 focus:outline-none shadow-[0_0_10px_rgba(0,255,159,0.3)]"
                >
                  <Send size={12} />
                  <span>Send</span>
                </button>
              </form>
            </main>

            {showChatConfetti && (
              <BirthdayAnimation onComplete={() => setShowChatConfetti(false)} HUDEnabled={false} />
            )}
          </div>
        </TerminalSection>
      </div>
    </div>
  );
}
