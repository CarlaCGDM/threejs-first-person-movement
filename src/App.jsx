import './App.css'
import { SettingsProvider } from "./context/SettingsContext";
import Scene from "./components/Scene";

// In your main App.js or index.js
function preloadImages() {
    const images = [
      '/assets/icons/ui/arrow_left.svg',
      '/assets/icons/ui/arrow_right.svg',
      '/assets/icons/props/MaxilarLeon/64.png'
      // Add other frequently used icons
    ];
    
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  
  // Call this when your app initializes
  preloadImages();

export default function App() {
    return (
        <SettingsProvider>
            <Scene />
        </SettingsProvider>
    );
}