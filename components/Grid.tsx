import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, XCircle, Sparkle, Scan, Target } from 'lucide-react';
import { playSound } from '../services/audio';
import { translations } from '../translations';
import { Language } from '../types';

const MotionDiv = motion.div as any;

interface GridProps {
  path: number[]; 
  isAnalyzing: boolean;
  predictionId?: string;
  onCellClick?: (rowIndex: number, colIndex: number) => void;
  rowCount: number;
  currentRow: number; 
  difficulty: string;
  gridData?: boolean[][]; 
  language: Language;
}

const COLS = 5;
const COL_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const Grid: React.FC<GridProps> = ({ 
  path, 
  isAnalyzing, 
  predictionId, 
  rowCount,
  currentRow,
  gridData,
  language
}) => {
  const t = translations[language];
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const [shufflingIndex, setShufflingIndex] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  
  const isFailure = !isAnalyzing && predictionId && (path.length === 0 || path.every(v => v === -1));
  const isSuccess = !isAnalyzing && predictionId && !isFailure;

  useEffect(() => {
      if (isSuccess) {
          setShowSuccessFlash(true);
          const timer = setTimeout(() => setShowSuccessFlash(false), 1500);
          return () => clearTimeout(timer);
      }
  }, [predictionId, isSuccess]);

  // منطق المسح الرقمي قبل كشف التفاحة
  useEffect(() => {
    if (predictionId && !isAnalyzing && currentRow >= 0) {
      setIsShuffling(true);
      let count = 0;
      const maxShuffles = 12; // عدد مرات القفز بين الخلايا
      const interval = setInterval(() => {
        setShufflingIndex(Math.floor(Math.random() * COLS));
        count++;
        if (count >= maxShuffles) {
          clearInterval(interval);
          setIsShuffling(false);
          setShufflingIndex(null);
          playSound('success'); // صوت التأكيد عند القفل على الخلية
        } else {
          playSound('hover'); // صوت "تيك" خفيف أثناء المسح
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [predictionId, currentRow, isAnalyzing]);

  const activeRowIndex = currentRow >= 0 ? currentRow : 0;

  const rowLayout = useMemo(() => {
    if (!predictionId) return Array(COLS).fill('unknown');
    const safeColIndex = path[activeRowIndex] !== undefined ? path[activeRowIndex] : -1;
    
    return Array.from({ length: COLS }, (_, i) => {
        if (i === safeColIndex) return 'path';
        return 'unknown';
    });
  }, [predictionId, path, activeRowIndex]);

  return (
    <div className="relative w-full mx-auto">
      <div className={`flex flex-col items-center gap-4 p-4 relative z-10 transition-all duration-700 ${showSuccessFlash ? 'scale-[1.01]' : ''}`}>
        
        {/* العناوين العلوية للأعمدة */}
        <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/5 opacity-40 w-full">
            <div className="grid grid-cols-5 gap-2 flex-1">
                {COL_LETTERS.map(l => (
                    <div key={l} className="text-center">
                        <span className="text-[8px] font-black text-zinc-500 font-mono tracking-widest">{l}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* حاوية الصف النشط */}
        <div className="w-full min-h-[100px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                <MotionDiv 
                    key={`row-step-${activeRowIndex}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex items-center gap-3 group/row w-full"
                >
                    <div className="grid grid-cols-5 gap-2 flex-1">
                        {Array.from({ length: COLS }).map((_, colIndex) => {
                            const isPredictedPath = rowLayout[colIndex] === 'path';
                            const isBeingScanned = isShuffling && shufflingIndex === colIndex;
                            const isFinalReveal = !isShuffling && isPredictedPath && predictionId;

                            return (
                                <MotionDiv
                                    key={`cell-${colIndex}`}
                                    className={`
                                        aspect-square rounded-xl flex items-center justify-center relative overflow-hidden border transition-all duration-300
                                        ${isBeingScanned ? 'bg-red-500/10 border-red-500/40' : ''}
                                        ${isFinalReveal ? 'bg-green-600/20 border-green-500/50 shadow-[0_0_25px_rgba(34,197,94,0.2)]' : 'bg-[#08080a] border-white/5'}
                                    `}
                                >
                                    <span className="absolute top-1 left-1 text-[5px] font-mono text-zinc-800 opacity-50">
                                        [{COL_LETTERS[colIndex]}]
                                    </span>

                                    {/* تأثير المسح (Scanning) */}
                                    <AnimatePresence>
                                        {isBeingScanned && (
                                            <MotionDiv
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <div className="w-full h-full bg-red-600/10 animate-pulse flex items-center justify-center">
                                                    <Scan className="w-5 h-5 text-red-600/40" />
                                                </div>
                                            </MotionDiv>
                                        )}
                                    </AnimatePresence>

                                    {/* إظهار التفاحة النهائية (الخضراء) */}
                                    <AnimatePresence>
                                        {isFinalReveal && (
                                            <MotionDiv
                                                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                                className="w-full h-full flex items-center justify-center relative z-20"
                                            >
                                                <MotionDiv
                                                    animate={{ 
                                                        y: [0, -3, 0],
                                                        filter: ['drop-shadow(0 0 5px rgba(34,197,94,0.3))', 'drop-shadow(0 0 15px rgba(34,197,94,0.6))', 'drop-shadow(0 0 5px rgba(34,197,94,0.3))']
                                                    }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                >
                                                    <Apple className="w-10 h-10 text-green-500 fill-green-500/30" />
                                                </MotionDiv>
                                                
                                                {/* تأثير "القفل" (Locked) */}
                                                <MotionDiv 
                                                    initial={{ opacity: 1, scale: 0.8 }}
                                                    animate={{ opacity: 0, scale: 1.5 }}
                                                    className="absolute inset-0 border-2 border-green-500 rounded-xl"
                                                />
                                                
                                                {/* جزيئات لامعة حول التفاحة */}
                                                <Sparkle className="absolute top-2 right-2 w-2 h-2 text-green-300 animate-pulse" />
                                                <Sparkle className="absolute bottom-2 left-2 w-2 h-2 text-green-200 animate-pulse delay-75" />
                                            </MotionDiv>
                                        )}
                                    </AnimatePresence>

                                    {/* حالة الاستعداد (قبل التوقع) */}
                                    {!isFinalReveal && !isBeingScanned && (
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${isAnalyzing ? 'bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping' : 'bg-zinc-800 opacity-20'}`} />
                                    )}
                                </MotionDiv>
                            );
                        })}
                    </div>
                </MotionDiv>
            </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
          {isFailure && (
            <MotionDiv 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl rounded-xl p-8 text-center"
            >
                <div className="relative p-6 mb-6">
                    <XCircle className="w-16 h-16 text-red-600 relative z-10" />
                    <div className="absolute inset-0 bg-red-600/30 blur-3xl animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-white tracking-[0.3em] uppercase mb-2">{t.matrixFailure}</h3>
                <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mb-6">
                    {t.matrixFailureMsg}
                </p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-700 text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg">{t.retrySync}</button>
            </MotionDiv>
          )}
      </AnimatePresence>
    </div>
  );
};