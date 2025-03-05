"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useGetMiniMutualFundCurrentRoundPlacements } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import { useTranslations } from "next-intl";

type Placement = {
    id: number;
    amount: number;
    marketItem: {
        id: number;
        name: string;
        code: string;
    };
    user: {
        id: number;
        firstname: string;
        lastname: string;
        username: string;
    };
};

type UserBetSummary = {
    username: string;
    totalAmount: number;
    marketItemsCount: number;
    marketItems: {
        [key: string]: number;
    };
};

const CurrentBetsMiniMutualFunds = ({ className }: { className?: string }) => {
    const t = useTranslations("mutualFunds");
    const { lobbyRound } = useGameStore();
    const { data, isSuccess } = useGetMiniMutualFundCurrentRoundPlacements(lobbyRound?.id!);

    // Process placements to create user bet summaries
    const userBetSummaries = isSuccess ?
        data.placements.reduce((acc: Record<string, UserBetSummary>, placement: Placement) => {
            const { username } = placement.user;

            if (!acc[username]) {
                acc[username] = {
                    username,
                    totalAmount: 0,
                    marketItemsCount: 0,
                    marketItems: {}
                };
            }

            acc[username].totalAmount += placement.amount;
            acc[username].marketItemsCount++;

            const marketName = placement.marketItem.name;
            acc[username].marketItems[marketName] =
                (acc[username].marketItems[marketName] || 0) + placement.amount;

            return acc;
        }, {}) : {};

    const userBetList = Object.values(userBetSummaries);

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40);
        }
    }, []);

    return (
        <section ref={sectionRef} className={cn("p-3 rounded-xl h-full overflow-hidden w-full bg-[#122146]", className)}>
            <h2 className="text-lg font-semibold mb-2 text-gray-200">
                {t("current-bets")}
            </h2>
            
            {/* Table Header */}
            <div className="flex w-full bg-[#0E1A37] text-gray-300 text-xs font-semibold py-2 px-2 rounded-t-lg">
                <div className="flex-1 text-left">Username</div>
                <div className="flex-1 text-center">Market Items</div>
                <div className="flex-1 text-right">Total Amount</div>
            </div>

            <ScrollArea className="w-full" type="auto" style={{ height: `${scrollAreaHeight - 20}px` }}>
                {userBetList.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {userBetList.map((user: any, index) => (
                            <AccordionItem value={`user-${index}`} key={index}>
                                <AccordionTrigger className="flex hover:bg-blue-900/20 px-2 py-3">
                                    <div className="flex justify-between w-full">
                                        <span className="text-xs text-gray-300 text-left flex-1 truncate">
                                            {user.username}
                                        </span>
                                        <span className="text-xs text-gray-300 text-center flex-1">
                                            {user.marketItemsCount}
                                        </span>
                                        <span className="text-xs text-gray-300 text-right flex-1">
                                            {user.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-[#0E1A37] p-2">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-left text-xs text-gray-300 p-2">Market Item</th>
                                                <th className="text-right text-xs text-gray-300 p-2">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(user.marketItems).map(([marketName, amount]) => (
                                                <tr key={marketName} className="border-b last:border-none">
                                                    <td className="p-2 text-xs text-gray-300">{marketName}</td>
                                                    <td className="p-2 text-xs text-right text-gray-300">
                                                        {(amount as number).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="font-bold">
                                                <td className="p-2 text-xs text-gray-300">Total</td>
                                                <td className="p-2 text-xs text-right text-gray-300">
                                                    {user.totalAmount.toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center text-gray-300 py-4">
                        {t("no-bets-available")}
                    </div>
                )}
            </ScrollArea>
        </section>
    );
};

export default CurrentBetsMiniMutualFunds;