"use client"

import { Dispatch, SetStateAction, useState, useEffect } from "react"

import Navbar from "@/components/features/game/navbar"
import { BetSlip } from "@/components/features/stock-slot/bet-slip"
import { BettingCard } from "@/components/features/stock-slot/betting-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLeaderboard } from "@/hooks/use-leadboard"
import { SchedulerType } from "@/models/market-item"
import { RoundRecord, RoundRecordGameType } from "@/models/round-record"
import { CreditCard, SearchIcon, ZapIcon, ZapOffIcon } from "lucide-react"

import SlotResultDialog from "@/components/features/game/slot-result-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentGame, useGameState, useShowResults } from "@/hooks/use-current-game"
import { useGameType } from "@/hooks/use-game-type"
import { useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, Clock, AlertTriangle } from "lucide-react"
import { FormattedTime } from "@/components/features/game/contants"

export default function Home() {
  // State for bet slip
  const [betSlipOpen, setBetSlipOpen] = useState(false)
  const [globalBetAmount, setGlobalBetAmount] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")
  const [quickBetEnabled, setQuickBetEnabled] = useState(false)
  const [tab, setTab] = useGameType();

  const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);

  // Function to update global bet amount
  const handleGlobalBetAmountChange = (amount: number) => {
    setGlobalBetAmount(amount)
  }

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("")
  }


  return (
    <div className="flex flex-col min-h-screen bg-background-secondary text-white p-4 mx-auto">
      <Navbar />
      <Tabs className="flex-1 px-4 mt-20 py-6 max-w-7xl mx-auto w-full" value={tab} onValueChange={(value) => setTab(value as SchedulerType)}>
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

              <TabsList className="w-full mt-6 rounded-sm" >
                <TabsTrigger value={SchedulerType.NSE} className="w-full">NSE</TabsTrigger>
                <TabsTrigger value={SchedulerType.CRYPTO} className="w-full">Crypto</TabsTrigger>
                <TabsTrigger value={SchedulerType.USA_MARKET} className="w-full">US Stock</TabsTrigger>
              </TabsList>

              {roundRecord && <TimeDisplay roundRecord={roundRecord} />}
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
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setBetSlipOpen(true)}
              className="bg-primary hover:bg-primary/80 text-white rounded-full py-2 px-6 flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-primary/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Open Bet Slip</span>
            </button>
          </div>
        </div>

        <MarketSection
          title={`${tab.split('-')[0].toUpperCase()} Markets`}
          searchQuery={searchQuery}
          globalBetAmount={globalBetAmount}
          betSlipOpen={betSlipOpen}
          setBetSlipOpen={setBetSlipOpen}
        />


      </Tabs>


    </div>
  )
}


const MarketSection = ({ title, globalBetAmount, betSlipOpen, searchQuery, setBetSlipOpen }: { title: string, searchQuery: string, globalBetAmount: number, betSlipOpen: boolean, setBetSlipOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
  const { data: stockSlotPlacements } = useGetMyStockSlotGameRecord(roundRecord?.id);
  const { showResults, previousRoundId } = useShowResults(roundRecord, stockSlotPlacements as any);

  const { stocks: marketItems } = useLeaderboard(roundRecord);
  const filteredMarketItems = marketItems.filter((marketItem) => (marketItem.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (marketItem.code?.toLowerCase() || '').includes(searchQuery.toLowerCase())).sort((a, b) => (a.id || 0) - (b.id || 0))
  if (!roundRecord) return <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">No markets found matching your search.</div>

  return (
    <>
      <div className="flex items-center mt-12 justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center">
          {title}
        </h2>
      </div>

      {roundRecord.market.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">
          No markets found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filteredMarketItems.map((marketItem: any) => (
            <BettingCard
              key={marketItem.id}
              roundRecord={roundRecord}
              globalBetAmount={globalBetAmount}
              marketItem={marketItem}
            />
          ))}
        </div>
      )}

      {
        previousRoundId && (
          <SlotResultDialog
            key={showResults?.toString()}
            open={showResults}
            roundRecordId={previousRoundId}
          />
        )
      }

      <BetSlip
        roundRecord={roundRecord}
        open={betSlipOpen}
        setOpen={setBetSlipOpen}
      />
    </>
  )
}


export const TimeDisplay = ({ roundRecord }: { roundRecord: RoundRecord }) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft } = useGameState(roundRecord)

  // Determine if we're in the danger zone (last 3 seconds)
  console.log(gameTimeLeft, placeTimeLeft)
  const isDanger = isPlaceOver
    ? gameTimeLeft.minutes === 0 && gameTimeLeft.seconds <= 3
    : placeTimeLeft.minutes === 0 && placeTimeLeft.seconds <= 3

  // Current time to display
  const currentTime = isPlaceOver
    ? `${gameTimeLeft.minutes}:${String(gameTimeLeft.seconds).padStart(2, '0')}`
    : `${placeTimeLeft.minutes}:${String(placeTimeLeft.seconds).padStart(2, '0')}`

  // Status text
  const statusText = isPlaceOver ? "Betting Closed" : "Betting Open"

 
  return (
    <motion.div
      className="relative w-full h-[150px] bg-gray-900 rounded-xl mt-4 overflow-hidden border-2 border-primary-game"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanline opacity-10 z-10"></div>

      {/* Danger overlay */}
      {isDanger && (
        <motion.div
          className="absolute inset-0 bg-red-900/20"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [0, -2, 2, -2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 0.8,
            repeatType: "reverse",
          }}
        />
      )}

      <div className="flex flex-col items-center justify-center h-full p-6">
        {/* Status indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`status-${statusText}`}
            className="flex items-center mb-4 space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ rotate: isDanger ? [0, 15, -15, 0] : 0 }}
              transition={{
                repeat: isDanger ? Number.POSITIVE_INFINITY : 0,
                duration: 0.5,
                repeatType: "reverse",
              }}
            >
              {isPlaceOver ? (
                <Timer className={`w-5 h-5 ${isDanger ? "text-red-400" : "text-amber-300"}`} />
              ) : (
                <Clock className="w-5 h-5 text-cyan-300" />
              )}
            </motion.div>
            <span
              className={`text-sm font-medium uppercase tracking-wider ${isDanger ? "text-red-400" : isPlaceOver ? "text-amber-300" : "text-cyan-300"
                }`}
              style={{ textShadow: "0 0 3px currentColor" }}
            >
              {statusText}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Time display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`time-${currentTime}-${roundRecord.id}`}
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: isDanger ? [1, 1.05, 1] : 1,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.4,
              scale: {
                repeat: isDanger ? Number.POSITIVE_INFINITY : 0,
                duration: 0.5,
                repeatType: "reverse",
              },
            }}
          >
            {/* Warning icon for danger state */}
            {isDanger && (
              <motion.div
                className="absolute -left-10 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </motion.div>
            )}

            <div
              className={`font-mono text-6xl font-bold ${isDanger ? "text-red-500" : isPlaceOver ? "text-amber-300" : "text-cyan-300"
                } pixel-text`}
            >
              {currentTime}
            </div>

            {/* Warning icon for danger state */}
            {isDanger && (
              <motion.div
                className="absolute -right-10 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Phase indicator */}
        <motion.div
          className="mt-4 text-xs text-gray-500 uppercase tracking-widest"
          animate={{
            opacity: isDanger ? [0.5, 1] : 1,
          }}
          transition={{
            repeat: isDanger ? Number.POSITIVE_INFINITY : 0,
            duration: 0.5,
            repeatType: "reverse",
          }}
        >
          {isPlaceOver ? "Game in Progress" : "Place Your Bets"}
        </motion.div>
      </div>
    </motion.div>
  )
}
