import React from 'react';

export default function TerminalSection({ id, command = "visitor@derick-host: ~", children, className = "" }) {
  return (
    <section id={id} className={`w-full bg-terminal-card/90 backdrop-blur-md rounded-xl border border-terminal-green/20 shadow-[0_0_25px_rgba(0,255,159,0.04)] flex flex-col overflow-hidden relative ${className}`}>
      
      {/* Linux Terminal Top Bar */}
      <div className="h-9 bg-[#08090E] border-b border-terminal-green/15 flex items-center justify-between px-4 select-none flex-shrink-0 z-10 relative">
        {/* Window Controls */}
        <div className="flex gap-2 items-center opacity-80">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-500/90 shadow-[0_0_6px_rgba(239,68,68,0.4)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-500/90 shadow-[0_0_6px_rgba(234,179,8,0.4)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-500/90 shadow-[0_0_6px_rgba(0,255,159,0.4)]"></div>
        </div>
        
        {/* Window Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-16">
          <span className="text-[10px] text-terminal-muted font-mono font-bold tracking-wider truncate">
            {command}
          </span>
        </div>
        
        {/* Spacer for symmetry */}
        <div className="w-[36px] invisible" />
      </div>
      
      {/* Scrollable Main Content */}
      <div className="p-6 md:p-8 relative z-0">
        {children}
      </div>
    </section>
  );
}
