export function useNPCAnimation({ isMoving, isInteracting }) {
    return {
      animation: isMoving ? "walk" : isInteracting ? "look" : "idle"
    };
  }