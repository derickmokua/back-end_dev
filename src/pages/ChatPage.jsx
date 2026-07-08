import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import BirthdayAnimation from "../components/effects/BirthdayAnimation";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Connection established. I am **Ruby**, Derick's AI secure operations proxy. Query me regarding his work in Backend Architecture, Zero-Trust, or LLM safety.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const [showChatConfetti, setShowChatConfetti] = useState(false);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessageText = inputValue.trim();
    const userMsg = {
      id: Date.now(),
      text: userMessageText,
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
      const response = await fetch("https://derickmokua.co.ke/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessageText }),
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
    <div className="h-full bg-terminal-bg text-terminal-text font-mono flex flex-col selection:bg-terminal-green selection:text-black">
      {/* Header */}
      <header className="bg-terminal-bg/85 backdrop-blur-md border-b border-terminal-green/10 p-4 sticky top-0 z-10 select-none shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-terminal-muted hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span>Return to base</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center text-terminal-green shadow-lg">
                <Bot size={20} />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-terminal-bg rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm leading-none">RUBY_AI v1.4</h1>
              <p className="text-[9px] text-terminal-green font-mono tracking-wider uppercase mt-1">
                SECURE_LINK_ESTABLISHED
              </p>
            </div>
          </div>
          <div className="w-20 hidden sm:block" />
        </div>
      </header>

      {/* Main chat viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between overflow-hidden">
        {/* Messages scroll list */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto space-y-5 pb-6 scrollbar-thin scrollbar-thumb-terminal-green/15"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-7 h-7 rounded-full bg-terminal-green/10 border border-terminal-green/25 flex items-center justify-center text-terminal-green flex-shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              )}

              <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%]`}>
                <div
                  className={`px-4 py-3 rounded text-xs md:text-sm leading-relaxed shadow-lg ${
                    msg.sender === "user"
                      ? "bg-terminal-green/10 border border-terminal-green/30 text-terminal-green"
                      : "bg-terminal-card border border-terminal-cyan/15 text-terminal-text"
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
                <span className="text-[10px] text-terminal-muted/40 mt-1.5 px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-terminal-cyan/10 border border-terminal-cyan/25 flex items-center justify-center text-terminal-cyan flex-shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-terminal-green/10 border border-terminal-green/25 flex items-center justify-center text-terminal-green flex-shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-terminal-card border border-terminal-cyan/15 px-4 py-3 rounded text-xs text-terminal-cyan flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                <span>Running logic analysis...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="bg-terminal-card border border-terminal-green/20 rounded-lg p-3 flex gap-3 glow-border-green">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Submit secure prompt..."
            className="flex-1 bg-black border border-terminal-green/15 rounded px-4 py-2.5 text-white placeholder-terminal-muted/40 focus:outline-none focus:border-terminal-green transition-all text-xs md:text-sm font-mono"
            maxLength={250}
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="px-4 py-2 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold uppercase rounded text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 focus:outline-none"
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
  );
}
