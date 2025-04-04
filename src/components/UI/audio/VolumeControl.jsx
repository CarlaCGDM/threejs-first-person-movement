import { useState, useRef, useEffect } from "react";
import { useSettings } from "../../../context/SettingsContext";
import { IconButton } from "../IconButton";

export function VolumeControl() {
  const { settings, dispatch } = useSettings();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timeoutRef = useRef(null);

  const toggleMute = () => {
    dispatch({ type: "TOGGLE_AUDIO" });
  };

  const handleVolumeChange = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const height = rect.height;
    const y = rect.bottom - e.clientY;
    const volume = Math.min(1, Math.max(0, y / height));
    dispatch({ type: "SET_VOLUME", payload: volume });
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleButtonMouseEnter = () => {
    setIsHovered(true);
    clearTimeout(timeoutRef.current);
  };

  const handleButtonMouseLeave = () => {
    if (!isDragging) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  };

  const handleSliderMouseEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleSliderMouseLeave = () => {
    if (!isDragging) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 500);
    }
  };

  const startDrag = (e) => {
    setIsDragging(true);
    handleVolumeChange(e); // Update volume immediately on click
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  return (
    <div 
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
      }}
      onMouseEnter={handleButtonMouseEnter}
      onMouseLeave={handleButtonMouseLeave}
    >
      <IconButton
        iconOn="toggle_audio_on.svg"
        iconOff="toggle_audio_off.svg"
        isActive={settings.ui.isAudioOn}
        isHighlighted={!settings.ui.showTutorial}
        onClick={toggleMute}
        title={settings.ui.isAudioOn ? "Mute" : "Unmute"}
      />
      
      {(isHovered || isDragging) && (
        <div 
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            right: "50%",
            transform: "translateX(50%)",
            width: "30px",
            height: "100px",
            backgroundColor: "#272626",
            border: "1px solid #3a3a3a",
            borderRadius: "4px",
            padding: "10px 5px",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            zIndex: 1100,
            cursor: "pointer",
            marginTop: "4px",
          }}
          onMouseEnter={handleSliderMouseEnter}
          onMouseLeave={handleSliderMouseLeave}
          onMouseDown={startDrag}
          onMouseMove={handleVolumeChange}
          onMouseUp={endDrag}
        >
          <div style={{
            width: "4px",
            height: "100%",
            backgroundColor: "#3a3a3a",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              bottom: `${settings.ui.audioVolume * 100}%`,
              left: "-6px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#E2E2E2",
              transform: "translateY(50%)",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}