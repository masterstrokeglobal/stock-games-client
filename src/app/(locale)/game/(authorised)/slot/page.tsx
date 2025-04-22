"use client"

import { useState } from "react"

import Navbar from "@/components/features/game/navbar"
import { BetSlip } from "@/components/features/stock-slot/bet-slip"
import { BettingCard } from "@/components/features/stock-slot/betting-card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ArrowRightIcon, SearchIcon, TrendingUpIcon, CreditCard, DollarSign, Wallet, ZapOffIcon, ZapIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cryptoAssets, nseAssets, usStockAssets } from "./data"
import { Button } from "@/components/ui/button"

export default function Home() {
  // State for bet slip
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([])
  const [betSlipOpen, setBetSlipOpen] = useState(false)
  const [globalBetAmount, setGlobalBetAmount] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")
  const [quickBetEnabled, setQuickBetEnabled] = useState(false)

  // Filter assets based on search query
  const filterAssets = (assets: Asset[]) => {
    if (!searchQuery) return assets
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Function to add bet to slip
  const addToBetSlip = (asset: Asset, direction: BetDirection) => {
    const existingBetIndex = betSlip.findIndex((bet) => bet.id === asset.id && bet.direction === direction)

    if (existingBetIndex !== -1) {
      // If bet already exists, toggle it off (remove it)
      const newBetSlip = [...betSlip]
      newBetSlip.splice(existingBetIndex, 1)
      setBetSlip(newBetSlip)
    } else {
      // Add new bet to slip
      const newBet: BetSlipItem = {
        id: asset.id,
        assetName: asset.name,
        assetSymbol: asset.symbol,
        direction,
        odds: 1.96,
        betAmount: globalBetAmount, // Use global bet amount
        potentialWin: globalBetAmount * 1.96, // 1.96 * globalBetAmount
      }
      setBetSlip([...betSlip, newBet])

      // If quick bet is enabled, open bet slip
      if (quickBetEnabled) {
        setBetSlipOpen(true)
      }
    }
  }

  // Function to update bet amount
  const updateBetAmount = (id: string, direction: BetDirection, amount: number) => {
    setBetSlip(
      betSlip.map((bet) =>
        bet.id === id && bet.direction === direction
          ? { ...bet, betAmount: amount, potentialWin: amount * bet.odds }
          : bet,
      ),
    )
  }

  // Function to remove bet from slip
  const removeFromBetSlip = (id: string, direction: BetDirection) => {
    setBetSlip(betSlip.filter((bet) => !(bet.id === id && bet.direction === direction)))
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

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("")
  }

  const renderAssetSection = (title: string, assets: Asset[], icon: React.ReactNode, linkColor: string) => {
    const filteredAssets = filterAssets(assets)

    return (
      <>
        <div className="flex items-center mt-12 justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center">
            {icon}
            {title}
          </h2>
          <Link href="#" className={`text-sm ${linkColor} flex items-center hover:underline`}>
            View All <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">
            No markets found matching your search.
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4">
              {filteredAssets.map((asset) => (
                <BettingCard
                  key={asset.id}
                  asset={asset}
                  betSlip={betSlip}
                  globalBetAmount={globalBetAmount}
                  onAddToBetSlip={addToBetSlip}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-secondary text-white p-4 mx-auto">
      <Navbar />
      <main className="flex-1 px-4 mt-20 py-6 max-w-7xl mx-auto w-full">
        {/* Global Bet Amount and Search Section */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Search Markets with improved UI */}
            <div className="relative group">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search stocks, crypto, markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-primary focus-visible:ring-2 focus-visible:ring-secondary h-12 pl-12"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors duration-200" />
                </div>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="text-xs text-gray-400 mt-2 ml-3">
                  {filterAssets([...nseAssets, ...cryptoAssets, ...usStockAssets]).length} results found
                </div>
              )}
            </div>

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

                  {/* Quick Bet Toggle */}
                  <div className="flex  items-end gap-2">
                    <button
                      onClick={() => setQuickBetEnabled(!quickBetEnabled)}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 ${quickBetEnabled
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30'
                        : 'bg-gray-700 text-gray-300'
                        }`}
                      title={quickBetEnabled ? "Quick Bet Enabled" : "Quick Bet Disabled"}
                    >
                      {quickBetEnabled ? <ZapIcon className="w-5 h-5" /> : <ZapOffIcon className="w-5 h-5" />}
                    </button>
                    <span className="text-xs mt-1 text-gray-300">
                      {quickBetEnabled ? "Quick Bet" : "Manual Bet"}
                    </span>
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

        {/* Market Sections */}
        {renderAssetSection(
          "NSE Markets",
          nseAssets,
          <TrendingUpIcon className="w-5 h-5 mr-2 text-blue-400" />,
          "text-blue-400"
        )}

        {renderAssetSection(
          "Crypto Markets",
          cryptoAssets,
          <Image src="/placeholder.svg?height=20&width=20" width={20} height={20} alt="Crypto" className="mr-2" />,
          "text-yellow-400"
        )}

        {renderAssetSection(
          "US Stock Markets",
          usStockAssets,
          <Image src="/placeholder.svg?height=20&width=20" width={20} height={20} alt="US Stocks" className="mr-2" />,
          "text-green-400"
        )}
      </main>

      <BetSlip
        betSlip={betSlip}
        open={betSlipOpen}
        setOpen={setBetSlipOpen}
        removeFromBetSlip={removeFromBetSlip}
        updateBetAmount={updateBetAmount}
      />
    </div>
  )
}