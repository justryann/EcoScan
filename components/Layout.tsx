
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ScanLine, History, Search, Leaf, User, X, Moon, Sun, Languages, Settings, Key, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { translations, LangKey } from '../services/translations';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, theme, setLanguage, setTheme } = useStore();
  const [searchValue, setSearchValue] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = (key: LangKey) => translations[language][key] || key;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navItems = [
    { icon: Home, label: t('dashboard'), path: '/' },
    { icon: ScanLine, label: t('newScan'), path: '/scan' },
    { icon: History, label: t('journal'), path: '/history' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  const handleKeySelect = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFC] dark:bg-slate-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 px-6 py-4 flex items-center justify-center shadow-sm">
        <div className="w-full max-w-7xl flex items-center justify-between gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-emerald-600 text-2xl tracking-tight group">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <Leaf className="w-6 h-6 md:w-7 md:h-7 fill-emerald-500 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <span className="hidden sm:inline dark:text-emerald-400">Eco<span className="text-slate-900 dark:text-white font-black">Scan</span></span>
          </Link>

          <nav className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs md:text-sm whitespace-nowrap ${
                    isActive ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                  isSettingsOpen 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">{t('settings')}</span>
              </button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 z-10" />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-20 space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400">
                          <Languages className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('language')}</span>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                          {(['en', 'fr'] as const).map(lang => (
                            <button 
                              key={lang}
                              onClick={() => setLanguage(lang)}
                              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${language === lang ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                            >
                              {lang === 'en' ? 'English' : 'Français'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400">
                          <Settings className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('theme')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(['light', 'dark'] as const).map(tName => (
                            <button 
                              key={tName}
                              onClick={() => setTheme(tName)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                                theme === tName 
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400' 
                                  : 'border-slate-100 dark:border-slate-800 text-slate-400'
                              }`}
                            >
                              {tName === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                              <span className="text-[10px] font-black">{t(tName as LangKey)}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button 
                          onClick={handleKeySelect}
                          className="w-full flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-700 dark:text-emerald-400 group transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                        >
                          <div className="flex items-center gap-3">
                            <Key className="w-4 h-4" />
                            <div className="text-left">
                              <p className="text-[10px] font-black uppercase tracking-widest">Quota Issues?</p>
                              <p className="text-xs font-bold">Use Own API Key</p>
                            </div>
                          </div>
                          <AlertCircle className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                        </button>
                        <p className="mt-3 text-[9px] text-slate-400 font-medium px-1">
                          Connecting your own key from a paid GCP project resolves rate-limiting issues. 
                          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Docs</a>
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-6 pt-10 pb-20">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
