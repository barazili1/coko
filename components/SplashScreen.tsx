import React, { useState, useEffect, useMemo } from 'react';
import { LOGO_URL } from '../constants';
import { translations } from '../translations';
import { Language } from '../types';

interface SplashScreenProps {
  language: Language;
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ language, onComplete }) => {
  const t = translations[language];
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const loadingMessages = useMemo(() => [
    t.loading_establishing,
    t.loading_initializing,
    t.loading_decrypting,
    t.loading_synchronizing,
    t.loading_bypassing,
    t.loading_ready
  ], [t]);

  useEffect(() => {
    const duration = 3000; 
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      
      const easedProgress = rawProgress < 50 
        ? rawProgress * 0.8 
        : rawProgress + (100 - rawProgress) * 0.15;

      const finalProgress = Math.min(easedProgress, 100);
      setProgress(finalProgress);

      if (finalProgress >= 100) {
        setTimeout(onComplete, 500);
      } else {
        requestAnimationFrame(updateProgress);
      }
    };

    const frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  useEffect(() => {
    const segment = 100 / loadingMessages.length;
    const currentSegment = Math.min(Math.floor(progress / segment), loadingMessages.length - 1);
    if (currentSegment !== statusIndex) {
      setStatusIndex(currentSegment);
    }
  }, [progress, loadingMessages.length, statusIndex]);

  const fontClass = language === 'ar' ? 'font-ar' : 'font-en';

  return (
    <div className={`fixed inset-0 z-[2000] bg-[#030305] flex flex-col items-center justify-center p-6 overflow-hidden select-none will-change-opacity ${fontClass}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(239,68,68,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-grid-moving" />
      </div>

      <div className="relative flex flex-col items-center z-10 w-full max-w-xs">
        <div className="relative mb-14 animate-float">
            <div className="absolute inset-[-40px] border border-red-900/10 rounded-full scale-110" />
            <div className="absolute inset-[-20px] border border-red-600/5 rounded-full animate-spin-slow" />
            
            <div className="w-28 h-28 rounded-[2rem] bg-[#08080a] border border-white/5 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50" />
              <img 
                src={LOGO_URL} 
                alt="Hack Apple Logo" 
                className="w-[85%] h-[85%] object-contain relative z-10 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
            </div>
        </div>

        <div className="flex flex-col items-center gap-3 mb-16 text-center">
          <div className="text-3xl font-black uppercase italic tracking-[0.25em] flex items-center gap-3">
            <span className="text-white">HACK</span>
            <span className="text-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">APPLE</span>
          </div>

          <div className="flex items-center gap-4 opacity-40">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-zinc-700" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.5em]">
              {t.systemReady} v4.5
            </span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-zinc-700" />
          </div>
        </div>

        <div className="w-full space-y-6">
            <div className="space-y-3">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_#dc2626]" />
                      {t.coreStatus}
                    </span>
                    <span className="text-white font-mono">{Math.round(progress)}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-zinc-900/50 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div 
                        style={{ width: `${progress}%` }}
                        className="h-full bg-red-600 rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_rgba(239,68,68,0.4)] relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                </div>
            </div>

            <div className="h-10 flex flex-col items-center justify-center text-center">
                <div className="transition-all duration-300">
                    <span className={`text-[9px] font-mono text-zinc-400 font-bold tracking-[0.2em] uppercase animate-pulse`}>
                        {loadingMessages[statusIndex]}
                    </span>
                    <div className="flex items-center justify-center gap-3 mt-2 opacity-20">
                      <div className="w-2 h-2 border-t border-r border-white/50 rotate-45" />
                      <div className="w-1 h-1 bg-white rounded-full" />
                      <div className="w-2 h-2 border-b border-l border-white/50 rotate-45" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-10">
         <span className="text-[7px] font-black text-white tracking-[0.6em] uppercase">
           HACK_APPLE_SECURE • {t.nodeSync}
         </span>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s infinite linear; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}</style>
    </div>
  );
};
