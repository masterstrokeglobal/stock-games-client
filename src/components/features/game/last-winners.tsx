import ParticlesContainer from "@/components/ui/particle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameType } from "@/hooks/use-game-type";
import { cn } from "@/lib/utils";
import { useLastRoundWinner } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

const LastWinners = ({className}:PropsWithClassName ) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight);
            console.log(sectionHeight);
        }
    }, []);
    return <section ref={sectionRef} className={cn("bg-background-game rounded-2xl overflow-hidden relative", className)}>
        <ParticlesContainer className="w-full h-full" />
        <ScrollArea style={{ height: `${scrollAreaHeight}px` }} type="auto">
            <LastRoundWinner />
        </ScrollArea>
    </section>;
};

export default LastWinners;


const LastRoundWinner = () => {
    const t = useTranslations("last-round-winner");
    const [gameType] = useGameType();
    const { data, isSuccess } = useLastRoundWinner(gameType);

    const rounds: any[] = useMemo(() => {
        if (isSuccess) {
            return Array.from(data.data);
        }
        return [];
    }, [isSuccess, data]);


    return (
        <div>
            <h2 className="text-md pl-2 text-white mt-2 py-1 font-semibold mb-2 text-game-text game-box-gradient  w-full ">
                {t("title")}
            </h2>
            {rounds.length > 0 ? (
                <table className="min-w-full">
                    <thead className="bg-primary-game">
                        <tr className="flex">
                            <th className="p-2 text-sm text-left text-game-secondary rounded-tl-lg flex-1">
                                {t("time")}
                            </th>
                            <th className="p-2 text-sm text-center text-game-secondary flex-1">
                                {t("winner")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-game-text">
                        {rounds.map((round, index) => (
                            <tr key={index} className="flex">
                                <td className="p-2 text-sm text-game-text flex-1">
                                    {dayjs(round.startTime).format("hh:mm A")} ({round.roundNumber})
                                </td>
                                <td className="p-2 text-sm text-game-text flex-1 px-2">
                                    <span className={cn("w-16 mx-auto font-semibold flex items-center justify-center", round.winningColor === "red" ? "justify-start text-red-500" : "justify-end text-black", round.winningNumber === 0 ? "justify-center text-yellow-600" : "")}>
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
