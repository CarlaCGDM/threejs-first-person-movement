import { useRef, useState } from "react";
import { Overlay } from "./UI/Overlay";
import propsData from "../data/propsData.json";
import Content from "./Content";

export default function Scene() {

    // References for the player and orbit controls
    const playerRef = useRef();
    const orbitControlsRef = useRef();

    return (
        <>
            <Content
                playerRef={playerRef}
                orbitControlsRef={orbitControlsRef}
            />
            
            {/* UI overlay for additional controls and information */}
            <Overlay props={propsData} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />

        </>
    );
}
