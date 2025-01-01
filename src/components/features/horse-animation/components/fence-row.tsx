import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import FenceModel from './fence-mode'; // Ensure this path is correct

interface FenceRowProps {
  count: number;
  spacing: number;
  x: number;
}

const FenceRow: React.FC<FenceRowProps> = ({ count, spacing, x }) => {
  const fenceRowRef = useRef<any>();
  const speed = 0.90; // Speed of the animation
  const initialZPosition = -300;

  useFrame(() => {
    if (fenceRowRef.current) {
      fenceRowRef.current.position.z -= speed;

      if (fenceRowRef.current.position.z < -2000) {
        fenceRowRef.current.position.z = 0;
      }
    }
  });

  const fencePositions = Array.from({ length: count }, (_, index) => {
    return [x, 0, initialZPosition + (index * spacing)] as [number, number, number]; // Adjusted for initial starting position
  });

  return (
    <group ref={fenceRowRef}>
      {fencePositions.map((position, index) => (
        <FenceModel
          key={index}
          position={position}
          rotation={[0, 0, 0]}
          scale={[12, 12, 12]}
        />
      ))}
    </group>
  );
};

export default FenceRow;
