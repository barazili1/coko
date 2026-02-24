import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Key, 
    Shield, 
    ChevronRight, 
    AlertTriangle, 
    Globe, 
    Terminal, 
    Cpu, 
    Wifi, 
    Lock,
    Eye,
    Zap,
    Activity,
    Scan
} from 'lucide-react';
import { verifyAccessKey } from '../services/auth';
import { playSound } from '../services/audio';
import { LOGO_URL } from '../constants';
import { Language, AccessKey } from '../types';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

interface LoginProps {
    onLoginSuccess: (data: AccessKey) => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, language, onLanguageChange }) => {
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTos, setShowTos] = useState(false);
    const [systemLoad, setSystemLoad] = useState(0);
    const t = translations[language];

    useEffect(() => {
        const interval = setInterval(() => {
            setSystemLoad(Math.floor(Math.random() * 15) + 82);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key.trim()) return;

        setIsLoading(true);
        setError(null);
        playSound('predict');

        try {
            const result = await verifyAccessKey(key);
            if (result.valid && result.data) {
                // Simulate deep system check for aesthetic
                await new Promise(r => setTimeout(r, 1500));
                playSound('success');
                localStorage.setItem('access_key_data', JSON.stringify(result.data));
                onLoginSuccess(result.data);
            } else {
                setError(result.error || t.invalidKey);
                playSound('crash');
            }
        } catch (err) {
            setError(t.connectionFailed);
            playSound('crash');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#020202] relative overflow-hidden px-6"
        >
            {/* Cybernetic Background Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-moving opacity-[0.03]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05)_0%,transparent_70%)]" />
                
                {/* Random HUD Elements */}
                <div className="absolute top-10 left-10 opacity-10 flex flex-col gap-1">
                    <div className="w-12 h-1 bg-red-900" />
                    <div className="w-8 h-1 bg-red-900" />
                    <span className="text-[6px] font-mono text-white mt-2 tracking-widest uppercase">NODE_0991_SECURED</span>
                </div>
                <div className="absolute bottom-10 right-10 opacity-10 flex flex-col items-end gap-1">
                    <span className="text-[6px] font-mono text-white mb-2 tracking-widest uppercase">ENCRYPTION_RSA_4096</span>
                    <div className="w-8 h-1 bg-red-900" />
                    <div className="w-12 h-1 bg-red-900" />
                </div>
            </div>

            <div className="w-full max-w-sm relative z-10 flex flex-col">
                {/* Branding Core */}
                <div className="mb-10 flex flex-col items-center">
                    <div className="relative group">
                        {/* Rotating Outer Ring */}
                        <MotionDiv
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-12px] border border-dashed border-red-600/20 rounded-full"
                        />
                        <MotionDiv
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-20px] border border-dotted border-zinc-800 rounded-full"
                        />

                        <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-50" />
                            <img 
                                src={LOGO_URL} 
                                alt="Hack Apple Logo" 
                                className="w-full h-full object-cover p-2.5 relative z-10 group-hover:scale-110 transition-transform duration-700"
                            />
                            
                            {/* Scanning Light Sweep */}
                            <MotionDiv 
                                animate={{ y: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-red-500/10 to-transparent z-20"
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <h1 className="text-3xl font-black text-white tracking-[0.2em] font-en italic uppercase">
                            HACK_<span className="text-red-600 ml-1">APPLE</span>
                        </h1>
                        <div className="flex items-center justify-center gap-3 mt-3">
                            <div className="h-[1px] w-6 bg-red-900/50" />
                            <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.4em] font-mono">
                                {t.systemOnline} v3.1.2
                            </span>
                            <div className="h-[1px] w-6 bg-red-900/50" />
                        </div>
                    </div>
                </div>

                {/* Diagnostic Panels */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-red-900/30">
                            <Cpu className="w-4 h-4 text-red-700" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">Load</span>
                            <span className="text-[10px] font-black text-white font-mono">{systemLoad}%</span>
                        </div>
                    </div>
                    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-red-900/30">
                            <Wifi className="w-4 h-4 text-red-700" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">Latency</span>
                            <span className="text-[10px] font-black text-white font-mono">12ms</span>
                        </div>
                    </div>
                </div>

                {/* Login Form Card */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
                    <div className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-900/30 rounded-tl-[2rem]" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-900/30 rounded-br-[2rem]" />

                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <label className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">
                                    {t.licenseKey} / <span className="text-red-900">DECRYPTOR</span>
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                        <Key className={`w-4 h-4 transition-colors ${error ? 'text-red-500' : 'text-zinc-600 group-focus-within/input:text-red-500'}`} />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        placeholder="••••••••••••"
                                        className={`w-full h-14 bg-black/50 border ${error ? 'border-red-500/50' : 'border-white/5 focus:border-red-600/40'} rounded-2xl pl-12 pr-4 text-white font-mono text-sm placeholder:text-zinc-800 outline-none transition-all`}
                                    />
                                    {/* Decoration Corners for Input */}
                                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-red-500/0 group-focus-within/input:border-red-500/50 transition-all" />
                                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-red-500/0 group-focus-within/input:border-red-500/50 transition-all" />
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <MotionDiv 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl flex items-center gap-3"
                                    >
                                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                                        <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest">{error}</span>
                                    </MotionDiv>
                                )}
                            </AnimatePresence>

                            <button 
                                disabled={isLoading || !key}
                                className={`
                                    w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all relative overflow-hidden active:scale-[0.98]
                                    ${isLoading || !key 
                                        ? 'bg-zinc-900 text-zinc-700 border border-white/5' 
                                        : 'bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:bg-red-600'}
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <Scan className="w-4 h-4 animate-spin" />
                                        <span>{t.authenticating}...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>{t.authenticate}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                                
                                {isLoading && (
                                    <MotionDiv
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 bg-white/5 skew-x-12"
                                    />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sub-Actions */}
                <div className="mt-8 flex items-center justify-between px-2">
                    <button 
                        onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-red-900/50 transition-colors">
                            <Globe className="w-4 h-4 text-zinc-500 group-hover:text-red-600 transition-colors" />
                        </div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                            {language === 'en' ? 'Switch to Arabic' : 'التحويل للإنجليزية'}
                        </span>
                    </button>

                    <button 
                        onClick={() => { playSound('click'); setShowTos(true); }}
                        className="text-[9px] font-black text-zinc-600 hover:text-red-700 uppercase tracking-[0.2em] transition-colors"
                    >
                        {t.terms}
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 opacity-20 pointer-events-none">
                <div className="flex gap-4">
                    <Terminal className="w-3 h-3 text-white" />
                    <Activity className="w-3 h-3 text-white" />
                    <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-[6px] font-black text-white tracking-[0.5em] uppercase italic">
                    {t.securedBy} / BIOMETRIC_PASSTHROUGH_ACTIVE
                </span>
            </div>

            {/* TOS Modal */}
            <AnimatePresence>
                {showTos && (
                    <MotionDiv 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
                    >
                        <MotionDiv
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-sm p-8 space-y-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Shield className="w-32 h-32 text-red-600" />
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-4 italic">
                                    PROTOCOL<span className="text-red-600 ml-1">_GUIDELINES</span>
                                </h2>
                                <p className={`text-[10px] text-zinc-400 leading-relaxed font-mono uppercase font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    {t.tosBody}
                                </p>
                            </div>

                            <button 
                                onClick={() => { playSound('success'); setShowTos(false); }}
                                className="w-full py-4 bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                            >
                                {t.tosAgree}
                            </button>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </MotionDiv>
    );
};
