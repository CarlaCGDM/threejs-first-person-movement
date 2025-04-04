export function TutorialOverlay() {
    return (
      <>
        <div style={styles.background}></div>
        <div style={styles.midground}></div>
        <div style={styles.imageOverlay}></div>
      </>
    );
  }
  
  const styles = {
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#272626",
      zIndex: 998,
      pointerEvents: "auto",
    },
    midground: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0)",
      zIndex: 1999,
      pointerEvents: "auto",
    },
    imageOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage: "url('/assets/images/Portada.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.6,
      zIndex: 999,
      pointerEvents: "none",
    }
  };