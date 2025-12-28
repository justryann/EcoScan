
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, Trash2, Maximize2, Minimize2, ChevronRight } from 'lucide-react';
import { chatWithGemini } from '../services/gemini';
import { useStore } from '../store';
import { ChatMessage } from '../types';

const FloatingChatbot: React.FC = () => {
  const isStoreOpen = useStore((state) => state.isChatOpen);
  const chatPrompt = useStore((state) => state.chatPrompt);
  const setChatOpen = useStore((state) => state.setChatOpen);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentProduct = useStore((state) => state.currentProduct);
  const currentAnalysis = useStore((state) => state.currentAnalysis);

  // Suggested questions based on context
  const suggestions = useMemo(() => {
    if (!currentProduct) {
      return [
        "How to shop eco-friendly?",
        "What do eco-grades mean?",
        "Tips for zero waste?",
        "Seasonal food guide"
      ];
    }

    const baseSuggestions = [
      `Is ${currentProduct.name} vegan?`,
      "Any hidden allergens?",
      "Detailed health breakdown",
      "Environmental footprint?",
      "Better alternatives?"
    ];

    // If we have history, we could filter or refine, but product context is most relevant
    return baseSuggestions;
  }, [currentProduct]);

  // Sync with store state
  useEffect(() => {
    if (isStoreOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [isStoreOpen]);

  // Handle programmatic prompt
  useEffect(() => {
    if (chatPrompt && isOpen) {
      handleSend(chatPrompt);
      setChatOpen(true, null); // Clear prompt once sent
    }
  }, [chatPrompt, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText };
    setMessages((prev) => [...prev, userMsg]);
    if (!overrideInput) setInput('');
    setIsTyping(true);

    const context = currentProduct 
      ? `User is viewing ${currentProduct.name} by ${currentProduct.brand}. Health Grade: ${currentProduct.healthGrade}, Eco Grade: ${currentProduct.ecoGrade}. Analysis: ${currentAnalysis?.healthInsight || ''}` 
      : 'User is on the main dashboard.';

    try {
      const response = await chatWithGemini([...messages, userMsg], context);
      setMessages((prev) => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'model', text: "Connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setChatOpen(newState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isExpanded ? '400px' : '310px',
              height: isExpanded ? '580px' : '440px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 450, damping: 38 }}
            className="bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-[28px] flex flex-col overflow-hidden"
          >
            {/* Minimal Header */}
            <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black tracking-wider leading-none">ECO ASSIST</h3>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={clearChat} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white" title="Clear">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white hidden sm:block">
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={toggleOpen} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/40 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-slate-400 text-[11px] font-bold leading-relaxed px-4">
                    Expert advice on {currentProduct ? currentProduct.name : 'your groceries'}. Ask me anything!
                  </p>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-snug ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white font-bold rounded-tr-none shadow-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 font-medium shadow-sm rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 px-3 py-2 rounded-xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions area */}
            <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
               {suggestions.map((s, i) => (
                 <motion.button
                   key={i}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => handleSend(s)}
                   className="flex-shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center gap-1 shadow-sm"
                 >
                   {s} <ChevronRight className="w-3 h-3 text-slate-300" />
                 </motion.button>
               ))}
            </div>

            {/* Compact Input */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message AI..."
                className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="bg-emerald-600 text-white w-9 h-9 flex items-center justify-center rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-40 shadow-md shadow-emerald-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-all group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default FloatingChatbot;
