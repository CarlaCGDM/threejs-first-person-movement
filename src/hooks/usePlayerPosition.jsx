// hooks/usePlayerPosition.js
import { useFrame } from '@react-three/fiber';
import { useSettings } from '../context//SettingsContext';

export function usePlayerPosition() {
  const { settings, dispatch } = useSettings();

  useFrame(() => {
    if (settings.playerRef?.current?.position) {
      const pos = settings.playerRef.current.position;
      dispatch({
        type: "UPDATE_PLAYER_POSITION",
        payload: [pos.x, pos.y, pos.z]
      });
    }
  });
}