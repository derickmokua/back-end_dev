import React, { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Cpu, Github, Mail, Smartphone } from "lucide-react";

export default function DecryptGame({ isUnlockedInitially, onUnlocked }) {
  const [stage, setStage] = useState(isUnlockedInitially ? "unlocked" : "locked");
  const [puzzleWord, setPuzzleWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [hintsLeft, setHintsLeft] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [decryptionProgress, setDecryptionProgress] = useState(0);

  const secretWord = "ZERO_TRUST";
  const scrambledList = [
    "E_RZT_SRTOU",
    "U_EZS_TROTR",
    "R_ZOT_STUER",
    "T_RUZ_SEOTT",
  ];

  useEffect(() => {
    // Generate static scrambled representation
    setPuzzleWord(scrambledList[Math.floor(Math.random() * scrambledList.length)]);
  }, []);

  const handleBypass = () => {
    setFeedback("[!] Decryption bypassed. Standard access override...");
    setStage("decrypting");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDecryptionProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setStage("unlocked");
        onUnlocked();
      }
    }, 100);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (userGuess.trim().toUpperCase() === secretWord) {
      setFeedback("[+] Decryption Key verified. Access granted.");
      setStage("decrypting");

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setDecryptionProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setStage("unlocked");
          onUnlocked();
        }
      }, 60);
    } else {
      setFeedback("[-] Incorrect key string. Decryption failed.");
      setUserGuess("");
      setHintsLeft((h) => Math.max(0, h - 1));
    }
  };

  if (stage === "locked") {
    return (
      <div className="bg-black/80 border border-red-500/30 rounded-lg p-5 flex flex-col justify-center space-y-4 glow-border-red font-mono text-xs">
        <div className="flex items-center gap-2 text-red-400 font-bold border-b border-red-500/10 pb-2 mb-1 uppercase tracking-wider">
          <ShieldAlert size={16} className="animate-pulse" />
          <span>ACCESS_BLOCKED: Encrypted_Node</span>
        </div>

        <p className="text-terminal-muted leading-relaxed text-[11px]">
          Derick's contact coordinates are locked behind a cryptographic integrity check. Decrypt the key below or bypass to unlock details.
        </p>

        <div className="bg-red-500/5 border border-red-500/20 rounded p-3 text-center my-1.5">
          <span className="text-[10px] text-terminal-muted block mb-1">SCRAMBLED CIPHERTEXT</span>
          <span className="text-sm font-bold text-red-400 tracking-widest uppercase">
            {puzzleWord}
          </span>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="block text-[9px] text-red-400 uppercase font-bold mb-1">
              Enter Key Phrase (Hint: Z _ R _  _ R _ S _)
            </label>
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="ENTER DECRYPTION KEY"
              className="w-full bg-black border border-red-500/25 rounded px-3 py-2 text-white placeholder-red-500/20 focus:outline-none focus:border-red-500 transition-all font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-red-950/20 border border-red-500/30 hover:bg-red-500 hover:text-black font-bold uppercase rounded transition-all text-[11px]"
            >
              Verify Key
            </button>
            <button
              type="button"
              onClick={handleBypass}
              className="flex-1 py-1.5 bg-black border border-terminal-cyan/20 hover:border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/5 font-bold uppercase rounded transition-all text-[11px]"
            >
              Override Byp.
            </button>
          </div>
        </form>

        {feedback && (
          <p className="text-[10px] font-bold text-center text-red-400 animate-pulse mt-2">
            {feedback}
          </p>
        )}
      </div>
    );
  }

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
        <p className="text-[10px] text-terminal-muted animate-pulse">{feedback}</p>
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
