import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, Sparkles, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Greetings. I am Ruby, Derick's AI assistant. I have dedicated this secure channel for our communication. How can I assist you today?",
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
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: newUserMessage.text,
                    // We still send history so the context-aware bot works!
                    history: messages.slice(0, -1) // Exclude the message we just added effectively, or just send all
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.reply) {
                const newBotMessage = {
                    id: messages.length + 2,
                    text: data.reply,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newBotMessage]);
            } else {
                console.error("API Error or Empty Response", data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            const errorMessage = {
                id: messages.length + 2,
                text: "I am currently experiencing a connection issue. Please try again later.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-200 font-mono flex flex-col">
            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/80 backdrop-blur-md border-b border-zinc-900 p-4 sticky top-0 z-10"
            >
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="text-sm font-bold">Return to Base</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black shadow-lg shadow-gold-500/20">
                                <Bot size={22} className="fill-black/20" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-lg leading-none">Ruby AI</h1>
                            <p className="text-xs text-gold-500 font-mono tracking-wide">SECURE_CHANNEL_ACTIVE</p>
                        </div>
                    </div>
                    <div className="w-24"></div> {/* Spacer for centering */}
                </div>
            </motion.header>

            {/* Main Chat Area */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-6 pb-4">
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                                    <Bot size={18} className="text-gold-500" />
                                </div>
                            )}

                            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%]`}>
                                <div
                                    className={`px-5 py-3.5 text-base leading-relaxed shadow-lg ${msg.sender === 'user'
                                        ? 'bg-gold-500 text-black rounded-2xl rounded-tr-sm'
                                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-xs text-zinc-600 mt-1.5 px-1">
                                    {msg.timestamp}
                                </span>
                            </div>

                            {msg.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                                    <User size={18} className="text-zinc-400" />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-end gap-3 justify-start"
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                                <Bot size={18} className="text-gold-500" />
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 px-5 py-4 rounded-2xl rounded-tl-sm shadow-lg flex gap-1.5">
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                    className="w-2 h-2 bg-zinc-400 rounded-full"
                                />
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                    className="w-2 h-2 bg-zinc-400 rounded-full"
                                />
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                    className="w-2 h-2 bg-zinc-400 rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-black/80 backdrop-blur-md border-t border-zinc-900 p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Initialize query protocol..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-base rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-zinc-600 shadow-inner"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 p-3 bg-gold-500 hover:bg-gold-400 text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-gold-500/20"
                        >
                            <Send size={20} className="ml-0.5" />
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-zinc-600 flex items-center justify-center gap-1.5 uppercase tracking-widest">
                            <Sparkles size={8} className="text-gold-500" />
                            <span>Ruby Neural Interface V1.0.4</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
