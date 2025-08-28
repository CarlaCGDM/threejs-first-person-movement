import multilanguageCreditsData from "../../data/creditsData.json"
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

export function CreditsModal({ onClose }) {

    // Language settings
    const { language } = useContext(LanguageContext); // Get language from context

    // Select the appropriate data based on language setting
    const creditsData = language === 'ES' ? multilanguageCreditsData.ES : multilanguageCreditsData.EN

    return (
        <div style={styles.modalContainer}>
            <div style={styles.modalContent}>
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>
                <div style={styles.modalHeader}>
                    <h2 style={styles.title}>{creditsData.credits.title}</h2>
                </div>
                <div style={styles.content}>
                    <p style={styles.paragraph}>
                        {creditsData.credits.content[0]}
                    </p>
                    <p style={styles.paragraph}>
                        {creditsData.credits.content[1]}
                    </p>

                    <div style={styles.section}>
                        <h3 style={styles.subtitle}>{creditsData.acknowledgements.title}</h3>
                        <p style={styles.paragraph}>
                            {creditsData.acknowledgements.content[0]}
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
        "&::WebkitScrollbar": {
            width: "6px",
        },
        "&::WebkitScrollbarTrack": {
            background: "transparent",
        },
        "&::WebkitScrollbarThumb": {
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