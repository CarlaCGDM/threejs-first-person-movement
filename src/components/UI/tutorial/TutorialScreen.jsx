export function TutorialScreen({ title, content, currentIndex, totalScreens }) {
  return (
    <div style={styles.screen}>
      <div style={styles.progressContainer}>
        {Array.from({ length: totalScreens }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.progressDot,
              backgroundColor: i === currentIndex ? "#E2E2E2" : "#3a3a3a"
            }}
          />
        ))}
      </div>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>{title}</h2>
        <div style={styles.content}>{content}</div>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#E5B688 transparent",
    pointerEvents: "auto",
  },
  progressContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  progressDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    transition: "background-color 0.3s ease",
  },
  title: {
    color: "#E2E2E2",
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textAlign: "center",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    color: "#E2E2E2",
    fontSize: "1.1rem",
    lineHeight: "1.6",
    textAlign: "center",
    "& p": {
      marginBottom: "1rem",
    },
    "& img": {
      verticalAlign: "middle",
      height: "1.2em",
      margin: "0 0.2em",
    },
    "& svg": {
      verticalAlign: "middle",
      margin: "0 0.2em",
    },
    "& strong": {
      color: "#E5B688",
      fontWeight: 600,
    }
  }
};