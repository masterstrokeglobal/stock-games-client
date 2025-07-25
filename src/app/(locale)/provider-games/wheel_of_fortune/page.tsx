"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import ExternalUserNavbar from '@/components/features/game/external-user-Navbar';
import Navbar from '@/components/features/game/navbar';
import { BettingArea } from '@/components/features/wheel-of-fortune/betting-area';
import CurrentBets from '@/components/features/wheel-of-fortune/current-bets';
import WheelOfFortuneGameBoard from '@/components/features/wheel-of-fortune/game-board';
import GameSettingsPopover from '@/components/features/wheel-of-fortune/game-menu';
import LastRoundsTable from '@/components/features/wheel-of-fortune/last-rounds';
import { StockPriceDisplay, Viewers } from '@/components/features/wheel-of-fortune/stock-price';
import { Button } from '@/components/ui/button';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { useWindowSize } from '@/hooks/use-window-size';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';


const WheelOfFortune = () => {
    const { marketSelected } = useMarketSelector();
    const { isMobile } = useWindowSize();
    const [betAmount, setBetAmount] = useState<number>(100);
    const {
        roundRecord,
        isLoading
    } = useCurrentGame(RoundRecordGameType.WHEEL_OF_FORTUNE);


    const roundRecordWithWinningId = useWinningId(roundRecord);
    const winningMarketId = roundRecordWithWinningId?.winningId || null;

    if (!marketSelected) return <MarketSelector  title="Wheel of Fortune Market" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh)]' />


    if (isMobile) {
        return (
            <section className="flex flex-col relative space-y-4 bg-gradient-to-b from-[#1a1b2e] to-[#1a1b2e]/0  items-center justify-start pt-20 min-h-screen w-full">
                <Navbar />
                <video src="/videos/wheel-of-fortune.mp4" autoPlay muted loop className='absolute top-0 left-0 w-full h-[900px] object-cover' />
                <StockPriceDisplay roundRecord={roundRecord} winningMarketId={winningMarketId} className='w-full' />
                <div className='px-4 w-full space-y-4  bg-gradient-to-t relative z-10 from-[#000000] via-[#000000] via-[80%] to-transparent'>
                    <WheelOfFortuneGameBoard className='flex-1' roundRecord={roundRecord} amount={betAmount} roundRecordWithWinningId={roundRecordWithWinningId} />
                    <BettingArea className='w-full' roundRecord={roundRecord} betAmount={betAmount} setBetAmount={setBetAmount} />
                    <CurrentBets roundRecord={roundRecord} className='w-full' />
                    <LastRoundsTable className='w-full' />
                </div>
            </section>
        )
    }

    return (
        <section className="flex flex-col relative bg-gradient-to-b from-[#1a1b2e] to-[#1a1b2e]/0  items-center justify-center min-h-[calc(100svh-100px)] w-full">
            <ExternalUserNavbar />
            <video src="/videos/wheel-of-fortune.mp4" autoPlay muted loop className='absolute left-0 top-0 w-full h-[calc(100svh-100px)] object-cover' />
            <div className='absolute bottom-0 left-0 h-[60vh] w-full bg-gradient-to-t from-[#000000] via-[#000000] via-[60%]  to-transparent' />
            <div className="min-h-screen pt-20  px-4 max-w-[1560px] w-full mx-auto  text-white ">
                <div className='md:grid md:grid-cols-3  gap-4'>
                    <StockPriceDisplay className='md:col-span-2' roundRecord={roundRecord} winningMarketId={winningMarketId} />
                    <div className=' z-10 flex-1 gap-4 md:flex hidden flex-col col-span-1 w-full '>
                        <div className='flex items-center gap-2 w-full justify-between'>
                            <header className='flex justify-end items-center w-full gap-4'>
                                <Viewers />
                                <GameSettingsPopover>
                                    <Button style={{
                                        boxShadow: '0px 0px 5.4px 0px rgba(72, 131, 121, 1)',
                                    }} className='bg-[#274D3A] px-2 text-white border border-[#488379]'>
                                        <MenuIcon />
                                    </Button>
                                </GameSettingsPopover>
                            </header>
                        </div>
                        <div className='flex flex-col gap-4 h-[500px]'>
                            <CurrentBets roundRecord={roundRecord} className='flex-1' />
                            <LastRoundsTable className='flex-1' />
                        </div>
                    </div>
                    <div className='col-span-3 flex md:flex-row relative flex-col gap-4 py-6'>
                        <div className='absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-[#000000] via-[#000000] via-[80%] to-transparent' />
                        <WheelOfFortuneGameBoard className='flex-1' roundRecord={roundRecord} amount={betAmount} roundRecordWithWinningId={roundRecordWithWinningId} />
                        <BettingArea className='w-60' roundRecord={roundRecord} betAmount={betAmount} setBetAmount={setBetAmount} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WheelOfFortune;