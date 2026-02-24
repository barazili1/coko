import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppleGame } from './components/AppleGame';
import { SplashScreen } from './components/SplashScreen';
import { Conditions } from './components/Conditions';
import { SelectionScreen } from './components/SelectionScreen';
import { Login } from './components/Login';
import { ViewState, AccessKey, Language, Platform } from './types';
import { translations } from './translations';
import { playSound } from './services/audio';

const MotionDiv = motion.div as any;

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isVerified, setIsVerified] = useState(() => {
    try {
      return localStorage.getItem('user_verified') === 'true';
    } catch { return false; }
  });

  const [platform, setPlatform] = useState<Platform>(() => {
    try {
      return (localStorage.getItem('selected_platform') as Platform) || '1XBET';
    } catch { return '1XBET'; }
  });

  const [accessKeyData, setAccessKeyData] = useState<AccessKey | null>(() => {
      try {
          const saved = localStorage.getItem('access_key_data');
          return saved ? JSON.parse(saved) : null;
      } catch { return null; }
  });

  const [view, setView] = useState<ViewState>(() => {
    if (!isVerified) return 'SELECTION';
    return accessKeyData ? 'APPLE' : 'LOGIN';
  });

  const [language, setLanguage] = useState<Language>(() => {
      try { return (localStorage.getItem('app_language') as Language) || 'en'; } catch { return 'en'; }
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const handlePlatformSelect = (p: Platform) => {
    setPlatform(p);
    localStorage.setItem('selected_platform', p);
    setView('CONDITIONS');
  };

  const handleVerificationComplete = (isAdmin: boolean) => {
    setIsVerified(true);
    localStorage.setItem('user_verified', 'true');
    localStorage.setItem('admin_pending', isAdmin ? 'true' : 'false');
    setView('LOGIN');
  };

  const handleSignOut = () => {
    playSound('click');
    setIsVerified(false);
    setAccessKeyData(null);
    localStorage.removeItem('user_verified');
    localStorage.removeItem('access_key_data');
    localStorage.removeItem('admin_pending');
    setView('SELECTION');
  };

  const handleLoginSuccess = (data: AccessKey) => {
    const isAdmin = localStorage.getItem('admin_pending') === 'true';
    const finalData = { ...data, isAdminMode: data.isAdminMode || isAdmin };
    setAccessKeyData(finalData);
    localStorage.setItem('access_key_data', JSON.stringify(finalData));
    setView('APPLE');
  };

  const renderContent = () => {
    if (!isVerified) {
      if (view === 'SELECTION') {
        return <SelectionScreen onSelect={handlePlatformSelect} language={language} />;
      }
      return <Conditions 
        onComplete={handleVerificationComplete} 
        onBack={() => setView('SELECTION')}
        language={language} 
        onLanguageChange={handleLanguageChange} 
        platform={platform} 
      />;
    }

    if (!accessKeyData && view === 'LOGIN') {
      return <Login onLoginSuccess={handleLoginSuccess} language={language} onLanguageChange={handleLanguageChange} />;
    }

    return <AppleGame 
      onBack={handleSignOut} 
      accessKeyData={accessKeyData} 
      language={language} 
      onLanguageChange={handleLanguageChange} 
      platform={platform} 
    />;
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-red-500/30 ${language === 'ar' ? 'font-ar' : 'font-en'}`}>
      <AnimatePresence mode="wait">
        {isBooting ? (
          <SplashScreen key="splash" language={language} onComplete={() => setIsBooting(false)} />
        ) : (
          <MotionDiv 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto relative flex flex-col min-h-screen bg-[#050505]"
          >
            <AnimatePresence mode="wait">
                <MotionDiv key={accessKeyData ? 'game-view' : view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    {renderContent()}
                </MotionDiv>
            </AnimatePresence>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};