import { useTranslations } from "../../hooks/useTranslations";

export function ModelViewerInstructions() {

    const { getComponentLabels } = useTranslations();
    const UILabels = getComponentLabels('modelViewerInstructions'); // Retrieve metadataPanel labels

    return (
        <div style={styles.instructionsPanel}>
            <p style={styles.text}>
                <img
                    src={`/assets/icons/ui/mouse_left.svg`}
                    alt={UILabels.pan}
                    style={{
                        height: "2em",
                        width: "auto",
                        verticalAlign: "middle",
                        margin: "0 0.3em 0.1em",
                        filter: "brightness(0) saturate(100%)" // Makes icon solid black
                    }}
                /> {UILabels.pan}
            </p>
            <p style={styles.text}>
                <img
                    src={`/assets/icons/ui/mouse_middle.svg`}
                    alt={UILabels.zoom}
                    style={{
                        height: "2em",
                        width: "auto",
                        verticalAlign: "middle",
                        margin: "0 0.3em 0.1em",
                        filter: "brightness(0) saturate(100%)" // Makes icon solid black
                    }}
                /> {UILabels.zoom}
            </p>
            
            <p style={styles.text}>
                <img
                    src={`/assets/icons/ui/mouse_right.svg`}
                    alt={UILabels.rotate}
                    style={{
                        height: "2em",
                        width: "auto",
                        verticalAlign: "middle",
                        margin: "0 0.3em 0.1em",
                        filter: "brightness(0) saturate(100%)" // Makes icon solid black
                    }}
                /> {UILabels.rotate}
            </p>
        </div>
    );
}

const styles = {
    instructionsPanel: {
        position: "absolute",
        bottom: 5,
        left: 5,
        opacity: 0.5,
        zIndex: 1000,
    },
    text: {
        margin: "5px 0",
        fontSize: "14px",
        color: "black",
    },
};