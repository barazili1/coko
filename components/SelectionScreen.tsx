import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Globe, Cpu, Zap, Radio, Activity } from 'lucide-react';
import { Platform, Language } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

interface SelectionScreenProps {
  onSelect: (platform: Platform) => void;
  language: Language;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, language }) => {
  const t = translations[language];

  const platforms = [
    {
      id: '1XBET' as Platform,
      name: 'Goobet',
      description: 'Optimized Uplink',
      tag: 'STABLE',
      logo: 'https://image2url.com/r2/default/images/1770041414359-d610ba00-5bd4-4a01-8316-eeedba658118.png',
      color: 'from-blue-600/20 to-transparent',
      borderColor: 'group-hover:border-blue-500/50',
      accentColor: 'text-blue-500',
      glow: 'shadow-[0_0_30px_rgba(37,99,235,0.1)]'
    },
    {
      id: 'MELBET' as Platform,
      name: 'WoW Bet',
      description: 'Alternative Node',
      tag: 'FAST',
      logo: 'https://image2url.com/r2/default/images/1770041760112-2532adca-da83-4e51-adfa-134648b3821e.jpg',
      color: 'from-yellow-500/20 to-transparent',
      borderColor: 'group-hover:border-yellow-500/50',
      accentColor: 'text-yellow-500',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.1)]'
    }
  ];

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      className="flex-1 flex flex-col p-6 items-center justify-center min-h-screen bg-[#030305] relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02] bg-grid-moving" />
      </div>

      {/* Technical Header */}
      <div className="mb-16 relative z-10 flex flex-col items-center">
        <MotionDiv
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-900/50 border border-white/10 flex items-center justify-center shadow-2xl mb-6 relative group overflow-hidden">
             <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <Shield className="w-7 h-7 text-red-600 relative z-10" />
             <MotionDiv 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-red-600/20 rounded-2xl scale-125"
             />
          </div>
          <h1 className="text-2xl font-black text-white tracking-[0.3em] uppercase italic text-center">
            SELECT <span className="text-red-600">ACCESS</span> POINT
          </h1>
          <div className="flex items-center gap-4 mt-4">
             <div className="h-[1px] w-8 bg-zinc-800" />
             <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-[0.5em]">{t.softwareDeployment}</p>
             <div className="h-[1px] w-8 bg-zinc-800" />
          </div>
        </MotionDiv>
      </div>

      {/* Platform Cards */}
      <div className="w-full max-sm space-y-5 relative z-10">
        {platforms.map((p, index) => (
          <MotionDiv
            key={p.id}
            initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + (index * 0.1), duration: 0.6, ease: "circOut" }}
          >
            <button
              onClick={() => {
                playSound('click');
                onSelect(p.id);
              }}
              className={`w-full group relative p-6 rounded-[2rem] bg-[#08080a] border border-white/5 ${p.borderColor} transition-all duration-500 active:scale-[0.98] overflow-hidden text-left shadow-2xl`}
            >
              {/* Card Ambient Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700`} />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center group-hover:border-white/20 transition-all duration-500 overflow-hidden p-1.5 shadow-inner">
                  <img 
                      src={p.logo} 
                      alt={p.name} 
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">{p.name}</h3>
                    <span className={`text-[6px] font-black px-1.5 py-0.5 rounded border border-current ${p.accentColor} opacity-50`}>
                      {p.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">{p.description}</span>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                    <div className="flex items-center gap-1">
                       <Zap className={`w-2 h-2 ${p.accentColor}`} />
                       <span className="text-[7px] text-zinc-600 font-mono">NODE_ACTIVE</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-full bg-zinc-900/50 border border-white/5 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-500">
                  <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
              </div>

              {/* Technical Bottom Decor */}
              <div className="mt-4 pt-3 border-t border-white/[0.02] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex gap-2">
                  <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                </div>
                <span className="text-[6px] font-mono text-zinc-700 uppercase tracking-widest">HACK_APPLE_SCRIPT_STABLE</span>
              </div>
            </button>
          </MotionDiv>
        ))}
      </div>

      {/* System Footer Decor */}
      <div className="mt-20 flex flex-col items-center gap-4 opacity-10">
        <div className="flex items-center gap-6">
          <Cpu className="w-4 h-4 text-white" />
          <Radio className="w-4 h-4 text-white" />
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-3">
           <div className="h-[1px] w-6 bg-zinc-800" />
           <span className="text-[7px] font-black text-white tracking-[0.8em] uppercase italic">HACK APPLE SCRIPT v3.1</span>
           <div className="h-[1px] w-6 bg-zinc-800" />
        </div>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-10 left-10 opacity-5 hidden sm:block">
        <div className="w-10 h-10 border-t-2 border-l-2 border-white" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-5 hidden sm:block">
        <div className="w-10 h-10 border-b-2 border-r-2 border-white" />
      </div>
    </MotionDiv>
  );
};
