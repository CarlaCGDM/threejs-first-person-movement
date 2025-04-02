export function TutorialContentWrapper({ children }) {
    return <div style={styles.container}>{children}</div>;
  }
  
  const styles = {
    container: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#272626cc",
      border: "1px solid #3a3a3a",
      padding: "30px",
      width: "60vw",
      maxWidth: "800px",
      minHeight: "50vh",
      maxHeight: "80vh",
      zIndex: 2000,
      fontFamily: "'Mulish', sans-serif",
      display: "flex",
      flexDirection: "column",
      // boxShadow: "0 0 30px rgba(0, 0, 0, 0.7)",
      borderRadius: "1.25vw",
      overflow: "hidden",
    }
  };