import { useEffect, useRef } from "react";
import { useSettings } from "../../../context/SettingsContext";

export function AudioManager() {
  const { settings } = useSettings();
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/assets/audio/bg_music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = settings.ui.audioVolume;

    // Handle autoplay policies
    const handleFirstInteraction = () => {
      if (settings.ui.isAudioOn) {
        audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      audioRef.current.pause();
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // Update audio based on settings changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Handle mute/unmute
    audioRef.current.muted = !settings.ui.isAudioOn;
    
    // Update volume (even when muted to remember last volume)
    audioRef.current.volume = settings.ui.audioVolume;

    // Play/pause based on audio state
    if (settings.ui.isAudioOn) {
      audioRef.current.play().catch(e => console.log("Play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [settings.ui.isAudioOn, settings.ui.audioVolume]);

  return null; // This component doesn't render anything
}