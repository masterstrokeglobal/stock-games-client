import { usePlacementOver } from '@/hooks/use-current-game';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useCreateDiceGamePlacement, useGetMyCurrentRoundDiceGamePlacement } from '@/react-query/dice-game-queries';
import { PropsWithChildren } from 'react';
import { Cube } from './dice-3d';

interface GameBoardProps extends PropsWithChildren<PropsWithClassName> {
    roundRecord: RoundRecord;
    globalBetAmount: number;
    winningMarketId: number[] | null;
}

// First row: numbers 2-7
const firstRow = [
    { number: 2, multiplier: '2x' },
    { number: 3, multiplier: '2x' },
    { number: 4, multiplier: '2x' },
    { number: 5, multiplier: '2x' },
    { number: 6, multiplier: '2x' },
    { number: 7, multiplier: '2x' }
];

// Second row: numbers 8-12 (reversed for visual balance)
const secondRow = [
    { number: 8, multiplier: '2x' },
    { number: 9, multiplier: '2x' },
    { number: 10, multiplier: '2x' },
    { number: 11, multiplier: '2x' },
    { number: 12, multiplier: '2x' }
];

const GameBoard = ({ children, className, roundRecord, globalBetAmount, winningMarketId }: GameBoardProps) => {
    const { data: placements } = useGetMyCurrentRoundDiceGamePlacement(roundRecord.id);
    const createPlacement = useCreateDiceGamePlacement();
    const isPlaceOver = usePlacementOver(roundRecord);

    const betAmounts = placements?.reduce((acc, placement) => {
        acc[placement.number] = (acc[placement.number] || 0) + placement.amount;
        return acc;
    }, {} as Record<number, number>) || {};

    const handleBetSelect = (number: number) => {
        if (globalBetAmount <= 0 || isPlaceOver) return;

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
                console.log(roundRecord.market[marketIndex],marketIndex)
                const value =  ((marketIndex + 1) % 6) == 0 ? 6 : ((marketIndex + 1) % 6);
                console.log(value);
                sum = value + sum;// Index + 1 represents the dice face value
            }
        });

        return sum > 0 ? sum : null;
    };

    const winningSum = getWinningSum();

    return (
        <div className={cn("bg-gradient-to-b bg-[url('/images/dice-game/board-bg-2.png')] bg-cover bg-center from-gray-900 via-gray-800 to-black md:p-8 p-4 pt-8 md:pt-24  border border-yellow-600/30 shadow-2xl", className)}>
            {/* Header */}
            {children}

            {/* Betting Grid */}
            <div className="space-y-4">
                {/* First Row */}
                <div className="flex justify-center md:gap-3 gap-1">
                    {firstRow.map((bet) => (
                        <BetButton
                            isWinner={winningSum === bet.number}
                            betAmounts={betAmounts}
                            handleBetSelect={handleBetSelect}
                            key={bet.number}
                            number={bet.number}
                            multiplier={bet.multiplier}
                        />
                    ))}
                </div>

                {/* Second Row */}
                <div className="flex justify-center md:gap-3 gap-1">
                    {secondRow.map((bet) => (
                        <BetButton
                            isWinner={winningSum === bet.number}
                            betAmounts={betAmounts}
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

const BetButton = ({ number, multiplier, betAmounts, handleBetSelect, isWinner }: {
    number: number,
    multiplier: string,
    isWinner: boolean,
    betAmounts: Record<number, number>,
    handleBetSelect: (number: number) => void
}) => {
    const amountBet = betAmounts[number] || 0;
    const hasBet = amountBet > 0;

    // Colors from the image:
    // - Deep green background: #13311c (approx)
    // - Gold border: #e6b85c (approx)
    // - Red outer border: #a13a2f (approx)
    // - Text: off-white/yellowish (#e6b85c), white for number, gold for multiplier

    return (
        <button
            onClick={() => handleBetSelect(number)}
            className={cn(
                "relative w-20 h-20 rounded-[8px] border-[3px] transition-all duration-200 flex flex-col items-center justify-center group hover:scale-105",
                "bg-gradient-to-b from-[#001607] to-[#13311c] border-[#e6b85c] shadow-[0_0_0_4px_#a13a2f] outline outline-2 outline-[#a13a2f] outline-offset-[-6px]",
                {
                    // Winner styles
                    'border-[4px] border-[#e0aa2f] bg-gradient-to-b from-[#e0aa2f]/60 to-[#e6b85c]/80 shadow-lg shadow-[#e0aa2f]/40 animate-pulse duration-1000 infinite ease-in-out scale-110': isWinner,
                    // Has bet styles (when not winner)
                    'border-[#e6b85c] bg-gradient-to-b from-[#e6b85c]/10 to-[#13311c]/90 shadow-lg shadow-[#e6b85c]/20': hasBet && !isWinner,
                    // Default styles
                    'border-[#e6b85c] bg-[#13311c] hover:border-[#ffe066]': !hasBet && !isWinner
                }
            )}
        >
            {/* Decorative corners - gold corners */}
            <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-[#e0aa2f] rounded-tl"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-[#e0aa2f] rounded-tr"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-[#e0aa2f] rounded-bl"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-[#e0aa2f] rounded-br"></div>

            {/* Crown emoji for winner */}
            {isWinner && (
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                    👑
                </div>
            )}

            {/* Number */}
            <span className={cn(
                "text-2xl font-bold mb-1 transition-colors",
                isWinner ? "text-white" : "text-[#e6b85c]",
                "drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
            )}>
                {number}
            </span>

            {/* Multiplier */}
            <span className="text-xs font-semibold text-[#e6b85c] bg-transparent px-2 py-0.5 rounded">
                {multiplier}
            </span>

            {/* Bet Amount Display - Poker Chip Style */}
            {hasBet && (
                <div className="absolute -top-3 -left-3 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 aspect-square z-20 border-2 border-dashed border-amber-800 rounded-full p-1 flex justify-center items-center text-[10px] text-center w-10 h-10 shadow-[0_4px_8px_rgba(217,119,6,0.6)] ring-1 ring-yellow-300 ring-opacity-50">
                    <span className="font-bold text-amber-900 drop-shadow-sm">₹{amountBet}</span>
                </div>
            )}
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