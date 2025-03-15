export function InstructionsPanel() {
    return (
      <div style={styles.instructionsPanel}>
        <h2 style={styles.heading}>Instructions</h2>
        <p style={styles.text}>Use <strong>WASD</strong> to move.</p>
        <p style={styles.text}>Hold <strong>right mouse button</strong> to look around.</p>
      </div>
    );
  }
  
  // Styles (same as before)
  const styles = {
    instructionsPanel: {
      position: "absolute",
      bottom: 20,
      left: 20,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: "10px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    },
    heading: {
      margin: "0 0 10px 0",
      fontSize: "18px",
    },
    text: {
      margin: "5px 0",
      fontSize: "14px",
    },
  };