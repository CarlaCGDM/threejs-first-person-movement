import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Spinner } from './loadingScreen/Spinner';
import caveIcon from '/assets/icons/ui/cave.svg';
import { useProgress } from '@react-three/drei';

export function QualityToggle({isHDReady = false}) {
  const { progress, active } = useProgress(); // 🎯 real loading tracking
  const { settings, dispatch } = useSettings();
  const isActive = settings.showHDEnvironment;

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_HD_ENVIRONMENT' });
  };

  return (
    <div style={styles.toggleContainer}>
      <div style={styles.topRow}>
        <div style={styles.iconContainer}>
          <img src={caveIcon} alt="Quality toggle" style={styles.icon} />
        </div>
        <div
          style={{
            ...styles.toggleSwitch,
            backgroundColor: isActive ? '#bbbbbb' : 'grey'
          }}
          onClick={handleToggle}
        >
          <div
            style={{
              ...styles.toggleSlider,
              transform: isActive ? 'translateX(20px)' : 'translateX(0)'
            }}
          >
            {isActive ? "HD" : "SD"}
          </div>
        </div>
      </div>
  
      {/* Show when GLTFs are actively loading */}
      {(isActive && (!isHDReady || active)) &&
        <div style={styles.loadingRow}>
          <Spinner size={16} />
          <span style={styles.loadingText}>
           { isHDReady ? `Loading... ${Math.round(progress)}%` : `Fetching...`}
          </span>
        </div>
      }
    </div>
  );
  
}

const styles = {
  toggleContainer: {
    pointerEvents: "auto",
    position: "absolute",
    top: "50px",
    right: "10px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column", // overall structure is column (rows stacked)
    alignItems: "center",
    gap: "8px",
    opacity: 0.5,
  },
  topRow: {
    display: "flex",
    flexDirection: "row", // icon and toggle in a row
    alignItems: "center",
    gap: "8px",
  },
  toggleSwitch: {
    width: "44px",
    height: "24px",
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
    padding: "3px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  toggleSlider: {
    width: "18px",
    height: "18px",
    borderRadius: "2px",
    transition: "transform 0.3s, background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    color: "black",
    fontSize: "0.7em",
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '24px',
  },
  icon: {
    height: '24px',
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  loadingText: {
    fontSize: "0.9rem",
    color: "#E2E2E2",
  }
};
