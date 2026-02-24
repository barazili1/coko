import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Send, 
  Code, 
  Zap, 
  Fingerprint, 
  Database,
  Layers
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { playSound } from '../services/audio';

const MotionDiv = motion.div as any;

interface AboutDevProps {
  onBack: () => void;
  language: Language;
}

export const AboutDev: React.FC<AboutDevProps> = ({ onBack, language }) => {
  const t = translations[language];

  const techSpecs = [
    { icon: Cpu, label: "Core Model", value: "Gemini 2.5 Flash" },
    { icon: ShieldCheck, label: "Encryption", value: "AES-256-GCM" },
    { icon: Globe, label: "Network", value: "Quantum-Sync v4" },
    { icon: Database, label: "Database", value: "Realtime-DB Edge" }
  ];

  const handleContact = () => {
    playSound('click');
    window.open('https://t.me/your_telegram_channel', '_blank');
  };

  return (
    <MotionDiv 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col p-4 pb-24 h-full overflow-y-auto bg-[#050505]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => { playSound('click'); onBack(); }}
          className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black text-white uppercase tracking-[0.3em]">{t.aboutDev}</h1>
          <div className="h-[1px] w-12 bg-green-600/50 mt-1" />
        </div>
        <div className="w-10" />
      </div>

      {/* Developer Profile Card */}
      <div className="relative mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#121214] to-[#09090b] border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Fingerprint className="w-24 h-24 text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-green-600/20 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-600/10 animate-pulse" />
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">HACK APPLE ARCHITECT</h2>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t.systemArchitect}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
            Specializing in high-frequency predictive modeling and neural network integration. 
            The Hack Apple project is a testament to the convergence of probability theory and modern AI architectures.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {techSpecs.map((spec) => (
              <div key={spec.label} className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <spec.icon className="w-3 h-3 text-zinc-600" />
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">{spec.label}</span>
                </div>
                <div className="text-[10px] font-mono text-white font-bold">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competencies Section */}
      <div className="space-y-4 mb-8">
        <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] ml-2">{t.coreCompetencies}</h3>
        
        <div className="space-y-2">
          {[
            { label: t.neuralNet, progress: 98, color: "bg-green-800" },
            { label: t.realtimeData, progress: 94, color: "bg-green-600" },
            { label: t.predictiveMod, progress: 96, color: "bg-green-500" }
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl bg-[#0c0c0e] border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-zinc-300 uppercase">{item.label}</span>
                <span className="text-[10px] font-mono text-zinc-500">{item.progress}%</span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <MotionDiv 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-auto pb-4">
        <button 
          onClick={handleContact}
          className="w-full group relative h-16 rounded-2xl bg-gradient-to-r from-green-800 to-green-600 p-[1px] overflow-hidden transition-all active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
          <div className="h-full w-full bg-zinc-900 rounded-[15px] flex items-center justify-center gap-3">
            <Send className="w-5 h-5 text-green-500" />
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{t.contactDirect}</span>
          </div>
        </button>
        <p className="text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-4">
          {t.viaTelegram}
        </p>
      </div>

      {/* System Footer Decor */}
      <div className="flex items-center justify-center gap-6 opacity-20 mt-4 mb-2">
        <Layers className="w-4 h-4 text-green-900" />
        <Zap className="w-4 h-4 text-green-800" />
        <Terminal className="w-4 h-4 text-green-900" />
      </div>
    </MotionDiv>
  );
};
