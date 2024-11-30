"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentGame } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { RoundRecord } from "@/models/round-record";
import { cn } from "@/lib/utils";

// Enhanced interface for ranked market items
interface RankedMarketItem {
    name: string;
    price: number;
    rank: number;
    change_percent: string;
    bitcode: string;
    initialPrice?: number;
}

type Props = {
    roundRecord: RoundRecord;
}

const LeaderBoard = ({ roundRecord }: Props) => {
    const { stocks: leaderboardData } = useLeaderboard(roundRecord);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);


    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40);
        }
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const getChangeColor = (changePercent: string) => {
        const change = parseFloat(changePercent);
        if (change > 0) return "text-green-500";
        if (change < 0) return "text-red-500";
        return "text-gray-300";
    };

    return (
        <section
            ref={sectionRef}
            className="p-4 rounded-2xl h-full w-full bg-[#122146]"
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                Leader Board
            </h2>
            <ScrollArea
                className="max-h-96 h-full"
                style={{ height: `${scrollAreaHeight - 20}px` }}
            >
                <table className="min-w-full">
                    <thead>
                        <tr className="text-[#8990A2] text-sm">
                            <th className="p-2 text-left w-12">Rank</th>
                            <th className="p-2 text-left">Horse</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-right">Price</th>
                            <th className="p-2 text-right">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((crypto, index) => (
                            <tr
                                key={index}
                                className="border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                            >
                                <td className="p-2 w-12 text-gray-300">
                                    {index === 0 ? (
                                        <img
                                            src="/rank-1.svg"
                                            alt="Rank 1"
                                            className="w-6 h-6"
                                        />
                                    ) : index === 1 ? (
                                        <img
                                            src="/rank-2.svg"
                                            alt="Rank 2"
                                            className="w-6 h-6"
                                        />
                                    ) : index === 2 ? (
                                        <img
                                            src="/rank-3.svg"
                                            alt="Rank 3"
                                            className="w-6 h-6"
                                        />
                                    ) : (
                                        <span className="text-[#8990A2]">{index + 1}</span>
                                    )}
                                </td>
                                <td className="p-2 text-sm text-gray-300">
                                    {crypto.horse}
                                </td>
                                <td className="p-2 text-sm text-gray-300">
                                    {crypto.name}
                                </td>
                                <td className="p-2 text-sm text-right text-gray-300">
                                    Rs. {crypto.price ? formatPrice(crypto.price):"-"}
                                </td>
                                <td className={cn(
                                    "p-2 text-sm text-right",
                                    getChangeColor(crypto.change_percent)
                                )}>
                                    {parseFloat(crypto.change_percent) > 0 ? '+' : ''}
                                    {crypto.change_percent??0}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </section>
    );
};

export default LeaderBoard;