"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import AllBets from '@/components/features/7-up-down/all-bets';
import { BettingArea } from '@/components/features/7-up-down/BettingArea';
import { GameBoard } from '@/components/features/7-up-down/game-board-new';
import { GameTimer } from '@/components/features/7-up-down/game-timer';
import { LiveBadge } from '@/components/features/dice-game/price-display';
import Navbar from '@/components/features/game/navbar';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { useLeaderboard } from '@/hooks/use-multi-socket-leaderboard';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';


const SevenUpDown = () => {
    const { marketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const {
        roundRecord,
        isLoading
    } = useCurrentGame(RoundRecordGameType.SEVEN_UP_DOWN);
    
    const roundRecordWithWinningId = useWinningId(roundRecord);
    const { stocks } = useLeaderboard(roundRecord);
    
    if (!marketSelected) return <MarketSelector title="7 Up & 7 Down" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh)]' />


    return (
        <section className={`flex flex-col relative bg-[radial-gradient(133.68%_74.71%_at_55.58%_46.9%,#01144C_0%,#000313_100%)] backdrop-blur-sm  items-center justify-start overflow-hidden min-h-screen w-full`}>
            <Navbar />
            <img src="/images/seven-up-down/bg.png" alt="7Up & 7Down" className='absolute top-0 left-0 w-full h-full opacity-50 object-cover' />
            <div className=" pt-16 pb-2  sm:px-4 px-2 max-w-[1560px] flex flex-col w-full mx-auto flex-1  text-white ">
                <div className='w-full bg-[#2857ADBF] relative z-10 rounded-2xl flex items-center justify-between px-4 sm:py-2 py-1'>
                    <h2 className=' uppercase tracking-wider sm:text-lg xs:text-base text-xs md:text-2xl font-poppins font-bold'>7Up & 7Down</h2>
                    <div className='flex items-center gap-2'>
                        <span className='tracking-widest text-xs md:text-base'>312 Viewing</span>
                    </div>
                </div>
                <div className='md:grid md:grid-cols-12 flex-1 gap-4'>
                    <div className='md:col-span-8 justify-around flex flex-col'>
                        <div className="justify-between items-center  flex-wrap flex flex-row w-full gap-4 my-4  relative z-10">
                            <LiveBadge/>
                            <GameTimer  roundRecord={roundRecord} />
                        </div>
                        <GameBoard className='flex-1' roundRecord={roundRecord} amount={betAmount}  marketItems={stocks} roundRecordWithWinningId={roundRecordWithWinningId} />
                        <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
                    </div>
                    <div className='md:col-span-4 mt-4 relative z-10'>
                        <AllBets roundRecord={roundRecord} className='h-full' />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SevenUpDown;