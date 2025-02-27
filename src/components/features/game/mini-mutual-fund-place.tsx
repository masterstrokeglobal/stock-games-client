import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameStore } from "@/store/game-store";
import { useIsPlaceOver } from '@/hooks/use-current-game';
import { useCreateMiniMutualFundPlacementBet } from '@/react-query/game-record-queries';
import { useStockBettingStore } from '@/store/betting-store';

const BetInputForm = () => {
    const { lobbyRound } = useGameStore();
    const { selectedStock, betAmount, isLoading, setBetAmount, setSelectedStock, setIsLoading } = useStockBettingStore();
    const { mutate } = useCreateMiniMutualFundPlacementBet();
    const isPlaceOver = useIsPlaceOver(lobbyRound?.roundRecord ?? null);

    if (!lobbyRound || !lobbyRound.roundRecord) return null;

    const handlePlaceBet = () => {
        if (!selectedStock || isPlaceOver) return;

        setIsLoading(true);

        // Call the mutation to place the bet
        mutate({
            marketItemId: selectedStock.id,
            lobbyRoundId: lobbyRound.id,
            amount: betAmount,
        }, {
            onSuccess: () => {
                // Reset selected stock after successful bet
                setSelectedStock(null);
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-[#1A2D58] p-4 rounded-2xl">
            {/* Betting amount input with coin icon */}
            <div className="flex justify-center relative mb-2">
                <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full">
                    <img src="/coin.svg" className="shadow-custom-glow rounded-full" alt="coin" />
                </div>
                <Input
                    placeholder="Enter bet amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="bg-[#101F44] p-2 text-white rounded-2xl pl-14 h-14 text-xl"
                    disabled={isPlaceOver || !selectedStock}
                />
            </div>

            {/* Quick amount selection buttons */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex justify-between gap-1 w-full xl:flex-nowrap flex-wrap">
                    {[100, 500, 1000, 2000, 3000].map((amount) => (
                        <Button
                            className="flex-1"
                            variant="game-secondary"
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            disabled={isPlaceOver || !selectedStock}
                        >
                            ₹{amount}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Bet button */}
            <button
                className={`bet-button w-full ${(isPlaceOver || isLoading || !selectedStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPlaceOver || isLoading || !selectedStock}
                onClick={handlePlaceBet}
            >
                {isPlaceOver ? "BETTING CLOSED" : isLoading ? "PLEASE WAIT" : "BET NOW"}
            </button>

        </div>
    );
};

export default BetInputForm;