import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';

export function useNPCSpeech(closestTarget) {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const { getRandomPhrase } = useTranslations();

  useEffect(() => {
    console.log("getting new phrase!")
    const key = closestTarget?.type === 'prop' 
      ? closestTarget.artifactName 
      : "Cova bonica";
    
    setCurrentPhrase(getRandomPhrase(key));
  }, [closestTarget, getRandomPhrase]);

  return currentPhrase;
}