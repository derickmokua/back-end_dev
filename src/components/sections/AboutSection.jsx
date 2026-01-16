import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = ({ variants }) => (
  <motion.section id="about" className="portfolio-section relative py-20 px-4 scroll-mt-20" variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
    <div className="max-w-5xl mx-auto">
      <div className="mb-8"><div className="text-blue-400 mb-2">┌──(derick㉿kali)-[~/about]</div><div className="text-green-400 mb-4">└─$ cat README.md</div></div>
      <div className="border border-cyan-500/30 p-6 mb-8 shadow-xl glass-enhanced rounded-lg hover:border-cyan-400/50 transition-all duration-500 relative overflow-hidden">
        <div className="corner-accent top-left" />
        <div className="corner-accent top-right" />
        <div className="corner-accent bottom-left" />
        <div className="corner-accent bottom-right" />
        <div className="mb-4"><span className="text-purple-400"># ABOUT_ME</span></div>
        <p className="text-gray-300 leading-relaxed mb-4"><span className="text-cyan-400">&gt;&gt;</span> Most systems work until they’re pushed. I build them to stand their ground.</p>
        <p className="text-gray-300 leading-relaxed"><span className="text-cyan-400">&gt;&gt;</span> I’m a backend engineer in Nairobi focused on two things: speed and security. From low-level network hardening to scaling AI integrations, I make sure your architecture is as unassailable as it is fast. My go-to tools are Node.js, Python, PostgreSQL, and Docker.</p>
      </div>
    </div>
  </motion.section>
);

export default AboutSection;