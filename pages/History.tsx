
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ScanLine, ArrowUpRight, Filter, LayoutGrid, Calendar, Trash2, X, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';

const History: React.FC = () => {
  const history = useStore((state) => state.history);
  const removeScan = useStore((state) => state.removeScan);
  const clearHistory = useStore((state) => state.clearHistory);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleDelete = (e: React.MouseEvent, barcode: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeScan(barcode);
  };

  // Robust filtering logic: Name, Brand, and Barcode (case-insensitive)
  const filteredHistory = history.filter(p => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;
    
    return (
      p.name.toLowerCase().includes(searchLower) || 
      p.brand.toLowerCase().includes(searchLower) ||
      p.barcode.includes(searchLower)
    );
  });

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-20 text-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-[40px] flex items-center justify-center text-emerald-200 dark:text-emerald-800">
            <ScanLine className="w-16 h-16" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
            <Search className="w-6 h-6" />
          </div>
        </div>
        <div className="max-w-xs space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Empty Journal</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Every audit you perform is saved in your local database. Start scanning to build your history!
          </p>
        </div>
        <Link 
          to="/scan" 
          className="bg-emerald-600 text-white px-10 py-4 rounded-[22px] font-black shadow-2xl shadow-emerald-100 dark:shadow-none hover:scale-105 transition-all"
        >
          Open Audit Scanner
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Audit Journal</h1>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <Calendar className="w-3 h-3" /> All Time
             </div>
             <p className="text-sm font-bold text-slate-400">{history.length} Saved Audits</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowConfirmClear(true)}
             className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
           >
             <Trash2 className="w-4 h-4" /> Clear All
           </button>
        </div>
      </header>

      <div className="relative group max-w-2xl">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Filter by name, brand, or barcode..."
          className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[28px] pl-14 pr-14 py-5 text-lg font-bold text-slate-800 dark:text-white focus:border-emerald-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
        />
        {search && (
          <button 
            onClick={() => handleSearchChange('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence>
          {filteredHistory.map((product, idx) => (
            <motion.div
              key={product.barcode}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <Link
                to={`/result/${product.barcode}`}
                className="flex flex-col bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-emerald-100/30 dark:hover:shadow-emerald-900/20 transition-all duration-500 h-full"
              >
                <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800/50 p-8 relative overflow-hidden flex items-center justify-center">
                  <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Grade Badges */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                     <div className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center shadow-sm border border-white/50 dark:border-slate-700/50">
                        <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">H</span>
                        <span className={`text-sm font-black leading-none ${
                          ['A', 'B'].includes(product.healthGrade) ? 'text-emerald-500' : 'text-amber-500'
                        }`}>{product.healthGrade}</span>
                     </div>
                  </div>

                  {/* Delete Trigger */}
                  <button 
                    onClick={(e) => handleDelete(e, product.barcode)}
                    className="absolute top-5 right-5 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm border border-white/50 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2">{product.brand}</p>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2 mb-6 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-400">
                       {new Date(product.lastScannedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                     </span>
                     <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Open <ArrowUpRight className="w-4 h-4" />
                     </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHistory.length === 0 && search && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-black text-xl mb-2">No audits found matching "{search}"</p>
          <button onClick={() => handleSearchChange('')} className="text-emerald-600 dark:text-emerald-400 font-black underline">Clear filters</button>
        </div>
      )}

      {/* Clear History Modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirmClear(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-10 bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl z-[101] text-center"
            >
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Clear All Data?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed mb-10">
                This will permanently delete all {history.length} scans from your local journal. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { clearHistory(); setShowConfirmClear(false); }}
                  className="w-full py-5 bg-rose-600 text-white rounded-[24px] font-black text-lg hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100 dark:shadow-none"
                >
                  Yes, Delete Everything
                </button>
                <button 
                  onClick={() => setShowConfirmClear(false)}
                  className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-[24px] font-black text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
