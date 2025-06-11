"use client"
import { Button } from "@/components/ui/button";
import { usePlacementOver, useShowResults } from '@/hooks/use-current-game';
import { formatRupee } from "@/lib/utils";
import { RoundRecord } from '@/models/round-record';
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import { useCreateStockGamePlacement, useGetMySlotGamePlacement } from "@/react-query/slot-game-queries";
import { Minus, Plus, WalletIcon, } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useEffect, useState } from 'react';
import SlotGameResultDialog from "../game/slot-game-result-dialog";
import { useLeaderboard } from "@/hooks/use-leadboard";

interface BettingAreaProps {
    betAmount: number;
    roundRecord: RoundRecord;
    setBetAmount: (amount: number) => void;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
    betAmount,
    setBetAmount,
    roundRecord
}) => {
    const { data: walletData, isLoading } = useGetWallet();
    const { data: myPlacementData } = useGetMySlotGamePlacement(roundRecord.id);
    const {showResults, previousRoundId} = useShowResults( roundRecord, myPlacementData?.data ?? []);
    const { mutate: createStockGamePlacement, isPending: isCreateStockGamePlacementPending } = useCreateStockGamePlacement();
    const {stocks} = useLeaderboard(roundRecord)

    const [currentStocks, setCurrentStocks] = useState<RoundRecord['market']>([])
    const [stockPrice, setStockPrice] = useState<Record<string, number>>({})

    const isPlaceOver = usePlacementOver(roundRecord);

    const totalBetAmount = useMemo(() => {
        return myPlacementData?.data?.reduce((acc, curr) => acc + curr.amount, 0);
    }, [myPlacementData])

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(walletData?.data?.wallet);
    }, [walletData])


    const placeBetHandler = () => {
        createStockGamePlacement({
            roundId: roundRecord.id,
            amount: betAmount,
        })
    }

    useEffect(() => {
        if(roundRecord){
            let stocks = roundRecord.market.map((stock) => {
                return stock
            })
            stocks = stocks.sort((a, b) => a.name?.localeCompare(b.name ?? '') ?? 0)
            setCurrentStocks(stocks)
            
            if (roundRecord.initialValues && Object.keys(roundRecord.initialValues).length > 0) {
                setStockPrice(roundRecord.initialValues)
            }
        }
        if(stocks.length > 0){
            stocks.forEach((stock) => {
                if(stock.price){
                    setStockPrice((prev) => ({...prev, [stock.code ?? '']: stock.price}))
                }
            })

        }
    }, [roundRecord, stocks])

    return (
        <>
        <div className="w-full bg-[url('/images/slot-game/wodden-bg.jpg')] bg-repeat bg-contain bg-center text-[#E3B872] p-4">
        
            <div className="flex items-center flex-wrap item-center justify-between gap-4 mb-4">

                {currentStocks.length > 0 && (
                    currentStocks.map((stock) => (
                        <div key={stock.code} className="flex flex-col items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                            <span className="text-lg">{stock.name?.slice(0, 7)}</span>
                            <span className="text-lg">
                                {(() => {
                                    const price = parseFloat(stockPrice[stock.code ?? '']?.toString() || '0').toFixed(2);
                                    const lastDigit = price.slice(-2, -1);
                                    const restOfPrice = price.slice(0, -2);
                                    return (
                                        <>
                                            {restOfPrice}
                                            <span className="text-[#FFD700] ml-1 text-lg font-bold">
                                                {lastDigit}
                                            </span>
                                        </>
                                    );
                                })()}
                            </span>
                        </div>
                    ))
                )}

            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                    <WalletIcon className="w-5 h-5" />
                    <span className="text-lg">{formatRupee(wallet?.mainBalance ?? 0)}</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                    <Image
                        src="/images/coin.png"
                        alt="Bet"
                        width={28}
                        height={28}
                    />
                    <span className="text-lg">₹{betAmount}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-[100px]">

                <Button
                    variant="ghost"
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => setBetAmount(Math.max(0, betAmount - 100))}
                >
                    <Minus size={28} className=" text-[#E3B872]" />
                </Button>

                <div className="relative w-24 h-24 group ">
                    <div
                        style={{ animationDuration: "5s" }} className="absolute inset-0 rounded-full border-4 animate-spin border-[#E3B872] bg-[#2A1810]/80 flex items-center justify-center transition-all duration-300 group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] group-hover:bg-[#2A1810]">
                        <Image
                            src="/images/slot-game/wheel.png"
                            alt="Spin"
                            width={400}
                            height={400}
                            className="object-contain w-full h-full scale-110 transition-all duration-300 group-hover:brightness-125"
                        />
                    </div>
                    <button
                        disabled={isPlaceOver || isCreateStockGamePlacementPending || isPlaceOver}
                        onClick={isPlaceOver ? undefined : placeBetHandler}
                        className={`absolute inset-0 flex items-center justify-center rounded-full ${isPlaceOver ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}>
                    </button>
                </div>

                <Button
                    variant="ghost"
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => setBetAmount(betAmount + 100)}
                >
                    <Plus className="w-7 h-7 text-[#E3B872]" />
                </Button>

            </div>

            <div className="flex items-center justify-center gap-4">

            </div>
            <div className="flex items-center mt-4 justify-center max-w-sm mx-auto flex-1 gap-2 fontse bg-gradient-to-b font-semibold from-[#E3B872] to-[#FFD700] text-[#1B1B1B] px-2 py-1 rounded-md">
                TotalBet :
                <span className="text-lg">₹{totalBetAmount}</span>
            </div>
        </div>
        {
            previousRoundId && (
                <SlotGameResultDialog
                    key={String(previousRoundId)}
                    open={showResults}
                    roundRecordId={previousRoundId}
                />
            )
        }
        </>
    );
};
