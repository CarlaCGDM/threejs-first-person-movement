import { useSettings } from '../../context/SettingsContext';
import { VolumeControl } from './audio/VolumeControl';
import { IconButton } from './IconButton';

export function Navbar() {
    const { settings, dispatch } = useSettings();

    return (
        <>
            <div style={{...styles.navbarContainer, 
                backgroundColor: settings.ui.isFullscreen ? 'transparent' : '#272626',
                borderBottom: settings.ui.isFullscreen ? 'none' : "1px solid #3a3a3a",
                }}>
                {!settings.ui.isFullscreen && <div style={styles.title}>Cova Bonica Virtual Tour</div>}

                <div style={{...styles.buttonsContainer, opacity: settings.ui.isFullscreen ? 0 : 1}}>
                    <IconButton
                        iconOn="toggle_instructions.svg"
                        isActive={settings.ui.showInstructions}
                        isHighlighted={!settings.ui.showTutorial}
                        onClick={() => dispatch({ type: "TOGGLE_INSTRUCTIONS" })}
                        title="Toggle Instructions"
                    />

                    <IconButton
                        iconOn="toggle_npcs_on.svg"
                        iconOff="toggle_npcs_off.svg"
                        isActive={settings.ui.showNPCs}
                        isHighlighted={!settings.ui.showTutorial}
                        onClick={() => dispatch({ type: "TOGGLE_NPCS" })}
                        title="Toggle NPCs"
                    />

                    <IconButton
                        iconOn="toggle_minimap_on.svg"
                        iconOff="toggle_minimap_off.svg"
                        isActive={settings.ui.showMinimap}
                        isHighlighted={!settings.ui.showTutorial}
                        onClick={() => dispatch({ type: "TOGGLE_MINIMAP" })}
                        title="Toggle Minimap"
                    />

                    <IconButton
                        iconOn="toggle_credits.svg"
                        isActive={settings.ui.showCredits}
                        isHighlighted={!settings.ui.showTutorial}
                        onClick={() => dispatch({ type: "TOGGLE_CREDITS" })}
                        title="Show Credits"
                    />

                    < VolumeControl />

                    <IconButton
                        iconOn="toggle_fullscreen.svg"
                        isActive={settings.ui.isFullscreen}
                        isHighlighted={!settings.ui.showTutorial}
                        onClick={() => dispatch({ type: "TOGGLE_FULLSCREEN" })}
                        title="Toggle Fullscreen"
                    />
                </div>
            </div>
            {settings.ui.isFullscreen && <div style={styles.hiddenNavbarContainer}>
                <IconButton
                    iconOn="toggle_fullscreen.svg"
                    isActive={settings.ui.isFullscreen}
                    isHighlighted={false}
                    onClick={() => dispatch({ type: "TOGGLE_FULLSCREEN" })}
                    title="Toggle Fullscreen"
                />
            </div>}
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
        fontFamily: "'Mulish', sans-serif", // Fallback to sans-serif
        color: '#E2E2E2',
        fontSize: '1.2rem',
        letterSpacing: '0%'
    },
    buttonsContainer: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
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
    }
};