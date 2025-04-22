// logger.js
import { useDebug } from "../context/DebugContext";

export const createLogger = (component) => {
  const { debugState } = useDebug();
  
  // Parse component path (e.g., "npc.pathfinding")
  const pathParts = component.split('.');
  
  // Determine if logging is enabled for this component
  const isEnabled = () => {
    let current = debugState;
    
    // Check category master toggle first
    if (!current[pathParts[0]]?.enabled) return false;
    
    // Check specific component toggle if it exists
    for (const part of pathParts) {
      current = current[part];
      if (current === undefined || current === false) return false;
    }
    
    return true;
  };
  
  return {
    log: (...args) => isEnabled() && console.log(`[${component}]`, ...args),
    warn: (...args) => isEnabled() && console.warn(`[${component}]`, ...args),
    error: (...args) => console.error(`[${component}]`, ...args), // Always log errors
    info: (...args) => isEnabled() && console.info(`[${component}]`, ...args),
    debug: (...args) => isEnabled() && console.debug(`[${component}]`, ...args),
  };
};