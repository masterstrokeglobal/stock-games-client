import LoadingScreen from "@/components/common/loading-screen";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tier } from '@/models/tier';
import { useGetUserTier } from "@/react-query/game-user-queries";
import { useGetTiers } from "@/react-query/tier-queries";
import Image from "next/image";
import { useEffect, useState } from 'react';

// Progress Bar Component
const ProgressBar = ({ 
    label, 
    current, 
    target, 
    progress,
}: {
    label: string;
    current: number;
    target: number;
    progress: number;

}) => (
    <div>
        <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-platform-text">{label}</span>
            <span className="font-semibold text-xs text-platform-text">
                {current}/{target}
            </span>
        </div>
        <div className={`w-full h-3 rounded-sm overflow-hidden border dark:border-none border-[#E2EFFF] bg-[#EFF5FF] dark:bg-[#23235A]`}>
            <div
                className={`h-full rounded-sm transition-all bg-primary-game dark:bg-[#4467CC]`}
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
);

// Progress Section Component
const ProgressSection = ({ 
    nextTier, 
    userTier 
}: { 
    nextTier: Tier; 
    userTier: any; 
}) => {
    const pointsProgress = nextTier?.minPoints
        ? Math.min(((userTier?.totalPoints || 0) / nextTier.minPoints) * 100, 100)
        : 0;
    const gamesProgress = nextTier?.gamesRequired
        ? Math.min(((userTier?.gamesPlayed || 0) / nextTier.gamesRequired) * 100, 100)
        : 0;

    return (
        <>
            <div className="flex items-center gap-3 mb-6">
                <img
                    src={nextTier?.imageUrl}
                    alt={nextTier?.name}
                    className="md:w-8 md:h-8 w-7 h-7"
                />
                <span className="font-bold text-base sm:text-lg text-platform-text line-clamp-2 ">
                    To Reach Next <span className="capitalize">{nextTier?.name}</span> Tier
                </span>
            </div>
            <div className="flex flex-col md:gap-8 gap-4">
                {nextTier?.minPoints > 0 && (
                    <ProgressBar
                        label="Point progress"
                        current={userTier?.totalPoints || 0}
                        target={nextTier?.minPoints}
                        progress={pointsProgress}
                    />
                )}
                {nextTier?.gamesRequired > 0 && (
                    <ProgressBar
                        label="Game Progress"
                        current={userTier?.gamesPlayed || 0}
                        target={nextTier?.gamesRequired}
                        progress={gamesProgress}
                    />
                )}
            </div>
        </>
    );
};

const ActiveTierCard = ({ className }: PropsWithClassName) => {
    const [activeTier, setActiveTier] = useState<Tier | null>(null);
    const [nextTier, setNextTier] = useState<Tier | null>(null);

    const { data: userTier, isLoading: isUserTierLoading } = useGetUserTier();
    const { data: tiersData, isLoading: isTiersLoading } = useGetTiers({
        page: 1,
        limit: 100,
        search: "",
        orderBy: "minPoints",
        orderByField: "ASC"
    });

    useEffect(() => {
       
        
        if (tiersData?.tiers && tiersData.tiers.length > 0) {
            // Sort tiers by minPoints ascending on frontend to ensure correct order
            const sortedTiers = [...tiersData.tiers].sort((a, b) => a.minPoints - b.minPoints);
           
            
            if (userTier) {
                // Use sorted tiers for proper ordering
                const currentTierIndex = sortedTiers.findIndex(
                    (tier) => tier.id.toString() == userTier.tierId.toString()
                );
               
                
                if (currentTierIndex !== -1) {
                    setActiveTier(sortedTiers[currentTierIndex]);
                    if (currentTierIndex < sortedTiers.length - 1) {
                        const nextTierCandidate = sortedTiers[currentTierIndex + 1];
                        setNextTier(nextTierCandidate);
                    } else {
                        setNextTier(null);
                    }
                } else if (sortedTiers.length > 0) {
                    setActiveTier(sortedTiers[0]);
                    if (sortedTiers.length > 1) {
                        setNextTier(sortedTiers[1]);
                    }
                }
            }
        }
    }, [tiersData, userTier]);

    if (isUserTierLoading || isTiersLoading) {
        return <LoadingScreen className="min-h-[200px]" />;
    }

    if (!activeTier) {
        return <Card className="p-4 text-center">No tier information available</Card>;
    }

    return (
        <Card
            className={cn(
                "mb-8 md:h-64 flex flex-col overflow-hidden dark:rounded-none px-0 py-0",
                "bg-white border border-platform-border",
                "dark:bg-transparent dark:border dark:border-platform-border",
                className
            )}
            style={{
                boxShadow: "0px 2px 8px 0px rgba(97, 216, 234, 0.10)",
            }}
        >
            <div className="flex flex-row items-stretch h-full flex-1 w-full">
                {/* Left: Tier badge and name */}
                <div className="flex flex-col items-center justify-center md:min-w-52 xs:min-w-36 min-w-28 py-6 px-4 dark:bg-[url('/images/tier/tier-bg-dark.png')] bg-[url('/images/tier/tier-bg-light.png')] bg-cover bg-center">
                    <div className="relative mb-2">
                        <Image
                            src={activeTier?.imageUrl}
                            alt={activeTier?.name}
                            className="md:w-40   md:h-auto w-20 h-20 z-10 relative"
                            width={96}
                            height={96}
                        />
                    </div>
                    <div className="flex flex-col items-center mt-2">
                        <span className="font-bold text-xl md:text-2xl uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] text-[#00355B] dark:text-white">
                            {activeTier?.name}
                        </span>
                        <span className="text-[#7AC6F9] dark:text-[#FCC93D] text-xs md:text-base font-semibold tracking-widest mt-1" style={{ letterSpacing: "0.1em" }}>
                            MY TIER
                        </span> 
                    </div>
                </div>
                {/* Right: Progress and next tier */}
                <div className="flex-1 flex flex-col justify-center md:px-12 py-6 px-4">
                    {nextTier && <ProgressSection nextTier={nextTier} userTier={userTier} />}
                </div>
            </div>
        </Card>
    );
};

export default ActiveTierCard;
