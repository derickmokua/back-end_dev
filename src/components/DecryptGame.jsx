import React, { useState, useEffect } from "react";
import { ShieldCheck, Cpu, Github, Mail, Smartphone } from "lucide-react";

export default function DecryptGame({ isUnlockedInitially, onUnlocked }) {
  const [stage, setStage] = useState(isUnlockedInitially ? "unlocked" : "decrypting");
  const [decryptionProgress, setDecryptionProgress] = useState(0);

  useEffect(() => {
    if (stage === "decrypting") {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setStage("unlocked");
          if (onUnlocked) onUnlocked();
        }
        setDecryptionProgress(progress);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage, onUnlocked]);

  if (stage === "decrypting") {
    return (
      <div className="bg-black/80 border border-terminal-cyan/30 rounded-lg p-6 flex flex-col justify-center items-center space-y-4 glow-border-cyan font-mono text-xs text-center min-h-[220px]">
        <Cpu className="text-terminal-cyan animate-spin" size={26} />
        <div>
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Executing Decrypt sequence</h3>
          <span className="text-[9px] text-terminal-cyan font-bold block mt-1">ALIGNING CRYPTO_MATRIX: {decryptionProgress}%</span>
        </div>
        <div className="w-48 bg-black border border-terminal-cyan/25 h-1.5 rounded overflow-hidden mt-1">
          <div
            className="bg-terminal-cyan h-full rounded transition-all duration-100"
            style={{ width: `${decryptionProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-terminal-muted animate-pulse">[+] Overriding security protocols...</p>
      </div>
    );
  }

  return (
    <div className="bg-black/60 border border-terminal-green/30 rounded-lg p-5 flex flex-col justify-center space-y-4 glow-border-green font-mono text-xs">
      <div className="flex items-center gap-2 text-terminal-green font-bold border-b border-terminal-green/10 pb-2 mb-1 uppercase tracking-wider">
        <ShieldCheck size={16} className="animate-pulse" />
        <span>AUTHENTICATION_PASSED: Access_Granted</span>
      </div>

      <p className="text-terminal-muted leading-relaxed text-[11px]">
        Secure handshake tunnel opened. You can now establish contact directly with Derick using these unlocked coordinates.
      </p>

      <div className="space-y-3.5 text-xs text-terminal-text/90 pl-1">
        <a
          href="mailto:derickmokua@outlook.com"
          className="flex items-center gap-2.5 hover:text-terminal-green transition-all group"
        >
          <Mail size={15} className="text-terminal-green group-hover:scale-105 transition-transform" />
          <span>derickmokua@outlook.com</span>
        </a>
        <a
          href="https://github.com/derickmokua"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 hover:text-terminal-green transition-all group"
        >
          <Github size={15} className="text-terminal-green group-hover:scale-105 transition-transform" />
          <span>github.com/derickmokua</span>
        </a>
        <a
          href="tel:+254716883375"
          className="flex items-center gap-2.5 hover:text-terminal-green transition-all group"
        >
          <Smartphone size={15} className="text-terminal-green group-hover:scale-105 transition-transform" />
          <span>+254 716 883 375</span>
        </a>
      </div>
    </div>
  );
}
