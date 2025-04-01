// components/UI/LoadingScreen.jsx
import { Html, useProgress } from "@react-three/drei";

export function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html
      as="div" // Render as regular div
      wrapperClass="html-wrapper" // Class for the wrapper
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Inject the keyframes */}
      <style>{styles.spinKeyframes}</style>
      
      <div style={styles.container}>
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
          Loading... {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

// Define all styles as constants
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
      pointerEvents: 'none', // Allows clicks to pass through
    },
    container: {
      width: '300px',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid rgba(255, 255, 255, 0.3)',
      borderTop: '5px solid #4CAF50',
      borderRadius: '50%',
      margin: '0 auto 20px',
      animation: 'spin 1s linear infinite',
    },
    progressBar: {
      width: '100%',
      height: '10px',
      backgroundColor: '#333',
      borderRadius: '5px',
      overflow: 'hidden',
      marginBottom: '10px',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4CAF50',
      transition: 'width 0.1s ease-out',
    },
    progressText: {
      fontSize: '16px',
    },
    // Keyframes as an inline style tag
    spinKeyframes: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
  };