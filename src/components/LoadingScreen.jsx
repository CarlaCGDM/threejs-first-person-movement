// components/UI/LoadingScreen.jsx
import { Html, useProgress } from "@react-three/drei";

export function LoadingScreen() {
  const { progress } = useProgress();

  const styles = {
    wrapper: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(39, 38, 38, 0.9)', // Navbar color with opacity
      pointerEvents: 'none',
      zIndex: 999, // Just below navbar
    },
    container: {
      width: '300px',
      padding: '25px',
      backgroundColor: '#272626', // Exact navbar background
      borderRadius: '8px',
      color: '#E2E2E2', // Navbar text color
      fontFamily: "'Mulish', sans-serif",
      textAlign: 'center',
      border: '1px solid #3a3a3a', // Navbar border
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
      border: '3px solid #3a3a3a', // Dark border like navbar
      borderTop: '3px solid #E2E2E2', // Light color like navbar text
      borderRadius: '50%',
      margin: '0 auto 20px',
      animation: 'spin 1s linear infinite',
    },
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#3a3a3a', // Navbar border color
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: '15px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#E2E2E2', // Navbar text color
      transition: 'width 0.2s ease-out',
    },
    progressText: {
      fontSize: '0.9rem',
      letterSpacing: '0.5px',
    },
    spinKeyframes: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
  };

  return (
    <Html
      as="div"
      style={styles.wrapper}
    >
      <style>{styles.spinKeyframes}</style>
      
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
          {Math.round(progress)}% complete
        </div>
      </div>
    </Html>
  );
}