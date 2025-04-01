import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";

// Individual tutorial screen component
function TutorialScreen({ title, content }) {
    return (
        <div style={styles.screen}>
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.content}>{content}</div>
        </div>
    );
}

export function Tutorial({ onClose }) {
    const tutorialScreens = [
        {
            title: "Tutorial",
            content: (
                <>
                    <p>Te damos la bienvenida al tour virtual de Cova Bonica.</p>
                    <p>
                        Aquí podrás explorar la cueva, descubrir algunos de los restos que se hallaron y conocer más sobre los pobladores que la habitaron.
                    </p>
                    <p>
                        En el menú superior encontrarás la <strong>guía</strong> <img src={`/assets/icons/ui/toggle_instructions.svg`} alt={"guía"} />
                        con los controles para poder moverte por la cueva, podrás consultarla en cualquier momento.
                    </p>
                </>
            ),
        },
        {
            title: "Navigation",
            content: (
                <p>
                    Use the <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L3 21h18L12 2z" /></svg> button to move around.
                </p>
            ),
        },
        {
            title: "Interacting with Objects",
            content: (
                <p>
                    Click on objects to learn more about them. Some may have detailed information or images.
                </p>
            ),
        },
    ];

    const [currentScreen, setCurrentScreen] = useState(0);

    const handleNext = () => {
        if (currentScreen < tutorialScreens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onClose(); // Notify the parent component when the tutorial is finished
        }
    };

    const handlePrevious = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    return (
        <>
            {/* Solid Background */}
            <div style={styles.background}></div>

            {/* Semi-transparent Image Overlay */}
            <div style={styles.imageOverlay}></div>

            {/* Tutorial Container */}
            <div style={styles.container}>
                <TutorialScreen {...tutorialScreens[currentScreen]} />
                <div style={styles.controls}>
                    {currentScreen > 0 && (
                        <button onClick={handlePrevious} style={styles.button}>Previous</button>
                    )}
                    <button onClick={handleNext} style={styles.button}>
                        {currentScreen === tutorialScreens.length - 1 ? "Start" : "Next"}
                    </button>
                </div>
            </div>
        </>
    );
}

const styles = {
    background: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#5a5a5a", // Solid gray background
        zIndex: 998, // Ensure it's behind everything
        pointerEvents: "none",
    },
    imageOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/assets/images/cb_bg.jpg')", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.1, // Set low opacity for faded effect
        zIndex: 999, // Above the solid background but below the tutorial UI
        pointerEvents: "none",
    },
    container: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#272626",
        opacity: "0.9",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        width: "60vw",
        height: "70vh",
        zIndex: 2000, // Ensure it's above everything
        fontFamily: "'Mulish', sans-serif",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        pointerEvents: "auto",
    },
    screen: {
        marginBottom: "20px",
    },
    title: {
        fontSize: "1.5rem",
        marginBottom: "15px",
        color: "#E2E2E2", // Matching navbar title color
    },
    content: {
        fontSize: "1rem",
        color: "#E2E2E2",
        marginBottom: "20px",
    },
    controls: {
        display: "flex",
        justifyContent: "space-between",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#3a3a3a",
        color: "#E2E2E2",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};
