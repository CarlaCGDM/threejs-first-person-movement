import './App.css'
import { SettingsProvider } from "./context/SettingsContext";
import { LanguageProvider } from './context/LanguageContext';
import { DebugProvider } from './context/DebugContext';
import Scene from "./components/Scene";

export default function App() {

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