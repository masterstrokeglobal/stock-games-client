"use client"

import { Dispatch, SetStateAction, useState } from "react"

import Navbar from "@/components/features/game/navbar"
import SlotResultDialog from "@/components/features/game/slot-result-dialog"
import { BetSlip } from "@/components/features/stock-jackpot/bet-slip"
import { BettingCard } from "@/components/features/stock-jackpot/betting-card"
import TimeDisplay from "@/components/features/stock-jackpot/time-left"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentGame, useShowResults } from "@/hooks/use-current-game"
import { useGameType } from "@/hooks/use-game-type"
import { useLeaderboard } from "@/hooks/use-leadboard"
import { SchedulerType } from "@/models/market-item"
import { RoundRecordGameType } from "@/models/round-record"
import { useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { CreditCard, SearchIcon } from "lucide-react"
import { BettingAmoutMobile } from "@/components/features/slot-jackpot/betting-amout"
import BettingAmount from "@/components/features/slot-jackpot/betting-amout"

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
    <div className="flex flex-col min-h-screen bg-background-secondary text-white py-4 mx-auto">
      <Navbar />
      <Tabs className="flex-1 px-4 mt-48 py-6 max-w-7xl mx-auto w-full" value={tab} onValueChange={(value) => setTab(value as SchedulerType)}>
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

              {roundRecord && <TimeDisplay className="fixed top-14 left-1/2 -translate-x-1/2 z-50  w-full max-w-md" roundRecord={roundRecord} />}
            </div>

            {/* Global Bet Amount with improved UI */}
            <BettingAmount
              globalBetAmount={globalBetAmount}
              handleGlobalBetAmountChange={handleGlobalBetAmountChange}
            />
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

      <BettingAmoutMobile
        globalBetAmount={globalBetAmount}
        handleGlobalBetAmountChange={handleGlobalBetAmountChange}
      />

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
        <div className="grid grid-cols-1  gap-2">
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

      {previousRoundId && (
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

