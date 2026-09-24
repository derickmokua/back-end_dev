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
        className="w-full max-w-2xl bg-[#181818] border border-[#343434] rounded-xl p-6 max-h-[85vh] overflow-y-auto cursor-default font-mono shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#343434] pb-4 mb-4 select-none">
          <div>
            <span className="text-[10px] text-[#FF3B45] font-bold tracking-wider">{post.date} // Publication Record</span>
            <h3 className="text-base md:text-lg font-bold text-white mt-1 font-sans">{post.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close article modal"
            className="p-1.5 text-[#A4A4A0] hover:text-white border border-[#343434] hover:border-[#FF3B45] rounded-lg transition-colors focus:outline-none"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content body */}
        <div className="text-xs md:text-sm text-[#F5F5F3] leading-relaxed space-y-4 ruby-message max-w-none font-sans">
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
        <div className="mt-6 pt-4 border-t border-[#343434] flex flex-wrap gap-1.5 select-none">
          {post.tags?.map((tag) => (
            <span key={tag} className="text-[10px] px-2.5 py-1 rounded-md bg-[#202020] border border-[#343434] text-[#A4A4A0] font-mono">
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
