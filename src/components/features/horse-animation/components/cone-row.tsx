import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import TrafficConeModel from './traffic-cone-model';

interface FenceRowProps {
  count: number;
  spacing: number;
  x: number;
}

const TrafficConeRow: React.FC<FenceRowProps> = ({ count, spacing, x }) => {
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
        <TrafficConeModel
          key={index}
          position={position}
          rotation={[0, 0, 0]}
          scale={[4,4,4]}
        />
      ))}
    </group>
  );
};

export default TrafficConeRow;
