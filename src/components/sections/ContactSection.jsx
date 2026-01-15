import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Zap } from 'lucide-react';
import WhatsappIcon from '../ui/WhatsappIcon';

const ContactSection = ({ variants, formData, handleInputChange, handleFormSubmit, formStatus }) => (
  <motion.section id="contact" className="portfolio-section relative py-20 px-4 scroll-mt-20" variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
    <div className="max-w-5xl mx-auto">
      <div className="mb-8"><div className="text-blue-400 mb-2">┌──(derick㉿kali)-[~/contact]</div><div className="text-green-400 mb-4">└─$ ./connect.sh</div></div>
      <div className="border border-cyan-500/30 p-8 shadow-2xl glass-enhanced rounded-lg relative overflow-hidden">
        <div className="corner-accent top-left" />
        <div className="corner-accent top-right" />
        <div className="corner-accent bottom-left" />
        <div className="corner-accent bottom-right" />
        <p className="text-xl mb-6 text-gray-300"><span className="text-cyan-400">&gt;&gt;</span> Ready to collaborate? Send a transmission.</p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="name@host" value={formData.name} onChange={handleInputChange} required className="form-input-cyber w-full p-3 rounded-md text-white" />
            <input type="email" name="email" placeholder="your-email@domain.com" value={formData.email} onChange={handleInputChange} required className="form-input-cyber w-full p-3 rounded-md text-white" />
          </div>
          <textarea name="message" placeholder="Message..." value={formData.message} onChange={handleInputChange} required rows="5" className="form-input-cyber w-full p-3 rounded-md text-white"></textarea>
          <div className="flex items-center justify-between">
            <button type="submit" className="cyber-button px-6 py-2 rounded-md font-bold transition-all duration-300 shadow-lg flex items-center gap-2">
              <Zap size={16} /> SEND TRANSMISSION
            </button>
            {formStatus && <p className={`text-sm ${formStatus.includes('complete') ? 'text-green-400' : 'text-yellow-400'}`}>{formStatus}</p>}
          </div>
        </form>
        <div className="mt-8 pt-6 border-t border-cyan-500/20 flex justify-center gap-6">
          <a href="mailto:contact@derickmokua.dev" className="relative group text-gray-400 hover:text-cyan-400 transition-colors duration-300"><Mail /><span className="tooltip">Email</span></a>
          <a href="https://github.com/derickmokua" target="_blank" rel="noopener noreferrer" className="relative group text-gray-400 hover:text-cyan-400 transition-colors duration-300"><Github /><span className="tooltip">GitHub</span></a>
          <a href="https://www.linkedin.com/in/derick-mokua-b05165369" target="_blank" rel="noopener noreferrer" className="relative group text-gray-400 hover:text-cyan-400 transition-colors duration-300"><Linkedin /><span className="tooltip">LinkedIn</span></a>
          <a href="https://api.whatsapp.com/send?phone=254735122178" target="_blank" rel="noopener noreferrer" className="relative group text-gray-400 hover:text-cyan-400 transition-colors duration-300"><WhatsappIcon /><span className="tooltip">WhatsApp</span></a>
        </div>
      </div>
    </div>
  </motion.section>
);

export default ContactSection;
