import { useLeaderboard } from "@/hooks/use-leadboard";
import { ROULETTE_COLORS } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import HorseModel from "./horse-model";
import MarketItem from "@/models/market-item";


type Props = {
    roundRecord: RoundRecord;
    filteredMarket?: MarketItem[]; // Pass filtered horses
    horseOffset: number;
};

const MAX_Z_POSITION = 60;
const MIN_Z_POSITION = -60;

const controlZPosition = (z: number) => {
    if (z > MAX_Z_POSITION) return MAX_Z_POSITION;
    if (z < MIN_Z_POSITION) return MIN_Z_POSITION;
    return z;
};

const HorseAnimation = React.memo(({ roundRecord, filteredMarket, horseOffset }: Props) => {
    const numberOfHorses = (filteredMarket && filteredMarket.length > 0) ? filteredMarket.length : roundRecord.market.length;
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);


    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);
    const [targetPositions, setTargetPositions] = useState<{ x: number, z: number }[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { stocks } = useLeaderboard(roundRecord);

    // Memoize initial positions to prevent unnecessary recalculations
    const initialPositions = useMemo(() =>
        [...Array(numberOfHorses)].map((_, index) => ({
            x: -15 + index * 4 + (Math.random() * 2 - 1),
            z: 0,
        })),
        [numberOfHorses]);

    const generateNewPositions = useMemo(() => {
        const marketToRender = filteredMarket && filteredMarket.length > 0
            ? roundRecord.market.filter(stock =>
                filteredMarket.some(filteredStock => filteredStock.id === stock.id))
            : roundRecord.market;

        return marketToRender.map((horse, index) => {
            const currentHorse = stocks.find(stock => stock.horse === horse.horse);

            const zBasedOnRank = currentHorse?.rank ? -(currentHorse.rank * 8) + 60 : 0;

            return {
                x: -15 + (index) * 4 + (Math.random() * 20),
                z: controlZPosition(zBasedOnRank),
            };
        });
    }, [stocks, roundRecord.market, filteredMarket]);

    // Reduce effect dependencies and optimize transition logic
    useEffect(() => {
        const newPositions = generateNewPositions;
        setCurrentPositions(prev => prev.length ? prev : initialPositions);
        setTargetPositions(newPositions);
        setIsTransitioning(true);
        animationProgressRef.current = 0;
    }, [generateNewPositions, initialPositions]);

    // Optimize position interpolation
    const updateHorsePositions = useCallback(
        (progress: number) => {
            horsesRef.current.forEach((horse, index) => {
                if (horse && currentPositions[index] && targetPositions[index]) {
                    const currentPos = currentPositions[index];
                    const targetPos = targetPositions[index];
                    // Use lerp for smoother interpolation
                    horse.position.x = THREE.MathUtils.lerp(currentPos.x, targetPos.x, progress);
                    horse.position.z = THREE.MathUtils.lerp(currentPos.z, targetPos.z, progress);
                }
            });
        },
        [currentPositions, targetPositions]
    );
    // Optimize frame updates with fixed timestep and completion check
    useFrame(() => {
        if (isTransitioning && animationProgressRef.current < 1) {
            // Use a larger fixed timestep for mobile
            const timestep = 0.016;
            const speed = 0.8; // Increased animation speed

            animationProgressRef.current = Math.min(
                animationProgressRef.current + timestep * speed,
                1
            );

            updateHorsePositions(animationProgressRef.current);

            const animationProgress = 0.9;
            if (animationProgressRef.current >= animationProgress) {
                animationProgressRef.current = 1;
                updateHorsePositions(1);
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    // Memoize horses rendering data
    const horses = useMemo(() => {
        const marketToRender = filteredMarket && filteredMarket.length > 0
            ? roundRecord.market.filter(stock =>
                filteredMarket.some(filteredStock => filteredStock.id === stock.id))
            : roundRecord.market;

        return marketToRender.map((stock, index) => {
            const currentHorse = stocks.find(s => s.horse === stock.horse);
            const initialPos = currentPositions[index] || initialPositions[index] || { x: 0 };
            return {
                position: [initialPos.x, 0, initialPos.z],
                scale: [.2, .2, .2],
                speed: 1 + Math.random() * 0.2,
                horseNumber: stock.horse,
                rank: currentHorse?.rank || index + 1,
            };
        });
    }, [roundRecord.market, currentPositions, initialPositions, filteredMarket, stocks]);

    return (
        <>
            <group position={[0, 0, -horseOffset]}>
                {horses.map((horse, index) => (
                    <HorseModel
                        key={horse.horseNumber}
                        ref={(el: THREE.Object3D | null) => {
                            horsesRef.current[index] = el;
                        }}
                        number={horse.horseNumber == 17 ? 0 : horse.horseNumber!}
                        color={ROULETTE_COLORS[index].color}
                        position={horse.position as any}
                        scale={horse.scale as any}
                        speed={horse.speed}
                    />
                ))}
            </group>
        </>
    );
});

HorseAnimation.displayName = "HorseAnimation";
export default HorseAnimation;