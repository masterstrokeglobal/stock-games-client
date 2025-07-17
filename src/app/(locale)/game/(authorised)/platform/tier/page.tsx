"use client"

import LoadingScreen from "@/components/common/loading-screen"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tier } from "@/models/tier"
import { useGetUserTier } from "@/react-query/game-user-queries"
import { useGetTiers } from "@/react-query/tier-queries"
import Image from "next/image"
import { RefObject, createRef, useEffect, useRef, useState } from "react"

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
                setActiveTier(tierList?.findIndex((tier) => tier.id == userTier.tierId.toString()))
            }
    }, [userTier, tierList])
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


    if (tierList.length === 0) {
        return <div>No tiers found</div>
    }

    if (isUserTierLoading || isTiersLoading) {
        return <LoadingScreen className="min-h-[80svh]" />
    }

    return (
        <>
            <section className="my-6 sm:mb-12 md:mb-20 ">
                <header  className="flex items-center justify-between mb-4">
                    <h2 className="text-lg text-platform-text font-semibold">Tiers Program</h2>
                </header>

                {/* Tier Tabs */}
                <div className="w-full md:w-[80%] mx-auto mb-12 px-2">
                    <div className="relative flex items-center justify-between">
                        {/* Horizontal gold line */}
                        <div
                            className="absolute top-1/2 left-5 right-0 h-0.5 z-0 w-[calc(100%-2rem)]"
                            style={{
                                background: "#FFDE21",
                                transform: "translateY(-50%)"
                            }}
                        />
                        <div className="flex w-full justify-between items-center relative z-10">
                            {tierList.map((tier, index) => {
                                const isActive = activeTier === index;
                                return (
                                    <div key={tier.name} className={cn("flex flex-col items-center flex-[2] min-w-0", index === 0 ? "items-start flex-1" :  index === tierList.length - 1 ? "items-end flex-1" : "items-center")}>
                                        <button
                                            ref={tierRefs.current[index]}
                                            onClick={() => setActiveTier(index)}
                                            className={cn(
                                                "flex flex-col items-center aspect-square focus:outline-none group",
                                                isActive ? "z-20" : "z-10"
                                            )}
                                            style={{ background: "none", border: "none", padding: 0 }}
                                        >
                                            <div className={cn(
                                                "rounded-full transition-all border-2 p-2 flex items-center justify-center aspect-square",
                                                isActive
                                                    ? "border-[#FFDE21] dark:bg-primary-game bg-[#E6F6FF]"
                                                    : "border-transparent"
                                            )}>
                                                <img
                                                    src={tier?.imageUrl}
                                                    alt={tier?.name}
                                                    className={cn(
                                                        "w-10 h-auto sm:w-12 md:w-14 sm:h-auto object-contain")}
                                                />
                                            </div>

                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Active Tier Card */}

                <ActiveTierCard tier={tierList[activeTier]} myTier={userTier as any} tierList={tierList} className="mb-12" />

                {/* How it Works Section */}
                <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-platform-text">How it Works?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {steps.map((step) => (
                            <Card key={step.number} className="dark:bg-gradient-to-br dark:from-[rgba(68,103,204,0.8)] dark:to-[rgba(26,14,225,0.8)] bg-[linear-gradient(172.33deg,rgba(125,192,252,0.8)_5.37%,rgba(69,106,206,0.8)_94.32%)] border-platform-border rounded-none p-3 sm:p-4">
                                <div className="flex flex-col justify-between h-full">
                                    <div className="mb-4 sm:mb-6 w-12 h-12 sm:w-16 aspect-square sm:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        {step.number === "01" && <img src="/images/platform/tier/sign-up.png" alt="coin" className="w-full h-auto block"  />}
                                        {step.number === "02" && <img src="/images/platform/tier/play.png" alt="coin" className="w-full h-auto block"  />}
                                        {step.number === "03" && <img src="/images/platform/tier/level-up.png" alt="coin" className="w-full h-auto block"  />}
                                        {step.number === "04" && <img src="/images/platform/tier/have-fun.png" alt="coin" className="w-full h-auto block"  />}
                                    </div>
                                    <h4 className="text-base sm:text-lg dark:text-platform-text text-white font-bold mb-1">
                                        {step.number}. {step.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm  font-poppins font-semibold text-[#FFC541] dark:text-[#FFDE21] flex-grow">{step.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}



const ActiveTierCard = ({
    tier,
    myTier,
    className,
    tierList,
}: {
    tier: Tier,
    myTier: { tierId: string, gamesPlayed: number, totalPoints: number, pointsRedeemed: number },
    tierList: Tier[],
    className?: string
}) => {
    const isMyTier = myTier?.tierId?.toString() === tier?.id?.toString();
    const currentTierIndex = tierList.findIndex((t) => t?.id === tier?.id);
    const nextTier = tierList[currentTierIndex + 1];

    console.log(tier, myTier)
    if (!tier) {
        return <LoadingScreen className="min-h-[200px]" />;
    }

    // Card style for the left badge
    return (
        <div className={cn("flex flex-col md:flex-row gap-6 md:gap-10 md:border-none border border-platform-border mb-8", className)}>    
            {/* Left: Badge and Tier Name */}
            <div className="flex flex-col items-center justify-center  dark:bg-[url('/images/tier/tier-bg-dark.png')] bg-[url('/images/tier/tier-bg-light.png')]  bg-cover bg-center md:p-8 p-4 w-full xl:w-[440px] lg:w-[380px] md:w-[340px] md:min-h-[420px] min-h-52  md:border border-platform-border rounded-none">
                <div className="relative md:w-48 md:h-48 w-auto h-full aspect-square flex-1 md:mb-6">
                    <Image
                        src={tier?.imageUrl}
                        alt={tier?.name}border-platform-border
                        width={192}
                        height={192}
                        className="object-contain w-full h-full z-10 relative"
                        priority
                    />
                </div>
                <div className="flex flex-col items-center">
                    <span className="uppercase text-platform-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wider mb-1">{tier?.name}</span>
                    {isMyTier && (
                        <span className="text-yellow-400 text-lg font-semibold tracking-wide">MY TIER</span>
                    )}
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 flex flex-col md:gap-6 gap-2">
                {/* Tier Title and Steps */}
                <div className="px-2">
                    <span className="uppercase text-yellow-400 font-bold md:text-xl text-lg tracking-widest">{tier?.name}</span>
                <div className="text-platform-text text-base font-semibold mb-2">
                        Step One: Survive {tier?.name}. Step Two: Dominate
                    </div>
                </div>

                {/* Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-4">
                    {/* Login Points */}
                    <div className="sm:border dark:border-platform-border border-primary-game p-4 flex items-center gap-4 min-h-[90px]">
                    <div className="w-10 h-10 sm:h-14 sm:w-14 aspect-square bg-white/10 rounded-full backdrop-blur border dark:border-platform-border border-primary-game flex items-center justify-center text-white text-xl font-bold">
                            <img src="/images/platform/tier/login-points.png" alt="coin" className=" w-full h-auto block"  />
                        </div>
                        <div>
                            <div className="text-platform-text font-bold text-base">Login Points</div>
                            <div className="text-platform-text text-xs font-medium">
                                {tier.loginPoints} Points Received For Login Days
                            </div>
                        </div>
                    </div>
                    {/* First Game Points */}
                    <div className="sm:border dark:border-platform-border border-primary-game p-4 flex items-center gap-4 min-h-[90px]">
                    <div className="w-10 h-10 sm:h-14 sm:w-14 aspect-square bg-white/10 rounded-full backdrop-blur border dark:border-platform-border border-primary-game flex items-center justify-center text-white text-xl font-bold">
                            <img src="/images/platform/tier/first-game-points.png" alt="coin" className=" w-full h-auto block"  />
                        </div>
                        <div>
                            <div className="text-platform-text font-bold text-base">First Game Points</div>
                            <div className="text-platform-text text-xs font-medium">
                                {tier.firstGamePoints} Points Received For First Game
                            </div>
                        </div>
                    </div>
                    {/* Game Points */}
                    <div className="sm:border dark:border-platform-border border-primary-game p-4 flex items-center gap-4 min-h-[90px]">
                    <div className="w-10 h-10 sm:h-14 sm:w-14 aspect-square bg-white/10 rounded-full backdrop-blur border dark:border-platform-border border-primary-game flex items-center justify-center text-white text-xl font-bold">
                    <img src="/images/platform/tier/game-points.png" alt="coin" className=" w-full h-auto block"  />
                        </div>
                        <div>
                            <div className="text-platform-text font-bold text-base">Game Points</div>
                            <div className="text-platform-text text-xs font-medium">
                                {tier.pointsPerHundredRupees} Points Received For Every 100 Rupees Deposited
                            </div>
                        </div>
                    </div>
                    {/* Redeem Points */}
                    <div className="sm:border dark:border-platform-border border-primary-game p-4 flex items-center gap-4 min-h-[90px]">
                    <div className="w-10 h-10 sm:h-14 sm:w-14 bg-white/10 aspect-square rounded-full backdrop-blur border dark:border-platform-border border-primary-game flex items-center justify-center text-white text-xl font-bold">
                       <img src="/images/platform/tier/reedeem-points.png" alt="coin" className=" w-full h-auto block"  />
                        </div>
                        <div>
                            <div className="text-platform-text font-bold text-base">Reedeem Points</div>
                            <div className="text-platform-text text-xs font-medium">
                                {tier.redeemablePoints} Points Received For Redeeming
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Tier Progress */}
                {nextTier && (
                    <div className="md:pt-4 flex flex-col gap-2 px-2 py-4">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={nextTier?.imageUrl} alt={nextTier?.name} className="w-7 h-7" />
                            <span className="text-platform-text font-semibold text-base">
                                To Reach Next <span className="capitalize">{nextTier?.name}</span> Tier
                            </span>
                        </div>
                        {/* Points Progress */}
                        <div className="mb-2">
                            <div className="flex justify-between font-semibold text-xs text-platform-text mb-1">
                                <span>Point Progress</span>
                                <span>
                                    {myTier?.totalPoints || 0}/{nextTier?.minPoints} Points
                                </span>
                            </div>
                            <div className="h-2 w-full dark:bg-[#90ACFF6E] bg-white rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r dark:from-[#7c3aed] dark:to-[#f472b6] from-primary-game to-primary-game"
                                    style={{
                                        width: `${Math.min(((myTier?.totalPoints || 0) / nextTier?.minPoints) * 100, 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                        {/* Games Progress */}
                        <div>
                            <div className="flex justify-between font-semibold text-xs text-platform-text mb-1">
                                <span>Game Progress</span>  
                                <span>
                                    {myTier?.gamesPlayed || 0}/{nextTier?.gamesRequired} Games
                                </span>
                            </div>
                            <div className="h-2 w-full dark:bg-[#90ACFF6E] bg-white rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r dark:from-[#7c3aed] dark:to-[#f472b6] from-primary-game to-primary-game"
                                    style={{
                                        width: `${Math.min(((myTier?.gamesPlayed || 0) / nextTier?.gamesRequired) * 100, 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
