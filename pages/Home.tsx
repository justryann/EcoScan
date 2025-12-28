
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScanLine, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, ArrowUpRight, BarChart3 } from 'lucide-react';
import { useStore } from '../store';
import { getQuickTip } from '../services/gemini';
import { translations, LangKey } from '../services/translations';

const Home: React.FC = () => {
  const { history, language } = useStore();
  const lastScanned = history[0] || null;
  const [tip, setTip] = useState<string>('');

  const t = (key: LangKey) => translations[language][key] || key;

  useEffect(() => {
    getQuickTip().then(setTip);
  }, []);

  const totalScans = history.length;
  const healthChoices = history.filter(p => ['A', 'B'].includes(p.healthGrade?.toUpperCase())).length;
  const ecoChoices = history.filter(p => ['A', 'B'].includes(p.ecoGrade?.toUpperCase())).length;

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Audit
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tight"
          >
            {t('heroTitle1')} <span className="text-emerald-500">{t('heroTitle2')}</span>
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
        >
          <div className="flex -space-x-3 overflow-hidden p-1">
            {[24, 32, 45].map(i => (
              <img key={i} className="inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-2">{t('joinShoppers')}</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          className="lg:col-span-8 group relative"
        >
          <Link 
            to="/scan" 
            className="relative flex flex-col md:flex-row items-center justify-between w-full h-full min-h-[340px] p-10 md:p-14 bg-slate-900 dark:bg-black rounded-[48px] overflow-hidden shadow-2xl transition-all border border-slate-800"
          >
            <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                <Zap className="w-3 h-3 fill-emerald-400" />
                Real-time Analysis
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]">{t('newProductAudit')}</h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-sm leading-relaxed">{t('auditDescription')}</p>
            </div>

            <div className="relative z-10">
              <div className="w-32 h-32 md:w-44 md:h-44 bg-emerald-500 rounded-[40px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <ScanLine className="w-14 h-14 md:w-20 md:h-20" />
              </div>
            </div>

            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[110px] animate-pulse"></div>
          </Link>
        </motion.div>

        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Health Score</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">{healthChoices} {t('goodChoices')}</h3>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: totalScans ? `${(healthChoices / totalScans) * 100}%` : '0%' }}
                  className="bg-emerald-500 h-full rounded-full" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-emerald-600 p-8 rounded-[40px] border border-emerald-500 shadow-xl flex flex-col justify-between text-white overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-1">{t('totalImpact')}</p>
                <h3 className="text-3xl font-black leading-tight">Saving Planet <br />One Scan Away</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[48px] shadow-sm flex flex-col h-full"
        >
          <div className="flex justify-between items-start mb-8">
            <h4 className="font-black text-2xl text-slate-900 dark:text-white">{t('recentAudit')}</h4>
          </div>
          
          {lastScanned ? (
            <div className="flex items-center gap-6 mt-auto">
              <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 rounded-[32px] p-4 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                <img src={lastScanned.image} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" alt="" />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">{lastScanned.brand}</p>
                <h5 className="font-black text-xl text-slate-800 dark:text-white leading-tight mb-3 line-clamp-1">{lastScanned.name}</h5>
                <div className="flex gap-3">
                   <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-black">Grade {lastScanned.healthGrade}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
               <p className="text-slate-400 font-medium">{t('emptyJournal')}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 p-10 rounded-[48px] flex flex-col justify-center gap-6 relative"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-emerald-600 rounded-[20px] flex items-center justify-center text-white">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight">{t('dailyWisdom')}</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed font-bold italic">
            "{tip || '...'}"
          </p>
          <button 
            onClick={() => getQuickTip().then(setTip)} 
            className="text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center gap-2"
          >
            {t('refresh')} <TrendingUp className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
