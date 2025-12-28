
import React from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  label: string;
  grade: string;
  color: string;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score, label, grade, color }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  // Handle long strings like "NOT-APPLICABLE"
  const isNumeric = !isNaN(Number(grade)) || grade.length <= 2;
  const displayGrade = grade || 'N/A';

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 h-full w-full group hover:border-slate-200 transition-colors">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-100 fill-none"
            strokeWidth="7"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className="fill-none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center px-2 text-center overflow-hidden">
          <motion.span 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-black text-slate-900 leading-[0.9] tracking-tighter uppercase break-words transition-all ${
              displayGrade.length > 10 ? 'text-[8px]' : 
              displayGrade.length > 5 ? 'text-[10px]' : 'text-3xl'
            }`}
          >
            {displayGrade}
          </motion.span>
          {isNumeric && score > 0 && (
            <span className="text-[10px] font-black text-slate-400 mt-1">{score}%</span>
          )}
        </div>
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center px-1">
        {label}
      </span>
    </div>
  );
};

export default ScoreRing;
