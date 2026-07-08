import React from 'react';
import MatrixRain from './MatrixRain';

export default function TerminalWindow({ children }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden selection:bg-terminal-green selection:text-black font-mono">
      {/* Background Matrix Rain */}
      <MatrixRain />
      
      {/* Desktop Window Container */}
      <div className="absolute inset-0 md:inset-6 lg:inset-10 xl:inset-y-12 xl:inset-x-32 2xl:inset-y-16 2xl:inset-x-64 pointer-events-none flex flex-col z-0">
        
        {/* Terminal Window Frame */}
        <div className="flex-1 pointer-events-auto bg-terminal-bg/95 backdrop-blur-md md:rounded-lg border-x border-b border-t-0 md:border-t border-terminal-green/30 md:shadow-[0_0_40px_rgba(0,255,159,0.15)] flex flex-col overflow-hidden relative">
          
          {/* Linux Terminal Top Bar */}
          <div className="h-8 bg-black/90 border-b border-terminal-green/20 flex items-center justify-between px-3 select-none flex-shrink-0 z-50">
            {/* Window Controls */}
            <div className="flex gap-2 items-center opacity-70">
              <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500 hover:bg-red-500 transition-colors cursor-pointer shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500 hover:bg-yellow-500 transition-colors cursor-pointer shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500 hover:bg-green-500 transition-colors cursor-pointer shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            </div>
            
            {/* Window Title */}
            <div className="text-[10px] md:text-xs text-terminal-muted font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm bg-terminal-green animate-pulse"></span>
              visitor@mokua-host: ~
            </div>
            
            {/* Spacer for symmetry */}
            <div className="w-[44px]"></div>
          </div>
          
          {/* Scrollable Main Content */}
          <div id="terminal-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-terminal-green/20 scrollbar-track-transparent relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
