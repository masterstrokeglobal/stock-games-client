"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, getPlacementString, randomNumber, randomUsername } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { useGetMyPlacements } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";

type Props = {
    className?: string;
    round: RoundRecord;
};

const CurrentBets = ({ className, round }: Props) => {
    const t = useTranslations("game");
    const { data, isSuccess } = useGetMyPlacements({ roundId: round.id.toString() });

    const currentBetsData: GameRecord[] = useMemo(() => {
        if (isSuccess) {
            return data.data;
        }
        return [];
    }, [isSuccess, data]);

    const sectionRef = useRef<HTMLDivElement | null>(null);



    const totalAmount = useMemo(() => {
        return currentBetsData.reduce((acc, bet) => acc + bet.amount, 0);
    }, [currentBetsData]);

    const BetTable = ({ title, data, showTotal = false }: { title: string, data: any[], showTotal?: boolean }) => (
        <div className="w-full game-gradient-card h-full rounded-sm overflow-hidden">
            <div className=" md:rounded-sm">
            <h2 className="text-md font-semibold p-2  text-game-secondary flex justify-between  w-full">
                <span>{title}</span>
                {showTotal && (
                    <span className="ml-auto ">
                        Rs. {totalAmount}
                    </span>
                )}
            </h2>
            {data.length > 0 ? (
                <table className="min-w-full pr-2">
                    <thead className="relative game-gradient-card-header">
                    <div className="gradient-line" />
                        <tr className="flex">
                            <th className="p-2 text-sm text-left text-game-secondary rounded-tl-lg flex-1">
                                {t("placement")}
                            </th>
                            <th className="p-2 text-sm text-left text-game-secondary flex-1">
                                {t("username")}
                            </th>
                            <th className="p-2 text-sm text-right text-game-secondary rounded-tr-lg flex-1">
                                {t("amount")}
                            </th>
                        </tr>
                        <div className="gradient-line" />
                    </thead>
                    <tbody>
                        {data.map((bet: any, index: number) => (
                            <tr
                                key={index}
                                className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                                style={{ display: 'flex', flexDirection: 'row' }}
                            >
                                <td className="p-2 text-sm text-balance text-game-secondary rounded-l-lg flex-1">
                                    {getPlacementString(bet, round)}
                                </td>
                                <td className="p-2 text-sm text-game-secondary flex-1">
                                    {bet.user?.username || randomUsername()}
                                </td>
                                <td className="p-2 text-sm text-right text-game-secondary rounded-r-lg flex-1">
                                    {bet.amount || randomNumber(100, 1000, 100)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-game-secondary py-4 text-center">
                    {t("no-bets")}
                </div>
                )}
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className={cn(" md:rounded-2xl h-full w-full ", className)}
        >
            <div className="flex gap-4 md:flex-row flex-col h-full">
                <ScrollArea className="max-h-96 w-full flex-1 rounded-sm overflow-hidden game-gradient-card-parent" type="auto">
                    <BetTable title={t("current-bets")} data={currentBetsData} showTotal={true} />
                    <ScrollBar orientation="vertical" />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <ScrollArea className="max-h-96 w-full flex-1 rounded-sm overflow-hidden game-gradient-card-parent" type="auto">
                    <BetTable title={t("top-bets")} data={Array.from({ length: 10 }).map(() => ({}))} />
                    <ScrollBar orientation="vertical" />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
};

export default CurrentBets;
