
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ScanLine, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';

const slides = [
  {
    icon: <Leaf className="w-12 h-12 text-emerald-500" />,
    title: "Welcome to Eco-Scan Pro",
    description: "Your AI-powered companion for navigating health and sustainability in every shopping aisle.",
    color: "bg-emerald-50",
    accent: "text-emerald-600"
  },
  {
    icon: <ScanLine className="w-12 h-12 text-blue-500" />,
    title: "Point. Scan. Reveal.",
    description: "Instantly audit any product by scanning its barcode. We decode labels so you don't have to.",
    color: "bg-blue-50",
    accent: "text-blue-600"
  },
  {
    icon: <Sparkles className="w-12 h-12 text-amber-500" />,
    title: "AI-Powered Intelligence",
    description: "Get deep insights into ingredients, carbon footprint, and discover healthier, greener alternatives.",
    color: "bg-amber-50",
    accent: "text-amber-600"
  }
];

const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const setHasSeenOnboarding = useStore((state) => state.setHasSeenOnboarding);
  const hasSeenOnboarding = useStore((state) => state.hasSeenOnboarding);

  if (hasSeenOnboarding) return null;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setHasSeenOnboarding(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[54px] shadow-[0_40px_80px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100"
      >
        <div className="p-10 md:p-14 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className={`w-24 h-24 ${slides[currentSlide].color} rounded-[32px] flex items-center justify-center mx-auto shadow-inner`}>
                {slides[currentSlide].icon}
              </div>
              
              <div className="space-y-4">
                <h2 className={`text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight`}>
                  {slides[currentSlide].title}
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 space-y-8">
            {/* Dots */}
            <div className="flex justify-center gap-2">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentSlide ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 transition-all group active:scale-95"
            >
              {currentSlide === slides.length - 1 ? (
                <>Start Auditing <CheckCircle2 className="w-6 h-6 text-emerald-400" /></>
              ) : (
                <>Continue <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            
            {currentSlide < slides.length - 1 && (
              <button 
                onClick={() => setHasSeenOnboarding(true)}
                className="text-slate-400 font-bold text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Skip Intro
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
