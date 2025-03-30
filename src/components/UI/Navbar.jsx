import { useSettings } from '../../context/SettingsContext';
import { IconButton } from './IconButton';

export function Navbar() {
    const { settings, dispatch } = useSettings();

    return (
        <div style={styles.navbarContainer}>
            <div style={styles.title}>Cova Bonica Virtual Tour</div>
            
            <div style={styles.buttonsContainer}>
                <IconButton
                    iconOn="toggle_instructions.svg"
                    isActive={settings.ui.showInstructions}
                    onClick={() => dispatch({ type: "TOGGLE_INSTRUCTIONS" })}
                    title="Toggle Instructions"
                />

                <IconButton
                    iconOn="toggle_npcs_on.svg"
                    iconOff="toggle_npcs_off.svg"
                    isActive={settings.ui.showNPCs}
                    onClick={() => dispatch({ type: "TOGGLE_NPCS" })}
                    title="Toggle NPCs"
                />

                <IconButton
                    iconOn="toggle_minimap_on.svg"
                    iconOff="toggle_minimap_off.svg"
                    isActive={settings.ui.showMinimap}
                    onClick={() => dispatch({ type: "TOGGLE_MINIMAP" })}
                    title="Toggle Minimap"
                />

                <IconButton
                    iconOn="toggle_credits.svg"
                    isActive={settings.ui.showCredits}
                    onClick={() => dispatch({ type: "TOGGLE_CREDITS" })}
                    title="Show Credits"
                />

                <IconButton
                    iconOn="toggle_fullscreen.svg"
                    isActive={settings.ui.isFullscreen}
                    onClick={() => dispatch({ type: "TOGGLE_FULLSCREEN" })}
                    title="Toggle Fullscreen"
                />
            </div>
        </div>
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
        backgroundColor: '#272626',
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
        gap: '12px',
        alignItems: 'center'
    }
};