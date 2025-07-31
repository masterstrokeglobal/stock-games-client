"use client"

import GameLoadingScreen from "@/components/common/game-loading-screen"
import Navbar from "@/components/features/game/navbar"
import BettingChips from "@/components/features/slot-jackpot/betting-chips"
import Header from "@/components/features/stock-jackpot/header"
import MarketSection, { MarketSectionMobile } from "@/components/features/stock-jackpot/market-section"
import StockCardStack from "@/components/features/stock-jackpot/stock-card"
import { Tabs } from "@/components/ui/tabs"
import { useCurrentGame, usePlacementOver } from "@/hooks/use-current-game"
import { useGameType } from "@/hooks/use-game-type"
import useWindowSize from "@/hooks/use-window-size"
import useWinningId from "@/hooks/use-winning-id"
import { SchedulerType } from "@/models/market-item"
import { RoundRecordGameType } from "@/models/round-record"
import { useState } from "react"


export default function Home() {
    const [globalBetAmount, setGlobalBetAmount] = useState(100)
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
    const [tab, setTab] = useGameType();
    const { isDesktop } = useWindowSize()
    const isPlacementOver = usePlacementOver(roundRecord);
    const roundRecordWithWinningId = useWinningId(roundRecord);

    const handleGlobalBetAmountChange = (amount: number) => {
        setGlobalBetAmount(amount)
    }

    if (isLoading) return <GameLoadingScreen className='min-h-[100svh]' />
    return (
        <div className="flex flex-col min-h-screen overflow-hidden pt-12  relative bg-repeat bg-center text-white  mx-auto">
            <img src="/images/jackpot/bg.png" className="w-full h-full absolute z-0" />
            <Navbar />
            <Header className="z-10 relative mt-4 px-4" />
            <Tabs className="flex-1 w-full flex justify-between flex-col" value={tab} onValueChange={(value) => setTab(value as SchedulerType)}>
                <MarketSection
                    globalBetAmount={globalBetAmount}
                />
                <div className="w-full z-10 ">
                    <div className="grid relative grid-cols-1  lg:gap-6  rounded-lg">
                        <div className="relative h-full w-full lg:min-h-[200px]  bg-contain bg-no-repeat bg-center">
                            <div className="lg:absolute lg bottom-0 w-full h-fit">
                                <div className='absolute left-1/2 -translate-x-1/2 lg:bottom-[calc(100%-2vw)] sm:bottom-[calc(100%-2vw-20px)] bottom-[calc(100%-2vw-10px)] md:h-[60%] h-3/4 z-10 flex max-w-sm items-end justify-center'>
                                    <img src="/images/jackpot/girl.png" alt="dice-bg" className='w-auto h-full mt-20' />
                                </div>
                                <img src="/images/jackpot/high-chip.svg" className="absolute -top-5 sm:right-[30%] md:w-28 w-20 right-[15%]" />
                                <img src="/images/jackpot/low-chip.svg" className="absolute -top-5 sm:left-[30%] md:w-28 w-20 left-[15%]" />
                                <img src="/images/jackpot/table.png" alt="jackpot-table" className=" w-full sm:mx-auto h-full  relative z-10  md:max-w-4xl sm:max-w-2xl max-w-xl" />
                                {roundRecord && <StockCardStack roundRecord={roundRecord} roundRecordWithWinningId={roundRecordWithWinningId} />}
                            </div>
                        </div>
                        {roundRecord && <BettingChips
                            roundRecord={roundRecord}
                            showBetting={!isPlacementOver}
                            className="lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 z-30 w-full "
                            globalBetAmount={globalBetAmount}
                            handleGlobalBetAmountChange={handleGlobalBetAmountChange}
                        />}
                    </div>
                </div>
                {!isDesktop &&
                    <div className="px-4 flex w-full justify-center">
                        <MarketSectionMobile className="flex-1" globalBetAmount={globalBetAmount} />
                    </div>
                }
            </Tabs>


        </div>

    )
}



