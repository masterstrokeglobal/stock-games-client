"use client"
import Navbar from "@/components/features/game/navbar"
import { Button } from "@/components/ui/button"
import { HelpCircle , MessageCircle } from "lucide-react"
import UserProfile from "./user-card"
import Link from "next/link"
import Image from "next/image"
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
                    <div className="p-2 w-full absolute bottom-4 bg-white text-game-text text-center">
                        <h3 className="font-bold text-sm">STOCKS ROULETTE</h3>
                    </div>
                </div>
                </Link>

                {/* Coming Soon Card */}
                <div className="rounded-xl overflow-hidden border border-blue-700 relative shadow-lg shadow-blue-900">
                  <Image src="/images/coming-soon.png" alt="coming-soon" width={500} height={500} />
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

