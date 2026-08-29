import React, { useRef, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';

const MatrixCanvas = ({ opacity = 0.20, scrollY }) => {
  const y = useTransform(scrollY, [0, 500], [0, -50]);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = new Array(columns).fill(1);

    const chars = '01あいうえおカクルシン✦✧';
    ctx.font = `${fontSize}px monospace`;

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < drops.length; i++) {
        const rand = Math.random();
        if (rand > 0.92) {
          ctx.fillStyle = '#EF4444';
        } else if (rand > 0.85) {
          ctx.fillStyle = '#B91C1C';
        } else {
          ctx.fillStyle = '#E63946';
        }
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      rafRef.current = requestAnimationFrame(render);
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    };

    window.addEventListener('resize', onResize);
    render();

    return () => {
      if(rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <motion.canvas ref={canvasRef} style={{y, opacity}} className="fixed inset-0 pointer-events-none z-0" />;
};

export default MatrixCanvas;
