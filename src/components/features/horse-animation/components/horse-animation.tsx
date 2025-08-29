import { useLeaderboard } from "@/hooks/use-leadboard";
import { ROULETTE_COLORS } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import HorseModel from "./horse-model";
import MarketItem from "@/models/market-item";

type Props = {
    roundRecord: RoundRecord;
    filteredMarket?: MarketItem[];
    horseOffset: number;
};

const MAX_Z_POSITION = 60;
const MIN_Z_POSITION = -60;
const ANIMATION_SPEED = 1/0.7;

const controlZPosition = (z: number) => {
    if (z > MAX_Z_POSITION) return MAX_Z_POSITION;
    if (z < MIN_Z_POSITION) return MIN_Z_POSITION;
    return z;
};

const HorseAnimation = React.memo(({ roundRecord, filteredMarket, horseOffset }: Props) => {
    const numberOfHorses = (filteredMarket && filteredMarket.length > 0) ? filteredMarket.length : roundRecord.market.length;
    
    // Animation refs - no useState in useFrame!
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);
    const currentPositionsRef = useRef<{ x: number, z: number }[]>([]);
    const targetPositionsRef = useRef<{ x: number, z: number }[]>([]);
    const isTransitioningRef = useRef(false);
    const animationCompleteCallbackRef = useRef<(() => void) | null>(null);

    // Only keep essential state for React renders
    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);

    const { stocks } = useLeaderboard(roundRecord);

    // Memoize initial positions
    const initialPositions = useMemo(() =>
        Array.from({ length: numberOfHorses }, (_, index) => ({
            x: -15 + index * 4 + (Math.random() * 2 - 1),
            z: 0,
        })),
        [numberOfHorses]
    );

    // Memoize market to render
    const marketToRender = useMemo(() => {
        return filteredMarket && filteredMarket.length > 0
            ? roundRecord.market.filter(stock =>
                filteredMarket.some(filteredStock => filteredStock.id === stock.id))
            : roundRecord.market;
    }, [roundRecord.market, filteredMarket]);

    // Generate new positions - removed from useMemo to avoid unnecessary deps
    const generateNewPositions = () => {
        return marketToRender.map((horse, index) => {
            const currentHorse = stocks.find(stock => stock.horse === horse.horse);
            const zBasedOnRank = currentHorse?.rank ? -(currentHorse.rank * 8) + 60 : 0;

            return {
                x: -15 + index * 4 + (Math.random() * 20),
                z: controlZPosition(zBasedOnRank),
            };
        });
    };

    // Optimized position update function - no useCallback needed
    const updateHorsePositions = (progress: number) => {
        const horses = horsesRef.current;
        const current = currentPositionsRef.current;
        const target = targetPositionsRef.current;
        
        // Use traditional for loop for better performance
        for (let i = 0; i < horses.length; i++) {
            const horse = horses[i];
            const currentPos = current[i];
            const targetPos = target[i];
            
            if (horse && currentPos && targetPos) {
                // Direct lerp calculation (faster than THREE.MathUtils.lerp)
                const invProgress = 1 - progress;
                horse.position.x = currentPos.x * invProgress + targetPos.x * progress;
                horse.position.z = currentPos.z * invProgress + targetPos.z * progress;
            }
        }
    };

    // Initialize positions when stocks change
    useEffect(() => {
        const newPositions = generateNewPositions();
        const startPositions = currentPositionsRef.current.length ? currentPositionsRef.current : initialPositions;
        
        // Update refs
        currentPositionsRef.current = startPositions;
        targetPositionsRef.current = newPositions;
        
        // Start animation
        isTransitioningRef.current = true;
        animationProgressRef.current = 0;
        
        // Set callback for when animation completes
        animationCompleteCallbackRef.current = () => {
            setCurrentPositions(newPositions);
        };
        
        // Update React state for initial render
        if (!currentPositions.length) {
            setCurrentPositions(startPositions);
        }
    }, [stocks, initialPositions]); // Only depend on essential data

    // Optimized useFrame - NO setState calls inside!
    useFrame((_state, delta) => {
        if (!isTransitioningRef.current) return;
        
        const currentProgress = animationProgressRef.current;
        if (currentProgress >= 1) return;
        
        // Update progress
        const newProgress = Math.min(currentProgress + delta * ANIMATION_SPEED, 1);
        animationProgressRef.current = newProgress;
        
        // Update horse positions
        updateHorsePositions(newProgress);
        
        // Check for completion
        if (newProgress >= 0.9) {
            // Final position update
            animationProgressRef.current = 1;
            updateHorsePositions(1);
            
            // Update current positions ref
            currentPositionsRef.current = [...targetPositionsRef.current];
            
            // Stop animation
            isTransitioningRef.current = false;
            
            // Execute callback outside of useFrame
            if (animationCompleteCallbackRef.current) {
                animationCompleteCallbackRef.current();
                animationCompleteCallbackRef.current = null;
            }
        }
    });

    // Memoize horse data for rendering
    const horseRenderData = useMemo(() => {
        return marketToRender.map((stock, index) => {
            const currentHorse = stocks.find(s => s.horse === stock.horse);
            const initialPos = currentPositions[index] || initialPositions[index] || { x: 0, z: 0 };
            
            return {
                id: stock.horse,
                position: [initialPos.x, 0, initialPos.z] as [number, number, number],
                scale: [0.2, 0.2, 0.2] as [number, number, number],
                speed: 1 + Math.random() * 0.2,
                horseNumber: stock.horse,
                rank: currentHorse?.rank || index + 1,
                color: ROULETTE_COLORS[index]?.color || "#ffffff",
            };
        });
    }, [marketToRender, currentPositions, initialPositions, stocks]);

    return (
        <group position={[0, 0, -horseOffset]}>
            {horseRenderData.map((horse, index) => (
                <HorseModel
                    key={horse.id}
                    ref={(el: THREE.Object3D | null) => {
                        horsesRef.current[index] = el;
                    }}
                    number={horse.horseNumber === 17 ? 0 : horse.horseNumber!}
                    color={horse.color}
                    position={horse.position}
                    scale={horse.scale}
                    speed={horse.speed}
                />
            ))}
        </group>
    );
});

HorseAnimation.displayName = "HorseAnimation";
export default HorseAnimation;