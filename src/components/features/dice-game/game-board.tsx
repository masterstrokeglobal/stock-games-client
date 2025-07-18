import { usePlacementOver } from '@/hooks/use-current-game';
import useWindowSize from '@/hooks/use-window-size';
import { cn, INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { BetErrorToast, useCreateDiceGamePlacement, useGetMyCurrentRoundDiceGamePlacement    } from '@/react-query/dice-game-queries';
import Image from 'next/image';
import { PropsWithChildren, useMemo, useState } from 'react';
import { Cube } from './dice-3d';
import { toast } from 'sonner';
import { DicePlacementType } from '@/models/dice-placement';
import { DICE_WINNING_MULTIPLIER_2, DICE_WINNING_MULTIPLIER_3, DICE_WINNING_MULTIPLIER_4, DICE_WINNING_MULTIPLIER_5, DICE_WINNING_MULTIPLIER_6, DICE_WINNING_MULTIPLIER_7, DICE_WINNING_MULTIPLIER_8, DICE_WINNING_MULTIPLIER_9, DICE_WINNING_MULTIPLIER_10, DICE_WINNING_MULTIPLIER_11, DICE_WINNING_MULTIPLIER_12 } from '@/lib/utils';

interface GameBoardProps extends PropsWithChildren<PropsWithClassName> {
    roundRecord: RoundRecord;
    globalBetAmount: number;
    winningSum: Record<DicePlacementType, number>;  
    winningMarketId: number[] | null;
}



// First row: numbers 2-7
const firstRow = [
    { number: 2, multiplier: `${DICE_WINNING_MULTIPLIER_2}x` },
    { number: 3, multiplier: `${DICE_WINNING_MULTIPLIER_3}x` },
    { number: 4, multiplier: `${DICE_WINNING_MULTIPLIER_4}x` },
    { number: 5, multiplier: `${DICE_WINNING_MULTIPLIER_5}x` },
    { number: 6, multiplier: `${DICE_WINNING_MULTIPLIER_6}x` },
    { number: 7, multiplier: `${DICE_WINNING_MULTIPLIER_7}x` }
];

// Second row: numbers 8-12
const secondRow = [
    { number: 8, multiplier: `${DICE_WINNING_MULTIPLIER_8}x` },
    { number: 9, multiplier: `${DICE_WINNING_MULTIPLIER_9}x` },
    { number: 10, multiplier: `${DICE_WINNING_MULTIPLIER_10}x` },
    { number: 11, multiplier: `${DICE_WINNING_MULTIPLIER_11}x` },
    { number: 12, multiplier: `${DICE_WINNING_MULTIPLIER_12}x` }
];
// Bet configurations for different types
const betConfigs  = {
    [DicePlacementType.BOTH]: {
        firstRow: firstRow,
        secondRow: secondRow
    },
    [DicePlacementType.FIRST]: {
        firstRow: [
            { number: 1, multiplier: '6x' },
            { number: 2, multiplier: '6x' },
            { number: 3, multiplier: '6x' },
            { number: 4, multiplier: '6x' },
            { number: 5, multiplier: '6x' },
            { number: 6, multiplier: '6x' }
        ],
        secondRow: []
    },
    [DicePlacementType.SECOND]: {
        firstRow: [
            { number: 1, multiplier: '6x' },
            { number: 2, multiplier: '6x' },
            { number: 3, multiplier: '6x' },
            { number: 4, multiplier: '6x' },
            { number: 5, multiplier: '6x' },
            { number: 6, multiplier: '6x' }
        ],
        secondRow: []
    }
};


const GameBoard = ({ children, className, roundRecord, globalBetAmount, winningMarketId,winningSum}: GameBoardProps) => {
    const createPlacement = useCreateDiceGamePlacement();
    const isPlaceOver = usePlacementOver(roundRecord);
    const [selectedBetType, setSelectedBetType] = useState<DicePlacementType>(DicePlacementType.BOTH);
    const { data: placements } = useGetMyCurrentRoundDiceGamePlacement(roundRecord.id);

    const chipBets: Record<string, number> | undefined = placements?.reduce((acc, placement) => {
        const key = `${placement.placementType}-${placement.number}`;
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += placement.amount;
        return acc;
    }, {} as Record<string, number>);


    const handleBetSelect = (number: number) => {
        if (globalBetAmount <= 0 || isPlaceOver) {
            toast.custom((t) => (
                <BetErrorToast message="Time's up! No more bets" onClose={() => toast.dismiss(t)} />
            ), {
                position: 'bottom-right'
            });
            return;
        }
        createPlacement.mutate({
            roundId: roundRecord.id,
            amount: globalBetAmount,
            placementType: selectedBetType,
            number
        });
    };

    // Calculate winning sum from market items
    const result = useMemo(() => {
        if (!winningMarketId || winningMarketId.length === 0) return null;

        let sum = 0;

        // For each winning market ID, find its index in the market array and add (index + 1)
        winningMarketId.forEach(winningId => {
            const marketIndex = roundRecord.market.findIndex(market => market.id === winningId);
            if (marketIndex !== -1) {
                const value = ((marketIndex + 1) % 6) == 0 ? 6 : ((marketIndex + 1) % 6);
                sum = value + sum;// Index + 1 represents the dice face value
            }
        });

        const firstDice = winningMarketId.length > 0 ? 
            (() => {
                const firstWinningIndex = roundRecord.market.findIndex(market => market.id === winningMarketId[0]);
                if (firstWinningIndex >= 6) {
                    // If index is 6 or greater, it's second dice
                    const secondDiceValue = (firstWinningIndex + 1) % 6;
                    return secondDiceValue === 0 ? 6 : secondDiceValue;
                } else {
                    // If index is less than 6, it's first dice
                    return firstWinningIndex + 1;
                }
            })() : null;

        const secondDice = winningMarketId.length > 1 ? 
            (() => {
                const secondWinningIndex = roundRecord.market.findIndex(market => market.id === winningMarketId[1]);
                if (secondWinningIndex >= 6) {
                    // If index is 6 or greater, it's second dice
                    const secondDiceValue = (secondWinningIndex + 1) % 6;
                    return secondDiceValue === 0 ? 6 : secondDiceValue;
                } else {
                    // If index is less than 6, it's first dice
                    return secondWinningIndex + 1;
                }
            })() : null;

        return {
            [DicePlacementType.BOTH]: sum,
            [DicePlacementType.FIRST]: firstDice,
            [DicePlacementType.SECOND]: secondDice
        }
    }, [winningMarketId, roundRecord]);
    const currentConfig = betConfigs[selectedBetType];

    return (
        <div className={cn("flex flex-col justify-center items-center gap-4 p-4", className)}>
            {/* Header */}
            {children}

            {/* Bet Type Tabs */}
            <div className="flex bg-gray-800 rounded-lg p-1 w-full max-w-sm">
                {([DicePlacementType.FIRST, DicePlacementType.BOTH, DicePlacementType.SECOND] as DicePlacementType[]).map((betType) => (
                    <button
                        key={betType}
                        onClick={() => setSelectedBetType(betType)}
                        className={cn(
                            "flex-1 py-1 px-2 rounded-md text-xs font-medium transition-all duration-200",
                            selectedBetType === betType
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-300 hover:text-white hover:bg-gray-700"
                        )}
                    >
                        {betType.charAt(0).toUpperCase() + betType.slice(1)}
                    </button>
                ))}
            </div>

            <div className="space-y-4 w-full">
                <div className="flex md:justify-center justify-between w-full md:gap-3 gap-1">
                    {currentConfig.firstRow.map((bet) => (
                        <BetButton
                            betAmount={chipBets?.[`${selectedBetType}-${bet.number}`] || 0}
                            isWinning={isPlaceOver ? winningSum?.[selectedBetType] == bet.number : false}
                            isWinner={result?.[selectedBetType] === bet.number}
                            handleBetSelect={handleBetSelect}
                            key={bet.number}
                            number={bet.number}
                            multiplier={bet.multiplier}
                        />
                    ))}
                </div>
                {selectedBetType === 'both' && currentConfig.secondRow.length > 0 && (
                    <div className="flex md:justify-center sm:justify-around justify-between xs:px-10 px-2 w-full md:gap-3 gap-2">
                        {currentConfig.secondRow.map((bet) => (
                            <BetButton
                                betAmount={chipBets?.[bet.number] || 0}
                                isWinning={isPlaceOver ? winningSum?.[selectedBetType] == bet.number : false}
                                isWinner={result?.[selectedBetType] === bet.number}
                                handleBetSelect={handleBetSelect}
                                key={bet.number}
                                number={bet.number}
                                multiplier={bet.multiplier}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBoard;

const BetButton = ({ number, multiplier, handleBetSelect, isWinner, isWinning, betAmount }: {
    number: number,
    multiplier: string,
    isWinner: boolean,
    isWinning: boolean,
    betAmount: number,
    handleBetSelect: (number: number) => void
}) => {

    return (
        <button
            onClick={() => handleBetSelect(number)}
            className={cn(
                "relative z-10 w-14  h-9 md:w-20 md:h-14 py-2 rounded-[8px] transition-all duration-200 flex flex-col items-center justify-center group hover:scale-105",
                isWinner && "border-2 border-[#4467CC]",
                isWinning && "animate-pulse"
            )}
        >
            <div className='absolute top-0 left-0 blur-[2px] rounded-[8px] w-full h-full bg-gradient-to-b from-[#1294E2] to-[#1294E2]' />
            {betAmount > 0 && <div className="absolute -top-3 -left-3 -rotate-12 p-1.5 flex items-center justify-center aspect-square rounded-full  z-10">
            <span className="text-white md:text-[10px] text-[8px] z-10 relative  font-poppins">
                {INR(betAmount, true, false)}
            </span>
            <img src="/images/head-tail/betting-chip.png" alt="" className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>}
            {/* Crown emoji for winner */}
            {
                isWinner && (
                    <div className="absolute -top-10 -right-9 rotate-12 ">
                        <Image src="/images/dice-game/crown.png" alt="crown" width={64} height={64} />
                    </div>
                )
            }

            {/* Number */}
            <span className={cn(
                "text-sm md:text-xl font-bold blur-0 md:mb-1 leading-none transition-colors text-white",
                "drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
            )}>
                {number}
            </span>

            {/* Multiplier */}
            <span className="text-[10px] md:text-xs blur-0 font-semibold leading-none text-white bg-transparent px-2 py-0.5 rounded">
                {multiplier}
            </span>
        </button>
    );
};

export const MobileDice = ({ className = '', roundRecord, roundRecordWithWinningId }: {
    className?: string,
    roundRecord: RoundRecord,
    roundRecordWithWinningId: RoundRecord | null
}) => {
    const { isMobile } = useWindowSize();
    const marketItems = roundRecord.market;
    const isPlaceOver = usePlacementOver(roundRecord);
    const isRolling = isPlaceOver && roundRecordWithWinningId?.winningId == null;

    const firstCube = marketItems.slice(0, 6);
    const secondCube = marketItems.slice(6, 12);

    // Check if we're waiting for winning data
    const isWaitingForResults = !isRolling && (!roundRecordWithWinningId?.winningId || roundRecordWithWinningId?.winningId.length === 0);

    if (!isMobile) return null;

    return (
        <div className={`font-sans bg-cover bg-center overflow-visible ${className}`} style={{ height: '10rem' }}>
            <div className="flex justify-center relative h-full items-center">
                <div className="flex sm:pr-24 flex-row flex-1 h-full gap-2 items-center justify-end animate-slide-left relative">
                    <Cube
                        marketItems={firstCube}
                        isRolling={isRolling}
                        winningMarketId={roundRecordWithWinningId?.winningId}
                        isLoading={isWaitingForResults}
                    />
                </div>

                <div className="flex sm:pl-24 pl-12 flex-row bg-cover bg-center flex-1 h-full gap-2 items-center justify-between animate-slide-right relative">
                    <Cube
                        marketItems={secondCube}
                        className='delay-1000'
                        isRolling={isRolling}
                        isSecondCube
                        winningMarketId={roundRecordWithWinningId?.winningId}
                        isLoading={isWaitingForResults}
                    />
                </div>
            </div>
        </div>
    );
};