import { usePlacementOver } from '@/hooks/use-current-game';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { BetErrorToast, useCreateDiceGamePlacement } from '@/react-query/dice-game-queries';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import { Cube } from './dice-3d';
import { toast } from 'sonner';

interface GameBoardProps extends PropsWithChildren<PropsWithClassName> {
    roundRecord: RoundRecord;
    globalBetAmount: number;
    winningMarketId: number[] | null;
}

// First row: numbers 2-7
const firstRow = [
    { number: 2, multiplier: '11x' },
    { number: 3, multiplier: '11x' },
    { number: 4, multiplier: '11x' },
    { number: 5, multiplier: '11x' },
    { number: 6, multiplier: '11x' },
    { number: 7, multiplier: '11x' }
];

// Second row: numbers 8-12 (reversed for visual balance)
const secondRow = [
    { number: 8, multiplier: '11x' },
    { number: 9, multiplier: '11x' },
    { number: 10, multiplier: '11x' },
    { number: 11, multiplier: '11x' },
    { number: 12, multiplier: '11x' }
];

const GameBoard = ({ children, className, roundRecord, globalBetAmount, winningMarketId }: GameBoardProps) => {
    const createPlacement = useCreateDiceGamePlacement();
    const isPlaceOver = usePlacementOver(roundRecord);


    const handleBetSelect = (number: number) => {
        if (globalBetAmount <= 0 || isPlaceOver) {
            toast.custom((t) => (
                <BetErrorToast onClose={() => toast.dismiss(t)} />
            ), {
                position: 'bottom-right'
            });
            return;
        }
        createPlacement.mutate({
            roundId: roundRecord.id,
            amount: globalBetAmount,
            number
        });
    };

    // Calculate winning sum from market items
    const getWinningSum = () => {
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

        return sum > 0 ? sum : null;
    };

    const winningSum = getWinningSum();

    return (
        <div className={cn("flex flex-col justify-center items-center gap-4 p-4", className)}>
            {/* Header */}
            {children}

            {/* Betting Grid */}
            <div className="space-y-4 w-full">
                {/* First Row */}
                <div className="flex md:justify-center justify-between w-full md:gap-3 gap-1">
                    {firstRow.map((bet) => (
                        <BetButton
                            isWinner={winningSum === bet.number}
                            handleBetSelect={handleBetSelect}
                            key={bet.number}
                            number={bet.number}
                            multiplier={bet.multiplier}
                        />
                    ))}
                </div>

                {/* Second Row */}
                <div className="flex md:justify-center sm:justify-around justify-between xs:px-10 px-2 w-full md:gap-3 gap-2">
                    {secondRow.map((bet) => (
                        <BetButton
                            isWinner={winningSum === bet.number}
                            handleBetSelect={handleBetSelect}
                            key={bet.number}
                            number={bet.number}
                            multiplier={bet.multiplier}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;

const BetButton = ({ number, multiplier, handleBetSelect, isWinner }: {
    number: number,
    multiplier: string,
    isWinner: boolean,
    handleBetSelect: (number: number) => void
}) => {

    return (
        <button
            onClick={() => handleBetSelect(number)}
            className={cn(
                "relative z-10 w-14  h-9 md:w-20 md:h-14 py-2 rounded-[8px] transition-all duration-200 flex flex-col items-center justify-center group hover:scale-105",
                isWinner && "border-2 border-[#4467CC]"
            )}
        >
            <div className='absolute top-0 left-0 blur-[2px] rounded-[8px] w-full h-full bg-gradient-to-b from-[#1294E2] to-[#1294E2]' />

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