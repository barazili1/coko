import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Info, AlertTriangle, ShieldCheck, ChevronRight, Globe } from 'lucide-react';
import { Notification, Language } from '../types';
import { translations } from '../translations';
import { playSound } from '../services/audio';

const MotionDiv = motion.div as any;

interface NotificationsProps {
    notifications: Notification[];
    onMarkRead: (id: string) => void;
    onMarkAllRead: () => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onMarkRead, onMarkAllRead, language, onLanguageChange }) => {
    const t = translations[language];

    return (
        <MotionDiv 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col p-4 pb-24 h-full bg-[#050505] text-left"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h1 className="text-xl font-black text-white tracking-widest uppercase">{t.alerts}</h1>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{t.liveFeed}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }}
                    className="p-2 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-red-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'AR' : 'EN'}</span>
                  </button>
                  <button 
                      onClick={onMarkAllRead}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase"
                  >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Read All
                  </button>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center opacity-20">
                            <Bell className="w-12 h-12 mb-2" />
                            <span className="text-xs font-bold uppercase tracking-widest">{t.noNotifications}</span>
                        </div>
                    ) : (
                        notifications.map((note) => (
                            <MotionDiv 
                                key={note.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => onMarkRead(note.id)}
                                className={`
                                    p-4 rounded-2xl border transition-all cursor-pointer relative group
                                    ${note.read ? 'bg-zinc-900/30 border-white/5 opacity-60' : 'bg-zinc-900 border-white/10 shadow-lg'}
                                `}
                            >
                                <div className="flex gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
                                        ${note.type === 'success' ? 'bg-green-600/10 border-green-600/20 text-green-500' : 
                                          note.type === 'warning' ? 'bg-green-800/10 border-green-800/20 text-green-600' : 
                                          'bg-green-900/10 border-green-900/20 text-green-700'}
                                    `}>
                                        {note.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : 
                                         note.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                                         <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-xs font-black text-white truncate uppercase tracking-wide text-left">
                                                {note.titleKey && (t as any)[note.titleKey] ? (t as any)[note.titleKey] : note.title}
                                            </h3>
                                            <span className="text-[8px] font-mono text-zinc-600 uppercase">
                                                {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2 text-left">
                                            {note.messageKey && (t as any)[note.messageKey] ? (t as any)[note.messageKey] : note.message}
                                        </p>
                                    </div>
                                    {!note.read && (
                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-600 rounded-full" />
                                    )}
                                </div>
                            </MotionDiv>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </MotionDiv>
    );
};
