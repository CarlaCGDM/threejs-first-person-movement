// src/components/LoadingScreen.js
import { useProgress } from "@react-three/drei";
import { useTranslations } from "../../../hooks/useTranslations";
import { useEffect } from "react";
import { Spinner } from "./Spinner";

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const { getComponentLabels } = useTranslations();
  const UILabels = getComponentLabels('loadingScreen');

  // Prevent scrolling while loading
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(39, 38, 38, 1)',
      zIndex: 1000,
      pointerEvents: 'auto',
    },
    container: {
      width: '300px',
      padding: '25px',
      backgroundColor: '#272626',
      borderRadius: '8px',
      color: '#E2E2E2',
      fontFamily: "'Mulish', sans-serif",
      textAlign: 'center',
      border: '1px solid #3a3a3a',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '20px',
    },
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#3a3a3a',
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: '15px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#E2E2E2',
      transition: 'width 0.2s ease-out',
    },
    progressText: {
      fontSize: '0.9rem',
      letterSpacing: '0.5px',
    },
    spinnerContainer: {
      display: 'flex',          // Enable flexbox
      justifyContent: 'center', // Center horizontally
      alignItems: 'center',     // Center vertically
      marginBottom: '20px',     // Add space below spinner
    },
  };

  if (!active) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.title}>{UILabels?.title || "Loading Cova Bonica"}</div>
        {/* Centered Spinner */}
        <div style={styles.spinnerContainer}>
          <Spinner size={40} />
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
        </div>
        <div style={styles.progressText}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
