"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getPlacementString } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { useGetTopPlacements } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    className?: string;
    round: RoundRecord;
};

const CurrentBets = ({ className, round }: Props) => {
    const t = useTranslations("game");
    const { data, isSuccess } = useGetTopPlacements(round.id.toString());

    const currentBetsData: GameRecord[] = useMemo(() => {
        if (isSuccess) {
            return data.data;
        }
        return [];
    }, [isSuccess, data]);

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40);
        }
    }, []);




    return (
        <section
            ref={sectionRef}
            className={cn("p-4 rounded-2xl h-full w-full bg-secondary-game", className)}
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                {t("current-bets")}
            </h2>
            <ScrollArea className="max-h-96 w-full" style={{ height: `${scrollAreaHeight - 20}px` }} type="auto">
                {currentBetsData.length > 0 ? (
                    <table className="min-w-full">
                        <thead>
                            <tr className="flex">
                                <th className="p-2 text-sm text-left text-gray-300 rounded-tl-lg flex-1">
                                    {t("placement")}
                                </th>
                                <th className="p-2 text-sm text-left text-gray-300 flex-1">
                                    {t("username")}
                                </th>
                                <th className="p-2 text-sm text-right text-gray-300 rounded-tr-lg flex-1">
                                    {t("amount")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBetsData.map((bet: any, index: number) => (
                                <tr
                                    key={index}
                                    className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <td className="p-2 text-sm text-gray-300 rounded-l-lg flex-1">
                                        {getPlacementString(bet, round)}
                                    </td>
                                    <td className="p-2 text-sm text-gray-300 flex-1">
                                        {bet.user.username}
                                    </td>
                                    <td className="p-2 text-sm text-right text-gray-300 rounded-r-lg flex-1">
                                        {bet.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-300 py-4">
                        {t("no-bets")}
                    </div>
                )}
            </ScrollArea>
        </section>
    );
};

export default CurrentBets;
