import { useState, Suspense } from "react";
import { TutorialScreen } from "./TutorialScreen";
import { TutorialContentWrapper } from "./TutorialContentWrapper";
import { TutorialControls } from "./TutorialControls";
import { TutorialOverlay } from "./TutorialOverlay";
import { Fossil } from "../icons/Fossil";
import { RightMouseButton } from "../icons/RightMouseButton";
import { MinimapOn } from "../icons/MinimapOn";
import { NpcsOn } from "../icons/NPCsOn";
import { WireframeLoader } from "./WireframeLoader";

export function Tutorial({ onClose }) {

    const [currentScreen, setCurrentScreen] = useState(0);
    const tutorialScreens = [
        {
            title: "¡Te damos la bienvenida a la Cova Bonica!",
            content: (
                <>
                    <WireframeLoader modelUrl={"/assets/models/CovaBonica_LODs/LOD_00.glb"} />
                    <p>
                        En este tour virtual podrás explorar la cueva, descubrir algunos de los restos que se hallaron y conocer más sobre los pobladores que la habitaron.
                    </p>
                    <p>
                        Usa las <strong>teclas</strong><img
                            src="/assets/icons/ui/letter_set.png"
                            alt="teclas WASD"
                            title="Teclas WASD"
                            style={{
                                height: "2.3em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em",
                                paddingBottom: "0.5em",
                            }}
                        />para moverte libremente. Mantén pulsado el <strong>clic derecho del ratón</strong><RightMouseButton
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
                        />para rotar la cámara y no perderte nada.
                    </p>
                </>
            ),
        },
        {
            title: "Tutorial",
            content: (
                <>
                    <p>
                        El <strong>localizador</strong>,<MinimapOn
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
                        />del menú superior te permite mostrar u ocultar el mapa en 3D que te indicará en qué parte de la cueva te encuentras. El <strong>fósil</strong><Fossil
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
                        />te dará acceso a información interesante sobre el yacimiento arqueológico.
                    </p>
                    <p>
                        Las <strong>miniaturas</strong><img
                            src="/assets/icons/props/MaxilarLeon/64.png"
                            alt="miniatura"
                            title="Miniatura"
                            style={{
                                height: "2em",
                                width: "auto",
                                verticalAlign: "middle",
                                margin: "0 0.3em",
                                marginBottom: "0.1em"
                            }}
                        />del menú inferior representan los hallazgos que puedes ver durante el recorrido.  Si pulsas en alguno, te transportarás directamente delante de él.
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
                        Puedes hacer clic sobre los <strong>hallazgos</strong> o <strong>puntos de interés</strong> para ver información adicional.
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
                        </div> o su <strong>indicador intermitente</strong>
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