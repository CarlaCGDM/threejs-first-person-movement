import './App.css'
import { SettingsProvider } from "./context/SettingsContext";
import { LanguageProvider } from './context/LanguageContext';
import Scene from "./components/Scene";

export default function App() {

    return (
        <LanguageProvider>
            <SettingsProvider>
                <Scene />
            </SettingsProvider>
        </LanguageProvider>
    );
}