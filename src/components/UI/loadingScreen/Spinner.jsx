// src/components/UI/Spinner.js
export function Spinner({ size = 40 }) {
  const styles = {
    spinner: {
      width: `${size}px`,
      height: `${size}px`,
      border: '3px solid #3a3a3a',
      borderTop: '3px solid #E2E2E2',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.spinner} />
    </>
  );
}

