// NPCSpeech.jsx
import { Text } from '@react-three/drei';

export default function NPCSpeech({ npcRef, comment }) {
  return (
    <Text
      position={[0, 2.5, 0]} // Above NPC's head
      fontSize={0.2}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {comment}
    </Text>
  );
}