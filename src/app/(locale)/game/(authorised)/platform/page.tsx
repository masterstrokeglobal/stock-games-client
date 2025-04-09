"use client"
import Navbar from "@/components/features/game/navbar"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import UserProfile from "./user-card"

import { useRef, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/css'; // 



export default function GamingAppInterface() {


    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white p-4  mx-auto">
            <Navbar />
            {/* User profile card */}
            <UserProfile className="mt-20 max-w-4xl mx-auto w-full" />

            {/* Game cards */}
            <div className="grid grid-cols-2 max-w-4xl mx-auto w-full gap-4 mb-6">
                <Link href="/game">
                    <div className="rounded-xl overflow-hidden border border-white relative shadow-lg shadow-green-900/30">
                        <Image src="/images/stock-roulette.png" alt="stock-roulette" width={500} height={500} />
                        <div className="md:p-2 w-full absolute bottom-4 bg-white text-game-text text-center">
                            <h3 className="font-bold text-sm">STOCKS ROULETTE</h3>
                        </div>
                    </div>
                </Link>

                {/* Coming Soon Card */}
                <div className="rounded-xl overflow-hidden border border-blue-700 relative shadow-lg shadow-blue-900">
                    <CarouselAds />
                </div>
            </div>



            <div className="mt-auto rounded-lg bg-background/40 p-6 text-center border max-w-4xl mx-auto w-full border-purple-200/20 shadow-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 " />
                    <h3 className="font-bold text-lg">Need assistance ?</h3>
                </div>
                <p className="text-sm text-gray-200 mb-3">Our friendly support team is available 24/7 to help you!</p>
                <Link href="/game/contact">
                    <Button
                        variant="game"
                        className="mt-2 w-full text-sm py-2.5 font-semibold shadow-sm hover:shadow-md transition-all duration-200 gap-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Contact Support
                    </Button>
                </Link>
            </div>
        </div>
    )
}


const CarouselAds = () => {
    const splideRef = useRef(null);

    useEffect(() => {
        if (splideRef.current) {
            const splideInstance = (splideRef.current as any).splide;

            // Set up autoplay behavior
            splideInstance.on('mounted', () => {
                // Start autoplay
                splideInstance.Components.Autoplay.play();
            });
        }
    }, []);

    return (
        <Splide
            ref={splideRef}
            options={{
                type: 'loop',
                autoplay: true,
                pauseOnHover: false,
                pauseOnFocus: false,
                resetProgress: false,
                interval: 2000,
                arrows: false,
                pagination: true,
                perPage: 1,
            }}
            className="w-full h-full"
        >
            <SplideSlide className="w-full aspect-square">
                <Image src="/images/ad1.jpg" alt="coming-soon" className="w-full h-full  object-cover" width={500} height={500} />
            </SplideSlide>
            <SplideSlide className="w-full aspect-square">
                <Image src="/images/ad2.jpg" alt="coming-soon" className="w-full " width={500} height={500} />
            </SplideSlide>
            <SplideSlide className="w-full aspect-square">
                <Image src="/images/ad3.jpg" alt="coming-soon" className="w-full h-full object-cover " width={500} height={500} />
                <div className="absolute top-0 left-0 w-full h-fit bg-gradient-to-b  from-black to-trasparent text-white p-4">
                    <h3 className="md:text-2xl text-sm font-bold text-center">Coming Soon</h3>
                </div>
            </SplideSlide>
        </Splide>
    );
};

