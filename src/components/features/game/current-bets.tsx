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
        <div className="w-full game-gradient-card h-full md:rounded-sm overflow-hidden">
            <div className=" md:rounded-sm h-full flex flex-col">
                <header className="relative">
                    <h2 className="text-md font-semibold p-2  text-game-secondary flex justify-between  w-full">
                        <span>{title}</span>
                        {showTotal && (
                            <span className="ml-auto ">
                                Rs. {totalAmount}
                            </span>
                        )}
                    </h2>
                    {showTotal && (
                        <div className="gradient-line" />
                    )}
                </header>
                {data.length > 0 ? (
                    <ScrollArea className="max-h-96 w-full " type="auto">
                        <table className="min-w-full pr-2">
                            <thead className="game-gradient-card-header sticky top-0   ">
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
                        <ScrollBar orientation="vertical" />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                ) : (
                    <div className="text-game-secondary py-4 text-center flex-1 flex flex-col items-center justify-center">
                        <img className="w-10 h-10 mb-2" src="/images/roulette/wallet-icon.png" alt="no-bets" />
                        <p className="text-game-secondary md:text-lg font-semibold mb-4 max-w-xs text-center">
                            {t("no-bets")}
                        </p>
                        <p className="text-[#0B5AB6] text-sm">
                            {t("no-bets-description")}
                        </p>
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
                <div className="max-h-96 w-full flex-1 md:rounded-sm overflow-hidden game-gradient-card-parent">
                    <BetTable title={t("current-bets")} data={currentBetsData} showTotal={true} />
                </div>
                <div className="max-h-96 w-full flex-1 md:rounded-sm overflow-hidden game-gradient-card-parent">
                    <BetTable title={t("top-bets")} data={Array.from({ length: 10 }).map(() => ({}))} />
                </div>
            </div>
        </section>
    );
};

export default CurrentBets;
