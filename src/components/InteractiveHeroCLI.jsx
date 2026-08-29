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
      <form onSubmit={handleCommand} className="flex items-center gap-2 bg-[#08090E] border border-terminal-green/25 rounded-lg px-3 py-2 text-xs text-white">
        <span className="text-terminal-green flex items-center gap-1 font-bold">
          <Terminal size={13} />
          <span>$</span>
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try typing 'help', 'skills', 'projects', or 'whoami'..."
          className="w-full bg-transparent text-xs text-terminal-text placeholder-terminal-muted/50 focus:outline-none"
        />
        <button
          type="submit"
          className="px-2 py-0.5 bg-terminal-green/10 hover:bg-terminal-green text-terminal-green hover:text-black rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
        >
          <CornerDownLeft size={11} />
          <span className="hidden sm:inline">Exec</span>
        </button>
      </form>

      {/* Quick click suggestions */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-terminal-muted select-none">
        <span className="text-terminal-green/70">Quick Commands:</span>
        {['whoami', 'skills', 'projects', 'uptime'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => runQuick(item)}
            className="px-2 py-0.5 bg-white/5 hover:bg-terminal-green/10 border border-white/10 hover:border-terminal-green/30 text-terminal-text hover:text-terminal-green rounded transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Output Console Box */}
      {output && (
        <div className="p-3 bg-[#08090E] border-l-2 border-terminal-green rounded-r-lg text-xs text-terminal-cyan leading-relaxed animate-fade-in">
          <span className="text-terminal-green font-bold mr-2">&gt;&gt;</span>
          {output}
        </div>
      )}
    </div>
  );
}
