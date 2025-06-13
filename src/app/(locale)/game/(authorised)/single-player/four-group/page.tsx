"use client";
import LeaderBoard from "@/components/features/four-group/leaderboard";
import SinglePlayerRouletteGame from "@/components/features/four-group/placement-board";
import StockCardStack, { StockCardStackMobile } from "@/components/features/four-group/stock-card";
import Navbar from "@/components/features/game/navbar";
import { BettingAmoutMobile } from "@/components/features/slot-jackpot/betting-amout";
import BettingChips from "@/components/features/slot-jackpot/betting-chips";
import TimeDisplay from "@/components/features/stock-jackpot/time-left";
import { Tabs } from "@/components/ui/tabs";
import { useCurrentGame, usePlacementOver } from "@/hooks/use-current-game";
import { useGameType, useRoundRecordGameType } from "@/hooks/use-game-type";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { useWindowSize } from "@/hooks/use-window-size";
import { SchedulerType } from "@/models/market-item";
import { useState } from "react";


export default function Home() {
    // State for bet slip
    const [globalBetAmount, setGlobalBetAmount] = useState(100);
    const { isMobileSmall } = useWindowSize();
    const [roundRecordGameType] = useRoundRecordGameType();
    const { roundRecord } = useCurrentGame(roundRecordGameType);
    const [tab, setTab] = useGameType();
    const isPlacementOver = usePlacementOver(roundRecord);

    const { stocks: marketItems } = useLeaderboard(roundRecord);
    // Function to update global bet amount
    const handleGlobalBetAmountChange = (amount: number) => {
        setGlobalBetAmount(amount)
    }
    return (
        <div className="flex flex-col min-h-screen  relative from-green-800 via-green-900 to-green-950 bg-repeat bg-center text-white  mx-auto">
            <Navbar />

            <Tabs className="flex-1  mt-8  pt-6 w-full" value={tab} onValueChange={(value) => setTab(value as SchedulerType)}>

                {roundRecord && <TimeDisplay className="fixed top-14 left-1/2 -translate-x-1/2 z-50  w-full max-w-[300px]" roundRecord={roundRecord} />}
                <div className="w-full">
                    <div className="grid relative grid-cols-1  gap-6  rounded-lg  pt-20  ">
                        <img src="/images/four-group/background.jpg" className=" w-full absolute top-0 left-0 object-cover  mx-auto  h-full " />
                        {roundRecord && isMobileSmall && <StockCardStackMobile className="absolute  p-2 top-14 right-0" roundRecord={roundRecord} marketItems={marketItems} />}
                        <div className="relative h-full w-full md:min-h-[700px]  sm:min-h-[600px] min-h-[400px]  bg-contain bg-no-repeat bg-center">
                            <div className="absolute bottom-0 w-full h-fit ">
                                <div className='absolute left-1/2 -translate-x-1/2 bottom-[calc(100%-2vw)] md:h-[60%] h-3/4 z-10 flex max-w-sm items-end justify-center'>
                                    <img src="/images/four-group/lady.gif" alt="dice-bg" className='w-auto md:h-[80%] sm:h-48 xs:h-40 h-36 mt-20' />
                                </div>
                                {roundRecord && <StockCardStack className="absolute p-2 left-1/2 -translate-x-1/2 md:bottom-[calc(30%+1rem)] bottom-[calc(20%+1rem)]" roundRecord={roundRecord} marketItems={marketItems} />}
                                <img src="/images/four-group/table.png" className=" w-full sm:mx-auto   h-full  relative z-10  md:max-w-5xl sm:max-w-2xl max-w-xl" />
                                <h2 className="text-emerald-900 font-semibold absolute md:bottom-12 bottom-6 xl:text-3xl md:text-xl sm:text-base text-xs left-1/2 -translate-x-1/2 font-keania-one z-20 tracking-wide">BULL MARKET</h2>
                            </div>
                        </div>
                        {roundRecord && !isMobileSmall && <LeaderBoard roundRecord={roundRecord} className="absolute top-0 left-0 z-10 h-72 bg-black/50  w-full max-w-sm rounded-b-lg md:block hidden" />}
                        <BettingChips
                            showBetting={true}
                            className="absolute top-0 right-0 z-10 bg-black/50  w-full max-w-sm rounded-b-lg md:block hidden"
                            globalBetAmount={globalBetAmount}
                            handleGlobalBetAmountChange={handleGlobalBetAmountChange}
                        />
                    </div>

                </div>
                {roundRecord && <SinglePlayerRouletteGame roundRecord={roundRecord} globalBetAmount={globalBetAmount} showCards={!isPlacementOver || !isMobileSmall}>
                    <div className="md:hidden block w-full mb-8 ">
                        <BettingChips
                            showBetting={!isPlacementOver}
                            globalBetAmount={globalBetAmount}
                            handleGlobalBetAmountChange={handleGlobalBetAmountChange}
                        />
                        {roundRecord && isMobileSmall && isPlacementOver && <LeaderBoard roundRecord={roundRecord} className="rounded-sm" />}

                    </div>
                </SinglePlayerRouletteGame>
                }
            </Tabs>

            <BettingAmoutMobile
                globalBetAmount={globalBetAmount}
                handleGlobalBetAmountChange={handleGlobalBetAmountChange}
            />

        </div>

    )
}


