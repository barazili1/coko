import React, { useState, useEffect, useRef } from 'react';
import { Grid } from './Grid';
import { generatePrediction } from '../services/gemini';
import { fetchAppleGridData, updateAppleGridData } from '../services/database';
import { playSound } from '../services/audio';
import { GameState, PredictionResult, AccessKey, Language, Platform } from '../types';
import { translations } from '../translations';
import { 
    History, 
    X,
    Terminal,
    Scan,
    ArrowUp,
    Play,
    RotateCcw,
    ChevronDown,
    Users,
    Crosshair,
    Database,
    Binary,
    Signal,
    Globe,
    ChevronLeft,
    Clock,
    Activity,
    ShieldCheck,
    Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface AppleGameProps {
    onBack: () => void;
    accessKeyData: AccessKey | null;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    platform: Platform;
}

export const AppleGame: React.FC<AppleGameProps> = ({ onBack, accessKeyData, language, onLanguageChange, platform }) => {
  const setGameState = (s: GameState) => { _setGameState(s); };
  const [_gameState, _setGameState] = useState<GameState>(GameState.IDLE);
  const gameState = _gameState;
  
  const [isUpdating, setIsUpdating] = useState(false);
  const t = translations[language];
  
  const [onlineUsersCount, setOnlineUsersCount] = useState(() => Math.floor(Math.random() * (1000 - 50 + 1)) + 50);
  const [fluxValue, setFluxValue] = useState(98.2);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncedId, setSyncedId] = useState<string | null>(() => localStorage.getItem('synced_platform_id'));

  const [rowCount] = useState(5);
  const [currentRow, setCurrentRow] = useState(-1);
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(() => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('fortune-ai-last-result');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && Array.isArray(parsed.path)) return parsed;
            }
        } catch (e) {}
    }
    return null;
  });

  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setOnlineUsersCount(prev => {
            const change = Math.floor(Math.random() * 7) - 3;
            return Math.min(1000, Math.max(50, prev + change));
        });
        setFluxValue(prev => {
            const change = (Math.random() * 0.4 - 0.2);
            return parseFloat((prev + change).toFixed(1));
        });
        setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (currentResult) {
          localStorage.setItem('fortune-ai-last-result', JSON.stringify(currentResult));
          if (gameState === GameState.IDLE) setGameState(GameState.PREDICTED);
      }
  }, [currentResult, gameState]);

  const addRipple = (e: React.MouseEvent) => {
    const id = Date.now();
    setClickRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setClickRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  };

  const handlePredict = async (e: React.MouseEvent) => {
    if (gameState === GameState.ANALYZING) return;
    addRipple(e);
    playSound('predict');
    setGameState(GameState.ANALYZING);
    setCurrentResult(null);
    setCurrentRow(-1);

    const startTime = Date.now();
    const minTime = 2000;

    let realGridData = null;
    const isAdminMode = accessKeyData?.isAdminMode;
    
    if (isAdminMode) {
        realGridData = await fetchAppleGridData(platform);
    }

    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minTime) await new Promise(resolve => setTimeout(resolve, minTime - elapsedTime));
    
    let result: PredictionResult;
    if (realGridData) {
        const path: number[] = [];
        for (let i = 0; i < rowCount; i++) {
            if (i < realGridData.length) {
                const row = realGridData[i];
                const safeIndices = row.map((isSafe, idx) => isSafe ? idx : -1).filter(idx => idx !== -1);
                if (safeIndices.length > 0) {
                    path.push(safeIndices[Math.floor(Math.random() * safeIndices.length)]);
                } else path.push(-1);
            } else path.push(Math.floor(Math.random() * 5));
        }
        result = {
            path,
            confidence: 99, 
            analysis: language === 'ar' ? "تم إنشاء الاتصال الكمومي. تم اعتراض الخادم. تم فك تشفير المسار." : "QUANTUM UPLINK ESTABLISHED. SERVER HASH INTERCEPTED. PATH DECODED.",
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            gridData: realGridData
        };
    } else {
        result = await generatePrediction(rowCount, 'Hard');
    }

    setGameState(GameState.PREDICTED);
    playSound('success');
    setCurrentResult(result);
    setCurrentRow(0); // Show first row immediately on start
    setHistory(prev => [result, ...prev].slice(0, 10));
  };

  const handleUp = (e: React.MouseEvent) => {
      if (!currentResult || currentRow >= rowCount - 1) return;
      addRipple(e);
      playSound('click');
      setCurrentRow(prev => prev + 1);
  };

  const handleNewGame = async (e: React.MouseEvent) => {
      if (isUpdating) return;
      addRipple(e);
      setIsUpdating(true);
      playSound('click');
      await updateAppleGridData(platform);
      await new Promise(r => setTimeout(r, 800));
      setGameState(GameState.IDLE);
      setCurrentResult(null);
      setCurrentRow(-1);
      setIsUpdating(false);
      playSound('success');
  };

  return (
    <div className="flex flex-col h-full relative overflow-y-auto select-none bg-[#020202] text-left">
        {/* Click Ripple Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <AnimatePresence>
            {clickRipples.map(ripple => (
              // Use any-casted MotionDiv component to fix TypeScript assignment errors
              <MotionDiv
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: 'fixed',
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.4)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.1)_0%,transparent_70%)] opacity-30" />
            <div className="absolute inset-0 bg-grid-moving opacity-[0.02]" />
        </div>

        {/* --- REDESIGNED TOP BAR --- */}
        <div className="sticky top-0 z-50 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MotionButton 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { playSound('click'); onBack(); }}
                        className="w-10 h-10 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:bg-zinc-800"
                    >
                        <ChevronLeft className="w-5 h-5 text-red-600" />
                    </MotionButton>
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 bg-red-600/10 border border-red-600/20 rounded-md">
                                <ShieldCheck className="w-3 h-3 text-red-600" />
                            </div>
                            <h1 className="text-sm font-black text-white uppercase tracking-[0.15em] font-en italic leading-none">
                                HACK_<span className="text-red-600">APPLE</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 opacity-40">
                            <Clock className="w-2.5 h-2.5 text-zinc-500" />
                            <span className="text-[7px] text-zinc-500 font-mono font-bold uppercase tracking-widest">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Live Status Panel */}
                    <div className="flex items-center gap-2 bg-zinc-900/40 border border-white/5 rounded-xl px-2.5 py-1.5">
                        <div className="flex flex-col items-center border-r border-white/10 pr-2.5">
                            <div className="flex items-center gap-1">
                                <Activity className="w-2.5 h-2.5 text-red-600 animate-pulse" />
                                <span className="text-[9px] font-black text-white font-mono">{fluxValue}%</span>
                            </div>
                            <span className="text-[6px] font-bold text-zinc-600 uppercase tracking-tighter">SIGNAL</span>
                        </div>
                        <div className="flex flex-col items-center pl-0.5">
                            <div className="flex items-center gap-1">
                                <Users className="w-2.5 h-2.5 text-red-600" />
                                <span className="text-[9px] font-black text-white font-mono">{onlineUsersCount}</span>
                            </div>
                            <span className="text-[6px] font-bold text-zinc-600 uppercase tracking-tighter">ONLINE</span>
                        </div>
                    </div>

                    <MotionButton 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }}
                      className="w-9 h-9 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center justify-center"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest">{language === 'en' ? 'AR' : 'EN'}</span>
                    </MotionButton>
                </div>
            </div>
        </div>
        {/* --- END REDESIGNED TOP BAR --- */}

        <div className="px-4 pb-28 pt-6">
            <div className="relative mb-12 group">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-red-600/40 z-20 transition-all group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-red-600/40 z-20 transition-all group-hover:scale-110" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-red-600/40 z-20 transition-all group-hover:scale-110" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-red-600/40 z-20 transition-all group-hover:scale-110" />

                <div className="glass-panel p-2 rounded-xl border-white/5 shadow-[0_0_50px_rgba(239,68,68,0.05)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#060608] -z-10" />
                    <Grid 
                        path={currentResult?.path || []} 
                        isAnalyzing={gameState === GameState.ANALYZING}
                        predictionId={currentResult?.id}
                        onCellClick={() => {}} 
                        rowCount={rowCount}
                        currentRow={currentRow}
                        difficulty={'Hard'}
                        gridData={currentResult?.gridData}
                        language={language}
                    />
                </div>

                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#050505] px-4 py-1.5 border border-white/5 rounded-full z-20 whitespace-nowrap">
                    <span className="text-[7px] font-mono text-zinc-600 tracking-widest uppercase flex items-center gap-2">
                        <Crosshair className="w-2.5 h-2.5 text-red-900" />
                        {t.targetingActive}
                    </span>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <span className="text-[7px] font-mono text-red-600 tracking-widest uppercase flex items-center gap-2">
                        <Fingerprint className="w-2.5 h-2.5" />
                        ID: {syncedId || 'N/A'}
                    </span>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                </div>
            </div>

            <div className="space-y-6">
                <MotionDiv 
                    whileTap={{ scale: 0.98 }}
                    onClick={(e: React.MouseEvent) => { addRipple(e); playSound('click'); setIsAnalysisOpen(true); }} 
                    className={`relative bg-[#08080a] p-4 rounded-xl border transition-all duration-300 group cursor-pointer hover:border-red-600/30 min-h-[85px] flex flex-col justify-center overflow-hidden ${gameState === GameState.ANALYZING ? 'border-red-600 animate-pulse' : 'border-white/5'}`}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                        <Binary className="w-12 h-12 text-red-600" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${gameState === GameState.ANALYZING ? 'bg-red-600' : 'bg-red-900'}`} />
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t.aiAnalysis}</span>
                        {currentResult && <span className="ml-auto text-[9px] font-mono text-red-600">{t.confidence}:{currentResult.confidence}%</span>}
                    </div>

                    <div className="text-[10px] font-mono text-zinc-400 leading-relaxed line-clamp-2 uppercase tracking-wide">
                        {gameState === GameState.ANALYZING ? (
                            <span className="text-red-500 tracking-[0.2em]">{t.processingMatrix}</span>
                        ) : currentResult ? (
                            currentResult.analysis
                        ) : (
                            <span className="text-zinc-800 italic">{t.awaitingParameters}</span>
                        )}
                    </div>
                </MotionDiv>

                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <MotionButton 
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePredict} 
                            disabled={gameState === GameState.ANALYZING || isUpdating} 
                            className={`group relative h-16 rounded-xl overflow-hidden font-black tracking-[0.4em] uppercase text-xs transition-all ${gameState === GameState.ANALYZING ? 'bg-zinc-900 text-zinc-700' : 'bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                {gameState === GameState.ANALYZING ? (
                                    <><Scan className="w-5 h-5 animate-spin" /></>
                                ) : (
                                    <><Play className="w-5 h-5 fill-current" /><span>{t.start}</span></>
                                )}
                            </div>
                        </MotionButton>
                        <MotionButton 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUp} 
                            disabled={gameState === GameState.ANALYZING || isUpdating || !currentResult || currentRow >= rowCount - 1} 
                            className={`group relative h-16 rounded-xl overflow-hidden font-black tracking-[0.4em] uppercase text-xs transition-all ${!currentResult || currentRow >= rowCount - 1 ? 'bg-zinc-900 text-zinc-700' : 'bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                <ArrowUp className="w-5 h-5" /><span>{t.up}</span>
                            </div>
                        </MotionButton>
                    </div>
                    
                    <div className="grid grid-cols-1">
                        <MotionButton 
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNewGame} 
                            disabled={isUpdating || gameState === GameState.ANALYZING} 
                            className="h-12 rounded-xl border border-white/5 bg-zinc-900/50 text-zinc-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <RotateCcw className={`w-4 h-4 ${isUpdating ? 'animate-spin text-red-600' : ''}`} />
                            <span>{t.resync}</span>
                        </MotionButton>
                    </div>
                </div>

                <div className="pt-4 pb-12">
                    <MotionButton 
                        whileTap={{ scale: 0.98 }}
                        onClick={(e: React.MouseEvent) => { addRipple(e); playSound('click'); setShowHistory(!showHistory); }} 
                        className="flex flex-col items-center justify-center w-full gap-2 transition-all group opacity-40 hover:opacity-100"
                    >
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">
                            <History className="w-3 h-3" />
                            {showHistory ? t.hideHistory : t.viewHistory}
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${showHistory ? 'rotate-180' : ''}`} />
                    </MotionButton>
                    <AnimatePresence>
                        {showHistory && (
                            <MotionDiv 
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} 
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pb-6 pt-4">
                                    {history.length === 0 ? (
                                        <div className="text-center py-6 text-[8px] font-bold text-zinc-800 uppercase tracking-widest">-- {t.noHistory} --</div>
                                    ) : (
                                        history.map((h, i) => (
                                            <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-[#08080a] border border-white/5 group hover:border-red-600/20 transition-all">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[7px] text-zinc-700 font-mono uppercase">{new Date(h.timestamp).toLocaleTimeString()}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-white font-black uppercase">{t.op}_{history.length - i}</span>
                                                        <div className="w-1 h-1 bg-red-950 rounded-full" />
                                                        <span className="text-[9px] text-zinc-500 font-mono">X{h.path.length}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-black text-red-600 font-mono">{h.confidence}%</span>
                                                    <span className="text-[7px] font-bold text-zinc-700 uppercase">{t.confidence}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {isAnalysisOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <MotionDiv 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => { playSound('click'); setIsAnalysisOpen(false); }}
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                    />
                    <MotionDiv 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
                        className="w-full max-w-lg bg-[#08080a] border border-red-600/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-red-600" />
                                <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase">{t.analysisLog}</h3>
                            </div>
                            <MotionButton whileTap={{ scale: 0.8 }} onClick={() => { playSound('click'); setIsAnalysisOpen(false); }} className="p-2 hover:bg-white/5 rounded-lg">
                                <X className="w-5 h-5 text-zinc-600" />
                            </MotionButton>
                        </div>
                        <div className="p-6 font-mono text-[11px] leading-relaxed text-zinc-400 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            {gameState === GameState.ANALYZING ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Scan className="w-10 h-10 text-red-600 animate-spin" />
                                    <span className="animate-pulse tracking-[0.4em] text-red-600">{t.decryptingPattern}</span>
                                </div>
                            ) : currentResult ? (
                                <div className="space-y-6">
                                    <div className="bg-red-600/5 border border-red-600/10 p-5 rounded-xl">
                                        <p className="text-red-500/90 italic">
                                            <span className="font-black mr-2">{">>>"}</span>
                                            {currentResult.analysis}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">Vector_ID</span>
                                            <div className="text-[10px] text-white truncate">{currentResult.id}</div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">{t.activationTime}</span>
                                            <div className="text-[10px] text-white">{new Date(currentResult.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="h-[1px] bg-white/5" />
                                    <div className="space-y-3">
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t.safeSpots}</span>
                                        <div className="flex flex-wrap gap-2">
                                            {currentResult.path.map((col, idx) => (
                                                <div key={idx} className="bg-white/5 px-3 py-1.5 rounded border border-white/5 flex items-center gap-2">
                                                    <span className="text-[8px] text-zinc-600">L{idx+1}:</span>
                                                    <span className="text-[10px] text-red-600 font-black">C{col+1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-20 text-zinc-800 opacity-30">
                                    <Database className="w-12 h-12 mb-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">NO_LOGS_DETECTED</span>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-end">
                            <MotionButton whileTap={{ scale: 0.95 }} onClick={() => { playSound('click'); setIsAnalysisOpen(false); }} className="px-6 h-10 bg-red-700 text-white font-black text-[9px] uppercase tracking-widest rounded-lg">{t.closeConsole}</MotionButton>
                        </div>
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};