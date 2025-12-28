
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, ShieldCheck, Zap, Globe, Heart, Search, Award } from 'lucide-react';

const LoadingAudit: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Contacting OpenFoodFacts...",
    "Scanning ingredient database...",
    "Consulting Gemini AI experts...",
    "Analyzing carbon footprint...",
    "Finalizing your eco-report..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-8 text-center space-y-12 bg-white rounded-[60px] relative overflow-hidden">
      {/* Floating Animated Stickers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100"
        >
          <Leaf className="w-8 h-8 text-emerald-500" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [20, -20, 20], x: [10, -10, 10], rotate: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-[15%] w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100"
        >
          <Globe className="w-10 h-10 text-sky-500" />
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-40 right-[20%] w-12 h-12 bg-amber-50 rounded-[15px] flex items-center justify-center border border-amber-100"
        >
          <Sparkles className="w-6 h-6 text-amber-500" />
        </motion.div>

        <motion.div 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-[20%] w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100"
        >
          <Heart className="w-7 h-7 text-rose-400" />
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="relative">
          {/* Main Animated Scanner Box */}
          <div className="w-44 h-56 bg-white border-[6px] border-slate-100 rounded-[48px] shadow-2xl overflow-hidden relative">
            <motion.div 
              animate={{ top: ['-10%', '110%', '-10%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 w-full h-1.5 bg-emerald-500 shadow-[0_0_20px_#10b981] z-20"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 gap-6">
              <Zap className="w-14 h-14 text-emerald-950" />
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-emerald-950 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-950 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-950 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Floating 'Certified' Sticker */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: -15 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
            className="absolute -bottom-4 -right-8 bg-slate-900 text-white p-4 rounded-3xl shadow-xl flex flex-col items-center gap-1 border-4 border-white"
          >
            <Award className="w-6 h-6 text-emerald-400" />
            <span className="text-[8px] font-black uppercase tracking-widest">Eco Audit</span>
          </motion.div>
        </div>

        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Analyzing Product...</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= step ? 'bg-emerald-500' : 'bg-slate-200'} transition-colors duration-500`} />
                ))}
              </div>
            </div>
          </div>

          <div className="px-6">
            <div className="bg-slate-100 rounded-full h-3 w-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-3 text-slate-500 font-black text-lg"
            >
              <div className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg">
                <Search className="w-3 h-3 animate-spin" />
              </div>
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-emerald-50 px-8 py-4 rounded-[28px] border border-emerald-100 flex items-center gap-4 relative z-10"
      >
        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-left">
           <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none mb-1">Audit Protocol</p>
           <p className="text-sm font-bold text-emerald-800">Verifying ingredients via Gemini AI 3.0</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingAudit;
