import { usePlacementOver } from '@/hooks/use-current-game';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useCreateDiceGamePlacement, useGetMyCurrentRoundDiceGamePlacement } from '@/react-query/dice-game-queries';
import { PropsWithChildren } from 'react';

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

const GameBoard = ({ children, className, roundRecord, globalBetAmount }: GameBoardProps) => {
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



    return (
        <div className={cn("bg-gradient-to-b bg-[url('/images/dice-game/board-bg.jpg')] bg-cover bg-center from-gray-900 via-gray-800 to-black md:p-8 p-4 pt-14 md:pt-24  border border-yellow-600/30 shadow-2xl", className)}>
            {/* Header */}
            {children}

            {/* Betting Grid */}
            <div className="space-y-4">
                {/* First Row */}
                <div className="flex justify-center md:gap-3 gap-1">
                    {firstRow.map((bet) => (
                        <BetButton
                            isWinner={false}
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
                            isWinner={false}
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



const BetButton = ({ number, multiplier, betAmounts, handleBetSelect }: { number: number, multiplier: string, isWinner: boolean, betAmounts: Record<number, number>, handleBetSelect: (number: number) => void }) => {
    const amountBet = betAmounts[number] || 0;
    const hasBet = amountBet > 0;

    return (
        <button
            onClick={() => handleBetSelect(number)}
            className={`
                relative w-20 h-20 rounded-lg border-2 transition-all duration-200 
                flex flex-col items-center justify-center group hover:scale-105
                ${hasBet
                    ? 'border-yellow-400 bg-gradient-to-b from-yellow-500/20 to-yellow-600/30 shadow-lg shadow-yellow-500/25'
                    : 'border-yellow-600/50 bg-gradient-to-b from-gray-800/80 to-gray-900/90 hover:border-yellow-500/70'
                }
                backdrop-blur-sm
            `}
        >
            {/* Decorative corners */}
            <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-yellow-500/60 rounded-tl"></div>
            <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-yellow-500/60 rounded-tr"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-yellow-500/60 rounded-bl"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-yellow-500/60 rounded-br"></div>

            {/* Number */}
            <span className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                {number}
            </span>

            {/* Multiplier */}
            <span className="text-xs font-semibold text-yellow-400 bg-black/40 px-2 py-0.5 rounded">
                {multiplier}
            </span>

            {/* Bet Amount Display */}
            {hasBet && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                    ₹{amountBet}
                </div>
            )}
        </button>
    );
};