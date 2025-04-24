"use client";
import Bonus from "@/models/bonus";
import { useGetActiveBonus } from "@/react-query/bonus-queries";
import { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import Navbar from "@/components/features/game/navbar";
import BonusCard from "./bonus-card";
import { MegaphoneIcon } from "lucide-react";
const PromotionPage = () => {
    const { data, isLoading } = useGetActiveBonus();

    const activeBonus = useMemo(() => {
        if (isLoading) return null;
        return data?.map((bonus: any) => new Bonus(bonus));
    }, [data]);

    if (isLoading) return <LoadingScreen className="min-h-screen" />
    return (
        <section className="flex flex-col min-h-screen bg-primary-game text-white p-4  mx-auto">
            <Navbar />
            <main className="flex flex-col gap-4 mt-20 max-w-5xl w-full mx-auto">
                <header className="flex justify-start items-center gap-2 bg-gradient-to-r from-secondary-game to-secondary-game text-primary-game p-2 rounded-full w-fit px-4">
                    <MegaphoneIcon className="w-6 h-6 -rotate-12 mr-2" />
                    <h1 className="text-2xl font-bold text-left">Promotion</h1>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeBonus?.map((bonus: Bonus) => (
                        <BonusCard className="w-full" key={bonus.id} bonus={bonus} />
                    ))}
                </div>
            </main>
        </section>
    )
}

export default PromotionPage;


