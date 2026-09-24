import React, { useState } from 'react';
import { Terminal, CornerDownLeft, Sparkles } from 'lucide-react';

export default function InteractiveHeroCLI({ onCommandExecuted }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'help') {
      setOutput('Available commands: skills, projects, contact, whoami, uptime, clear');
    } else if (cmd === 'skills') {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      setOutput('Navigating to // 02. SKILLS...');
    } else if (cmd === 'projects') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      setOutput('Navigating to // 03. PROJECTS...');
    } else if (cmd === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      setOutput('Navigating to // 07. CONTACT...');
    } else if (cmd === 'whoami') {
      setOutput('Derick Mokua — Backend Architect & AI Safety Researcher based in Nairobi, Kenya.');
    } else if (cmd === 'uptime') {
      setOutput('System Uptime: 99.98% // All Microservices Operating Normally.');
    } else if (cmd === 'clear') {
      setOutput(null);
    } else {
      setOutput(`Command not found: "${cmd}". Type "help" for a list of commands.`);
    }

    if (onCommandExecuted) onCommandExecuted(cmd);
    setInput('');
  };

  const runQuick = (commandName) => {
    setInput(commandName);
    const fakeEvent = { preventDefault: () => {} };
    // update state and execute
    setTimeout(() => {
      if (commandName === 'skills') {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        setOutput('Navigating to // 02. SKILLS...');
      } else if (commandName === 'projects') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setOutput('Navigating to // 03. PROJECTS...');
      } else if (commandName === 'whoami') {
        setOutput('Derick Mokua — Backend Architect & AI Safety Researcher based in Nairobi, Kenya.');
      }
      setInput('');
    }, 10);
  };

  return (
    <div className="pt-2 space-y-3 font-mono">
      {/* CLI Input form */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 bg-[#202020] border border-[#343434] focus-within:border-[#FF3B45] rounded-lg px-3 py-2 text-xs text-white transition-colors">
        <span className="text-[#FF3B45] flex items-center gap-1 font-bold">
          <Terminal size={13} />
          <span>$</span>
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try typing 'help', 'skills', 'projects', or 'whoami'..."
          aria-label="Terminal command prompt"
          className="w-full bg-transparent text-xs text-[#F5F5F3] placeholder-[#A4A4A0]/50 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Execute command"
          className="px-2.5 py-1 bg-[#FF3B45]/10 hover:bg-[#FF3B45] text-[#FF3B45] hover:text-white rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1 border border-[#FF3B45]/20"
        >
          <CornerDownLeft size={11} />
          <span className="hidden sm:inline">Exec</span>
        </button>
      </form>

      {/* Quick click suggestions */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#A4A4A0] select-none">
        <span className="text-[#A4A4A0]">Quick Commands:</span>
        {['whoami', 'skills', 'projects', 'uptime'].map((item) => (
          <button
            key={item}
            type="button"
            aria-label={`Run ${item} command`}
            onClick={() => runQuick(item)}
            className="px-2 py-0.5 bg-[#202020] hover:bg-[#FF3B45]/10 border border-[#343434] hover:border-[#FF3B45]/40 text-[#A4A4A0] hover:text-[#F5F5F3] rounded transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Output Console Box */}
      {output && (
        <div className="p-3 bg-[#202020] border-l-2 border-[#FF3B45] border-t border-r border-b border-[#343434] rounded-r-lg text-xs text-[#F5F5F3] leading-relaxed animate-fade-in">
          <span className="text-[#FF3B45] font-bold mr-2">&gt;&gt;</span>
          {output}
        </div>
      )}
    </div>
  );
}
