"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Bonus from "@/models/bonus";
import { useGetActiveBonus } from "@/react-query/bonus-queries";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";
import BonusCard from "./bonus-card";
import { Button } from "@/components/ui/button";

const PromotionPage = () => {
    const { data, isLoading, refetch } = useGetActiveBonus();

    const activeBonus = useMemo(() => {
        if (isLoading) return null;
        return data?.map((bonus: any) => new Bonus(bonus));
    }, [data, isLoading]);

    return (
        <section className="flex flex-col min-h-screen  p-4 mx-auto">
            <main className="flex flex-col gap-4 md:mt-20 mt-10 w-full mx-auto">
                <header>
                    <h1 className="text-2xl font-bold text-left text-platform-text">
                        Promotion
                    </h1>
                </header>

                {isLoading ? (
                    <BonusSkeletonLoader />
                ) : activeBonus && activeBonus.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {activeBonus.map((bonus: Bonus) => (
                            <BonusCard className="w-full" key={bonus.id} bonus={bonus} />
                        ))}
                    </div>
                ) : (
                    <NoPromotionsMessage onRefresh={refetch} />
                )}
            </main>
        </section>
    );
};

// Shadcn UI skeleton loader component for bonuses
const BonusSkeletonLoader = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
                <Card key={index} className="w-full bg-gray-800 border-gray-700">
                    <CardHeader className="p-0">
                        <Skeleton className="h-52 w-full rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-10 w-1/3" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

// No promotions message with gradient background, icon, and action buttons
const NoPromotionsMessage = ({ onRefresh }: { onRefresh: () => void }) => {
    return (
        <div className="border border-[#4D66C8] bg-[linear-gradient(90.08deg,#AC5797_0.13%,#4D66C8_99.99%)] p-6 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/30">
                    <span className="block h-6 w-6 bg-white/40 rounded-full" />
                </div>
                <div>
                    <div className="text-lg font-semibold text-white/90">No Active Promotions</div>
                </div>
            </div>
            <div className="text-sm text-white/80">
                There are currently no active promotions available. Check back later for exciting offers and bonuses!
            </div>
            <div className="flex gap-3 mt-2">
                <Button
                    onClick={onRefresh}
                    variant="platform-primary"
                    className=" rounded-none bg-[#4467CC]"
                >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default PromotionPage;