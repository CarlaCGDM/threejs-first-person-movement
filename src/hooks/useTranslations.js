// useTranslations.js
import { useContext, useCallback } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import phrases from '../components/NPCs/data/quotesData.json';

export const useTranslations = () => {
  const { language } = useContext(LanguageContext);

  // Wrap in useCallback with language as dependency
  const getRandomPhrase = useCallback((key) => {
    const langPhrases = phrases[language] || phrases['EN'];
    const category = langPhrases[key];
    
    if (category?.length > 0) {
      return category[Math.floor(Math.random() * category.length)];
    }
    
    return language === 'ES' 
      ? "Estoy observando este artefacto interesante" 
      : "I'm observing this interesting artifact";
  }, [language]);  // Only recreate when language changes

  return { getRandomPhrase, language };
};