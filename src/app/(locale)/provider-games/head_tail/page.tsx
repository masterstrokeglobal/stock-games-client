"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import AllBets from '@/components/features/coin-head-tail/all-bets';
import GameBoard, { GameTimer } from '@/components/features/coin-head-tail/game-board-new';
import PriceDisplay, { LiveBadge } from '@/components/features/dice-game/price-display';
import ExternalUserNavbar from '@/components/features/game/external-user-Navbar';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { Prosto_One } from 'next/font/google';
import { useState } from 'react';


const ProstoOne = Prosto_One({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-prosto-one',
})
const HeadTail = () => {
    const { marketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const {
        roundRecord,
        isLoading
    } = useCurrentGame(RoundRecordGameType.HEAD_TAIL);


    const roundRecordWithWinningId = useWinningId(roundRecord);


    if (!marketSelected) return <MarketSelector title="Coin Toss Market (Head & Tail)" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh)]' />


    return (
        <section className={`flex flex-col relative bg-[#00033D]  items-center justify-start overflow-hidden min-h-screen w-full ${ProstoOne.variable}`}>
            <ExternalUserNavbar />
            <div className=" pt-20 pb-2  sm:px-4 px-2 max-w-[1560px] flex flex-col w-full mx-auto flex-1  text-white ">
                <div className='w-full bg-[#004DA9] relative z-10 rounded-2xl flex items-center justify-between px-4 sm:py-2 py-1'>
                    <h2 className='font-playfair-display-sc sm:text-lg xs:text-base text-xs md:text-2xl font-bold uppercase tracking-wide'>Coin - Head & tail</h2>
                    <div className='flex items-center gap-2'>
                        <span className='tracking-widest text-xs md:text-base'>312 Viewing</span>
                    </div>
                </div>
                <div className='md:grid md:grid-cols-12 flex-1 gap-4'>
                    <div className='md:col-span-8 flex flex-col'>
                        <div className="justify-between  items-center  flex-wrap flex flex-row w-full gap-4 mt-4 mb-12 relative z-10">
                            <GameTimer className='md:flex hidden'   roundRecord={roundRecord} />
                            <LiveBadge
                                className='md:hidden flex'
                            />
                            <PriceDisplay roundRecord={roundRecord} roundRecordWithWinningSide={roundRecordWithWinningId} />
                        </div>
                        <GameBoard key={roundRecord.id} className='flex-1' roundRecord={roundRecord} betAmount={betAmount} setBetAmount={setBetAmount} roundRecordWithWinningSide={roundRecordWithWinningId} />
                    </div>
                    <div className='md:col-span-4 mt-4 relative z-10'>
                        <AllBets roundRecord={roundRecord} className='h-full' />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeadTail;