import "./tutorial-styles.css";
import { useIsMobile } from "../../../hooks/useIsMobile";

export function TutorialScreen({ title, content, currentIndex, totalScreens }) {
  const isMobile = useIsMobile();
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
        {((currentIndex === 0 && isMobile) || !isMobile) && <h2 className="tutorial-title">{title}</h2>}
        <div className="tutorial-content">{content}</div>
      </div>
    </div>
  );
}
