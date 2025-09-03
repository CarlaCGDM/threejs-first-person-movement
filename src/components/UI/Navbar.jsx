import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { VolumeControl } from './audio/VolumeControl';
import { IconButton } from './IconButton';
import { useTranslations } from '../../hooks/useTranslations';
import { useIsMobile } from '../../hooks/useIsMobile';

export function Navbar() {
  const { settings, dispatch } = useSettings();
  const isMobile = useIsMobile();

  // Track orientation
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight >= window.innerWidth : true
  );

  useEffect(() => {
    const onResize = () => setIsPortrait(window.innerHeight >= window.innerWidth);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const isMobilePortrait = isMobile && isPortrait;

  const { getComponentLabels } = useTranslations();
  const UILabels = getComponentLabels('navbar');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error('Error entering fullscreen:', err));
    } else {
      document.exitFullscreen().catch((err) => console.error('Error exiting fullscreen:', err));
    }
  };

  return (
    <>
      <div
        style={{
          ...styles.navbarContainer,
          backgroundColor: settings.ui.isFullscreen ? 'transparent' : '#272626',
          borderBottom: settings.ui.isFullscreen ? 'none' : '1px solid #3a3a3a',
        }}
      >
        {!settings.ui.isFullscreen && (
          <div
            style={{
              ...styles.title,
              fontSize: isMobilePortrait ? '1rem' : '1.2rem', // 🔹 smaller on mobile portrait
            }}
          >
            {UILabels.title}
          </div>
        )}

        <div
          style={{
            ...styles.buttonsContainer,
            opacity: settings.ui.isFullscreen ? 0 : 1,
          }}
        >
          <IconButton
            iconOn="cave.svg"
            isActive={settings.ui.showInstructions}
            isHighlighted={!settings.ui.showTutorial}
            onClick={() => dispatch({ type: 'TOGGLE_INFO' })}
            title={UILabels.infoAboutCave}
          />

          <IconButton
            iconOn="toggle_npcs_on.svg"
            iconOff="toggle_npcs_off.svg"
            isActive={settings.ui.showNPCs}
            isHighlighted={!settings.ui.showTutorial}
            onClick={() => dispatch({ type: 'TOGGLE_NPCS' })}
            title={UILabels.virtualVisitors}
          />

          <IconButton
            iconOn="toggle_minimap_on.svg"
            iconOff={!settings.ui.showTutorial ? 'toggle_minimap_off.svg' : 'toggle_minimap_on.svg'}
            isActive={settings.ui.showMinimap}
            isHighlighted={!settings.ui.showTutorial}
            onClick={() => dispatch({ type: 'TOGGLE_MINIMAP' })}
            title={UILabels.minimap}
          />

          <IconButton
            iconOn="toggle_credits.svg"
            isActive={settings.ui.showCredits}
            isHighlighted={!settings.ui.showTutorial}
            onClick={() => dispatch({ type: 'TOGGLE_CREDITS' })}
            title={UILabels.creditsAndAcknowledgments}
          />

          <VolumeControl />

          <IconButton
            iconOn="toggle_fullscreen.svg"
            isActive={settings.ui.isFullscreen}
            isHighlighted={!settings.ui.showTutorial}
            onClick={toggleFullscreen}
            title={UILabels.fullscreen}
          />
        </div>
      </div>

      {settings.ui.isFullscreen && (
        <div style={styles.hiddenNavbarContainer}>
          <IconButton
            iconOn="toggle_fullscreen.svg"
            isActive={settings.ui.isFullscreen}
            isHighlighted={false}
            onClick={() => dispatch({ type: 'TOGGLE_FULLSCREEN' })}
            title="Pantalla completa"
          />
        </div>
      )}
    </>
  );
}

const styles = {
  navbarContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '5vh',
    minHeight: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
    zIndex: 1000,
    pointerEvents: 'auto',
  },
  title: {
    fontFamily: "'Mulish', sans-serif",
    color: '#E2E2E2',
    fontSize: '1.2rem', // default
    letterSpacing: '0%',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  hiddenNavbarContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '5vh',
    minHeight: '40px',
    opacity: '0.5',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
    zIndex: 1000,
    pointerEvents: 'auto',
  },
};
