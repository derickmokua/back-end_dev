import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Terminal, Cake, Gift } from 'lucide-react';

const BirthdayAnimation = ({ onComplete, HUDEnabled = true }) => {
  const canvasRef = useRef(null);
  const [showHUD, setShowHUD] = useState(HUDEnabled);
  const [terminalText, setTerminalText] = useState('');
  const textIndexRef = useRef(0);

  const fullGreetingText = `> INITIALIZING PROTOCOL: CAKE_DAY_GREETING\n> STATUS: SECURE CONNECTION ESTABLISHED\n> HOST: DERICK MOKUA\n> SYSTEM MESSAGE: Wishing you a brilliant, secure, and glitch-free birthday! Keep architecting resilient systems. Happy Birthday, Derick! 🎉`;

  // Typing effect inside HUD
  useEffect(() => {
    if (!showHUD) return;
    setTerminalText('');
    textIndexRef.current = 0;
    
    const interval = setInterval(() => {
      if (textIndexRef.current < fullGreetingText.length) {
        setTerminalText(fullGreetingText.slice(0, textIndexRef.current + 1));
        textIndexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [showHUD]);

  // Handle closing animation
  const handleClose = () => {
    setShowHUD(false);
    if (onComplete) {
      // Small timeout to allow HUD exit animation to play
      setTimeout(onComplete, 500);
    }
  };

  // Auto close HUD after 15 seconds, or clean up silent animation after 30 seconds
  useEffect(() => {
    if (HUDEnabled) {
      const timer = setTimeout(() => {
        handleClose();
      }, 15000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 30000); // 30 seconds for background-only animations
      return () => clearTimeout(timer);
    }
  }, [HUDEnabled, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Confetti particles logic
    class ConfettiParticle {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = Math.random() * w;
        // Start higher offscreen for gradual onset
        this.y = Math.random() * -h - 20; 
        this.vx = (Math.random() - 0.5) * 4; 
        this.vy = Math.random() * 4 + 3; // speed
        this.size = Math.random() * 8 + 6;
        this.color = this.getRandomGoldColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 6;
        this.opacity = Math.random() * 0.4 + 0.6;
        this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
      }

      getRandomGoldColor() {
        const golds = [
          '#e6b000', // gold-500
          '#ffd44d', // gold-300
          '#b38900', // gold-600
          '#ffc71a', // gold-400
          '#ffffff', // white sparkle highlights
          '#ffe080'  // gold-200
        ];
        return golds[Math.floor(Math.random() * golds.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // Sway / wind drift
        this.vx += Math.sin(this.y / 40) * 0.05;

        // Reset if goes offscreen bottom
        if (this.y > this.h + 20) {
          this.y = Math.random() * -50 - 10;
          this.x = Math.random() * this.w;
          this.vy = Math.random() * 4 + 3;
          this.vx = (Math.random() - 0.5) * 4;
        }
        // Wrap horizontally
        if (this.x < -10) this.x = this.w + 10;
        if (this.x > this.w + 10) this.x = -10;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        
        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Balloons logic
    class Balloon {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = Math.random() * w;
        this.y = h + Math.random() * 300 + 100; // start below
        this.vy = -(Math.random() * 1.3 + 0.8); // rise speed
        this.sizeX = Math.random() * 16 + 24; // width
        this.sizeY = this.sizeX * 1.25; // height
        this.color = this.getRandomGoldColor();
        this.swaySpeed = Math.random() * 0.012 + 0.006;
        this.swayAmp = Math.random() * 14 + 6;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.angle = 0;
        this.type = Math.random() > 0.45 ? 'cyber' : 'classic'; // 55% chance for cyber balloons
        this.cyberText = ['01', '10', 'EXE', 'SYS', 'CORE', 'SEC', 'AI', 'LOCK'][Math.floor(Math.random() * 8)];
      }

      getRandomGoldColor() {
        const golds = [
          'rgba(230, 176, 0, 0.85)', // gold-500
          'rgba(255, 212, 77, 0.85)', // gold-300
          'rgba(179, 137, 0, 0.85)', // gold-600
          'rgba(255, 199, 26, 0.85)'  // gold-400
        ];
        return golds[Math.floor(Math.random() * golds.length)];
      }

      update() {
        this.y += this.vy;
        this.angle += this.swaySpeed;
        this.xOffset = Math.sin(this.angle + this.swayOffset) * this.swayAmp;

        // Reset to bottom if goes high above screen
        if (this.y < -this.sizeY - 50) {
          this.y = this.h + Math.random() * 300 + 100;
          this.x = Math.random() * this.w;
          this.vy = -(Math.random() * 1.3 + 0.8);
          this.type = Math.random() > 0.45 ? 'cyber' : 'classic';
        }
      }

      draw(ctx) {
        const currentX = this.x + this.xOffset;
        ctx.save();
        ctx.translate(currentX, this.y);
        
        if (this.type === 'cyber') {
          // Cyber string (dashed golden line)
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(0, this.sizeY / 2);
          ctx.lineTo(0, this.sizeY / 2 + 55);
          ctx.strokeStyle = 'rgba(230, 176, 0, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]); // reset

          // Cyber Balloon: Hexagonal panel
          ctx.beginPath();
          const sides = 6;
          const rx = this.sizeX / 2;
          const ry = this.sizeY / 2;
          for (let i = 0; i <= sides; i++) {
            const rad = (i * Math.PI * 2) / sides - Math.PI / 6;
            const px = Math.cos(rad) * rx;
            const py = Math.sin(rad) * ry;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          // Dark translucent neon-accented body
          ctx.fillStyle = 'rgba(10, 8, 0, 0.85)';
          ctx.fill();
          ctx.strokeStyle = '#e6b000'; // main gold outline
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(230, 176, 0, 0.6)';
          ctx.stroke();

          // Draw interior tech ring
          ctx.beginPath();
          ctx.ellipse(0, 0, rx * 0.7, ry * 0.7, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(230, 176, 0, 0.3)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
          ctx.stroke();

          // Cyber security metrics labels
          ctx.fillStyle = '#ffc71a';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.cyberText, 0, 0);

          // Digital crosshair indicator
          ctx.fillStyle = 'rgba(230, 176, 0, 0.6)';
          ctx.fillRect(-rx, -1, 3, 2);
          ctx.fillRect(rx - 3, -1, 3, 2);
        } else {
          // Classic Balloon
          // Draw string
          ctx.beginPath();
          ctx.moveTo(0, this.sizeY / 2);
          ctx.bezierCurveTo(-5, this.sizeY / 2 + 15, 5, this.sizeY / 2 + 30, 0, this.sizeY / 2 + 50);
          ctx.strokeStyle = 'rgba(230, 176, 0, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Draw balloon body
          ctx.beginPath();
          ctx.ellipse(0, 0, this.sizeX / 2, this.sizeY / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(230, 176, 0, 0.2)';
          ctx.fill();

          // Knot
          ctx.beginPath();
          ctx.moveTo(0, this.sizeY / 2);
          ctx.lineTo(-4, this.sizeY / 2 + 5);
          ctx.lineTo(4, this.sizeY / 2 + 5);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();

          // 3D Highlight sheen
          ctx.beginPath();
          ctx.ellipse(-this.sizeX / 6, -this.sizeY / 6, this.sizeX / 10, this.sizeY / 10, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 45 : 90;
    const balloonCount = isMobile ? 7 : 15;

    const particles = Array.from({ length: particleCount }, () => new ConfettiParticle(width, height));
    const balloons = Array.from({ length: balloonCount }, () => new Balloon(width, height));

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render balloons behind confetti
      balloons.forEach((b) => {
        b.update();
        b.draw(ctx);
      });

      // Render confetti
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Confetti + Balloon canvas overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-40 bg-black/10"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Cyberpunk HUD overlay modal */}
      <AnimatePresence>
        {showHUD && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-black/90 border-2 border-gold-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(230,176,0,0.15)] overflow-hidden font-mono"
            >
              {/* Scanline pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-zinc-500 hover:text-gold-400 transition-colors bg-zinc-950/80 border border-zinc-800 rounded-md p-1 z-10"
                aria-label="Close Greeting"
              >
                <X size={16} />
              </button>

              {/* Header Info */}
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-5 text-gold-500">
                <div className="p-2 bg-gold-950/30 border border-gold-500/20 rounded-lg animate-pulse">
                  <Cake size={24} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500">BIRTHDAY SYSTEM PROTOCOL</div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    HAPPY_BIRTHDAY.sh <Sparkles size={14} className="text-gold-400 animate-spin" />
                  </h2>
                </div>
              </div>

              {/* Terminal Greeting Body */}
              <div className="bg-zinc-950/70 border border-zinc-900 rounded-lg p-4 min-h-[140px] text-sm leading-relaxed mb-6 font-mono text-zinc-300 whitespace-pre-wrap select-none overflow-y-auto max-h-[200px]">
                {terminalText}
                <span className="inline-block w-2 h-4 bg-gold-500 ml-1 animate-pulse" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 border border-gold-500/20 hover:border-gold-500/50 bg-gold-950/20 hover:bg-gold-500 hover:text-black font-bold rounded-lg text-xs md:text-sm tracking-widest text-gold-500 transition-all text-center uppercase"
                >
                  [ ACKNOWLEDGE ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BirthdayAnimation;
