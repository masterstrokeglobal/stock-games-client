import { useLeaderboard } from "@/hooks/use-leadboard";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import HorseModel from "./horse-model";

const HORSE_COLORS = [
    "#D94D4D", "#3F8B83", "#3B91A5", "#D86F56", "#6F9F96",
    "#C89A3F", "#7F74B3", "#D066C6", "#59829E", "#C97A73",
    "#66B78F", "#E0B870", "#9E83B4", "#699EC7", "#D68A4A",
    "#4D8C7D", "#B7784D"
] as const;

const ANIMATION_SPEED = 0.5;
const FRAME_TIME = 0.016;
const INITIAL_X_OFFSET = -15;
const HORSE_SPACING = 4;
const Z_SPACING = 8;
const MAX_Z_POSITION = 200;
const MIN_Z_POSITION = -80;
const Z_BASE_OFFSET = -120;
const MAX_HORSE_COUNT = 16;

interface HorsePosition {
    x: number;
    z: number;
}

type Props = {
    roundRecord: RoundRecord;
    filteredMarket?: MarketItem[];
};

const HorseAnimation = React.memo(({ roundRecord, filteredMarket }: Props) => {
    const numberOfHorses = roundRecord.market.length;
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);

    const [currentPositions, setCurrentPositions] = useState<HorsePosition[]>([]);
    const [targetPositions, setTargetPositions] = useState<HorsePosition[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { stocks } = useLeaderboard(roundRecord);

    const initialPositions = useMemo(() =>
        Array.from({ length: numberOfHorses }, (_, index) => ({
            x: INITIAL_X_OFFSET + index * HORSE_SPACING + (Math.random() * 2 - 1),
            z: Z_BASE_OFFSET,
        })),
        [numberOfHorses]);

    const constrainZPosition = useCallback((z: number) => {
        return Math.min(Math.max(z, MIN_Z_POSITION), MAX_Z_POSITION);
    }, []);

    const rankToZPosition = useCallback((rank: number, totalHorses: number) => {
        const reversedRank = rank ;

        if (totalHorses <= MAX_HORSE_COUNT) {
            // Center horses when there are fewer
            const offset = (MAX_HORSE_COUNT - totalHorses) * Z_SPACING * 0.5;
            return (reversedRank) + Z_BASE_OFFSET + totalHorses * Z_SPACING * 0.5 + offset;
        } else {
            // Keep horses near start when there are more
            return (reversedRank) + Z_BASE_OFFSET + MAX_HORSE_COUNT * Z_SPACING * 0.5;
        }
    }, []);

    const generateNewPositions = useMemo(() => {
        const totalHorses = stocks.length;

        return roundRecord.market.map((horse, index) => {
            const currentHorse = stocks.find(stock => stock.horse === horse.horse);

            if (filteredMarket && filteredMarket.length > 0) {
                const filteredHorse = stocks.find(stock => stock.horse === horse.horse && filteredMarket.some(filteredStock => filteredStock.id === stock.id));

                if (filteredHorse?.rank) {
                    let zPosition = rankToZPosition(filteredHorse.rank, filteredMarket.length);
                    zPosition = constrainZPosition(zPosition);

                    return {
                        x: INITIAL_X_OFFSET + index * HORSE_SPACING + (Math.random() * 5),
                        z: zPosition,
                    };
                }
            }

            // Regular positioning with reversed rank logic
            let zPosition = currentHorse?.rank
                ? rankToZPosition(currentHorse.rank, totalHorses)
                : Z_BASE_OFFSET + (totalHorses * Z_SPACING);
            zPosition = constrainZPosition(zPosition);

            return {
                x: INITIAL_X_OFFSET + index * HORSE_SPACING + (Math.random() * 5),
                z: zPosition,
            };
        });
    }, [stocks, roundRecord.market, filteredMarket, constrainZPosition, rankToZPosition]);

    useEffect(() => {
        if (roundRecord.market.length === 0) return;

        setCurrentPositions(prev => prev.length ? prev : initialPositions);
        setTargetPositions(generateNewPositions);
        setIsTransitioning(true);
        animationProgressRef.current = 0;
    }, [generateNewPositions, initialPositions]);

    const updateHorsePositions = useCallback(
        (progress: number) => {
            horsesRef.current.forEach((horse, index) => {
                if (!horse || !currentPositions[index] || !targetPositions[index]) return;

                const currentPos = currentPositions[index];
                const targetPos = targetPositions[index];

                horse.position.x = THREE.MathUtils.lerp(currentPos.x, targetPos.x, progress);
                horse.position.z = THREE.MathUtils.lerp(currentPos.z, targetPos.z, progress);
            });
        },
        [currentPositions, targetPositions]
    );

    useFrame(() => {
        if (isTransitioning && animationProgressRef.current < 1) {
            animationProgressRef.current = Math.min(
                animationProgressRef.current + FRAME_TIME * ANIMATION_SPEED,
                1
            );
            updateHorsePositions(animationProgressRef.current);

            if (animationProgressRef.current >= 0.9) {
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    const horses = useMemo(() => {
        const marketToRender = filteredMarket && filteredMarket.length > 0
            ? roundRecord.market.filter(stock =>
                filteredMarket.some(filteredStock => filteredStock.id === stock.id))
            : roundRecord.market;

        return marketToRender.map((stock, index) => {
            const currentHorse = stocks.find(s => s.horse === stock.horse);
            const initialPos = currentPositions[index] || initialPositions[index] || { x: 0, z: Z_BASE_OFFSET };
            return {
                position: [initialPos.x, 0, initialPos.z],
                scale: [0.05, 0.05, 0.05],
                speed: 1 + Math.random() * 0.2,
                horseNumber: stock.horse,
                rank: currentHorse?.rank || index + 1,
            };
        });
    }, [roundRecord.market, currentPositions, initialPositions, filteredMarket, stocks]);

    console.log("HorseAnimation render", horses);

    return (
        <>
            {horses.map((horse, index) => (
                <HorseModel
                    key={index}
                    ref={(el) => {
                        horsesRef.current[index] = el as unknown as THREE.Object3D | null;
                    }}
                    number={horse.horseNumber === 17 ? 0 : horse.horseNumber!}
                    color={HORSE_COLORS[index % HORSE_COLORS.length]}
                    position={horse.position as any}
                    scale={horse.scale as any}
                    speed={horse.speed}
                />
            ))}
        </>
    );
});

HorseAnimation.displayName = "HorseAnimation";
export default HorseAnimation;