import { useEffect, useState } from "react";

export function useCustomKeyboardControls() {
    const [keys, setKeys] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
    });

    // Function to update key states - can be called by both keyboard and mobile controls
    const updateKey = (key, pressed) => {
        setKeys((prev) => ({ ...prev, [key]: pressed }));
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case "w":
                case "W":
                case "ArrowUp":
                    updateKey("forward", true);
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    updateKey("backward", true);
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    updateKey("left", true);
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    updateKey("right", true);
                    break;
                case " ":
                    updateKey("jump", true);
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event) => {
            switch (event.key) {
                case "w":
                case "W":
                case "ArrowUp":
                    updateKey("forward", false);
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    updateKey("backward", false);
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    updateKey("left", false);
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    updateKey("right", false);
                    break;
                case " ":
                    updateKey("jump", false);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return { keys, updateKey };
}