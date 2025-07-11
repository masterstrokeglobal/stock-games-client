"use client"
import BetHistoryTable from '@/components/features/7-up-down/betting-history';
import GameHistoryTable from '@/components/features/7-up-down/game-history';
import GameRules from '@/components/features/7-up-down/game-rules';
import HowToPlay from '@/components/features/7-up-down/how-to-play';
import SettingLayout from '@/components/features/7-up-down/setting-layout';
import Navbar from '@/components/features/game/navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from '@/components/ui/carousel';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

const TABS = [
    {
        value: "my-bet-history",
        label: "My Bet History",
        content: <BetHistoryTable />,
    },
    {
        value: "game-history",
        label: "Game History",
        content: <GameHistoryTable />,
    },
    {
        value: "how-to-play",
        label: "How to Play?",
        content: <HowToPlay />,
    },
    {
        value: "game-rules",
        label: "Game Rules",
        content: <GameRules />,
    }
]
const SevenUpDownSettings = () => {

    return (
        <section className={`flex flex-col relative bg-[radial-gradient(133.68%_74.71%_at_55.58%_46.9%,#01144C_0%,#000313_100%)] backdrop-blur-sm  items-center justify-start overflow-hidden min-h-screen w-full`}>
            <Navbar />
            <img src="/images/seven-up-down/bg.png" alt="7Up & 7Down" className='absolute top-0 left-0 w-full h-full opacity-50 object-cover' />
            <Tabs defaultValue="my-bet-history" className="pt-20 pb-2  max-w-[1560px] relative z-10 flex flex-col w-full mx-auto flex-1 text-white">
                <div className="flex flex-col lg:flex-row gap-6 mt-6">
                    <aside className="lg:w-64 lg:block hidden  w-full">
                        <TabsList className="flex flex-col w-full bg-transparent gap-2">
                            {
                                TABS.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="w-full justify-start bg-transparent text-white text-lg font-semibold uppercase data-[state=active]:rounded-r-[10px] data-[state=active]:border data-[state=active]:border-[#12409D] data-[state=active]:bg-[#295CB5] data-[state=active]:shadow-[2px_2px_3.3px_2px_#327BB7,0px_0px_5px_2px_#0E1537_inset] data-[state=active]:uppercase data-[state=active]:font-semibold"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                    </aside>
                    <div className="lg:hidden block px-2">
                        <Carousel opts={{ loop: false, startIndex: 0, containScroll: "trimSnaps" }} className="w-full">
                            <div className="md:space-y-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Link href="/game/7-up-down">
                                        <Button variant="ghost" className="p-0 text-white text-xs">
                                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                    </Link>
                                    <div className="flex gap-2 items-end">
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </div>
                                </div>
                                <CarouselContent className="py-4 overflow-visible">
                                    {TABS.map((tab) => (
                                        <CarouselItem key={tab.value} className="pl-4 basis-1/2">
                                            <TabsList className="flex flex-col w-full bg-transparent gap-2">
                                                <TabsTrigger
                                                    key={tab.value}
                                                    value={tab.value}
                                                    className="w-full justify-start bg-transparent text-white  font-semibold uppercase data-[state=active]:rounded-[10px] data-[state=active]:border data-[state=active]:border-[#12409D] data-[state=active]:bg-[#295CB5] data-[state=active]:shadow-[2px_2px_3.3px_2px_#327BB7,0px_0px_5px_2px_#0E1537_inset] data-[state=active]:uppercase data-[state=active]:font-semibold"
                                                >
                                                    {tab.label}
                                                </TabsTrigger>
                                            </TabsList>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </div>
                        </Carousel>
                    </div>
                    <SettingLayout className="flex-1">
                    {
                        TABS.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="h-full">
                                {tab.content}
                            </TabsContent>
                        ))
                    }
                    </SettingLayout>
                </div>
            </Tabs>
        </section>
    );
};

export default SevenUpDownSettings;


const CarouselPrevious = () => {
    const { scrollPrev, canScrollPrev } = useCarousel()
    return (
        <Button
            variant="ghost"
            size="icon"
            className="flex items-center  gap-2 p-0 h-6 w-6 rounded-sm bg-[#2859B0] border-2 border-[#8BB4FF] text-[#FFFFFF] text-sm font-semibold hover:bg-[#295CB5] transition-all"
            disabled={!canScrollPrev}
            onClick={scrollPrev}
        >
            <svg className={"-rotate-90"} width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.187169 8.33529C0.361869 8.51412 0.536569 8.69295 0.711268 8.87178C0.979564 8.66793 1.2464 8.46259 1.51179 8.25576C3.90025 6.39428 6.17079 4.41209 8.32341 2.30919C8.38143 2.25251 8.43936 2.19574 8.49721 2.13888L7.0654 2.10322C9.06201 4.24517 11.1758 6.27852 13.4069 8.20329C13.6616 8.42308 13.9179 8.64145 14.1757 8.8584C14.3591 8.68849 14.5425 8.51858 14.7259 8.34867C14.5292 8.07508 14.331 7.8029 14.1312 7.53215C12.382 5.16098 10.5156 2.89842 8.53195 0.744437C8.13872 0.31744 7.51658 0.304393 7.10013 0.708772C7.04194 0.765278 6.98383 0.821871 6.92581 0.878553C4.77319 2.98145 2.7385 5.20506 0.821726 7.54938C0.608751 7.80986 0.397233 8.07183 0.187169 8.33529Z" fill="white" />
            </svg>
        </Button>
    )
}

const CarouselNext = () => {
    const {  scrollNext, canScrollNext } = useCarousel()
    return (
        <Button
            variant="ghost"
            size="icon"
            className="flex items-center gap-2 p-0 h-6 w-6 rounded-sm bg-[#2859B0] border-2 border-[#8BB4FF] text-[#FFFFFF] text-sm font-semibold hover:bg-[#295CB5] transition-all"
            disabled={!canScrollNext}
            onClick={scrollNext}
        >     
           <svg className={"rotate-90"} width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.187169 8.33529C0.361869 8.51412 0.536569 8.69295 0.711268 8.87178C0.979564 8.66793 1.2464 8.46259 1.51179 8.25576C3.90025 6.39428 6.17079 4.41209 8.32341 2.30919C8.38143 2.25251 8.43936 2.19574 8.49721 2.13888L7.0654 2.10322C9.06201 4.24517 11.1758 6.27852 13.4069 8.20329C13.6616 8.42308 13.9179 8.64145 14.1757 8.8584C14.3591 8.68849 14.5425 8.51858 14.7259 8.34867C14.5292 8.07508 14.331 7.8029 14.1312 7.53215C12.382 5.16098 10.5156 2.89842 8.53195 0.744437C8.13872 0.31744 7.51658 0.304393 7.10013 0.708772C7.04194 0.765278 6.98383 0.821871 6.92581 0.878553C4.77319 2.98145 2.7385 5.20506 0.821726 7.54938C0.608751 7.80986 0.397233 8.07183 0.187169 8.33529Z" fill="white" />
            </svg>
        </Button>
    )
}