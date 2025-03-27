import { useState, useEffect, useCallback, useRef } from 'react';

export function useNPCActions({ onActionComplete }) {
  const [isPerformingActions, setIsPerformingActions] = useState(false);
  const timeoutRef = useRef();

  const startActions = useCallback((duration = 5000) => {
    setIsPerformingActions(true);
    timeoutRef.current = setTimeout(() => {
      setIsPerformingActions(false);
      onActionComplete?.();
    }, duration);
  }, [onActionComplete]);

  const resetActions = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsPerformingActions(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { isPerformingActions, startActions, resetActions };
}