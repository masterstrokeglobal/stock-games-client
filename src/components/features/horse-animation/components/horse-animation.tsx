import React, { useMemo, useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
    PerspectiveCamera,
    Stats,
    Sky,
    OrbitControls,
} from "@react-three/drei";
import HorseModel from "./horse-model";
import { Ground } from "./Ground";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import FenceRow from "./fence-row";
import { RoundRecord } from "@/models/round-record";


const horseColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#B19CD9",
    "#FF9FF3",
    "#7FB3D5",
    "#F1948A",
    "#82E0AA",
    "#FAD7A0",
    "#D7BDE2",
    "#85C1E9",
    "#F8C471",
    "#73C6B6",
    "#E59866",
];

interface CameraControllerProps {
    target: React.MutableRefObject<THREE.Object3D | null>;
    enabled?: boolean;
}

const CameraController = React.memo(({ target }: CameraControllerProps) => {
    const { camera } = useThree();
    const targetRef = useRef(new THREE.Vector3());

    useFrame(() => {
        if (target.current) {
            const targetPosition = target.current.position;
            targetRef.current.set(
                targetPosition.x, // Keep the camera aligned horizontally
                targetPosition.y + 15, // Camera height closer to horse
                targetPosition.z + 40 // Keep closer to leading horse
            );
            camera.position.lerp(targetRef.current, 0.1); // Smoothly follow the leading horse
            camera.lookAt(targetPosition as any);
        }
    });

    return null;
});

CameraController.displayName = "CameraController";

type Props = {
    roundRecord: RoundRecord;
};

const HorseAnimation = ({roundRecord}:Props) => {
    const numberOfHorses =  roundRecord.market.length;
    const animationProgressRef = useRef(0);
    const [leadingHorseIndex] = useState(() => Math.floor(16));
    const focusedHorseRef = useRef<THREE.Object3D | any>(null);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);
    const animationDuration = 10; // Increase the animation duration for slower spread
    // Initial positions: Horses start more closely packed in the X direction
    const initialPositions = useMemo(() => {
        return [...Array(numberOfHorses)].map((_, index) => {
            // The base position for the first horse
            const baseX = -15;

            // Create a random gap that increases with each horse
            const gap = 4 + index * (Math.random() * 0.1); // Randomized increasing gap

            return {
                x: baseX + gap * index, // Increasing gap for each horse
                z: 0,
            };
        });
    }, [numberOfHorses]);


    // Final positions: Wide spread in the X direction but smaller in the Z direction (closer in front-back distance)
    const finalPositions = useMemo(() => {
        return [...Array(numberOfHorses)].map((_, index) => ({
            x: (Math.random() - 0.5) * 60, // Increase side-to-side spread
            z: index * 5 + (Math.random() - 0.5) * 5, // Decrease front-back spread to keep them closer
        }));
    }, [numberOfHorses]);

    const updateHorsePositions = useCallback(
        (progress: number) => {
            horsesRef.current.forEach((horse, index) => {
                if (horse) {
                    const initialPos = initialPositions[index];
                    const finalPos = finalPositions[index];
                    horse.position.x =
                        initialPos.x + (finalPos.x - initialPos.x) * progress;
                    horse.position.z =
                        initialPos.z + (finalPos.z - initialPos.z) * progress;
                }
            });
        },
        [initialPositions, finalPositions]
    );

    useFrame((_, delta) => {
        if (animationProgressRef.current < 1) {
            animationProgressRef.current = Math.min(
                animationProgressRef.current + delta / animationDuration,
                1
            );
            updateHorsePositions(animationProgressRef.current);
        }
    });

    const horses = useMemo(() => {
        return [...Array(numberOfHorses)].map((_, index) => {
            const isLeading = index === leadingHorseIndex;
            return {
                position: [initialPositions[index].x, 0, initialPositions[index].z],
                scale: [0.05, 0.05, 0.05],
                speed: isLeading ? 1.2 : 1 + Math.random() * 0.2,
                isLeading,
            };
        });
    }, [numberOfHorses, leadingHorseIndex, initialPositions]);

    return (
        <>
            <PerspectiveCamera makeDefault fov={75} position={[0, 10, 60]} />
            <CameraController target={focusedHorseRef} />
            <color attach="background" args={[0xf0f0f0]} />
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.3} />
            <OrbitControls />
            <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
            <directionalLight color={0xffffff} intensity={0.8} position={[0, 5, 5]} />
            <Physics gravity={[0, -30, 0]}>
                {horses.map((horse, index) => (
                    <HorseModel
                        key={index}
                        ref={(el) => {
                            horsesRef.current[index] = el as unknown as THREE.Object3D | null;
                            if (horse.isLeading) focusedHorseRef.current = el;
                        }}
                        number={index + 1}
                        color={horseColors[index]}
                        position={horse.position as any}
                        scale={horse.scale as any}
                        speed={horse.speed}
                    />
                ))}

                <Ground />
                <FenceRow x={-35} count={1000} spacing={16} />
                <FenceRow x={85} count={1000} spacing={16} />
            </Physics>
            <Stats />
        </>
    );
};

HorseAnimation.displayName = "HorseAnimation";
export default HorseAnimation;
