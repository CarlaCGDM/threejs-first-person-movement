import './App.css'
import { SettingsProvider } from "./context/SettingsContext";
import Scene from "./components/Scene";

// In your main App.js or index.js
function preloadImages() {
    const images = [
        '/assets/icons/ui/arrow_left.svg',
        '/assets/icons/ui/arrow_right.svg',
        '/assets/icons/ui/fossil.svg',
        '/assets/icons/ui/mouse_right.svg',
        '/assets/icons/ui/toggle_credits.svg',
        '/assets/icons/ui/toggle_fullscreen.svg',
        '/assets/icons/ui/toggle_hd_off.svg',
        '/assets/icons/ui/toggle_hd_on.svg',
        '/assets/icons/ui/toggle_info_off.svg',
        '/assets/icons/ui/toggle_info_on.svg',
        '/assets/icons/ui/toggle_instructions.svg',
        '/assets/icons/ui/toggle_minimap_on.svg',
        '/assets/icons/ui/toggle_minimap_off.svg',
        '/assets/icons/ui/toggle_npcs_off.svg',
        '/assets/icons/ui/toggle_npcs_on.svg',
        '/assets/icons/images/screenshots/screenshot_npcs_01.png',
        '/assets/icons/images/screenshots/screenshot_npcs_02.png',
        '/assets/icons/images/screenshots/screenshot_props_03.png',
        '/assets/icons/images/screenshots/screenshot_props_04.png',
        '/assets/icons/props/MaxilarLeon/64.png'
        // Add other frequently used icons
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}


export default function App() {
    // Call this when your app initializes
    preloadImages();
    return (
        <SettingsProvider>
            <Scene />
        </SettingsProvider>
    );
}