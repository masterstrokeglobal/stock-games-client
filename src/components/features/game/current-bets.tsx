"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getPlacementString, randomNumber, randomUsername } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { useGetMyPlacements } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

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
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 0);
        }
    }, []);

    const totalAmount = useMemo(() => {
        return currentBetsData.reduce((acc, bet) => acc + bet.amount, 0);
    }, [currentBetsData]);
    return (
        <section
            ref={sectionRef}
            className={cn("pr-4 py-4 md:rounded-2xl h-full w-full bg-background-secondary", className)}
        >
            <div className="flex gap-2 md:flex-row flex-col">
                <ScrollArea className="max-h-96 w-full flex-[2]" style={{ height: `${scrollAreaHeight - 20}px` }} type="auto">
                    <h2 className="text-md font-semibold mb-2 text-game-text flex justify-between  game-header-highlight lg:pl-4 pl-2 w-full ">
                        <span>
                            {t("current-bets")}
                        </span>
                        <span className="ml-auto text-game-secondary">
                            Rs. {totalAmount}
                        </span>
                    </h2>
                    {currentBetsData.length > 0 ? (
                        <table className="min-w-full pr-2">
                            <thead>
                                <tr className="flex">
                                    <th className="p-2 text-sm  text-left text-game-secondary rounded-tl-lg flex-1">
                                        {t("placement")}
                                    </th>
                                    <th className="p-2 text-sm text-left text-game-secondary flex-1">
                                        {t("username")}
                                    </th>
                                    <th className="p-2 text-sm text-right text-game-secondary rounded-tr-lg flex-1">
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
                                        <td className="p-2 text-sm text-balance text-game-secondary rounded-l-lg flex-1">
                                            {getPlacementString(bet, round)}
                                        </td>
                                        <td className="p-2 text-sm text-game-secondary flex-1">
                                            {bet.user.username}
                                        </td>
                                        <td className="p-2 text-sm text-right text-game-secondary rounded-r-lg flex-1">
                                            {bet.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className=" text-game-secondary  py-4 text-center">
                            {t("no-bets")}
                        </div>
                    )}
                    <h2 className="text-md font-semibold mb-2 text-game-text  game-header-highlight lg:pl-4 pl-2 w-full ">
                        {t("top-bets")}
                    </h2>
                    <table className="min-w-full pr-2">
                        <thead>
                            <tr className="flex">
                                <th className="p-2 text-sm  text-left text-game-secondary rounded-tl-lg flex-1">
                                    {t("placement")}
                                </th>
                                <th className="p-2 text-sm text-left capitalize text-game-secondary flex-1">
                                    {t("username")}
                                </th>
                                <th className="p-2 text-sm text-right text-game-secondary rounded-tr-lg flex-1">
                                Rs. {t("amount")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 10 }).map((_, index: number) => (
                                <tr
                                    key={index}
                                    className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <td className="p-2 text-sm text-balance text-game-secondary rounded-l-lg flex-1">
                                        {randomNumber(1, 15, 1) + " Single"}
                                    </td>
                                    <td className="p-2 text-sm text-game-secondary capitalize flex-1">
                                        {randomUsername()}
                                    </td>
                                    <td className="p-2 text-sm text-right text-game-secondary rounded-r-lg flex-1">
                                        {randomNumber(100, 1000, 100)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ScrollArea>
            </div>
        </section>
    );
};



export default CurrentBets;
