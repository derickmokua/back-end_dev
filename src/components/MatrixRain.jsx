import React, { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters - only 0s and 1s
    const chars = "01";
    const charArray = chars.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // Start at random negative y to stagger
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      // Draw semi-transparent black background to create trail effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.05)"; // matches --terminal-bg slightly
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff9f"; // matches --terminal-green
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Randomly make some characters cyan for the terminal aesthetic
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#00e5ff";
        } else {
          ctx.fillStyle = "#00ff9f";
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      // Stop animating if user prefers reduced motion, draw once as a texture
      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
      // If reduced motion, just fill a static frame instantly
      for (let i = 0; i < 50; i++) draw();
    } else {
      const animationId = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resizeCanvas);
      };
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 bg-terminal-bg opacity-10 md:opacity-15 transition-opacity duration-1000"
    />
  );
}
