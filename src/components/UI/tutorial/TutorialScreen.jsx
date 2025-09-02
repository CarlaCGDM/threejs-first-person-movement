import "./tutorial-styles.css";

export function TutorialScreen({ title, content, currentIndex, totalScreens }) {
  return (
    <div className="tutorial-screen">
      <div className="tutorial-progress">
        {Array.from({ length: totalScreens }).map((_, i) => (
          <div
            key={i}
            className={`tutorial-dot ${i === currentIndex ? "is-active" : ""}`}
          />
        ))}
      </div>

      <div className="tutorial-content-wrapper">
        <h2 className="tutorial-title">{title}</h2>
        <div className="tutorial-content">{content}</div>
      </div>
    </div>
  );
}
