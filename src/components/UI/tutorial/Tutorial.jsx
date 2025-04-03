import { useState, Suspense, useEffect } from "react";
import { TutorialScreen } from "./TutorialScreen";
import { TutorialContentWrapper } from "./TutorialContentWrapper";
import { TutorialControls } from "./TutorialControls";
import { TutorialOverlay } from "./TutorialOverlay";
import { Fossil } from "../icons/Fossil";
import { Guide } from "../icons/Guide";
import { MinimapOn } from "../icons/MinimapOn";
import { NpcsOn } from "../icons/NPCsOn";

const screenshot_npcs_01 = new Image();
screenshot_npcs_01.src = "/assets/images/screenshots/screenshot_npcs_01.png";
const screenshot_npcs_02 = new Image();
screenshot_npcs_02.src = "/assets/images/screenshots/screenshot_npcs_02.png";
const screenshot_props_03 = new Image();
screenshot_props_03.src = "/assets/images/screenshots/screenshot_props_03.png";
const screenshot_props_04 = new Image();
screenshot_props_04.src = "/assets/images/screenshots/screenshot_props_04.png";


export function Tutorial({ onClose }) {

    const [imageLoaded, setImageLoaded] = useState(false);
    const imageSrc = "/assets/icons/props/MaxilarLeon/64.png";

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => setImageLoaded(true); // Mark as loaded when finished
    }, []);

    const [currentScreen, setCurrentScreen] = useState(0);
    const tutorialScreens = [
        {
            title: "¡Te damos la bienvenida a la Cova Bonica!",
            content: (
                <>
                    <p>
                        En este tour virtual podrás explorar la cueva, descubrir algunos de los restos que se hallaron y conocer más sobre los pobladores que la habitaron.
                    </p>
                    <p>
                        En el menú superior encontrarás la <strong>guía</strong><Guide
                            color="#E2E2E2"
                            size={30}
                            style={{
                                display: "inline-block",
                                height: "1.4em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        />con los controles para poder moverte por la cueva, podrás consultarla en cualquier momento.
                    </p>
                </>
            ),
        },
        {
            title: "Tutorial",
            content: (
                <>
                    <p>
                        También el <strong>localizador</strong>,<MinimapOn
                            color="#E2E2E2"
                            size={30}
                            style={{
                                display: "inline-block",
                                height: "1.4em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        />para mostrar en 3D en que parte de la cueva te encuentras, así como el <strong>fósil</strong><Fossil
                            color="#E2E2E2"
                            size={30}
                            style={{
                                display: "inline-block",
                                height: "1.4em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        />con el que acceder a información interesante sobre el yacimiento arqueológico.
                    </p>
                    <p>
                        Por último, en el menú inferior tendrás las <strong>miniaturas</strong><img
                            src={imageSrc}
                            alt="miniatura"
                            style={{
                                height: "2em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        />de los diferentes hallazgos que puedes ver durante el recorrido. De esta manera, te podrás teletransportar directamente delante de ellos.
                    </p>
                </>
            ),
        },
        {
            title: "Tutorial",
            content: (
                <>
                    <img
                        src={`/assets/images/screenshots/screenshot_props_04.png`}
                        alt={"hallazgo"}
                        style={{
                            height: "10em",
                            width: "auto",
                            verticalAlign: "middle",
                            margin: "0 0.3em",
                            marginBottom: "0.1em"
                        }} />
                    <img
                        src={`/assets/images/screenshots/screenshot_props_03.png`}
                        alt={"hallazgo"}
                        style={{
                            height: "10em",
                            width: "auto",
                            verticalAlign: "middle",
                            margin: "0 0.3em",
                            marginBottom: "0.1em"
                        }} />
                    <p>
                        Puedes hacer clic sobre los <strong>hallazgos</strong> para ver información adicional sobre ellos.
                        Los reconocerás por su <strong>etiqueta flotante</strong> <div style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            background: '#272626CC',
                            color: '#E2E2E2',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '3em',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            opacity: 0.8,
                            transition: 'all 0.3s ease'
                        }}>
                            {"?"}
                        </div> o su <strong>indicador pulsante</strong>
                        <span style={{ display: "inline-block", verticalAlign: "middle", margin: "0 0.3em", marginBottom: "0.2em" }}>
                            <div className="pulsating-circle"></div>
                        </span>.
                    </p>

                    <style>
                        {`
        .pulsating-circle {
            width: 12px; /* Adjust size to fit inline text */
            height: 12px;
            background-color: rgba(255, 255, 255, 0.8); /* Yellow */
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            animation: pulse 1.5s infinite ease-in-out;
            display: inline-block; /* Ensure it stays inline */
            vertical-align: middle;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.5); opacity: 0.4; }
            100% { transform: scale(1); opacity: 0.8; }
        }
    `}
                    </style>

                </>
            ),
        },
        {
            title: "Tutorial",
            content: (
                <>
                    <img
                        src={`/assets/images/screenshots/screenshot_npcs_01.png`}
                        alt={"miniatura"}
                        style={{
                            height: "10em",
                            width: "auto",
                            verticalAlign: "middle",
                            margin: "0 0.3em",
                            marginBottom: "0.1em"
                        }} />
                    <img
                        src={`/assets/images/screenshots/screenshot_npcs_02.png`}
                        alt={"miniatura"}
                        style={{
                            height: "10em",
                            width: "auto",
                            verticalAlign: "middle",
                            margin: "0 0.3em",
                            marginBottom: "0.1em"
                        }} />
                    <p>
                        Otros <strong>visitantes virtuales</strong> te acompañarán en la visita. Prueba a acercarte a ellos, ¡tienen cosas muy interesantes que decir!
                    </p>
                    <p>
                        Si prefieres realizar la visita en solitario, puedes ocultarlos pulsando sobre el <strong>visitante</strong><NpcsOn
                            color="#E2E2E2"
                            size={30}
                            style={{
                                display: "inline-block",
                                height: "1.4em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        />en el menú superior.
                    </p>
                </>
            ),
        },
    ];

    const handleNext = () => {
        if (currentScreen < tutorialScreens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        } else {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (currentScreen > 0) setCurrentScreen(currentScreen - 1);
    };

    return (
        <>
            <TutorialOverlay />
            <TutorialContentWrapper>
                <TutorialScreen
                    {...tutorialScreens[currentScreen]}
                    currentIndex={currentScreen}
                    totalScreens={tutorialScreens.length}
                />
                <TutorialControls
                    currentIndex={currentScreen}
                    totalScreens={tutorialScreens.length}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onClose={onClose}
                />
            </TutorialContentWrapper>
        </>
    );
}