import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    appTitle: 'AgroAI',
    appSubtitle: 'Crop Advisory Assistant',
    tagline: 'Smart Farming Starts with Smarter Decisions',
    heroDesc: 'Get personalized crop recommendations, soil insights, irrigation guidance, and AI-powered agricultural support for better farming decisions.',
    getStarted: 'Get Started',
    exploreFeatures: 'Explore Features',
    login: 'Login',
    register: 'Create Account',
    logout: 'Logout',
    dashboard: 'Dashboard',
    profile: 'Farmer Profile',
    cropRecommendation: 'Crop Advisory',
    soilAnalysis: 'Soil Health',
    fertilizerAdvisory: 'Fertilizers',
    irrigationAdvisory: 'Irrigation',
    diseaseDetection: 'Disease & Pests',
    cultivationCalendar: 'Crop Calendar',
    aiAssistant: 'AI Assistant',
    advisoryHistory: 'History',
    settings: 'Settings',
    submit: 'Generate Advisory',
    loading: 'Analyzing agricultural parameters...',
    disclaimer: 'Advisory Notice: Recommendations are AI-assisted decision aids. Always verify with local agricultural extension offices (KVK) and perform laboratory soil testing.',
  },
  kn: {
    appTitle: 'ಆಗ್ರೋ-ಎಐ (AgroAI)',
    appSubtitle: 'ಕೃಷಿ ಬೆಳೆ ಸಲಹಾ ಸಹಾಯಕ',
    tagline: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಆರಂಭವಾಗುವುದು ಉತ್ತಮ ನಿರ್ಧಾರಗಳಿಂದ',
    heroDesc: 'ಉತ್ತಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಬೆಳೆ ಶಿಫಾರಸುಗಳು, ಮಣ್ಣಿನ ಒಳನೋಟಗಳು, ನೀರಾವರಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಎಐ ಕೃಷಿ ಬೆಂಬಲ ಪಡೆಯಿರಿ.',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    exploreFeatures: 'ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    login: 'ಲಾಗಿನ್ ಮಾಡಿ',
    register: 'ಖಾತೆ ರಚಿಸಿ',
    logout: 'ಲಾಗ್‌ಔಟ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    profile: 'ರೈತರ ಪ್ರೊಫೈಲ್',
    cropRecommendation: 'ಬೆಳೆ ಸಲಹೆ',
    soilAnalysis: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ',
    fertilizerAdvisory: 'ರಸಗೊಬ್ಬರ ಮಾಹಿತಿ',
    irrigationAdvisory: 'ನೀರಾವರಿ ಮಾರ್ಗದರ್ಶನ',
    diseaseDetection: 'ರೋಗ ಮತ್ತು ಕೀಟ ಪತ್ತೆ',
    cultivationCalendar: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್',
    aiAssistant: 'ಎಐ ಕೃಷಿ ಸಹಾಯಕ',
    advisoryHistory: 'ಇತಿಹಾಸ',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    submit: 'ಸಲಹೆ ಪಡೆಯಿರಿ',
    loading: 'ಕೃಷಿ ವಿವರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    disclaimer: 'ಗಮನಿಸಿ: ಎಐ ಕೃಷಿ ಶಿಫಾರಸುಗಳು ರೈತರ ನಿರ್ಧಾರಕ್ಕೆ ಬೆಂಬಲ ನೀಡುವ ಸಾಧನವಾಗಿದೆ. ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳಿಗೆ ನಿಮ್ಮ ಹತ್ತಿರದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agroai_language') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('agroai_language', lang);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

