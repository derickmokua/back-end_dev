import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles, User, MoreHorizontal } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Greetings. I am Saibae, Derick's AI assistant. How can I assist you with his portfolio today?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            // Wait for animation to finish before scrolling
            setTimeout(scrollToBottom, 300);
        } else {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botResponses = [
                "I've noted that. Derick will be pleased to hear it.",
                "An interesting perspective. My algorithms suggest this aligns with Derick's expertise.",
                "I am currently operating in demo mode, but I can assure you Derick is the best choice for this project.",
                "Accessing database... affirmative.",
                "Would you like me to schedule a meeting with Derick?",
                "That's a great question. Let me consult my knowledge base."
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

            const newBotMessage = {
                id: messages.length + 2,
                text: randomResponse,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setIsTyping(false);
            setMessages(prev => [...prev, newBotMessage]);
        }, 1500);
    };

    return (
        <>
            {/* Floating Bubble */}
            <motion.button
                className="fixed bottom-24 right-8 z-50 p-3 bg-gold-500 text-black rounded-full shadow-lg shadow-gold-500/20 hover:scale-110 transition-all border-2 border-transparent hover:border-gold-300 group"
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ rotate: 10 }}
            >
                <AnimatePresence mode='wait'>
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={24} className="fill-black/10" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-80 h-[450px] bg-black/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden ring-1 ring-gold-500/10"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-3 shadow-sm">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black shadow-lg shadow-gold-500/20">
                                    <Bot size={22} className="fill-black/20" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-white text-base leading-none mb-1">Saibae AI</h3>
                                <p className="text-xs text-gold-500 font-mono tracking-wide">ONLINE</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                                aria-label="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {messages.map((msg, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                                            <Bot size={14} className="text-gold-500" />
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                        <div
                                            className={`px-4 py-2.5 text-sm leading-relaxed shadow-md ${msg.sender === 'user'
                                                ? 'bg-gold-500 text-black rounded-2xl rounded-tr-sm'
                                                : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-2xl rounded-tl-sm'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-zinc-600 mt-1 px-1">
                                            {msg.timestamp}
                                        </span>
                                    </div>

                                    {msg.sender === 'user' && (
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                                            <User size={14} className="text-zinc-400" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-end gap-2 justify-start"
                                >
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                                        <Bot size={14} className="text-gold-500" />
                                    </div>
                                    <div className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md flex gap-1">
                                        <motion.span
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900/80 border-t border-zinc-800">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask Saibae..."
                                    className="w-full bg-black border border-zinc-800 text-zinc-200 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-zinc-600 shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-1.5 p-2 bg-gold-500 hover:bg-gold-400 text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-gold-500/20"
                                >
                                    <Send size={18} className="ml-0.5" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-zinc-600 flex items-center justify-center gap-1.5">
                                    <Sparkles size={8} className="text-gold-500" />
                                    <span>AI Assistant V1.0.4</span>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
