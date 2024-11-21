import React, { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import HorseModel from "./horse-model";

type HorseProps = {
    number: number;
    color: string;
    targetPosition: THREE.Vector3;
    initialPosition: THREE.Vector3;
};

const Horse = forwardRef<THREE.Group, HorseProps>(
    ({ number, color, targetPosition, initialPosition }, ref) => {
        const localRef = useRef<THREE.Group>(null);
        const horseRef = ref || localRef;

        useEffect(() => {
            if (horseRef && 'current' in horseRef && horseRef.current) {
                horseRef.current.position.copy(initialPosition);
            }
        }, [initialPosition]);

        useFrame(() => {
            if (horseRef && 'current' in horseRef && horseRef.current) {
                horseRef.current.position.lerp(targetPosition, 0.1);
            }
        });

        return (
            <HorseModel
                ref={horseRef}
                number={number}
                color={color}
                scale={[0.05, 0.05, 0.05]} position={[0, 0, 0]} speed={0} />
        );
    }
);

Horse.displayName = "Horse";

export default Horse;
