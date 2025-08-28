import { TutorialButton } from './TutorialButton';

export function TutorialControls({
  currentIndex,
  totalScreens,
  onNext,
  onPrevious,
  onClose
}) {
  const isFirstScreen = currentIndex === 0;
  const isLastScreen = currentIndex === totalScreens - 1;

  return (
    <div style={styles.controls}>
      {/* First Screen - Only Continue button centered */}
      {isFirstScreen && (
        <div style={styles.singleButtonContainer}>
          <TutorialButton
            onClick={onNext}
            variant="primary"
            icon="arrow_right"
          >
          </TutorialButton>
        </div>
      )}

      {/* Middle Screens - Both buttons centered */}
      {!isFirstScreen && !isLastScreen && (
        <div style={styles.doubleButtonContainer}>
          <TutorialButton 
            onClick={onPrevious} 
            variant="secondary"
            icon="arrow_left"
          >
          </TutorialButton>
          <TutorialButton
            onClick={onNext}
            variant="primary"
            icon="arrow_right"
          >
          </TutorialButton>
        </div>
      )}

      {/* Last Screen - Previous and Start buttons */}
      {isLastScreen && (
        <div style={styles.doubleButtonContainer}>
          <TutorialButton 
            onClick={onPrevious} 
            variant="secondary"
            icon="arrow_left"
          >
          </TutorialButton>
          <TutorialButton
            onClick={onClose}
            variant="primary"
            isHighlighted={true}
          >
          </TutorialButton>
        </div>
      )}
    </div>
  );
}

// Keep your existing styles
const styles = {
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px",
    //borderTop: "1px solid #3a3a3a",
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
    '@media (maxWidth: 480px)': {
      flexDirection: 'column',
      gap: '10px',
    }
  }
};