"use client"

import { useState } from "react"

import Navbar from "@/components/features/game/navbar"
import { BetSlip } from "@/components/features/slot-jackpot/BetSlip"
import { MarketList } from "@/components/features/slot-jackpot/MarketList"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard } from "lucide-react"
import { cryptoAssets, nseAssets, usStockAssets } from "./data"

export default function Home() {
    // State for bet slip
    const [betSlip, setBetSlip] = useState<BetSlipItem[]>([])
    const [betSlipOpen, setBetSlipOpen] = useState(false)
    const [globalBetAmount, setGlobalBetAmount] = useState(100)

    // Function to add or remove bet from slip
    const handleAddBet = (asset: Asset, betType: BetType, predictedDigits: string) => {
        const existingBetIndex = betSlip.findIndex(
            (bet) => bet.id === asset.id && bet.betType === betType && bet.predictedDigits === predictedDigits,
        )

        if (existingBetIndex !== -1) {
            // If bet already exists, remove it
            const newBetSlip = [...betSlip]
            newBetSlip.splice(existingBetIndex, 1)
            setBetSlip(newBetSlip)
        } else {
            // Add new bet to slip
            const odds = betType === "single-digit" ? 9 : 99
            const newBet: any = {
                id: asset.id,
                assetName: asset.name,
                assetSymbol: asset.symbol,
                betType,
                predictedDigits,
                odds,
                betAmount: globalBetAmount,
                potentialWin: globalBetAmount * odds,
            }
            setBetSlip([...betSlip, newBet])
        }
    }

    // Function to remove bet from slip
    const removeBet = (id: string, betType: BetType, predictedDigits: string) => {
        setBetSlip(
            betSlip.filter((bet) => !(bet.id === id && bet.betType === betType && bet.predictedDigits === predictedDigits)),
        )
    }

    // Function to update bet amount
    const updateBetAmount = (id: string, betType: BetType, predictedDigits: string, amount: number) => {
        setBetSlip(
            betSlip.map((bet) =>
                bet.id === id && bet.betType === betType && bet.predictedDigits === predictedDigits
                    ? { ...bet, betAmount: amount, potentialWin: amount * bet.odds }
                    : bet,
            ),
        )
    }

    // Function to update global bet amount
    const handleGlobalBetAmountChange = (amount: number) => {
        setGlobalBetAmount(amount)
        // Update all existing bets with the new amount
        setBetSlip(
            betSlip.map((bet) => ({
                ...bet,
                betAmount: amount,
                potentialWin: amount * bet.odds,
            })),
        )
    }


    return (
        <div className="flex flex-col min-h-screen bg-[#0F1221] text-white">

            <Navbar />
            <main className="flex-1 px-4 mt-20 py-6 max-w-7xl mx-auto w-full">
                {/* Global Bet Amount and Search Section */}
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-6 mb-8">
                      
                        {/* Global Bet Amount with improved UI */}
                        <div className="rounded-lg p-4 bg-primary-game  transition-all duration-200 shadow-lg shadow-purple-900/20">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-yellow-100">Betting Amount</span>
                                </div>

                            </div>
                            <div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex justify-center relative mb-2">
                                        <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full">
                                            <img src="/coin.svg" className='shadow-custom-glow rounded-full' alt="coin" />
                                        </div>
                                        <Input
                                            placeholder="Enter bet amount"
                                            value={globalBetAmount}
                                            onChange={(e) => handleGlobalBetAmountChange(Number(e.target.value))}
                                            className=" p-2  rounded-2xl pl-14 h-14 border-2 border-game-text text-xl"
                                        />
                                    </div>

                                </div>


                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex justify-between gap-1 w-full xl:flex-wrap flex-wrap" >
                                        {[100, 500, 1000, 5000, 10000].map((amount) => (
                                            <Button
                                                className='flex-1 text-game-text bg-secondary-game'
                                                variant="game-secondary"
                                                key={amount}

                                                onClick={() => handleGlobalBetAmountChange(amount)}
                                            >
                                                ₹{amount}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bet slip counter badge */}
                    {betSlip.length > 0 && (
                        <div className="flex items-center justify-center mb-6">
                            <button
                                onClick={() => setBetSlipOpen(true)}
                                className="bg-primary hover:bg-primary/80 text-white rounded-full py-2 px-6 flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-primary/20"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Open Bet Slip</span>
                                <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                                    {betSlip.length}
                                </span>
                            </button>
                        </div>
                    )}
                </div>



                <MarketList
                    nseAssets={nseAssets}
                    cryptoAssets={cryptoAssets}
                    usStockAssets={usStockAssets}
                    betSlip={betSlip}
                    globalBetAmount={globalBetAmount}
                    onAddBet={handleAddBet}
                />
            </main>

            <BetSlip
                betSlip={betSlip}
                open={betSlipOpen}
                setOpen={setBetSlipOpen}
                removeBet={removeBet}
                updateBetAmount={updateBetAmount}
            />

        </div>
    )
}
