import React, { forwardRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

type HorseNumberProps = {
  position: [number, number, number];
  number: number;
  color?: string;
};

const HorseNumber = forwardRef<THREE.Group, HorseNumberProps>(
  ({ number, color = "blue", position }, ref) => {
    const radius = 0.4; 
    const fontSize = 0.4; 

    const [x, y, z] = position;

    return (
      <group ref={ref as any} rotation={[0, -Math.PI / 4, 0]} position={[x, y, z]}>
        {/* Circular Background */}
        <mesh position={[0, 1.2, 0]}>
          <circleGeometry args={[radius, 24]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Number Text */}
        <Text
          position={[0, 1.2, 0]} // Adjusted position relative to the group
          fontSize={fontSize} // Further reduced font size
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineColor="black"
          outlineWidth={0.05}
          // Added depthTest to improve rendering and prevent flickering
          material-toneMapped={false} 
          onUpdate={(self) => {
            if (Array.isArray(self.material)) {
              self.material.forEach(mat => {
                mat.depthTest = false;
                mat.needsUpdate = true;
              });
            } else {
              self.material.depthTest = false; 
            }
          }}
        >
          {number.toString()}
        </Text>
      </group>
    );
  }
);

HorseNumber.displayName = "HorseNumber";

export default HorseNumber;
