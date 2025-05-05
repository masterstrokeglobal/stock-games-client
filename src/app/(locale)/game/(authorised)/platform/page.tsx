"use client";
import Navbar from "@/components/features/game/navbar"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { MoneyIcon, WithdrawIcon } from "../user-menu/icons"
import UserProfile from "./user-card"
import { SchedulerType } from "@/models/market-item"
import { useAuthStore } from "@/context/auth-context"
import { checkCasinoAllowed } from "@/lib/utils"

export default function GamingAppInterface() {
    const t = useTranslations('wallet');
    const tcontact = useTranslations('contact');

    const { userDetails } = useAuthStore();

    const isCasinoAllowed = checkCasinoAllowed(userDetails?.company?.id ?? 0);


    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white p-4  mx-auto">
            <Navbar />
            {/* User profile card */}
            <UserProfile className="mt-20  mx-auto w-full max-w-4xl mb-4" />

            <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-4 mb-4 ">
                <Link href="/game/wallet/deposit" passHref className="w-full">
                    <Button variant="game-secondary" className="w-full flex items-center !bg-green-500 hover:!bg-green-700 justify-center gap-x-2 h-14">
                        <MoneyIcon />
                        {t('menu.deposit')}
                    </Button>
                </Link>

                <Link href="/game/wallet/withdrawl" passHref className="w-full">
                    <Button variant="game-secondary" className="w-full  flex items-center bg-blue-700 hover:bg-blue-800 justify-center gap-x-2 h-14">
                        <WithdrawIcon />
                        {t('menu.withdraw')}
                    </Button>
                </Link>
            </div>

            {/* Game cards */}
            <div className="grid grid-cols-2 max-w-4xl mx-auto w-full gap-4 mb-6">
                <Link href={`/game?gameType=${SchedulerType.NSE}`}>
                    <div className="rounded-xl overflow-hidden border border-yellow-600 relative shadow-lg shadow-green-900/30">
                        <Image src="/images/stock-roulette.png" alt="stock-roulette" width={500} height={500} />
                        <div className="md:p-2 w-full absolute bottom-0 bg-gradient-to-b from-transparent to-black text-game-text text-center">
                            <h3 className="font-bold text-sm md:text-xl text-secondary-game">NSE STOCKS ROULETTE</h3>
                            <Button variant="game" className="mt-2 w-full text-sm py-2.5 font-semibold shadow-sm hover:shadow-md transition-all duration-200 gap-2">
                                Play Now
                            </Button>
                        </div>
                    </div>
                </Link>
                {
                    isCasinoAllowed && (
                        <Link href="/game/casino">
                            <div className="rounded-xl overflow-hidden border border-yellow-600 relative shadow-lg shadow-green-900/30">
                                <Image src="/images/casino-games.png" alt="stock-roulette" width={500} height={500} />
                            </div>
                        </Link>
                    )
                }
                <Link href={`/game?gameType=${SchedulerType.USA_MARKET}`}>
                    <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                        <Image src="/images/ad2.jpg" alt="coming-soon" className="w-full h-auto object-contain  " width={500} height={500} />
                        <div className="md:p-2 w-full absolute bottom-0 bg-gradient-to-b from-transparent to-black text-game-text text-center">
                            <h3 className="font-bold text-sm md:text-xl text-secondary-game">USA STOCKS ROULETTE</h3>
                            <Button variant="game" className="mt-2 w-full text-sm py-2.5 font-semibold shadow-sm hover:shadow-md transition-all duration-200 gap-2">
                                Play Now
                            </Button>
                        </div>
                    </div>
                </Link>

                {/* Coming Soon Card */}
                <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                    <Image src="/images/ad1.png" alt="coming-soon" className="w-full h-full object-cover " width={500} height={500} />
                    <div className="absolute bottom-0 left-0 w-full h-fit bg-gradient-to-b pt-4 from-transparent to-black text-white p-4">
                        <h3 className="md:text-2xl text-sm font-bold text-center">Coming Soon</h3>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                    <Image src="/images/ad3.jpg" alt="coming-soon" className="w-full h-full object-top " width={500} height={500} />
                    <div className="absolute bottom-0 left-0 w-full h-fit bg-gradient-to-b pt-4 from-transparent to-black text-white p-4">
                        <h3 className="md:text-2xl text-sm font-bold text-center">Coming Soon</h3>
                    </div>
                </div>
            </div>

            <div className="mt-auto rounded-lg bg-background/40 p-6 text-center border max-w-4xl mx-auto w-full border-purple-200/20 shadow-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <HelpCircle className="w-5 h-5 " />
                    <h3 className="font-bold text-lg">{tcontact('need-assistance')}</h3>
                </div>
                <p className="text-sm text-gray-200 mb-3">{tcontact('support-team-available')}</p>
                <Link href="/game/contact">
                    <Button
                        variant="game"
                        className="mt-2 w-full text-sm py-2.5 font-semibold shadow-sm hover:shadow-md transition-all duration-200 gap-2"
                    >
                        <MessageCircle className="w-4 h-4" />
                        {tcontact('contact-support')}
                    </Button>
                </Link>

                <div className="flex items-center justify-center gap-4 mt-4  mb-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="youtube" className="w-5 h-5 text-[#FF0000]" />
                    <img src="/images/instagram.png" alt="instagram" className="w-5 h-5 text-[#FF0000]" />
                    <img src="/images/twitter.png" alt="facebook" className="w-5 h-5 bg-white rounded-full p-0.5" />
                    <img src="/images/facebook.png" alt="twitter" className="w-5 h-5 bg-white rounded-full text-[#FF0000]" />
                </div>
            </div>
        </div>
    )
}


