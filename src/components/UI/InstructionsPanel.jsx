export function InstructionsPanel() {
    return (
      <div style={styles.instructionsPanel}>
        {/* <h2 style={styles.heading}>Instructions</h2> */}
        <p style={styles.text}>Usa <strong>WASD</strong> para caminar (placeholder).</p>
        <p style={styles.text}><img
                            src={`/assets/icons/ui/mouse_right.svg`}
                            alt={"guía"}
                            style={{
                                height: "2em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        /> Cámara</p>
      </div>
    );
  }
  
  // Styles (same as before)
  const styles = {
    instructionsPanel: {
      position: "absolute",
      bottom: 5,
      left: 5,
      opacity: 0.5,
      zIndex: 1000,
      // backgroundColor: "rgba(0, 0, 0, 0.7)",
      // padding: "10px 20px",
      // borderRadius: "8px",
      // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
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