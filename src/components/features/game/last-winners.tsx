import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameType } from "@/hooks/use-game-type";
import { cn } from "@/lib/utils";
import { useLastRoundWinner } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

const LastWinners = ({ className }: PropsWithClassName) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight);
        }
    }, []);
    return <section ref={sectionRef} className={cn("game-gradient-card-parent relative w-full h-full ", className)}>
        <ScrollArea style={{ height: `${scrollAreaHeight}px` }} className="game-gradient-card md:rounded-sm" type="auto">
            <LastRoundWinner />
        </ScrollArea>
    </section>;
};

export default LastWinners;


const LastRoundWinner = () => {
    const t = useTranslations("last-round-winner");
    const [gameType] = useGameType();
    const { data, isSuccess, refetch } = useLastRoundWinner(gameType);

    const rounds: any[] = useMemo(() => {
        if (isSuccess) {
            return Array.from(data.data);
        }
        return [];
    }, [isSuccess, data]);

    useEffect(() => {
        const FIFTEEN_SECONDS = 1000 * 15 * 1;
        const interval = setInterval(() => {
            if (isSuccess) {
                refetch();
            }
        }, FIFTEEN_SECONDS);
        return () => clearInterval(interval);
    }, [isSuccess, data]);


    return (
        <div className=" md:m-auto mx-auto md:w-full w-[calc(80%)]">
            <h2 className="text-md pl-2 text-white mt-2 py-1 font-semibold mb-2 text-game-text game-box-gradient  w-full ">
                {t("title")}
            </h2>
            {rounds.length > 0 ? (
                <table className="min-w-full">
                    <thead className="bg-primary-game">
                        <div className="gradient-line" />
                        <tr className="flex">
                            <th className="p-2 text-sm text-left text-game-secondary rounded-tl-lg flex-1">
                                {t("time")}
                            </th>
                            <th className="p-2 text-sm text-center text-game-secondary flex-1">
                                {t("winner")}
                            </th>
                        </tr>
                        <div className="gradient-line" />
                    </thead>
                    <tbody className="text-game-secondary">
                        {rounds.map((round, index) => (
                            <tr key={index} className="flex">
                                <td className="p-2 text-sm flex-1">
                                    {dayjs(round.startTime).format("hh:mm A")} ({round.roundNumber})
                                </td>
                                <td className="p-2 text-sm flex-1 px-2">
                                    <span className={cn("w-16 mx-auto font-semibold flex items-center justify-center", round.winningColor === "red" ? "justify-start text-red-500" : "justify-end  text-white", round.winningNumber === 0 ? "justify-center text-yellow-600" : "")}>
                                        &nbsp; {round.winningNumber} &nbsp;
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-game-text py-4">
                    {t("no-bets")}
                </div>
            )}
        </div>
    )
}
