import { useState, useCallback } from "react";
import { useCursor } from "@react-three/drei";

/**
 * Manages POI hover/click interactions and visual feedback
 * @param {function} dispatch - Settings context dispatcher
 * @param {string} poiName - Name of the POI
 * @param {object} metadata - Additional POI data
 * @param {string[]} imageFiles - Associated image path
 * @returns {{
 *   isHovered: boolean,
 *   interactionHandlers: { onPointerOver: function, onPointerOut: function, onClick: function }
 * }}
 */
export const usePOIInteractions = (dispatch, poiName, metadata, imageFiles) => {
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  const handlePointerOver = useCallback(() => setIsHovered(true), []);
  const handlePointerOut = useCallback(() => setIsHovered(false), []);

  const handleClick = useCallback(() => {
    setIsHovered(false);
    dispatch({
      type: "SELECT_POI",
      payload: { poiName, metadata, imageFiles },
    });
  }, [dispatch, poiName, metadata, imageFiles]);

  return {
    isHovered,
    interactionHandlers: {
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
      onClick: handleClick
    }
  };
};