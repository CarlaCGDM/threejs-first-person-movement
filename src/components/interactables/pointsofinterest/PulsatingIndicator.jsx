import { Html } from "@react-three/drei";

const PulsatingIndicator = ({ onPointerOver, onPointerOut, onClick }) => {
    return (
        <Html
            center
            distanceFactor={5}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onClick={onClick}
            style={{ pointerEvents: "auto" }} // Ensure the Html component is interactive
        >
            <div
                onPointerOver={onPointerOver} // Attach event handlers to the div
                onPointerOut={onPointerOut}
                onClick={onClick}
                style={{ pointerEvents: "auto" }} // Ensure the div is interactive
            >
                <style>
                    {`
                        .pulsating-circle {
                            width: 30px;
                            height: 30px;
                            background-color: rgba(255, 255, 255, 0.8); /* Yellow */
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                            animation: pulse 1.5s infinite ease-in-out;
                        }

                        @keyframes pulse {
                            0% {
                                transform: scale(1);
                                opacity: 0.8;
                            }
                            50% {
                                transform: scale(1.5);
                                opacity: 0.4;
                            }
                            100% {
                                transform: scale(1);
                                opacity: 0.8;
                            }
                        }
                    `}
                </style>
                <div className="pulsating-circle"></div>
            </div>
        </Html>
    );
};

export default PulsatingIndicator;