import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function RubyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Connection established. I am **Ruby**, Derick's AI security proxy. Query me regarding his work in Backend Architecture, Zero-Trust, or LLM safety.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, isOpen, isTyping]);

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

    try {
      const apiUrl = import.meta.env.DEV 
        ? "https://derickmokua.co.ke/api/chat" 
        : "/api/chat";

      const response = await fetch(apiUrl, {
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

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
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

  const suggestions = [
    "Tell me about KukuConnect.",
    "What is Derick's tech stack?",
    "Explain his AI safety research.",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 font-mono text-xs">
      {/* Floating launcher bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 bg-terminal-green/10 hover:bg-terminal-green/20 text-terminal-green rounded-full flex items-center justify-center shadow-lg shadow-black/50 hover:shadow-[0_0_20px_rgba(0,255,159,0.2)] transition-all hover:scale-105 focus:outline-none"
            title="Chat with Ruby"
          >
            <MessageSquare size={20} className="animate-pulse" />
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
            className="w-[320px] sm:w-[360px] h-[450px] bg-terminal-card border border-terminal-green/30 rounded-xl shadow-[0_0_30px_rgba(0,255,159,0.15)] flex flex-col justify-between overflow-hidden relative glow-border-green"
          >
            {/* Linux Terminal Header bar */}
            <div className="bg-black/95 p-3 border-b border-terminal-green/15 flex items-center justify-between select-none relative z-10 flex-shrink-0">
              {/* Traffic Lights */}
              <div className="flex gap-1.5 items-center opacity-70">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-500/30"></div>
              </div>
              
              {/* Window Title */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] text-white font-bold tracking-widest uppercase">RUBY_AI_PROXY v1.4</span>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-terminal-muted hover:text-white transition-colors focus:outline-none z-10"
              >
                <X size={14} />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 scrollbar-thin scrollbar-thumb-terminal-green/20"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center text-terminal-green flex-shrink-0 mt-0.5">
                      <Bot size={12} />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[80%]`}>
                    <div
                      className={`px-3 py-2 rounded text-[11px] leading-relaxed shadow ${
                        msg.sender === "user"
                          ? "bg-terminal-green/10 border border-terminal-green/30 text-terminal-green"
                          : "bg-terminal-bg border border-terminal-cyan/20 text-terminal-text"
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                    </div>
                    <span className="text-[9px] text-terminal-muted/40 mt-1 px-1">{msg.timestamp}</span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-6 h-6 rounded-full bg-terminal-cyan/10 border border-terminal-cyan/20 flex items-center justify-center text-terminal-cyan flex-shrink-0 mt-0.5">
                      <User size={12} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center text-terminal-green flex-shrink-0">
                    <Bot size={12} />
                  </div>
                  <div className="bg-terminal-bg border border-terminal-cyan/20 px-3 py-2 rounded text-[11px] text-terminal-cyan flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Querying DB...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 pb-2 pt-1.5 border-t border-terminal-green/5 bg-black/40 flex flex-wrap gap-1.5 select-none">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-0.5 border border-terminal-cyan/15 hover:border-terminal-cyan/40 hover:bg-terminal-cyan/5 text-terminal-cyan bg-black/60 rounded-[3px] text-[9px] transition-all focus:outline-none font-mono"
                >
                  [{suggestion.replace(/[?.]/g, "")}]
                </button>
              ))}
            </div>

            {/* Input Row */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-black/90 border-t border-terminal-green/15 flex items-center gap-2">
              <span className="text-terminal-green font-bold text-xs select-none pl-1">&gt;</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Secure query..."
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white placeholder-terminal-muted/30 text-xs font-mono"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="px-2.5 py-1 bg-terminal-green/10 border border-terminal-green/30 hover:bg-terminal-green/20 text-terminal-green font-bold uppercase rounded-[3px] text-[9px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 focus:outline-none"
              >
                <Send size={10} />
                <span>EXECUTE</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
