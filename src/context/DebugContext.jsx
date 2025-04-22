// src/contexts/DebugContext.jsx
import { createContext, useContext, useState } from 'react';

const DebugContext = createContext();

export function DebugProvider({ children }) {
  const [debugConfig, setDebugConfig] = useState({
    NPCs: {
      enabled: false, // Master toggle for all NPCs
      Pathfinding: false,
      Animations: false,
    },
    Cloudflare: {
      enabled: false,
      Chunks: false,
    },
    UI: {
      enabled: false,
      Tutorial: false,
    },
  });

  const toggleDebug = (category, key, value) => {
    setDebugConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <DebugContext.Provider value={{ debugConfig, toggleDebug }}>
      {children}
    </DebugContext.Provider>
  );
}

// src/contexts/DebugContext.jsx
export function useDebug(category, key) {
  const { debugConfig, toggleDebug } = useContext(DebugContext);
  
  // If used with params (e.g., `useDebug('Cloudflare', 'Chunks')`)
  if (category && key !== undefined) {
    return debugConfig[category]?.enabled && debugConfig[category]?.[key];
  }
  
  // If used without params (e.g., `useDebug()` in DebugPanel)
  return { debugConfig, toggleDebug };
}