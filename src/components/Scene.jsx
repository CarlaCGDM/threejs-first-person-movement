import { useRef, useContext } from "react";
import { Overlay } from "./UI/Overlay";
import Content from "./Content";
import { LanguageContext } from "../context/LanguageContext";
import multilanguagePropsData from "../data/propsData.json";
import multilanguagePOIsData from "../data/POIsData.json";
import multilanguageCaveData from "../data/caveData.json";
import multilanguageUIData from "../data/UIData.json";

export default function Scene() {

    // Language settings
    const { language } = useContext(LanguageContext); // Get language from context

    // References for the player and orbit controls
    const playerRef = useRef();
    const orbitControlsRef = useRef();

    // Select the appropriate data based on language setting
    const propsData = language === 'ES' ? multilanguagePropsData.ES : multilanguagePropsData.EN;
    const POIsData = language === 'ES' ? multilanguagePOIsData.ES : multilanguagePOIsData.EN;
    const caveData = language === 'ES' ? multilanguageCaveData.ES : multilanguageCaveData.EN;

    return (
        <>
            <Content
                playerRef={playerRef}
                orbitControlsRef={orbitControlsRef}
                propsData={propsData}
                POIsData={POIsData}
            />

            {/* UI overlay for additional controls and information */}
            <Overlay
                props={propsData}
                playerRef={playerRef}
                orbitControlsRef={orbitControlsRef}
                caveData={caveData}
            />

        </>
    );
}
