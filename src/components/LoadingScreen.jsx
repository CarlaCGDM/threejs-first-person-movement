import { useProgress } from "@react-three/drei";
import { useTranslations } from "../hooks/useTranslations";
import { useEffect } from "react";

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
      backgroundColor: 'rgba(39, 38, 38, 1)', // Solid color (no transparency)
      zIndex: 1000, // Very high to ensure it's on top
      pointerEvents: 'auto', // Block interactions
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
      letterSpacing: '0%',
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #3a3a3a',
      borderTop: '3px solid #E2E2E2',
      borderRadius: '50%',
      margin: '0 auto 20px',
      animation: 'spin 1s linear infinite',
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
  };

  if (!active) return null;

  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.title}>Loading Cova Bonica</div>
        <div style={styles.spinner}></div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`
            }}
          ></div>
        </div>
        <div style={styles.progressText}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}