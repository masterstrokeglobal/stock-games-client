"use client"

import { useState, useRef, useEffect, RefObject, createRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Tier {
    name: string;
    xpRange: string;
    color: string;
    icon: string;
}

interface Step {
    number: string;
    title: string;
    description: string;
}

export default function TiersProgram(): JSX.Element {
    const [activeTier, setActiveTier] = useState<number>(0)
    const scrollAreaRef = useRef<HTMLDivElement | null>(null)
    const tierRefs = useRef<Array<RefObject<HTMLButtonElement>>>([])

    const tiers: Tier[] = [
        { name: "BRONZE ", xpRange: "0 - 50 XP", color: "bg-amber-600/80", icon: "🥉" },
        { name: "SILVER ", xpRange: "151 - 250 XP", color: "bg-gray-300/80", icon: "🥈" },
        { name: "GOLD ", xpRange: "451 - 600 XP", color: "bg-yellow-400/80", icon: "🥇" },
        { name: "PLATINUM ", xpRange: "901 - 1100 XP", color: "bg-cyan-400/80", icon: "💠" },
        { name: "DIAMOND ", xpRange: "1501 - 1800 XP", color: "bg-blue-400/80", icon: "💎" },
    ]

    // Initialize refs array when component mounts
    useEffect(() => {
        tierRefs.current = Array(tiers.length)
            .fill(null)
            .map((_, i) => tierRefs.current[i] || createRef<HTMLButtonElement>())
    }, [tiers.length])

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
        setActiveTier((prev) => (prev === 0 ? tiers.length - 1 : prev - 1))
    }

    const handleNext = (): void => {
        setActiveTier((prev) => (prev === tiers.length - 1 ? 0 : prev + 1))
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
                <ScrollArea ref={scrollAreaRef} className="w-fit mb-6 py-1.5 px-2 rounded-full bg-secondary-game">
                    <div className="flex gap-1">
                        {tiers.map((tier, index) => (
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
                                    {tier.icon}
                                </span>
                                {tier.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Active Tier Card */}
                <Card className="bg-background-secondary border-primary-game mb-8 overflow-hidden">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-background-secondary/50 to-primary-game z-0"></div>
                        <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 relative z-10">
                            {/* Tier Badge Placeholder */}
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-background-secondary/30 to-transparent"></div>
                                <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${tiers[activeTier].color} clip-hexagon relative`}>
                                    <div className="absolute bottom-0 w-full h-1/6 bg-amber-600"></div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-start">
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{tiers[activeTier].name}</h3>
                                <p className="text-secondary font-bold mb-4 md:mb-6">{tiers[activeTier].xpRange}</p>
                            </div>

                            <div className="w-full md:w-auto p-3 sm:p-4 ml-auto rounded-lg backdrop-blur-sm">
                                <h4 className="text-base sm:text-lg font-semibold mb-2 text-white">Cashback</h4>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-lg sm:text-xl">🎰</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">Casino</span>
                                            <span className="text-secondary text-xs sm:text-sm">4% cashback on casino net losses</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-lg sm:text-xl">⚽</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">Sport</span>
                                            <span className="text-secondary text-xs sm:text-sm">4% cashback on sport net losses</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

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
                                        <Button variant="game" className="w-full mt-auto">Start growth</Button>
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