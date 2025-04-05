
export function CreditsModal({ onClose }) {

    return (
        <div style={styles.modalContainer}>
            <div style={styles.modalContent}>
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>
                <div style={styles.modalHeader}>
                    <h2 style={styles.title}>Créditos</h2>

                </div>
                <div style={styles.content}>
                    <p style={styles.paragraph}>
                        Este proyecto ha sido llevado a cabo por Nadina Carla Cardillo Garreta y Laura Gómez Morgado.
                    </p>
                    <p style={styles.paragraph}>
                        Los modelos 3D utilizados fueron realizados para el Grup de Recerca del Quaternari (SERP) de la Universitat de Barcelona.
                    </p>

                    <div style={styles.section}>
                        <h3 style={styles.subtitle}>Agradecimientos:</h3>
                        <p style={styles.paragraph}>
                            A Joan Daura y Montserrat Sanz (GRQ) por su colaboración y a Almudena Yagüe por permitir el uso de sus ilustraciones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    modalContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        pointerEvents: "auto",
    },
    modalContent: {
        position: "relative",
        backgroundColor: "#F3EEEB",
        borderRadius: "0.25vw",
        maxWidth: "600px",
        maxHeight: "80vh",
        padding: "3vw",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "gray transparent",
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "gray",
            borderRadius: "3px",
        },
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        color: "#272626",
        fontFamily: "Mulish, sans-serif",
        fontSize: "1.5rem",
        margin: 0,
    },
    closeButton: {
        position: "absolute",
        top: "15px",
        right: "15px",
        background: "none",
        border: "none",
        color: "#272626",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: 30000,
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    section: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    subtitle: {
        color: "#272626",
        margin: 0,
        fontFamily: "Mulish, sans-serif",
        fontSize: "1rem",
        letterSpacing: "0.5px",
        fontWeight: "bold",
    },
    paragraph: {
        color: "#272626",
        margin: 0,
        fontFamily: "Mulish, sans-serif",
        fontSize: "0.9rem",
        lineHeight: "1.4",
    },

};