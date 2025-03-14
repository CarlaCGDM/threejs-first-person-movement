import './App.css'
import { SettingsProvider } from "./context/SettingsContext";
import Scene from "./components/Scene";

export default function App() {
    return (
        <SettingsProvider>
            <Scene />
        </SettingsProvider>
    );
}