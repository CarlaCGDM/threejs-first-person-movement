import { useTranslations } from "../../hooks/useTranslations";

export function InstructionsPanel() {

  const { getComponentLabels } = useTranslations();
  const UIlabels = getComponentLabels('instructionsPanel'); // Retrieve metadataPanel labels

    return (
      <div style={styles.instructionsPanel}>
        <p style={styles.text}><img
                            src={`/assets/icons/ui/mouse_right_02.svg`}
                            alt={"guía"}
                            style={{
                                height: "2em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        /> {UIlabels.camera}</p>
        <p style={styles.text}><img
                            src={`/assets/icons/ui/keys.svg`}
                            alt={"guía"}
                            style={{
                                height: "2em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        /> {UIlabels.movement}</p>
        
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