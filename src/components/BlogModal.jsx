import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

export default function BlogModal({ post, onClose }) {
  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 cursor-zoom-out"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-terminal-card border border-terminal-green/30 rounded-lg p-6 max-h-[85vh] overflow-y-auto cursor-default font-mono glow-border-green"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-terminal-green/10 pb-4 mb-4 select-none">
          <div>
            <span className="text-[10px] text-terminal-cyan font-bold">{post.date} // Article Record</span>
            <h3 className="text-sm md:text-base font-bold text-white mt-1">{post.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-terminal-muted hover:text-white border border-terminal-green/10 rounded focus:outline-none"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div className="text-xs md:text-sm text-terminal-text/90 leading-relaxed space-y-4 ruby-message max-w-none">
          {post.html ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  marked.parse(post.html, { breaks: true, gfm: true })
                )
              }}
            />
          ) : post.content ? (
            post.content.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>Content unavailable.</p>
          )}
        </div>

        {/* Tags footer */}
        <div className="mt-6 pt-4 border-t border-terminal-green/10 flex flex-wrap gap-1.5 select-none">
          {post.tags?.map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-black border border-terminal-cyan/15 text-terminal-cyan">
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
