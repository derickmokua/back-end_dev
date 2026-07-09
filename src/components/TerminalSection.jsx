import React from 'react';

export default function TerminalSection({ id, command = "visitor@mokua-host: ~", children }) {
  return (
    <section id={id} className="w-full bg-terminal-bg/85 backdrop-blur-md rounded-lg border border-terminal-green/30 shadow-[0_0_30px_rgba(0,255,159,0.05)] flex flex-col overflow-hidden relative glow-border-green">
      
      {/* Linux Terminal Top Bar */}
      <div className="h-8 bg-black/90 border-b border-terminal-green/20 flex items-center justify-between px-3 select-none flex-shrink-0 z-10 relative">
        {/* Window Controls */}
        <div className="flex gap-2 items-center opacity-70">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500 hover:bg-red-500 transition-colors cursor-pointer shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500 hover:bg-yellow-500 transition-colors cursor-pointer shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500 hover:bg-green-500 transition-colors cursor-pointer shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        </div>
        
        {/* Window Title — centered, generous left margin clears the traffic light dots */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{paddingLeft: '80px', paddingRight: '40px'}}>
          <span className="text-[9px] md:text-[10px] text-terminal-muted font-bold tracking-widest truncate">
            {command}
          </span>
        </div>
        
        {/* Spacer for symmetry (keeps traffic lights left-aligned) */}
        <div className="w-[44px] invisible" />
      </div>
      
      {/* Scrollable Main Content */}
      <div className="p-6 md:p-8 relative z-0">
        {children}
      </div>
    </section>
  );
}
