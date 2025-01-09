import React, { forwardRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

type HorseNumberProps = {
  position: [number, number, number];
  number: number;
  color?: string;
};

const HorseNumber = forwardRef<THREE.Group, HorseNumberProps>(
  ({ number, color = "blue" }, ref) => {
    const radius = 2.2; // Radius of the circle

    return (
      <group ref={ref as any} rotation={[0, -Math.PI / 4, 0]}> {/* -Math.PI/4 is 45 degrees left */}
        {/* Circular Background */}
        <mesh position={[0, 11, 3.5]}>
          <circleGeometry args={[radius, 24]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Number Text */}
        <Text
          position={[0, 11, 4]} // Adjust position relative to the group
          fontSize={2.2} // Adjust the size of the text
          color="white" // Text color
          anchorX="center" // Horizontal anchor
          anchorY="middle" // Vertical anchor
          outlineColor="black" // Black outline for better visibility
          outlineWidth={.2} // Outline width
        >
          {number.toString()}
        </Text>
      </group>
    );
  }
);

HorseNumber.displayName = "HorseNumber";

export default HorseNumber;