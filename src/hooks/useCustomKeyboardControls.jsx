import { useEffect, useState } from "react";

export function useCustomKeyboardControls() {
    const [keys, setKeys] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false, // Add jump state
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case "w":
                case "W":
                case "ArrowUp":
                    setKeys((prev) => ({ ...prev, forward: true }));
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    setKeys((prev) => ({ ...prev, backward: true }));
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    setKeys((prev) => ({ ...prev, left: true }));
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    setKeys((prev) => ({ ...prev, right: true }));
                    break;
                case " ":
                    setKeys((prev) => ({ ...prev, jump: true })); // Set jump to true
                    console.log("Jump key pressed"); // Debug log
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
                    setKeys((prev) => ({ ...prev, forward: false }));
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    setKeys((prev) => ({ ...prev, backward: false }));
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    setKeys((prev) => ({ ...prev, left: false }));
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    setKeys((prev) => ({ ...prev, right: false }));
                    break;
                case " ":
                    setKeys((prev) => ({ ...prev, jump: false })); // Reset jump to false
                    console.log("Jump key released"); // Debug log
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

    return keys;
}
