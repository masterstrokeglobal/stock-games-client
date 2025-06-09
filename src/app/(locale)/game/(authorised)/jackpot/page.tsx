"use client"

import { Dispatch, SetStateAction, useMemo, useState } from "react"

import Navbar from "@/components/features/game/navbar"
import SlotResultDialog from "@/components/features/game/slot-result-dialog"
import { BettingAmoutMobile } from "@/components/features/slot-jackpot/betting-amout"
import BettingChips from "@/components/features/slot-jackpot/betting-chips"
import { BetSlip } from "@/components/features/stock-jackpot/bet-slip"
import { BettingCard } from "@/components/features/stock-jackpot/betting-card"
import TimeDisplay from "@/components/features/stock-jackpot/time-left"
import { Tabs } from "@/components/ui/tabs"
import { useCurrentGame, usePlacementOver, useShowResults } from "@/hooks/use-current-game"
import { useGameType } from "@/hooks/use-game-type"
import { RankedMarketItem, useLeaderboard } from "@/hooks/use-leadboard"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import { SchedulerType } from "@/models/market-item"
import { RoundRecord, RoundRecordGameType } from "@/models/round-record"
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot"
import { useGetMyFavorites } from "@/react-query/favorite-market-item-queries"
import { useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { Triangle } from "lucide-react"


export default function Home() {
  // State for bet slip
  const [betSlipOpen, setBetSlipOpen] = useState(false)
  const [globalBetAmount, setGlobalBetAmount] = useState(100)
  const [searchQuery, setSearchQuery] = useState("");
  const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
  const [tab, setTab] = useGameType();
  const { isDesktop } = useWindowSize()
  const isPlacementOver = usePlacementOver(roundRecord);

  // Function to update global bet amount
  const handleGlobalBetAmountChange = (amount: number) => {
    setGlobalBetAmount(amount)
  }
  return (
    <div className="flex flex-col min-h-screen  relative bg-[url('/images/game-bg-pattern.png')] bg-repeat bg-center text-white  mx-auto">
      <Navbar />

      <Tabs className="flex-1  mt-8  py-6 w-full" value={tab} onValueChange={(value) => setTab(value as SchedulerType)}>
        {isDesktop &&
          <MarketSection
            searchQuery={searchQuery}
            globalBetAmount={globalBetAmount}
            betSlipOpen={betSlipOpen}
            className="absolute top-12 right-0 max-w-sm h-fit z-10"
            setSearchQuery={setSearchQuery}
            setBetSlipOpen={setBetSlipOpen}
          />
        }
        {/* Global Bet Amount and Search Section */}
        {roundRecord && <TimeDisplay className="fixed top-14 left-1/2 -translate-x-1/2 z-50  w-full max-w-sm" roundRecord={roundRecord} />}
        <div className="w-full mb-8 ">
          <div className="grid relative grid-cols-1  gap-6  rounded-lg  pt-20  ">
            <img src="/images/jackpot/bg.png" className=" w-full absolute top-0 left-0 object-cover  mx-auto  h-full " />
            <div className="relative h-full w-full md:min-h-[700px]   sm:min-h-[600px] min-h-[400px]  bg-contain bg-no-repeat bg-center">
              <div className="absolute bottom-0 w-full h-fit ">
                <div className='absolute left-1/2 -translate-x-1/2 bottom-[calc(100%-2vw)] md:h-[60%] h-3/4 z-10 flex max-w-sm items-end justify-center'>
                  <img src="/images/dice-game/lady.gif" alt="dice-bg" className='w-auto h-full mt-20' />
                </div>
                <img src="/images/jackpot/table.png" className=" w-full sm:mx-auto   h-full  relative z-10  md:max-w-6xl sm:max-w-2xl max-w-xl" />
                {roundRecord && <StockCardStack roundRecord={roundRecord} />}

              </div>
            </div>
            <BettingChips
              showBetting={!isPlacementOver}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-full md:block hidden"
              globalBetAmount={globalBetAmount}
              handleGlobalBetAmountChange={handleGlobalBetAmountChange}
            />
          </div>

          <div className="md:hidden block w-full mb-8 bg-amber-600/20">
            <BettingChips
              showBetting={!isPlacementOver}
              globalBetAmount={globalBetAmount}
              handleGlobalBetAmountChange={handleGlobalBetAmountChange}
            />
          </div>
        </div>


{ !isDesktop &&
  <MarketSection
  searchQuery={searchQuery}
  globalBetAmount={globalBetAmount}
  betSlipOpen={betSlipOpen}
  setSearchQuery={setSearchQuery}
  setBetSlipOpen={setBetSlipOpen}
/>
  }
      </Tabs>

      <BettingAmoutMobile
        globalBetAmount={globalBetAmount}
        handleGlobalBetAmountChange={handleGlobalBetAmountChange}
      />

    </div>

  )
}


const MarketSection = ({ globalBetAmount, betSlipOpen, searchQuery, setBetSlipOpen, className }: { searchQuery: string, globalBetAmount: number, betSlipOpen: boolean, className?: string, setSearchQuery: Dispatch<SetStateAction<string>>, setBetSlipOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
  const { data: stockSlotPlacements } = useGetMyStockSlotGameRecord(roundRecord?.id);
  const { showResults, previousRoundId } = useShowResults(roundRecord, stockSlotPlacements as any);

  const { data: myFavorites } = useGetMyFavorites();
  const sortedMarketItems = useMemo(() => {
    const filteredMarketItems = roundRecord?.market.filter((marketItem) => (marketItem.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (marketItem.code?.toLowerCase() || '').includes(searchQuery.toLowerCase())).sort((a, b) => (a.id || 0) - (b.id || 0))
    return filteredMarketItems?.sort((a, b) => {
      if (!a.id || !b.id) return 0;
      const aFavorite = myFavorites?.includes(a.id);
      const bFavorite = myFavorites?.includes(b.id);
      return !bFavorite ? -1 : !aFavorite ? 1 : 0;
    });
  }, [roundRecord, myFavorites, searchQuery]);

  if (!roundRecord) return <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">No markets found matching your search.</div>

  return (
    <div className={cn("relative w-full", className)}>
      {/* <div className={cn(" mt-12  px-4 max-w-7xl mx-auto")}>
        <h2 className="text-lg font-bold flex items-center ">
          {title}
        </h2>
        <div className="flex justify-between flex-col md:flex-row gap-4 items-start my-6">
          <div className="relative w-full md:max-w-md">
            <Input
              type="text"
              placeholder="Search stocks, crypto, markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-primary focus-visible:ring-2 focus-visible:ring-secondary h-10 pl-12 text-white"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors duration-200" />
            </div>
          </div>

          <TabsList className="w-full md:max-w-md flex gap-4">
            <TabsTrigger value={SchedulerType.NSE} className="w-full rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:shadow-[0_0_15px_rgba(245,158,11,0.5)] data-[state=active]:border-amber-400 data-[state=inactive]:bg-gray-700/50">NSE</TabsTrigger>
            <TabsTrigger value={SchedulerType.CRYPTO} className="w-full rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:shadow-[0_0_15px_rgba(245,158,11,0.5)] data-[state=active]:border-amber-400 data-[state=inactive]:bg-gray-700/50">Crypto</TabsTrigger>
            <TabsTrigger value={SchedulerType.USA_MARKET} className="w-full rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:shadow-[0_0_15px_rgba(245,158,11,0.5)] data-[state=active]:border-amber-400 data-[state=inactive]:bg-gray-700/50">US Stock</TabsTrigger>
          </TabsList>
        </div>
      </div> */}

      {roundRecord.market.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">
          No markets found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1  max-w-7xl mx-auto px-4 ">
          {sortedMarketItems?.slice(0, 4).map((marketItem: any) => (
            <BettingCard
              key={marketItem.id}
              roundRecord={roundRecord}
              globalBetAmount={globalBetAmount}
              marketItem={marketItem}
              className="w-full first:rounded-t-xl last:rounded-b-xl"
            />
          ))}

          {/* {showMore && sortedMarketItems && sortedMarketItems?.length > 4 && (
            <>
              {sortedMarketItems?.slice(4).map((marketItem: any) => (
                <BettingCard
                  key={marketItem.id}
                  roundRecord={roundRecord}
                  globalBetAmount={globalBetAmount}
                  marketItem={marketItem}
                />
              ))}
            </>
          )}

          <Button variant="game-secondary" onClick={() => setShowMore(!showMore)} className="w-full text-center flex justify-center">
            {showMore ? "Show Less" : "Show More"}
          </Button> */}
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
    </div>
  )
}


const StockCard = ({ stock, className, amount }: { stock?: RankedMarketItem, className?: string, amount?: number }) => {
  if (!stock) return null;
  console.log("stock individual",stock)
  return (
    <div className="relative">
      <div className={cn(
        "w-10 md:w-16 lg:w-20 h-14 md:h-16 lg:h-20 bg-white rounded-lg shadow-lg relative transform hover:scale-105 transition-transform cursor-pointer md:p-2 p-1",
        className
      )} style={{ background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)' }}>
        <div className="h-full flex flex-col items-center justify-center gap-1">
          <span className="text-black text-[8px] md:text-[10px] lg:text-xs text-center font-bold truncate w-full">{stock.name}</span>

          <span className={cn("text-black flex flex-col items-center text-center md:text-xs text-[8px] whitespace-nowrap font-bold truncate w-full", Number(stock.change_percent) >= 0 ? "text-green-600" : "text-red-600")}>
            {stock.currency} 
          </span>

          <span className={cn("text-black flex flex-col items-center text-center md:text-xs text-[8px] whitespace-nowrap font-bold truncate w-full", Number(stock.change_percent) >= 0 ? "text-green-600" : "text-red-600")}>
               {stock.price}
          </span>
          <div className={`text-[8px] md:text-[10px] lg:text-sm font-bold flex items-center gap-0.5 ${Number(stock.change_percent) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
            {Number(stock.change_percent) >= 0 ? (
              <>
                <Triangle className="md:w-4 md:h-4 w-3 h-3 text-green-600 fill-green-600 flex-shrink-0" />
              </>
            ) : (
              <Triangle className="md:w-4 md:h-4 w-3 h-3 text-red-600 fill-red-600 rotate-180 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
      {amount && (
        <div className=" bg-amber-500 text-white text-[8px] md:text-xs  text-center w-fit mx-auto px-2 py-0.5 rounded-full font-bold shadow-lg">
          ₹{amount}
        </div>
      )}
    </div>
  )
}

const StockCardStack = ({ roundRecord }: { roundRecord: RoundRecord }) => {

  const { stocks: marketItems } = useLeaderboard(roundRecord);
  const { data: myStockSlotJackpotGameRecord } = useGetMyStockSlotGameRecord(roundRecord?.id);

  const bettedMarketItems = useMemo(() => {
    const bettedMarketItems = myStockSlotJackpotGameRecord?.filter((record) => record.placement === StockJackpotPlacementType.HIGH || record.placement === StockJackpotPlacementType.LOW)
    return bettedMarketItems?.map((record) => {
      return {
        ...record,
        stock: marketItems?.find((item) => item.id === record.marketItem.id)
      }
    })
  }, [myStockSlotJackpotGameRecord, roundRecord, marketItems])

  const highStocks = bettedMarketItems?.filter((item) => item.placement === StockJackpotPlacementType.HIGH) || [];
  const lowStocks = bettedMarketItems?.filter((item) => item.placement === StockJackpotPlacementType.LOW) || [];


  console.log("stock high",highStocks)
  console.log("stock low",lowStocks)

  return (<div className="absolute p-2 left-1/2 -translate-x-1/2  md:bottom-[calc(45%+1rem)] bottom-[calc(33%+1rem)] z-10 w-full  md:max-w-xl sm:max-w-sm max-w-[280px]  ">
    <div style={{ transform: 'perspective(1000px) rotateX(15deg)' }} className=" origin-center mx-auto flex z-10 gap-2 md:gap-4 h-fit w-full" >

      <div className="flex-1 gap-2 md:gap-4 flex flex-col">
        <div className="col-span-2 text-center font-bold text-xs md:text-sm">LOW</div>
        <div className="flex-1 gap-2 md:gap-4 flex justify-around">
          {lowStocks.length > 0 ? (
            lowStocks.map((item) => (
              <StockCard key={item.id} stock={item.stock} amount={item.amount} />
            ))
          ) : (
            <div className="text-center border border-dashed border-gray-400  p-2 text-gray-400 text-xs md:text-sm rounded-lg">No stocks selected</div>
          )}
        </div>
      </div>

      <div className="flex-1 gap-2 md:gap-4 flex flex-col" >
        <div className="col-span-2 text-center font-bold text-xs md:text-sm">HIGH</div>
        <div className="flex-1 gap-2 md:gap-4 flex justify-around">
          {highStocks.length > 0 ? (
            highStocks.map((item) => (
              <StockCard key={item.id} stock={item.stock} amount={item.amount} />
            ))
          ) : (
            <div className="text-center text-gray-400 text-[10px] md:text-sm border border-dashed border-gray-400  md:p-2 p-1 rounded-lg">No stocks selected</div>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}
