import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, LogOut, ChevronLeft, Globe, Bell, Volume2, Fingerprint, Activity, Clock, Trophy, Wallet } from 'lucide-react';
import { UserProfile, AccessKey, Language, ViewState } from '../types';
import { translations } from '../translations';
import { playSound } from '../services/audio';

const MotionDiv = motion.div as any;

interface ProfileProps {
    accessKeyData: AccessKey | null;
    userProfile: UserProfile;
    onUpdateProfile: (p: UserProfile) => void;
    onSignOut: () => void;
    onNavigate: (v: ViewState) => void;
    currentAvatarId: number;
    onAvatarChange: (id: number) => void;
    language: Language;
    onLanguageChange: (l: Language) => void;
}

export const Profile: React.FC<ProfileProps> = ({ accessKeyData, userProfile, onSignOut, onNavigate, currentAvatarId, onAvatarChange, language, onLanguageChange }) => {
    const t = translations[language];

    return (
        <MotionDiv 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col p-4 pb-24 h-full overflow-y-auto bg-[#09090b]"
        >
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => onNavigate('APPLE' as any)} className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-sm font-black text-white uppercase tracking-widest">{t.profile}</h1>
                <div className="w-9" />
            </div>

            {/* User Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-green-600/20 flex items-center justify-center p-1">
                        <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                            <Fingerprint className="w-12 h-12 text-green-600 opacity-50" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-green-700 rounded-full border-4 border-[#09090b]">
                        <Shield className="w-3 h-3 text-white" />
                    </div>
                </div>
                <h2 className="text-xl font-black text-white">{userProfile.username}</h2>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{accessKeyData?.type || 'Standard'} License</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl">
                    <Trophy className="w-4 h-4 text-green-500 mb-2" />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">{t.totalWinnings}</span>
                    <span className="text-lg font-black text-white">${userProfile.stats.totalWinnings.toLocaleString()}</span>
                </div>
                <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl">
                    <Clock className="w-4 h-4 text-green-600 mb-2" />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block">Games</span>
                    <span className="text-lg font-black text-white">{userProfile.stats.gamesPlayed}</span>
                </div>
            </div>

            {/* Settings List */}
            <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">{t.settings}</h3>
                
                <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
                    <button 
                        onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-zinc-400" />
                            <span className="text-xs font-bold text-white uppercase">{language === 'en' ? 'Language: English' : 'اللغة: العربية'}</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => onNavigate('ABOUT_DEV' as any)}
                        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-zinc-400" />
                            <span className="text-xs font-bold text-white uppercase">{t.aboutDev}</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => { playSound('click'); onSignOut(); }}
                        className="w-full p-4 flex items-center justify-between hover:bg-green-900/10 group transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-bold text-green-600 uppercase">{t.signOut}</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center pb-8">
                <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Build ID: {crypto.randomUUID().split('-')[0].toUpperCase()}</span>
            </div>
        </MotionDiv>
    );
};