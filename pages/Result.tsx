
import { GoogleGenAI, Type } from "@google/genai";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Share2, Heart, ShieldAlert, Leaf, CheckCircle2, ChevronRight, Info, Sparkles, Zap, Beaker, Globe, ListChecks, Award, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { fetchProductData } from '../services/off';
import { analyzeProduct } from '../services/gemini';
import ScoreRing from '../components/ScoreRing';
import LoadingAudit from '../components/LoadingAudit';
import ShareModal from '../components/ShareModal';
import { Product, AIAnalysis } from '../types';

const Result: React.FC = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'health' | 'eco' | 'nutrition'>('health');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const addScan = useStore((state) => state.addScan);
  const setCurrentProduct = useStore((state) => state.setCurrentProduct);
  const setCurrentAnalysis = useStore((state) => state.setCurrentAnalysis);
  const setChatOpen = useStore((state) => state.setChatOpen);
  const product = useStore((state) => state.currentProduct);
  const analysis = useStore((state) => state.currentAnalysis);

  const containerRef = useRef<HTMLDivElement>(null);
  const alternativeRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -40]);

  useEffect(() => {
    if (!barcode) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const offData = await fetchProductData(barcode);
        if (!offData) {
          setError("Product not found in database.");
          setLoading(false);
          return;
        }

        setCurrentProduct(offData);
        addScan(offData);

        const aiData = await analyzeProduct(offData);
        setCurrentAnalysis(aiData);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze product.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [barcode]);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/###/g, '');

  const scrollToAlternative = () => {
    setActiveTab('eco');
    setTimeout(() => {
      alternativeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleExpertInfo = () => {
    const prompt = `Can you explain the nutrition and eco-impact of ${product?.name} in more detail? I see it has a health grade of ${product?.healthGrade} and eco grade of ${product?.ecoGrade}. What do these actually mean for me?`;
    setChatOpen(true, prompt);
  };

  const handleExploreSwaps = () => {
    if (!analysis?.alternative || !product) return;
    const prompt = `I'm interested in the alternative you suggested: "${analysis.alternative.name}". 
    Compared to ${product.name}, why is this a better choice? Can you suggest 2-3 other similar high-quality swaps I should look for?`;
    setChatOpen(true, prompt);
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: `Eco-Audit: ${product.name}`,
      text: `Check out the eco-audit for ${product.name} on Eco-Scan! Health Grade: ${product.healthGrade}, Eco Grade: ${product.ecoGrade}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const getConcernReason = (ingName: string) => {
    return analysis?.concerningIngredients?.find(ci => 
      ingName.toLowerCase().includes(ci.name.toLowerCase()) || 
      ci.name.toLowerCase().includes(ingName.toLowerCase())
    );
  };

  if (loading) {
    return <LoadingAudit />;
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center flex flex-col items-center gap-8">
        <div className="w-20 h-20 bg-rose-50 rounded-[30px] flex items-center justify-center text-rose-500 shadow-xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Analysis Error</h2>
          <p className="text-slate-500 font-medium">{error || "Product information unavailable."}</p>
        </div>
        <Link to="/scan" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">
          New Scan
        </Link>
      </div>
    );
  }

  const nutritionalRows = [
    { label: 'Energy', val: product.nutriments?.energy_value, unit: product.nutriments?.energy_unit || 'kcal' },
    { label: 'Fats', val: product.nutriments?.fat_100g, unit: 'g' },
    { label: 'Saturated Fats', val: product.nutriments?.['saturated-fat_100g'], unit: 'g' },
    { label: 'Carbohydrates', val: product.nutriments?.carbohydrates_100g, unit: 'g' },
    { label: 'Sugars', val: product.nutriments?.sugars_100g, unit: 'g' },
    { label: 'Proteins', val: product.nutriments?.proteins_100g, unit: 'g' },
    { label: 'Fiber', val: product.nutriments?.fiber_100g, unit: 'g' },
    { label: 'Salt', val: product.nutriments?.salt_100g, unit: 'g' },
  ];

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-12 pb-24 relative">
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        product={product} 
      />

      {/* Decorative Stickers based on scores */}
      <AnimatePresence>
        {product.healthGrade === 'A' && (
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -10 }}
            className="absolute -top-10 -right-4 z-10 bg-white p-4 rounded-3xl shadow-2xl border border-emerald-50 pointer-events-none hidden lg:flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-2">
               <Award className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Nutrition Pro</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft className="w-4 h-4 text-emerald-500" />
          Dashboard
        </Link>
        <div className="flex gap-2.5">
          <button 
            onClick={handleShare}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all active:scale-95"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-all active:scale-95">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Product Visual Area */}
        <div className="lg:col-span-5">
          <motion.div 
            style={{ y: yParallax }}
            className="relative"
          >
            <div className="aspect-square rounded-[48px] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] p-12 flex items-center justify-center group overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-6 left-6">
                 <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase">Verified Audit</span>
              </div>
              
              {/* Decorative sparkle */}
              <div className="absolute bottom-6 right-6 opacity-30">
                <Sparkles className="w-12 h-12 text-emerald-300 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info & Data Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{product.brand}</p>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">{product.name}</h1>
            </div>
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-md border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Grade</span>
              <span className={`text-2xl font-black leading-none ${
                ['A', 'B'].includes(product.healthGrade) ? 'text-emerald-500' : 'text-rose-500'
              }`}>{product.healthGrade}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <ScoreRing 
              score={analysis?.healthScore || 50} 
              grade={product.healthGrade} 
              label="Nutritional Score" 
              color="#10b981" 
            />
            <ScoreRing 
              score={analysis?.ecoScore || 50} 
              grade={product.ecoGrade} 
              label="Environmental Impact" 
              color="#0ea5e9" 
            />
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex bg-slate-50/80 p-1.5 m-2.5 rounded-[22px]">
              {[
                { id: 'health', icon: Beaker, label: 'Audit' },
                { id: 'nutrition', icon: ListChecks, label: 'Facts' },
                { id: 'eco', icon: Globe, label: 'Eco' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-black rounded-[18px] transition-all ${
                    activeTab === tab.id ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {activeTab === 'health' && (
                    <div className="space-y-8">
                      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-5 h-5 text-emerald-600" />
                          <h4 className="font-black text-slate-900">AI Health Insights</h4>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {analysis?.healthInsight ? cleanText(analysis.healthInsight) : "Generating analysis..."}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingredient Profile</h5>
                        <div className="flex flex-wrap gap-2">
                          {product.ingredients.length > 0 ? (
                            product.ingredients.slice(0, 20).map((ing, i) => {
                              const concern = getConcernReason(ing);
                              return (
                                <div key={i} className="group relative inline-block">
                                  <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-default flex items-center gap-1.5 ${
                                    concern 
                                      ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200'
                                  }`}>
                                    {ing}
                                    {concern && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                                  </span>
                                  {concern && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                      <div className="text-rose-400 uppercase tracking-wider mb-1 font-black">Warning</div>
                                      {concern.reason}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-slate-400 text-xs italic">No detailed ingredients available.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'nutrition' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nutritionalRows.map((row, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-colors">
                          <span className="text-xs font-bold text-slate-500">{row.label}</span>
                          <span className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{row.val !== undefined ? `${row.val}${row.unit}` : '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'eco' && (
                    <div className="space-y-8">
                      <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Leaf className="w-5 h-5 text-sky-600" />
                          <h4 className="font-black text-slate-900">Environmental Impact</h4>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {analysis?.sustainabilityInsight ? cleanText(analysis.sustainabilityInsight) : "Calculating footprint..."}
                        </p>
                      </div>

                      {analysis?.alternative && (
                        <div ref={alternativeRef} className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
                          <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Recommended Alternative</span>
                            </div>
                            <h3 className="text-2xl font-black">{analysis.alternative.name}</h3>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed">{cleanText(analysis.alternative.reason)}</p>
                            <motion.button 
                              whileTap={{ scale: 0.95 }}
                              onClick={handleExploreSwaps}
                              className="flex items-center gap-2 text-white font-black text-[11px] uppercase tracking-widest pt-2 hover:text-emerald-400 transition-colors group"
                            >
                              Explore Swaps <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
                          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Action Footer */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={scrollToAlternative}
              className="flex flex-col items-start gap-1 p-5 bg-white border border-slate-200 rounded-[28px] hover:border-emerald-500 transition-all group shadow-sm active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-black text-slate-400 uppercase">Upgrade Choice</span>
              <span className="text-sm font-black text-slate-800">Better Alternatives</span>
            </button>
            <button 
              onClick={handleExpertInfo}
              className="flex flex-col items-start gap-1 p-5 bg-white border border-slate-200 rounded-[28px] hover:border-blue-500 transition-all group shadow-sm active:scale-95 text-left"
            >
              <Info className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[10px] font-black text-slate-400 uppercase">Expert Info</span>
              <span className="text-sm font-black text-slate-800">Learn More</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;
