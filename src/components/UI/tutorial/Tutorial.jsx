import { useState, Suspense, useContext } from "react";
import { TutorialScreen } from "./TutorialScreen";
import { TutorialContentWrapper } from "./TutorialContentWrapper";
import { TutorialControls } from "./TutorialControls";
import { TutorialOverlay } from "./TutorialOverlay";
import { Fossil } from "../icons/Fossil";
import { RightMouseButton } from "../icons/RightMouseButton";
import { MinimapOn } from "../icons/MinimapOn";
import { NpcsOn } from "../icons/NPCsOn";
import { WireframeLoader } from "./WireframeLoader";
import tutorialContent from "../../../data/tutorialData.json";
import { LanguageContext } from "../../../context/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

function parseContent(contentObj, replacements) {
    return Object.values(contentObj).map(({ content, type }, idx) => {
        const parts = content.split(/(@@[^@]+@@)/g); // split at placeholders

        const children = parts.map((part, i) =>
            replacements[part] !== undefined ? (
                <span key={i}>{replacements[part]}</span>
            ) : (
                <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
            )
        );

        if (type === "paragraph") {
            return <p key={idx}>{children}</p>;
        } else if (type === "media") {
            return <div key={idx} className="media-block">{children}</div>;
        } else {
            console.warn(`Unknown content type: ${type}`);
            return <div key={idx}>{children}</div>;
        }
    });
}


export function Tutorial({ onClose }) {

    const wireframeModel = <WireframeLoader modelUrl={"/assets/models/CovaBonica_LODs/LOD_00.glb"} />

    const letterSetIcon = <img
        src="/assets/icons/ui/letter_set.png"
        alt="teclas WASD"
        title="Teclas WASD"
        style={{
            height: "2.5em",
            width: "auto",
            verticalAlign: "middle",
            margin: "0 0.3em",
            marginBottom: "0.1em",
            paddingBottom: "0.5em",
        }}
    />

    const miniaturesIcon = <img
        src="/assets/icons/props/MaxilarLeon/64.png"
        alt="miniatura"
        title="Miniatura"
        style={{
            height: "2em",
            width: "auto",
            verticalAlign: "middle",
        }}
    />

    const iconStyle = {
        display: "inline-block",
        height: "1.75em",
        width: "auto",
        verticalAlign: "middle",
        margin: "0 0.2em",
        marginBottom: "0.1em"
    }

    const rightMouseButtonIcon = <RightMouseButton
        color="#E2E2E2"
        size={30}
        style={iconStyle}
    />
    const minimapIcon = <MinimapOn
        color="#E2E2E2"
        size={30}
        style={iconStyle}
    />
    const fossilIcon = <Fossil
        color="#E2E2E2"
        size={30}
        style={iconStyle}
    />

    const NPCsIcon = <NpcsOn
        color="#E2E2E2"
        size={30}
        style={iconStyle}
    />

    const screenshotStyle = {
        height: "20vh",
        width: "auto",
        verticalAlign: "middle",
        margin: "0 0.3em",
        marginBottom: "0.1em"
    }
    const screenshot_01 = <img
        src={`/assets/images/screenshots/screenshot_props_04.png`}
        alt={"hallazgo"}
        style={screenshotStyle} />

    const screenshot_02 = <img
        src={`/assets/images/screenshots/screenshot_props_03.png`}
        alt={"hallazgo"}
        style={screenshotStyle} />

    const screenshot_03 = <img
        src={`/assets/images/screenshots/screenshot_npcs_01.png`}
        alt={"visitantes virtuales"}
        style={screenshotStyle} />

    const screenshot_04 = <img
        src={`/assets/images/screenshots/screenshot_npcs_02.png`}
        alt={"visitantes virtuales"}
        style={screenshotStyle} />

    const floatingNameTag = <div style={{
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
    </div>

    const pulsatingIndicator = <>
        <span style={{ display: "inline-block", verticalAlign: "middle", margin: "0 0.3em", marginBottom: "0.2em" }}>
            <div className="pulsating-circle"></div>
        </span>
        <style>
            {`
        .pulsating-circle {
            width: 12px;
            height: 12px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            animation: pulse 1.5s infinite ease-in-out;
            display: inline-block;
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

    const replacements = {
        "@@wireframeModel@@": wireframeModel,
        "@@letterSetIcon@@": letterSetIcon,
        "@@rightMouseButtonIcon@@": rightMouseButtonIcon,
        "@@minimapIcon@@": minimapIcon,
        "@@fossilIcon@@": fossilIcon,
        "@@miniaturesIcon@@": miniaturesIcon,
        "@@screenshot_01@@": screenshot_01,
        "@@screenshot_02@@": screenshot_02,
        "@@screenshot_03@@": screenshot_03,
        "@@screenshot_04@@": screenshot_04,
        "@@floatingNameTag@@": floatingNameTag,
        "@@pulsatingIndicator@@": pulsatingIndicator,
        "@@NPCsIcon@@": NPCsIcon
    };

    const [currentScreen, setCurrentScreen] = useState(0);
    // Language settings
    const { language } = useContext(LanguageContext); // Get language from context
    const tutorialScreens = tutorialContent[language].map(screen => ({
        title: screen.title,
        content: parseContent(screen.content, replacements)
    }));


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
            <LanguageSelector />
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