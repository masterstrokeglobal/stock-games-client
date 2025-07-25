import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetAllGameHistory } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { useGameType } from "@/hooks/use-game-type";
import { useMemo } from "react";

// Table row background based on winner
const HEAD_BG =
    "linear-gradient(90deg, rgba(182, 143, 0, 0.3) 0%, rgba(147, 115, 0, 0.3) 100%)";
const TAIL_BG =
    "linear-gradient(90deg, rgba(218, 218, 218, 0.35) 0%, rgba(137, 137, 137, 0.35) 100%)";


const LastRounds = ({
    className,
}: {
    className?: string;
}) => {
    const [gameType] = useGameType();
    // Fetch the last 10 rounds for Head-Tail
    const { data: allGameHistory, isLoading } = useGetAllGameHistory({
        roundRecordGameType: RoundRecordGameType.HEAD_TAIL,
        type: gameType,
        page: 1,
        limit: 10,
    });

    const history = useMemo(() => {
        return allGameHistory?.rounds ?? [];
    }, [allGameHistory]);

    return (
        <aside
            style={{
                backdropFilter: "blur(39.5px)",
                boxShadow: "0px 0px 8px 0px rgba(0, 92, 164, 1) inset",
            }}
            className={cn(
                "rounded-2xl lg:p-4 p-2 flex flex-col border border-[#0074FF] bg-[#004DA982]",
                className
            )}
        >
            <header className="bg-[#004DA9] rounded-[10px] px-4 py-2">
                <h2 className="font-play tracking-wider font-bold lg:text-md text-center">Last Game Results</h2>
            </header>
            <div className="mt-2 flex-1">
                <div className="flex w-full px-4 py-3 font-play text-[15px] sticky top-0 z-10 tracking-wider text-white text-sm gap-4">
                    <div className="flex-1 text-left uppercase whitespace-nowrap">Round ID</div>
                    <div className="flex-1 text-left uppercase whitespace-nowrap">Date</div>
                    <div className="flex-1 text-left uppercase whitespace-nowrap">Time</div>
                    <div className="flex-1 text-left uppercase whitespace-nowrap">Winner</div>
                </div>
                <ScrollArea scrollThumbClassName="bg-[#4467CC]" type="auto" className="font-phudu h-[calc(100svh/2-230px)] font-light overflow-y-auto">
                    <div className="min-w-full text-sm text-left text-white relative">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <span className="animate-spin mr-2 inline-block w-5 h-5 border-2 border-t-2 border-t-white border-white rounded-full"></span>
                                Loading...
                            </div>
                        ) : history.length === 0 ? (
                            <div className="px-4 py-3 text-center">No data found</div>
                        ) : (
                            <div>
                                {history.map((row: any, idx: number) => {
                                    const isHead = row.winningSide.toLowerCase() == "head";
                                    const rowBg = isHead ? HEAD_BG : TAIL_BG;
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "text-white flex items-center h-9 font-phudu font-light rounded-full mb-2 text-sm"
                                            )}
                                            style={{
                                                background: rowBg,
                                            }}
                                        >
                                            <div className="px-4 py-1 flex-1 whitespace-nowrap text-left">
                                                {row.id}
                                            </div>
                                            <div className="px-4 py-1 flex-1 whitespace-nowrap text-left">
                                                {dayjs(row.createdAt).format("DD/MM/YYYY")}
                                            </div>
                                            <div className="px-4 py-1 flex-1 whitespace-nowrap text-left">
                                                {dayjs(row.createdAt).format("hh:mm A")}
                                            </div>
                                            <div className="px-4 py-1 flex-1 whitespace-nowrap text-left">
                                                    {row.winningSide}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </aside>
    );
};

export default LastRounds;