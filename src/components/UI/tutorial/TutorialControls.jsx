import { TutorialButton } from './TutorialButton';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

export function TutorialControls({
  currentIndex,
  totalScreens,
  onNext,
  onPrevious,
  onClose
}) {
  const isMobile = useIsMobile();

  // If you ever want orientation-specific tweaks:
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight >= window.innerWidth : true
  );
  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight >= window.innerWidth);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === totalScreens - 1;

  if (isMobile) {
    // --- Mobile layout: buttons in the corners for easy thumb reach ---
    return (
      <div style={mobileStyles.controls}>
        {/* Left (Previous) — hidden on first screen */}
        {!isFirstScreen && (
          <div style={mobileStyles.leftCorner}>
            <TutorialButton
              onClick={onPrevious}
              variant="secondary"
              icon="arrow_left"
              iconSize={28}
              style={mobileStyles.button}
            />
          </div>
        )}

        {/* Right (Next/Start) */}
        <div style={mobileStyles.rightCorner}>
          {isLastScreen ? (
            <TutorialButton
              onClick={onClose}
              variant="primary"
              isHighlighted={true}
              icon={null}
              iconSize={28}
              style={mobileStyles.button}
            />
          ) : (
            <TutorialButton
              onClick={onNext}
              variant="primary"
              icon="arrow_right"
              iconSize={28}
              style={mobileStyles.button}
            />
          )}
        </div>
      </div>
    );
  }

  // --- Desktop layout: your original centered buttons ---
  return (
    <div style={styles.controls}>
      {/* First Screen - Only Continue button centered */}
      {isFirstScreen && (
        <div style={styles.singleButtonContainer}>
          <TutorialButton
            onClick={onNext}
            variant="primary"
            icon="arrow_right"
          />
        </div>
      )}

      {/* Middle Screens - Both buttons centered */}
      {!isFirstScreen && !isLastScreen && (
        <div style={styles.doubleButtonContainer}>
          <TutorialButton 
            onClick={onPrevious} 
            variant="secondary"
            icon="arrow_left"
          />
          <TutorialButton
            onClick={onNext}
            variant="primary"
            icon="arrow_right"
          />
        </div>
      )}

      {/* Last Screen - Previous and Start buttons */}
      {isLastScreen && (
        <div style={styles.doubleButtonContainer}>
          <TutorialButton 
            onClick={onPrevious} 
            variant="secondary"
            icon="arrow_left"
          />
          <TutorialButton
            onClick={onClose}
            variant="primary"
            isHighlighted={true}
          />
        </div>
      )}
    </div>
  );
}

// Desktop styles (unchanged)
const styles = {
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    pointerEvents: "auto",
    width: "100%",
  },
  singleButtonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  doubleButtonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
  }
};

// Mobile styles: corner placement
const mobileStyles = {
  controls: {
    position: 'relative',
    width: '100%',
    pointerEvents: 'auto',
    paddingTop: '10px',
    paddingBottom: '6px',
    minHeight: 56, // makes sure corners have room
  },
  leftCorner: {
    position: 'absolute',
    left: 'min(2.5svw, 10px)',
    bottom: 0,
  },
  rightCorner: {
    position: 'absolute',
    right: 'min(2.5svw, 10px)',
    bottom: 0,
  },
  button: {
    minHeight: "calc(min(15vh,15vw)",
    minWidth: "calc(min(20vh,20vw)",
  }
};
