"use client"

import { useState, useRef, useEffect, RefObject, createRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useGetTiers } from "@/react-query/tier-queries"
import { useGetUserTier } from "@/react-query/game-user-queries"
import Image from "next/image"
import { Tier } from "@/models/tier"
import LoadingScreen from "@/components/common/loading-screen"
import Link from "next/link"

interface Step {
    number: string;
    title: string;
    description: string;
}

export default function TiersProgram(): JSX.Element {
    const [activeTier, setActiveTier] = useState<number>(0)
    const scrollAreaRef = useRef<HTMLDivElement | null>(null)
    const tierRefs = useRef<Array<RefObject<HTMLButtonElement>>>([])

    const { data: userTier, isLoading: isUserTierLoading } = useGetUserTier()

    const { data: tiers, isLoading: isTiersLoading } = useGetTiers({
        page: 1,
        limit: 100,
        search: "",
        orderBy: "createdAt",
        orderByField: "DESC"
    })


    const tierList = tiers?.tiers || [];
    // Initialize refs array when component mounts
    useEffect(() => {
        tierRefs.current = Array(tierList?.length ?? 0)
            .fill(null)
            .map((_, i) => tierRefs.current[i] || createRef<HTMLButtonElement>())
    }, [tierList?.length])


    useEffect(() => {
        if (userTier) {
            setActiveTier(tierList?.findIndex((tier) => tier.id === userTier.tierId))
        }
    }, [userTier])
    // Scroll to the active tier when it changes
    useEffect(() => {
        if (tierRefs.current[activeTier]?.current && scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
            const tierElement = tierRefs.current[activeTier].current

            if (scrollContainer && tierElement) {
                const containerRect = scrollContainer.getBoundingClientRect()
                const tierRect = tierElement.getBoundingClientRect()

                // Check if the tier is not fully visible in the viewport
                if (tierRect.left < containerRect.left || tierRect.right > containerRect.right) {
                    // Calculate the scroll position to center the active tier
                    const scrollLeft = tierElement.offsetLeft - (scrollContainer.clientWidth / 2) + (tierElement.offsetWidth / 2)
                    scrollContainer.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    })
                }
            }
        }
    }, [activeTier])

    const steps: Step[] = [
        {
            number: "01",
            title: "Sign Up",
            description: "Register quickly and easily to begin your journey with us.",
        },
        {
            number: "02",
            title: "Play!",
            description: "Play and win your favorite games and get exclusive privileges.",
        },
        {
            number: "03",
            title: "Level Up!",
            description: "Advance through levels by playing more and unlocking new benefits.",
        },
        {
            number: "04",
            title: "Have fun!",
            description: "Enjoy your rewards and benefits as you progress.",
        },
    ]

    const handlePrevious = (): void => {
        setActiveTier((prev) => (prev === 0 ? tierList.length - 1 : prev - 1))
    }

    const handleNext = (): void => {
        setActiveTier((prev) => (prev === tierList.length - 1 ? 0 : prev + 1))
    }


    if (tierList.length === 0) {
        return <div>No tiers found</div>
    }

    if (isUserTierLoading || isTiersLoading) {
        return <LoadingScreen className="min-h-[80svh]" />
    }

    return (
        <>
            <div className="my-6 sm:my-12 md:my-20 px-2 sm:px-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <h2 className="text-lg font-bold">Tiers Program</h2>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-slate-800 rounded-full"
                            onClick={handlePrevious}
                            aria-label="Previous tier"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-slate-800 rounded-full"
                            onClick={handleNext}
                            aria-label="Next tier"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tier Tabs */}
                <ScrollArea ref={scrollAreaRef} className="w-full md:w-[80%] mb-6 py-1.5 px-2 rounded-full bg-secondary-game">
                    <div className="flex gap-1">
                        {tierList.map((tier, index) => (
                            <Button
                                key={tier.name}
                                ref={tierRefs.current[index]}
                                className={cn(
                                    "rounded-full border-2 border-transparent whitespace-nowrap bg-primary-game transition-all",
                                    activeTier === index
                                        ? "border-yellow-500 bg-yellow-600 hover:bg-yellow-600"
                                        : "",
                                )}
                                onClick={() => setActiveTier(index)}
                            >
                                <span className={cn(
                                    "rounded-full mr-2",
                                    activeTier === index
                                        ? "bg-white text-black"
                                        : "text-white"
                                )}>
                                    <img src={tier?.imageUrl} alt={tier?.name} className="w-6 h-6" />
                                </span>
                                {tier?.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Active Tier Card */}

                <ActiveTierCard tier={tierList[activeTier]} myTier={userTier} tierList={tierList} />

                {/* How it Works Section */}
                <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">How it Works?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {steps.map((step) => (
                            <Card key={step.number} className="bg-background-secondary border-primary-game p-3 sm:p-4">
                                <div className="flex flex-col h-full">
                                    <div className="mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 rounded-full flex items-center justify-center">
                                        {step.number === "01" && <span className="text-xl sm:text-2xl">⚡</span>}
                                        {step.number === "02" && <span className="text-xl sm:text-2xl">🎮</span>}
                                        {step.number === "03" && <span className="text-xl sm:text-2xl">🏆</span>}
                                        {step.number === "04" && <span className="text-xl sm:text-2xl">🎉</span>}
                                    </div>
                                    <h4 className="text-base sm:text-lg text-white font-bold mb-1">
                                        {step.number}. {step.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4 flex-grow">{step.description}</p>
                                    {step.number === "04" && (
                                        <Link href="/game/platform">
                                            <Button variant="game" className="w-full mt-auto">Start growth</Button>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}


const ActiveTierCard = ({ tier, myTier, tierList }: { tier: Tier, myTier: { tierId: string, gamesPlayed: number, totalPoints: number, pointsRedeemed: number }, tierList: Tier[] }) => {

    const isMyTier = myTier?.tierId?.toString() === tier?.id?.toString();

    const currentTierIndex = tierList.findIndex((t) => t?.id === tier?.id);

    const nextTier = tierList[currentTierIndex + 1];

    if (!tier) {
        return <LoadingScreen className="min-h-[200px]" />
    }
    return (
        <Card className={cn("bg-background-secondary  mb-8 overflow-hidden rounded-xl", isMyTier ? "border-2 border-yellow-500 rounded-xl" : "border-2 border-primary-game")}>
            <div className="relative">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 relative z-10">
                    {/* Tier Badge Placeholder */}
                    <div className="flex flex-col h-full  aspect-square items-center mb-10 md:items-start">
                        <div className="relative flex items-center flex-col  justify-center">
                            <Image src={tier?.imageUrl} alt={tier?.name} className="w-28 ml-4 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40  z-10 relative" width={1020} height={1020} />
                            <div className="absolute inset-0 aspect-square object-cover  scale-150" style={{ animationDuration: `10s` }}>
                                <img src="/images/banner/tiers_program_bg.webp" alt="tiers_program_bg" className="w-full h-full animate-spin" style={{ animationDuration: `20s` }} />
                            </div>
                            <h3 className="text-xl sm:text-2xl text-center flex-1 md:flex-col flex  md:text-left pl-4  font-semibold tracking-wider text-white mb-2 uppercase " >
                                <span className="text-white/70 text-lg ">
                                    {tier?.name}
                                </span>
                                {isMyTier && <span className=" text-yellow-500 text-sm text-center">My Tier</span>}
                            </h3>
                        </div>
                    </div>

                    <div className="w-full md:w-auto p-3  sm:p-6 md:p-8 ml-auto rounded-lg backdrop-blur-sm">
                        <div className="space-y-2 sm:space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-2  md:gridro md:gap-3">
                            {tier.loginPoints > 0 && <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-lg sm:text-xl">🎰</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">Login Points</span>
                                    <span className="text-secondary text-xs sm:text-sm">{tier.loginPoints} points received for login days</span>
                                </div>
                            </div>}
                            {tier.firstGamePoints > 0 && <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-lg sm:text-xl">⚽</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">First Game Points</span>
                                    <span className="text-secondary text-xs sm:text-sm">{tier.firstGamePoints} points received for first game</span>
                                </div>
                            </div>}
                            {tier.pointsPerHundredRupees > 0 && <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-lg sm:text-xl">
                                        🪙
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">Game Points</span>
                                    <span className="text-secondary text-xs sm:text-sm">{tier.pointsPerHundredRupees} points received for every 100 rupees deposited</span>
                                </div>
                            </div>}
                            {tier.redeemablePoints > 0 && <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-lg sm:text-xl">
                                        🎫
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-medium">Reedeem Points</span>
                                    <span className="text-secondary text-xs sm:text-sm">{tier.redeemablePoints} points received for redeeming</span>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
                {nextTier && <div className="flex items-center md:items-start p-4 justify-between">

                    <div className="flex flex-col gap-4 flex-[3]">
                        <header className="flex items-center gap-2 text-white font-semibold text-md">
                            <img src={nextTier?.imageUrl} alt={nextTier?.name} className="size-8" /> To Reach Next {nextTier?.name} Tier
                        </header>

                        {nextTier?.minPoints > 0 && <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-secondary text-sm">Points Progress</p>
                                    <p className="text-secondary text-sm">{myTier?.totalPoints || 0}/{nextTier?.minPoints} points</p>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        style={{
                                            width: `${Math.min(((myTier?.totalPoints || 0) / nextTier?.minPoints) * 100, 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>}
                        {nextTier?.gamesRequired > 0 && <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-secondary text-sm">Games Progress</p>
                                    <p className="text-secondary text-sm">{myTier?.gamesPlayed || 0}/{nextTier?.gamesRequired} games</p>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${Math.min(((myTier?.gamesPlayed || 0) / nextTier?.gamesRequired) * 100, 100)}%` }} />
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>}

            </div>
        </Card>
    )
}
