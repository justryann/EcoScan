
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Mail, MessageCircle, Twitter, Link2, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = window.location.href;
  const shareText = `Check out the eco-audit for ${product.name} on Eco-Scan! Health Grade: ${product.healthGrade}, Eco Grade: ${product.ecoGrade}.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'bg-[#25D366]', 
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` 
    },
    { 
      name: 'X (Twitter)', 
      icon: Twitter, 
      color: 'bg-black', 
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` 
    },
    { 
      name: 'Email', 
      icon: Mail, 
      color: 'bg-slate-500', 
      href: `mailto:?subject=${encodeURIComponent(`Eco-Audit: ${product.name}`)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}` 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md bg-white rounded-[40px] shadow-2xl z-[80] overflow-hidden p-8 border border-slate-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Share Audit</h3>
              <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl mb-8 border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm">
                <img src={product.image} alt="" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-black text-slate-900 text-sm truncate">{product.name}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Health {product.healthGrade}</span>
                  <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-full">Eco {product.ecoGrade}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 ${option.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-active:scale-95`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{option.name}</span>
                </a>
              ))}
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full bg-slate-100 hover:bg-slate-200 py-5 rounded-2xl flex items-center justify-between px-6 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
                </div>
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                  {copied ? 'Link Copied!' : 'Copy Audit Link'}
                </span>
              </div>
              <Copy className={`w-4 h-4 ${copied ? 'text-emerald-500' : 'text-slate-300'} group-hover:text-slate-400`} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
