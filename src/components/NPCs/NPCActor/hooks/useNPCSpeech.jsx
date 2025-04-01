import { useState, useEffect } from 'react';
import phrases from '../../data/quotesData.json';

export function useNPCSpeech(closestTarget) {
  const [currentPhrase, setCurrentPhrase] = useState("");

  const getRandomPhrase = (key) => {
    const category = phrases[0][key];
    if (category && category.length > 0) {
      return category[Math.floor(Math.random() * category.length)];
    }
    return "I'm observing this interesting artifact";
  };

  useEffect(() => {
    if (closestTarget) {
      if (closestTarget.type === 'prop') {
        setCurrentPhrase(getRandomPhrase(closestTarget.artifactName));
      } else {
        setCurrentPhrase(getRandomPhrase("Cova bonica"));
      }
    } else {
      setCurrentPhrase(getRandomPhrase("Cova bonica"));
    }
  }, [closestTarget]);

  return currentPhrase;
}