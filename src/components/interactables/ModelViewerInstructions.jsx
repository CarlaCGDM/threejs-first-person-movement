export function ModelViewerInstructions() {
    return (
        <div style={styles.instructionsPanel}>
            <p style={styles.text}>
                <img
                    src={`/assets/icons/ui/mouse_left.svg`}
                    alt="Orbitar"
                    style={{
                        height: "2em",
                        width: "auto",
                        verticalAlign: "middle",
                        margin: "0 0.3em 0.1em",
                        filter: "brightness(0) saturate(100%)" // Makes icon solid black
                    }}
                /> Girar
            </p>
            <p style={styles.text}>
                <img
                    src={`/assets/icons/ui/mouse_middle.svg`}
                    alt="Zoom"
                    style={{
                        height: "2em",
                        width: "auto",
                        verticalAlign: "middle",
                        margin: "0 0.3em 0.1em",
                        filter: "brightness(0) saturate(100%)" // Makes icon solid black
                    }}
                /> Acercar / alejar
            </p>
            <p style={styles.text}>
                <img
                    src={`/assets/icons/ui/mouse_right.svg`}
                    alt="Desplazamiento"
                    style={{
                        height: "2em",
                        width: "auto",
                        verticalAlign: "middle",
                        margin: "0 0.3em 0.1em",
                        filter: "brightness(0) saturate(100%)" // Makes icon solid black
                    }}
                /> Desplazar
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