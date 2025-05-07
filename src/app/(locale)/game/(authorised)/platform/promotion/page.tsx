"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Bonus from "@/models/bonus";
import { useGetActiveBonus } from "@/react-query/bonus-queries";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import BonusCard from "./bonus-card";

const PromotionPage = () => {
    const { data, isLoading } = useGetActiveBonus();

    const activeBonus = useMemo(() => {
        if (isLoading) return null;
        return data?.map((bonus: any) => new Bonus(bonus));
    }, [data]);

    return (
        <section className="flex flex-col min-h-screen bg-primary-game text-white p-4 mx-auto">
            <main className="flex flex-col gap-4 mt-20  w-full mx-auto">
                <header>
                    <h1 className="text-2xl font-bold text-left">
                        <span className="text-2xl mr-2">🎉</span>
                        Promotion
                    </h1>
                </header>

                {isLoading ? (
                    <BonusSkeletonLoader />
                ) : activeBonus && activeBonus.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeBonus.map((bonus: Bonus) => (
                            <BonusCard className="w-full" key={bonus.id} bonus={bonus} />
                        ))}
                    </div>
                ) : (
                    <NoPromotionsMessage />
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

// No promotions message using Shadcn Alert
const NoPromotionsMessage = () => {
    return (
        <Alert className="bg-gray-800/50 border-gray-700 text-gray-300">
            <AlertCircle className="h-5 w-5 stroke-white" />
            <AlertTitle className="text-xl font-semibold">No Active Promotions</AlertTitle>
            <AlertDescription className="text-gray-400">
                There are currently no active promotions available. Check back later for exciting offers and bonuses!
            </AlertDescription>
        </Alert>
    );
};

export default PromotionPage;