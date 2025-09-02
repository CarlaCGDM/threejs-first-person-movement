import './App.css'
import { SettingsProvider } from "./context/SettingsContext";
import { LanguageProvider } from './context/LanguageContext';
import { DebugProvider } from './context/DebugContext';
import Scene from "./components/Scene";

export default function App() {

    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Prevent pinch zoom
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });

    return (
        <DebugProvider>
            <LanguageProvider>
                <SettingsProvider>
                    <Scene />
                </SettingsProvider>
            </LanguageProvider>
        </DebugProvider>
    );
}