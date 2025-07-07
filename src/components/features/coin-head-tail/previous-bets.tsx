import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HeadTailPlacementType } from "@/models/head-tail";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetUserGameHistory } from "@/react-query/game-user-queries";
import dayjs from "dayjs";
import Image from "next/image";
import { useMemo } from "react";
import { CoinHeadTailHistory } from "./betting-history";

// --- Coin Head/Tail Config ---
export const COIN_SIDE_CONFIG = {
    head: {
        name: "HEAD",
        chipColor: "#693D11",
        textColor: "#F5D561",
        borderColor: "#F5D561",
    },
    tail: {
        name: "TAIL",
        chipColor: "#555555",
        textColor: "#fff",
        borderColor: "#B9B9B9",
    }
};

const PreviousBets = ({ className, tableClassName }: { className?: string, tableClassName?: string }) => {

    const { data: userGameHistory } = useGetUserGameHistory({ page: 1, roundRecordGameType: RoundRecordGameType.HEAD_TAIL });

    const { history } = useMemo(() => {
        const history: CoinHeadTailHistory[] = userGameHistory?.data || [];
        return { history };
    }, [userGameHistory]);

    return (
        <section className={cn(className)}>
            {history?.length === 0 ? <NoBets /> : <BetsTable placements={history ?? []} listClassName={tableClassName} />}
        </section>
    );
};

const NoBets = () => {
    return (
        <div className="text-white space-y-2 text-center flex flex-col items-center py-4 justify-center h-64">
            <Image src="/images/dice-game/no-bets.png" alt="No Bets" className="w-auto h-full aspect-square " width={100} height={100} />
            <p className="text-lg font-semibold max-w-sm px-12">{`You haven't placed
                any bets yet`}</p>
        </div>
    );
};

const BetsTable = ({ placements, listClassName }: { placements: CoinHeadTailHistory[], listClassName?: string }) => {
    return (
        <div
            className={cn("w-full   ", listClassName)}
        >

            {/* Header */}
            <div className="flex w-full px-4 py-3 font-play  sticky top-0  z-10 tracking-wider text-white text-sm gap-4">
                <div className="flex-1 text-left">Time</div>
                <div className="flex-1 text-left">Selected Side</div>
                <div className="flex-1 text-left">Winning Side</div>
                <div className="flex-1 text-left">Profit/Loss</div>
            </div>
            <ScrollArea
                scrollThumbClassName="bg-[#4467CC]"
                type="auto"
                className={cn("w-full h-[calc(100svh-200px)]   ", listClassName)}
            >
                {placements.length === 0 ? (
                    <div className="px-4 py-3 text-left text-white">No data found</div>
                ) : (
                    placements.map((placement, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex items-center flex-1 border-b border-[#0B5AB6]",
                            )}
                        >
                            <div className="px-4 py-1 flex-1 text-white text-center">
                                {dayjs(placement.createdAt).format("hh:mm A")}
                            </div>
                            <div className="px-4 py-1 flex-1 text-left">
                                <span
                                    className="px-3 py-1 rounded-full font-semibold text-xs border"
                                    style={{
                                        background: COIN_SIDE_CONFIG[placement.selectedSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.chipColor,
                                        color: COIN_SIDE_CONFIG[placement.selectedSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.textColor,
                                        borderColor: COIN_SIDE_CONFIG[placement.selectedSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.borderColor,
                                        minWidth: 60,
                                        display: "inline-block",
                                        textAlign: "center"
                                    }}
                                >
                                    {COIN_SIDE_CONFIG[placement.selectedSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.name}
                                </span>
                            </div>
                            <div className="px-4 py-1 flex-1 text-left">
                                <span
                                    className="px-3 py-1 rounded-full font-semibold text-xs border"
                                    style={{
                                        background: COIN_SIDE_CONFIG[placement.winningSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.chipColor,
                                        color: COIN_SIDE_CONFIG[placement.winningSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.textColor,
                                        borderColor: COIN_SIDE_CONFIG[placement.winningSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.borderColor,
                                        minWidth: 60,
                                        display: "inline-block",
                                        textAlign: "center"
                                    }}
                                >
                                    {COIN_SIDE_CONFIG[placement.winningSide === HeadTailPlacementType.HEAD ? 'head' : 'tail']?.name}
                                </span>
                            </div>
                            <div className="px-4 py-1 flex-1 text-white text-left">
                                <div className="px-4 py-3 flex-[1.2] flex items-center">
                                    {placement.netProfitLoss > 0
                                        ? `+₹ ${placement.netProfitLoss}`
                                        : placement.netProfitLoss < 0
                                            ? `-₹ ${Math.abs(placement.netProfitLoss)}`
                                            : `₹ ${placement.netProfitLoss}`}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    );
};

export default PreviousBets;