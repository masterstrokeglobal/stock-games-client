"use client"
import GameLoadingScreen from "@/components/common/game-loading-screen"
import MarketSelector from "@/components/common/market-selector"
import Navbar from "@/components/features/game/navbar"
import BettingChips from "@/components/features/slot-jackpot/betting-chips"
import Header from "@/components/features/stock-jackpot/header"
import MarketSection, { MarketSectionMobile } from "@/components/features/stock-jackpot/market-section"
import StockCardStack from "@/components/features/stock-jackpot/stock-card"
import { Tabs } from "@/components/ui/tabs"
import { useCurrentGame, usePlacementOver } from "@/hooks/use-current-game"
import { useGameType } from "@/hooks/use-game-type"
import { useMarketSelector } from "@/hooks/use-market-selector"
import useWindowSize from "@/hooks/use-window-size"
import useWinningId from "@/hooks/use-winning-id"
import { SchedulerType } from "@/models/market-item"
import { RoundRecordGameType } from "@/models/round-record"
import { useEffect, useRef, useState } from "react"


export default function Home() {
    const [globalBetAmount, setGlobalBetAmount] = useState(100)
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
    const [scrollHeight, setScrollHeight] = useState(0);
    const stocksRef = useRef<HTMLDivElement>(null);
    const [tab, setTab] = useGameType();
    const { isDesktop } = useWindowSize()
    const isPlacementOver = usePlacementOver(roundRecord);
    const roundRecordWithWinningId = useWinningId(roundRecord);
    const { marketSelected } = useMarketSelector();

    const handleGlobalBetAmountChange = (amount: number) => {
        setGlobalBetAmount(amount)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (stocksRef.current) {
                console.log(stocksRef.current.clientHeight, "clientHeight");
                const stocksHeight = stocksRef.current.clientHeight;
                setScrollHeight(stocksHeight);
            }
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
        
    }, [stocksRef]);
    if (isLoading || !roundRecord) return <GameLoadingScreen className="min-h-[calc(100svh)]" />;


    if (!marketSelected)
        return (
            <MarketSelector
                title="HI - LO Market"
                roundRecordType={RoundRecordGameType.STOCK_SLOTS}
            />
        );


    return (
        <div className="flex flex-col h-[100svh] min-h-[650px] pt-12 bg-[#00627A] overflow-hidden  relative bg-repeat bg-center text-white  mx-auto">
            <img src="/images/jackpot/bg.png" className="w-full hidden; md:h-full h-[380px] object-cover absolute z-0" />
            <Navbar />
            <Header className="z-10 relative sm:mt-4 mt-2 px-4" />
            <Tabs className="flex-1 w-full flex justify-between flex-col" value={tab} onValueChange={(value) => setTab(value as SchedulerType)}>
                <MarketSection
                    globalBetAmount={globalBetAmount}
                />
                <div className="w-full z-10 ">
                    <div className="grid relative grid-cols-1 lg:gap-6  xxl:py-4 lg:mt-0 xsm:mt-24 mt-20 rounded-lg">
                        <div className="relative h-full  w-full lg:min-h-[200px]  bg-contain bg-no-repeat bg-center">
                            <div className="lg:absolute lg bottom-4 w-full h-fit">
                                <div className='absolute left-1/2 -translate-x-1/2 lg:bottom-[calc(100%-2vw)] sm:bottom-[calc(100%-2vw-20px)] bottom-[calc(100%-2vw-10px)] md:h-[60%] h-3/4 z-10 flex max-w-sm items-end justify-center'>
                                    <img src={!isPlacementOver ? "/images/jackpot/girl-card.gif" : "/images/jackpot/girl-bet.gif"} alt="dice-bg" className='sm:w-auto w-full sm:max-w-none xs:max-w-[150px] max-w-[120px] sm:h-full h-auto relative z-[20] translate-y-[16%] sm:mt-20' />
                                </div>
                                <img src="/images/jackpot/high-chip.svg" className="absolute sm:-top-5 -top-3 lg:right-[30%] sm:right-[15%] md:w-28 xsm:w-20 w-16 right-[15%]" />
                                <img src="/images/jackpot/low-chip.svg" className="absolute sm:-top-5 -top-3 lg:left-[30%] sm:left-[15%] md:w-28 xsm:w-20 w-16 left-[15%]" />
                                <img src="/images/jackpot/table.png" alt="jackpot-table" className=" w-full sm:mx-auto h-full  relative z-0  md:max-w-4xl sm:max-w-2xl max-w-xl" />
                                {roundRecord && <StockCardStack roundRecord={roundRecord} roundRecordWithWinningId={roundRecordWithWinningId} />}
                            </div>
                        </div>
                        {roundRecord && <BettingChips
                            roundRecord={roundRecord}
                            showBetting={!isPlacementOver}
                            className="lg:absolute lg:bottom-0 lg:left-1/2 pb-2 lg:-translate-x-1/2 z-30 w-full "
                            globalBetAmount={globalBetAmount}
                            handleGlobalBetAmountChange={handleGlobalBetAmountChange}
                        />}
                    </div>
                </div>
                {!isDesktop &&
                    <div ref={stocksRef} className="px-4 h-full flex w-full justify-center">
                        <MarketSectionMobile styles={{ height: scrollHeight }} className="flex-1" globalBetAmount={globalBetAmount} />
                    </div>
                }
            </Tabs>
        </div>

    )
}





// const GameLoadingScreen = () => {
//     return (
//         <div className="flex justify-center items-center h-screen w-screen">
//             <img src="/images/jackpot/bg.png" alt="logo" className="absolute top-0 left-0 w-full object-cover h-full" />
//             <div className="absolute top-0 left-0 w-full h-full" style={{
//                 background: "radial-gradient(58.41% 58.41% at 50% 50%, rgba(42, 150, 176, 0.70) 0%, rgba(0, 88, 110, 0.70) 7.69%, rgba(0, 0, 0, 0.70) 100%)",
//                 backdropFilter: "blur(7.5px);"
//             }} />
//         </div>
//     );
// }
