import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, Loader2, Zap, Trash2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import BirthdayAnimation from "../components/effects/BirthdayAnimation";

const INITIAL_MESSAGE = {
  id: 1,
  text: "Connection established. I am **Ruby**, Derick's AI security & architecture proxy. Query me regarding his work in **Backend Architecture**, **Zero-Trust APIs**, or **LLM Safety**.",
  sender: "bot",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTIONS = [
  { label: "Tech Stack", query: "What is Derick's backend tech stack?" },
  { label: "Zero-Trust", query: "How does Derick approach zero-trust and API security?" },
  { label: "AI Safety", query: "Explain Derick's AI safety and LLM research." },
  { label: "KukuConnect", query: "Tell me about the KukuConnect architecture." },
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
          text: "**Initializing protocol: CAKE_DAY** 🎂\n\nCommencing celebration payload... **Happy Birthday, Derick!** Wishing you a secure, high-performance year ahead! 🚀",
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
    <div className="min-h-screen bg-[#181818] text-[#F5F5F3] font-mono flex flex-col relative selection:bg-[#FF3B45] selection:text-white">
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="w-full bg-[#202020] border border-[#343434] rounded-2xl shadow-2xl flex flex-col h-[88vh] overflow-hidden">
          {/* Header */}
          <header className="bg-[#202020] border-b border-[#343434] p-4 sticky top-0 z-10 select-none flex-shrink-0">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 text-[#A4A4A0] hover:text-[#FF3B45] transition-colors text-xs font-bold uppercase tracking-wider"
              >
                <ArrowLeft size={16} />
                <span>Return to Portfolio</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#FF3B45]/10 border border-[#FF3B45]/30 flex items-center justify-center text-[#FF3B45]">
                    <Bot size={18} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FF3B45] border-2 border-[#202020] rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-sm leading-none flex items-center gap-1.5 font-sans">
                    <span>RUBY_AI v1.5</span>
                    <ShieldCheck size={14} className="text-[#FF3B45]" />
                  </h1>
                  <p className="text-[10px] text-[#A4A4A0] font-mono tracking-wider uppercase mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#FF3B45] rounded-full animate-ping" />
                    ZERO_TRUST_CHANNEL // NAIROBI
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleResetChat}
                className="p-1.5 text-[#A4A4A0] hover:text-white border border-[#343434] rounded-lg hover:border-[#FF3B45] transition-colors text-xs flex items-center gap-1.5 focus:outline-none"
                title="Clear chat"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline text-[10px] font-bold uppercase">Reset</span>
              </button>
            </div>
          </header>

          {/* Main chat viewport */}
          <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            {/* Messages scroll list */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto space-y-4 pb-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-[#FF3B45]/10 border border-[#FF3B45]/30 flex items-center justify-center text-[#FF3B45] flex-shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}>
                    <div
                      className={`px-4 py-3 rounded-xl text-xs md:text-sm leading-relaxed shadow-lg ${
                        msg.sender === "user"
                          ? "bg-[#FF3B45]/15 border border-[#FF3B45]/40 text-[#F5F5F3] rounded-tr-none font-sans"
                          : "bg-[#181818] border-l-2 border-l-[#FF3B45] border-y border-r border-[#343434] text-[#F5F5F3] rounded-tl-none font-sans"
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                    </div>
                    <span className="text-[10px] text-[#A4A4A0]/60 mt-1.5 px-1">{msg.timestamp}</span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#343434] flex items-center justify-center text-[#A4A4A0] flex-shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#FF3B45]/10 border border-[#FF3B45]/30 flex items-center justify-center text-[#FF3B45] flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-[#181818] border border-[#343434] px-4 py-3 rounded-xl text-xs text-[#FF3B45] flex items-center gap-2">
                    <Loader2 size={13} className="animate-spin text-[#FF3B45]" />
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
                  className="px-3 py-1.5 border border-[#343434] hover:border-[#FF3B45] hover:bg-[#FF3B45]/10 text-[#A4A4A0] hover:text-white bg-[#181818] rounded-full text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Zap size={11} className="text-[#FF3B45]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Input box */}
            <form onSubmit={handleSendMessage} className="bg-[#181818] border border-[#343434] focus-within:border-[#FF3B45] rounded-xl p-3 md:p-3.5 flex items-center gap-3 transition-all duration-200">
              <span className="text-[#FF3B45] font-bold text-sm md:text-base select-none pl-1">&gt;_</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a technical or architecture question..."
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder:text-[#A4A4A0]/40 text-xs md:text-sm font-mono"
                maxLength={250}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="px-4 py-2 bg-[#FF3B45] hover:bg-[#E62A34] text-white font-bold uppercase rounded-lg text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 focus:outline-none shadow-md"
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
      </div>
    </div>
  );
}
