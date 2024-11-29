import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
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
import { useLeaderboard } from "@/hooks/use-leadboard";


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
const HorseAnimation = ({ roundRecord }: Props) => {
    const numberOfHorses = roundRecord.market.length;
    const animationProgressRef = useRef(0);
    const [leadingHorseIndex] = useState(() => Math.floor(16));
    const focusedHorseRef = useRef<THREE.Object3D | any>(null);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);

    // New state for tracking position changes
    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);
    const [targetPositions, setTargetPositions] = useState<{ x: number, z: number }[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { stocks } = useLeaderboard(roundRecord);

    // Initial positions setup
    const initialPositions = useMemo(() => {
        return [...Array(numberOfHorses)].map((_, index) => {
            const baseX = -15;
            const gap = 4 + index * (Math.random() * 0.1);
            return {
                x: baseX + gap * index,
                z: 0,
            };
        });
    }, [numberOfHorses]);

    // Function to generate new random positions
    const generateNewPositions = useCallback(() => {
        return horses.map((horse) => {
            const currentHorse = stocks.find((stock) => {
                return stock.horse === horse.horseNumber;
            });

            const horseRank = currentHorse ? currentHorse.rank : 0;

            const zBasedOnRank = horseRank ? -horseRank * 5 : 0;
            return {
                x: Math.random() * 50 - 0,
                z: zBasedOnRank || 0,
            };
        });
    }, [numberOfHorses]);

    // Periodic position change effect
    useEffect(() => {
        const positionChangeInterval = setInterval(() => {
            const newPositions = generateNewPositions();
            setCurrentPositions(prev => prev.length ? prev : initialPositions);
            setTargetPositions(newPositions);
            setIsTransitioning(true);
            animationProgressRef.current = 0;
        }, 2000);

        return () => clearInterval(positionChangeInterval);
    }, [generateNewPositions, initialPositions]);

    // Smooth position interpolation
    const updateHorsePositions = useCallback(
        (progress: number) => {
            horsesRef.current.forEach((horse, index) => {
                if (horse && currentPositions[index] && targetPositions[index]) {
                    const currentPos = currentPositions[index];
                    const targetPos = targetPositions[index];
                    horse.position.x = currentPos.x + (targetPos.x - currentPos.x) * progress;
                    horse.position.z = currentPos.z + (targetPos.z - currentPos.z) * progress;
                }
            });
        },
        [currentPositions, targetPositions]
    );

    useFrame((_, delta) => {
        if (isTransitioning && animationProgressRef.current < 1) {
            animationProgressRef.current = Math.min(
                animationProgressRef.current + delta / 2, // Slower transition (2 seconds)
                1
            );
            updateHorsePositions(animationProgressRef.current);

            // End transition when progress reaches 1
            if (animationProgressRef.current >= 1) {
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    const horses = useMemo(() => {
        return stocks.map((stock, index) => {
            const isLeading = index === leadingHorseIndex;
            const initialPos = currentPositions[index] || initialPositions[index];
            return {
                position: [initialPos.x, 0, initialPos.z],
                scale: [0.05, 0.05, 0.05],
                speed: isLeading ? 1.2 : 1 + Math.random() * 0.2,
                horseNumber: stock.horse,
                isLeading,
            };
        });
    }, [numberOfHorses, leadingHorseIndex, currentPositions, initialPositions]);

    // Rest of the component remains the same as in the original code
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
                        number={horse.horseNumber!}
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