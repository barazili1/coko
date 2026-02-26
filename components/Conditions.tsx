import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, 
    Fingerprint, 
    Upload, 
    CheckCircle2, 
    Copy, 
    AlertCircle,
    ShieldCheck,
    Terminal,
    Lock,
    Activity,
    Cpu,
    X,
    Globe,
    ChevronLeft,
    Sparkles,
    LogIn,
    FileText
} from 'lucide-react';
import { Language, Platform } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

interface ConditionsProps {
    onComplete: (isAdmin: boolean) => void;
    onBack?: () => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    platform: Platform;
}

export const Conditions: React.FC<ConditionsProps> = ({ onComplete, onBack, language, onLanguageChange, platform }) => {
    const t = translations[language];

    const [userId, setUserId] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isAdminFile, setIsAdminFile] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const promoCode = 'Snfor77';
    const appName = platform === '1XBET' ? 'DBbet' : 'WoW Bet';
    const apkUrl = platform === '1XBET' 
        ? 'https://db-bet.co/3KxnhKc' 
        : 'https://wowbet.win/downloads/androidclient/releases_android/wowbet/site/wowbet.apk?';
    
    // Platform specific logo for the header
    const platformLogo = platform === '1XBET' 
        ? 'https://image2url.com/r2/default/images/1771955657659-30f91fe6-070b-4b37-bc53-66de43dc5b87.png'
        : 'https://image2url.com/r2/default/images/1770041760112-2532adca-da83-4e51-adfa-134648b3821e.jpg';

    const handleCopy = () => {
        navigator.clipboard.writeText(promoCode);
        setCopyFeedback(true);
        playSound('toggle');
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setFileName(file.name);
            setFileUploaded(true);
            
            // Check if the file is 'Admin.png' to enable Firebase predictions
            if (file.name.toLowerCase() === 'admin.png') {
                setIsAdminFile(true);
            } else {
                setIsAdminFile(false);
            }
            
            playSound('success');
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setFileName(null);
        setFileUploaded(false);
        setIsAdminFile(false);
        playSound('toggle');
    };

    const handleSubmit = async () => {
        if (!userId) return;
        setIsSubmitting(true);
        playSound('predict');
        
        await new Promise(r => setTimeout(r, 3000));
        
        setIsSubmitting(false);
        playSound('success');
        setShowSuccessModal(true);
        // Save User ID for display in the main game screen
        localStorage.setItem('synced_platform_id', userId);
    };

    const handleProceedToLogin = () => {
        playSound('click');
        onComplete(isAdminFile);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const isReady = userId.length > 3;

    // Helper for dynamic strings
    const getPlatformText = (key: string) => {
        return (t as any)[key]?.replace('%platform%', appName) || "";
    };

    return (
        <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className={`flex-1 flex flex-col p-5 bg-[#020203] relative overflow-y-auto custom-scrollbar ${language === 'ar' ? 'text-right' : 'text-left'}`}
        >
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-grid-moving" />
            </div>

            <header className="relative z-10 mt-6 mb-10 flex items-center justify-between flex-row-reverse">
                <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <button 
                    onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }}
                    className="p-2 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-red-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'AR' : 'EN'}</span>
                  </button>
                </div>

                <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    {onBack && (
                        <button 
                            onClick={() => { playSound('click'); onBack(); }}
                            className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                        >
                            {language === 'ar' ? <ChevronLeft className="w-5 h-5 rotate-180" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    )}
                    <div className="flex flex-col">
                        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center p-1 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                <img src={platformLogo} alt={platform} className="w-full h-full object-cover rounded-sm" />
                            </div>
                            <h1 className="text-lg font-black text-white uppercase tracking-[0.2em] italic">
                                {appName}<span className="text-red-600">_ACCESS</span>
                            </h1>
                        </div>
                        <span className={`text-[7px] text-zinc-600 font-bold uppercase tracking-[0.4em] mt-1 ${language === 'ar' ? 'mr-11' : 'ml-11'}`}>
                            {t.conditionsSubtitle}
                        </span>
                    </div>
                </div>
            </header>

            <div className="relative z-10 space-y-4 pb-24">
                <div className="grid grid-cols-1 gap-4">
                    <div className={`bg-[#08080a] border border-white/5 rounded-2xl p-5 relative overflow-hidden group ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[9px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded">{t.node}_01</span>
                            <h2 className="text-[11px] font-black text-white uppercase tracking-wider">{t.softwareDeployment}</h2>
                        </div>
                        <p className="text-[10px] text-zinc-500 mb-4 leading-relaxed uppercase font-bold">
                            {getPlatformText('installDescription')}
                        </p>
                        <button 
                            onClick={() => { playSound('click'); window.open(apkUrl, '_blank'); }}
                            className={`w-full h-12 bg-zinc-900 border border-white/5 hover:border-red-600/30 rounded-xl flex items-center justify-center gap-2 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                            <Download className="w-4 h-4 text-red-600" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{t.installApk}</span>
                        </button>
                    </div>

                    <div className={`bg-[#08080a] border border-white/5 rounded-2xl p-5 relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[9px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded">{t.node}_02</span>
                            <h2 className="text-[11px] font-black text-white uppercase tracking-wider">{t.accountInitialization}</h2>
                        </div>
                        <p className="text-[10px] text-zinc-500 mb-4 leading-relaxed uppercase font-bold">
                            {getPlatformText('registerDescription')}
                        </p>
                        <div className={`flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex flex-col ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">{t.syncCode}</span>
                                <span className="text-lg font-black text-red-600 font-mono tracking-tighter">{promoCode}</span>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${language === 'ar' ? 'flex-row-reverse' : ''} ${copyFeedback ? 'bg-green-600 text-white' : 'bg-zinc-900 border border-white/5 text-zinc-400'}`}
                            >
                                {copyFeedback ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span className="text-[9px] font-black uppercase">{copyFeedback ? t.copied : t.copy}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`bg-[#08080a] border border-white/5 rounded-2xl p-5 relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[9px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded">{t.node}_03</span>
                        <h2 className="text-[11px] font-black text-white uppercase tracking-wider">{t.financialLinkage}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`bg-zinc-900/30 border border-white/5 p-3 rounded-xl ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <span className="text-[8px] font-black text-zinc-600 uppercase mb-1">{t.minUsd}</span>
                            <span className="text-md font-black text-white block">$5.00</span>
                        </div>
                        <div className={`bg-zinc-900/30 border border-white/5 p-3 rounded-xl ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <span className="text-[8px] font-black text-zinc-600 uppercase mb-1">{t.minEgp}</span>
                            <span className="text-md font-black text-white block">300 EGP</span>
                        </div>
                    </div>
                    <div className={`mt-4 flex items-center gap-2 bg-red-600/5 p-2 rounded-lg ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-[8px] font-bold text-zinc-500 uppercase leading-none">{t.depositDescription}</span>
                    </div>
                </div>

                <div className={`bg-[#08080a] border border-red-600/10 rounded-2xl p-5 relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-3 mb-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[9px] font-black text-red-700 bg-red-700/10 px-2 py-0.5 rounded">{t.node}_04</span>
                        <h2 className="text-[11px] font-black text-white uppercase tracking-wider">{t.validationHandshake}</h2>
                    </div>

                    <div className="space-y-5">
                        <div className={`space-y-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block px-1">{getPlatformText('userIdInputLabel')}</label>
                            <div className="relative">
                                <Fingerprint className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700`} />
                                <input 
                                    type="number" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder={t.id}
                                    className={`w-full h-12 bg-black/40 border border-white/5 rounded-xl ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} text-white font-mono text-xs focus:border-red-600/40 outline-none transition-all`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent pointer-events-none z-30">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <button 
                        disabled={!isReady || isSubmitting}
                        onClick={handleSubmit}
                        className={`
                            group relative w-full h-16 rounded-2xl overflow-hidden font-black tracking-[0.3em] uppercase text-xs transition-all
                            ${!isReady ? 'bg-zinc-900 text-zinc-700 border border-white/5' : 'bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.2)]'}
                        `}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {isSubmitting ? (
                                <><Activity className="w-5 h-5 animate-pulse" /><span>{t.verifyingLink}</span></>
                            ) : !isReady ? (
                                <><Lock className="w-4 h-4 opacity-30" /><span>{t.awaitingNodes}</span></>
                            ) : (
                                <><ShieldCheck className="w-5 h-5" /><span>{t.authorizeSync}</span></>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <MotionDiv 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-sm bg-[#0c0c0e] border border-green-600/20 rounded-[2.5rem] p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Sparkles className="w-20 h-20 text-green-600" />
                            </div>
                            
                            <div className="w-20 h-20 rounded-full bg-green-600/10 border border-green-600/20 flex items-center justify-center mx-auto mb-6 relative">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>

                            <h3 className="text-xl font-black text-white tracking-[0.2em] uppercase mb-4 italic">
                                ACCESS <span className="text-green-600">{t.identityConfirmed}</span>
                            </h3>
                            
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mb-8">
                                {t.identityConfirmedMsg}
                            </p>

                            <div className={`bg-black/40 border border-white/5 p-5 rounded-2xl mb-8 group transition-all cursor-pointer ${language === 'ar' ? 'text-right' : 'text-left'}`} onClick={handleCopy}>
                                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`text-left ${language === 'ar' ? 'text-right' : ''}`}>
                                        <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-1">{t.promoKeyAuth}</span>
                                        <span className="text-3xl font-black text-white font-mono tracking-tighter">{promoCode}</span>
                                    </div>
                                    <div className={`p-3 rounded-xl border transition-all ${copyFeedback ? 'bg-green-600 border-green-600 text-white' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
                                        {copyFeedback ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleProceedToLogin}
                                className={`w-full h-14 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                            >
                                <LogIn className="w-4 h-4" />
                                <span>{t.continueToLogin}</span>
                            </button>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>

            <div className={`fixed top-1/2 ${language === 'ar' ? 'left-2' : 'right-2'} -translate-y-1/2 flex flex-col gap-6 opacity-10 pointer-events-none z-0`}>
                <Terminal className="w-4 h-4 text-white" />
                <Cpu className="w-4 h-4 text-white" />
                <Activity className="w-4 h-4 text-white" />
            </div>
        </MotionDiv>
    );
};