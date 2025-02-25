import React, { useState } from 'react';
import { useGameStore } from "@/store/game-store";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useIsPlaceOver } from '@/hooks/use-current-game';
import MarketItem from '@/models/market-item';
import { useCreateMiniMutualFundPlacementBet } from '@/react-query/game-record-queries';

const MiniMutualFundBet = () => {
    const { lobbyRound } = useGameStore();
    const [selectedStock, setSelectedStock] = useState<MarketItem | null>(null);
    const [betAmount, setBetAmount] = useState(100);
    const { mutate, isPending: isLoading } = useCreateMiniMutualFundPlacementBet();
    const isPlaceOver = useIsPlaceOver(lobbyRound!.roundRecord);

    if (!lobbyRound || !lobbyRound.roundRecord) return null;

    const marketItems = lobbyRound.roundRecord.market || [];

    const handleSelectStock = (stock: MarketItem) => {
        if (isPlaceOver) return;
        setSelectedStock(stock);
    };

    const handlePlaceBet = () => {
        if (!selectedStock || isPlaceOver) return;
        
        // Call the mutation to place the bet
        mutate({
            marketItemId: selectedStock.id,
            lobbyRoundId: lobbyRound.id,
            amount: betAmount
        }, {
            onSuccess: () => {
                // Reset selected stock after successful bet
                setSelectedStock(null);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto lg:px-4 px-2 py-2">
            <div className="relative rounded-xl lg:flex-row flex-col flex gap-8 border-brown-800">
                <div className="w-full">
                    <h1 className="text-xl text-center mb-4 text-white font-semibold">
                        {isPlaceOver ? "Betting Closed" : "Select a Stock to Bet On"}
                    </h1>

                    {/* Scrollable stock cards */}
                    <ScrollArea className="w-full whitespace-nowrap mb-6">
                        <div className="flex space-x-3 pb-2">
                            {marketItems.map((stock) => (
                                <div
                                    key={stock.id}
                                    onClick={() => handleSelectStock(stock)}
                                    className={`
                    inline-flex flex-col items-center bg-[#1A2D58] p-3 rounded-lg cursor-pointer transition-all min-w-32
                    ${selectedStock?.id === stock.id ? 'ring-2 ring-yellow-500 shadow-yellow-500/30' : 'hover:bg-[#243a6d]'}
                    ${isPlaceOver ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                                >
                                    <span className="text-lg font-bold text-white">{stock.name}</span>
                                    <span className="text-xs text-gray-300 truncate w-full text-center">{stock.codeName}</span>
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="h-2" />
                    </ScrollArea>

                    {/* Betting controls section */}
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

                        {/* Selected stock info */}
                        {selectedStock && (
                            <div className="mt-4 text-center text-white">
                                <p>Selected: <span className="font-bold">{selectedStock.name}</span></p>
                                <p className="text-yellow-500">
                                    Potential win: ₹{(betAmount * (selectedStock.oddsMultiplier || 1)).toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiniMutualFundBet;