import SevenUpDownChip from "@/components/features/7-up-down/chip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameType } from "@/hooks/use-game-type";
import { cn } from "@/lib/utils";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetAllGameHistory } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { useMemo } from "react";

type History = {
    id: number;
    winner: "7 Up" | "7 Down" | "7";
    createdAt: string;
};

const LastRounds = ({
    className,
}: {
    className?: string;
}) => {
    const [gameType] = useGameType();
    // Fetch the last 10 rounds
    const { data: allGameHistory } = useGetAllGameHistory({
        roundRecordGameType: RoundRecordGameType.SEVEN_UP_DOWN,
        type: gameType,
        page: 1,
        limit: 10,
    });

    const history: History[] = useMemo(() => {
        return allGameHistory?.rounds ?? [];
    }, [allGameHistory]);

    return (
        <aside
            style={{
                backdropFilter: "blur(39.5px)",
                boxShadow: "0px 0px 8px 0px rgba(0, 92, 164, 1) inset",
                background: "linear-gradient(107deg, rgba(40, 88, 176, 0.90) 10.7%, rgba(29, 36, 93, 0.90) 111.17%)",
            }}
            className={cn(
                "rounded-2xl md:p-4 p-2 flex flex-col",
                className
            )}
        >
            <header className="bg-[#0F1E4D] rounded-[10px] px-4 py-2">
                <h2 className="font-poppins tracking-wider font-bold md:text-xl text-center">Last Round Results</h2>
            </header>
            <div className="mt-2 flex-1">
                <div className="hidden md:block">
                    <div>
                    <div className="flex w-full xl:px-0 px-1  tracking-wider font-montserrat  font-medium uppercase text-white text-sm gap-4">
                     <div className="py-3 xl:px-4 px-1 font-normal tracking-wider whitespace-nowrap flex-1 xl:min-w-[120px]">
                                DATE
                            </div>
                            <div className="py-3 xl:px-4 px-1 font-normal tracking-wider whitespace-nowrap flex-1 xl:min-w-[100px]">
                                TIME
                            </div>
                            <div className="py-3 xl:px-4 px-1 font-normal tracking-wider whitespace-nowrap flex-1 xl:min-w-[120px]">
                                WINNER
                            </div>
                        </div>
                        <ScrollArea className="md:h-[calc(100svh/2-210px)]"  scrollThumbClassName="bg-[#517ED4]">
                            {history.length === 0 ? (
                                <div className="text-center text-[#A3D1FF] py-6 font-poppins text-sm">No recent rounds found.</div>
                            ) : (
                                history.map((round, idx) => (
                                    <div
                                        key={round.id ?? idx}
                                        className="flex bg-[#517ED466] font-normal text-sm px-2 font-poppins rounded-full mb-2 items-center"
                                    >
                                        <div className="py-2 xl:px-4 px-1 text-white text-sm flex-1 xl:min-w-[120px]">
                                            {dayjs(round.createdAt).format("DD/MM/YYYY")}
                                        </div>
                                            <div className="py-2 xl:px-4 px-1 text-white  text-sm flex-1 xl:min-w-[100px]">
                                            {dayjs(round.createdAt).format("HH:mm A")}
                                        </div>
                                        <div className="py-2 xl:px-4 px-1 flex-1 xl:min-w-[120px]">
                                            <div className="flex items-center gap-2">
                                                <SevenUpDownChip side={round.winner === "7 Up" ? "up" : round.winner === "7 Down" ? "down" : "seven"} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </div>
                </div>
                <div className="block md:hidden">
                    <ScrollArea className="h-[250px]" scrollThumbClassName="bg-[#517ED4]">
                        <div className="flex flex-col font-montserrat gap-4">
                            {history.length === 0 ? (
                                <div className="text-center text-[#A3D1FF] py-6 font-poppins text-sm">No recent rounds found.</div>
                            ) : (
                                history.map((round, idx) => (
                                    <div
                                        key={round.id ?? idx}
                                        className="rounded-xl bg-[#1B2B4B] border overflow-hidden border-[#517ED4] shadow-md"
                                    >
                                        <div className="flex  items-center justify-between  px-2 py-1 bg-[#1A2867] border-b border-[#517ED4] ">
                                            <div className="text-[#8BB4FF] font-semibold text-sm tracking-wider">
                                                {dayjs(round.createdAt).format("DD/MM/YYYY")}
                                            </div>
                                            <div className="text-[#BED5FF] font-semibold text-sm">
                                                {dayjs(round.createdAt).format("dddd")}
                                            </div>
                                        </div>
                                        <div className=" gap-1  text-xs bg-[#2958AF] px-2 py-2 ">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[#BED5FF] whitespace-nowrap">
                                                    Winner :
                                                </span>
                                                <SevenUpDownChip side={round.winner === "7 Up" ? "up" : round.winner === "7 Down" ? "down" : "seven"} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </aside>
    );
};

export default LastRounds;