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
            className="w-12 h-12 bg-terminal-bg border border-terminal-green/30 hover:border-terminal-green text-terminal-green rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_rgba(0,255,159,0.3)] transition-all hover:scale-105 focus:outline-none"
            title="Secure AI Channel"
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
            className="w-[320px] sm:w-[360px] h-[450px] bg-terminal-card border border-terminal-green/30 rounded-lg shadow-2xl flex flex-col justify-between overflow-hidden glow-border-green"
          >
            {/* Header bar */}
            <div className="bg-black/90 p-3 border-b border-terminal-green/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-terminal-green/10 border border-terminal-green/20 flex items-center justify-center text-terminal-green">
                    <Bot size={13} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-terminal-bg" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-[11px] leading-none">RUBY_AI v1.4</h3>
                  <span className="text-[8px] text-terminal-green font-bold block mt-0.5">SECURE_LINK_CONNECTED</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-terminal-muted hover:text-white transition-colors focus:outline-none"
              >
                <X size={16} />
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
            <div className="px-3 pb-2 pt-1 border-t border-terminal-green/5 bg-black/20 flex flex-wrap gap-1.5 select-none">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-0.5 border border-terminal-cyan/15 hover:border-terminal-cyan/35 text-terminal-cyan bg-black/40 rounded-[3px] text-[9px] transition-all focus:outline-none"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-black/80 border-t border-terminal-green/10 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter prompt..."
                className="flex-1 bg-black border border-terminal-green/15 rounded px-3 py-1.5 text-white placeholder-terminal-muted/45 focus:outline-none focus:border-terminal-green transition-all text-xs"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="px-3 bg-terminal-green hover:bg-terminal-green/90 text-black font-bold uppercase rounded text-[10px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 focus:outline-none"
              >
                <Send size={10} />
                <span>Send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
