"use client"

import { Dispatch, SetStateAction, useState } from "react"

import Navbar from "@/components/features/game/navbar"
import SlotJackpotResultDialog from "@/components/features/game/slot-jackpot-result-dialog"
import { BettingCard } from "@/components/features/slot-jackpot/BettingCard"
import { BetSlip } from "@/components/features/slot-jackpot/bet-slip"
import TimeDisplay from "@/components/features/stock-slot/time-left"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentGame, useShowResults } from "@/hooks/use-current-game"
import { useGameType } from "@/hooks/use-game-type"
import { useLeaderboard } from "@/hooks/use-leadboard"
import { SchedulerType } from "@/models/market-item"
import { RoundRecordGameType } from "@/models/round-record"
import { useGetMyStockSlotJackpotGameRecord } from "@/react-query/game-record-queries"
import { CreditCard, SearchIcon } from "lucide-react"

export default function Home() {
  // State for bet slip
  const [betSlipOpen, setBetSlipOpen] = useState(false)
  const [globalBetAmount, setGlobalBetAmount] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")
  const [tab, setTab] = useGameType();

  const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_JACKPOT);

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
      {roundRecord && <BetSlip
        roundRecord={roundRecord}
        open={betSlipOpen}
        setOpen={setBetSlipOpen}
      />}

    </div>
  )
}


const MarketSection = ({ title, globalBetAmount, betSlipOpen, searchQuery, setBetSlipOpen }: { title: string, searchQuery: string, globalBetAmount: number, betSlipOpen: boolean, setBetSlipOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
  const { data: stockSlotPlacements } = useGetMyStockSlotJackpotGameRecord(roundRecord?.id);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarketItems.map((marketItem: any) => (
            <BettingCard
              globalBetAmount={globalBetAmount}
              key={marketItem.id}
              roundRecord={roundRecord}
              marketItem={marketItem}
            />
          ))}
        </div>
      )}

      {previousRoundId && (
        <SlotJackpotResultDialog
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
