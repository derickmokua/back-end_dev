import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, BookOpen, User, FolderGit2, Mail, ExternalLink, Sparkles, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    {
      id: 'about',
      label: 'About Derick',
      category: 'Navigation',
      icon: <User size={14} className="text-terminal-green" />,
      action: () => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'skills',
      label: 'Technical Arsenal & Skills',
      category: 'Navigation',
      icon: <Terminal size={14} className="text-terminal-green" />,
      action: () => {
        const el = document.getElementById('skills');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'projects',
      label: 'Selected Works & Projects',
      category: 'Navigation',
      icon: <FolderGit2 size={14} className="text-terminal-green" />,
      action: () => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'services',
      label: 'Engineering Services',
      category: 'Navigation',
      icon: <Terminal size={14} className="text-terminal-cyan" />,
      action: () => {
        const el = document.getElementById('services');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'articles',
      label: 'Research Articles & Publications',
      category: 'Navigation',
      icon: <BookOpen size={14} className="text-terminal-cyan" />,
      action: () => {
        const el = document.getElementById('blog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'contact',
      label: 'Contact & Terminal Decryption',
      category: 'Navigation',
      icon: <Mail size={14} className="text-terminal-green" />,
      action: () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'chat',
      label: 'Launch Ruby AI Assistant',
      category: 'AI Assistant',
      icon: <Sparkles size={14} className="text-terminal-cyan" />,
      action: () => {
        navigate('/chat');
        onClose();
      }
    },
    {
      id: 'copy-email',
      label: 'Copy Email Address (derickmokua@outlook.com)',
      category: 'Actions',
      icon: copied ? <Check size={14} className="text-terminal-green" /> : <Mail size={14} className="text-terminal-green" />,
      action: () => {
        navigator.clipboard.writeText('derickmokua@outlook.com');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          onClose();
        }, 1200);
      }
    },
    {
      id: 'github',
      label: 'Open GitHub Profile',
      category: 'External',
      icon: <ExternalLink size={14} className="text-terminal-muted" />,
      action: () => {
        window.open('https://github.com/derickmokua', '_blank');
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-terminal-card border border-terminal-green/30 rounded-xl shadow-2xl overflow-hidden animate-fade-slide-in flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="h-9 bg-[#08090E] border-b border-terminal-green/15 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-terminal-green font-bold uppercase tracking-widest">
              COMMAND_PALETTE // CTRL+K
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-terminal-muted hover:text-white transition-colors p-1"
            title="Close (Esc)"
          >
            <X size={14} />
          </button>
        </div>

        {/* Input */}
        <div className="p-3 border-b border-white/10 flex items-center gap-3 bg-[#08090E]/50">
          <Search size={16} className="text-terminal-green flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, section, or action..."
            className="w-full bg-transparent text-sm text-white placeholder-terminal-muted/60 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] text-terminal-muted bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-terminal-muted">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center justify-between transition-colors text-xs ${
                  selectedIndex === idx
                    ? 'bg-terminal-green/15 text-white border border-terminal-green/30'
                    : 'text-terminal-text/80 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-[#08090E]">
                    {cmd.icon}
                  </div>
                  <span className="font-medium font-sans text-xs">{cmd.label}</span>
                </div>
                <span className="text-[9px] text-terminal-muted/70 uppercase tracking-wide">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#08090E] flex items-center justify-between text-[10px] text-terminal-muted">
          <div className="flex items-center gap-2">
            <span>Navigate: <kbd className="px-1 bg-white/5 rounded">↑</kbd> <kbd className="px-1 bg-white/5 rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 bg-white/5 rounded">↵</kbd></span>
          </div>
          <span>Derick Mokua // Portfolio</span>
        </div>
      </div>
    </div>
  );
}
