"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkewedButton } from "@/components/ui/skew-button";
import MarketItem from "@/models/market-item";
import { RoundRecordGameType } from "@/models/round-record";
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot";
import { useGetUserGameHistory } from "@/react-query/game-user-queries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

// Type for a single history record based on the provided sample
type JackpotHistory = {
    id: number;
    roundId: number;
    amount: number;
    placementType: StockJackpotPlacementType;
    isWinner: boolean;
    marketItem: MarketItem;
    intialPriceForMarket: number;
    finalPriceForMarket: number;
    createdAt: string;
    netProfitLoss: number;
};

function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
    return {
        date: `${day}/${month}/${year}`,
        time: `${hour12}:${minutes} ${ampm}`,
        weekday,
    };
}

// Mobile card view for a single bet history item
function MobileHistoryCard({ item }: { item: JackpotHistory }) {
    const { date, weekday } = formatDateTime(item.createdAt);
    return (
        <div
            className="rounded-xl p-0 overflow-hidden mb-4"
            style={{
                border: "1px solid #FFFFFF80",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 4px 4px 0px #00000040",
                background: "#05657D99"
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{
                    background: "#007E9F73",
                    borderBottom: "1px solid #50D8F2"
                }}
            >
                <span className="font-audiowale text-white text-[11px]">{date}</span>
                <span className="font-audiowale text-white text-[11px]">{weekday}</span>
            </div>
            {/* Body */}
            <div className="px-4 py-3 grid grid-cols-2  space-x-2">
                <div className="flex justify-between items-center">
                    <span className="text-white/80 font-space-grotesk text-[9px]">Betted on:</span>
                    <span className="flex items-center gap-1 font-semibold text-white text-end font-space-grotesk text-[9px]">
                        {item.marketItem?.name || "-"}
                        <span
                            className={`
                                ml-1 font-space-grotesk text-[9px]
                                ${item.placementType === StockJackpotPlacementType.HIGH ? "text-green-400" : ""}
                                ${item.placementType === StockJackpotPlacementType.LOW ? "text-red-400" : ""}
                            `}
                        >
                            {item.placementType}
                        </span>
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/80 font-space-grotesk text-[9px]">Bet INR :</span>
                    <span className="text-white font-bold font-space-grotesk text-[9px]">{item.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/80 font-space-grotesk text-[9px]">Result:</span>
                    <span>
                        {item.isWinner ? (
                            <span className="text-green-400 font-bold font-space-grotesk text-[9px]">Win</span>
                        ) : (
                            <span className="text-red-400 font-bold font-space-grotesk text-[9px]">Loss</span>
                        )}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/80 font-space-grotesk text-[9px]">Cashout INR :</span>
                    <span
                        className={`font-bold font-space-grotesk text-[9px] ${item.isWinner ? "text-green-400" : "text-white"}`}
                    >
                        {item.isWinner
                            ? (item.amount + (item.netProfitLoss ?? 0)).toFixed(2)
                            : "0"}
                    </span>
                </div>
            </div>
        </div>
    );
}

const JackpotBettingHistory = () => {
    const [page, setPage] = useState(1);
    const { data: userGameHistory, isFetching } = useGetUserGameHistory({
        page,
        roundRecordGameType: RoundRecordGameType.STOCK_JACKPOT,
    });

    const { history, totalPages } = useMemo(() => {
        const history: JackpotHistory[] = userGameHistory?.data || [];
        const totalCount = userGameHistory?.countOfGame || 0;
        const totalPages = Math.ceil(totalCount / 10) || 1;
        return { history, totalPages };
    }, [userGameHistory]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    return (
        <div className="">
            {/* Desktop Table View */}
            <div className="hidden sm:block">
                <div className="space-y-2 p-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 text-sm font-medium text-white font-orbitron border-b border-white/20 pb-2 sticky top-0 bg-[#05657D99] px-3 py-2 rounded-full">
                        <div>DATE</div>
                        <div>TIME</div>
                        <div>BETTED ON</div>
                        <div>RESULT</div>
                        <div>BET INR</div>
                        <div>CASHOUT INR</div>
                    </div>

                    {/* Table Rows */}
                    <ScrollArea className="h-[40vh] text-white" scrollThumbClassName="bg-[#C7F4FF80]">
                        <div className="space-y-2 font-space-grotesk">
                            {isFetching ? (
                                <div className="text-center py-8 text-white/60">Loading...</div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-8 text-white/60">No betting history found.</div>
                            ) : (
                                history.map((item, i) => {
                                    const { date, time } = formatDateTime(item.createdAt);
                                  
                                    return (
                                        <div
                                            key={item.id}
                                            className={`grid grid-cols-6 font-space-grotesk text-[#C2F2FF] gap-4 text-sm py-2 px-3 rounded-full ${i % 2 === 1 ? 'bg-[#05657D38]' : ''}`}
                                        >
                                            <div>{date}</div>
                                            <div>{time}</div>
                                            <div
                                                className="rounded-md px-2 py-1 w-fit "
                                                style={
                                                    {
                                                        background: !(item.placementType === StockJackpotPlacementType.HIGH) ? 'linear-gradient(0deg, #B80033 0%, #C42C65 100%)' : 'linear-gradient(180deg, #B0FF2A 0%, #3E8100 100%)'
                                                    }
                                                }
                                            >
                                                <div className="flex gap-1 items-center">
                                                    <span title={item.marketItem.name} className="font-semibold text-xs text-white line-clamp-1">{item.marketItem?.name || "-"}</span>
                                                    <span className="text-xs text-white">
                                                        {item.placementType}
                                                    </span>
                                                </div>
                                            </div>
                                            <SkewedButton
                                                className="rounded-md w-fit"
                                                variant={item.isWinner ? "green" : "red"}
                                            >
                                                {item.isWinner ? (
                                                    <span className="text-white font-bold">Win</span>
                                                ) : (
                                                    <span className="text-white font-bold">Loss</span>
                                                )}
                                            </SkewedButton>
                                            <div>{item.amount}</div>
                                            <div>
                                                {item.isWinner
                                                    ? (item.amount + (item.netProfitLoss ?? 0)).toFixed(2)
                                                    : "0.00"}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden">
                <ScrollArea className="h-[60vh] text-white" scrollThumbClassName="bg-[#C7F4FF80]">
                    {isFetching ? (
                        <div className="text-center py-8 text-white/60">Loading...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8 text-white/60">No betting history found.</div>
                    ) : (
                        history.map((item) => (
                            <MobileHistoryCard key={item.id} item={item} />
                        ))
                    )}
                </ScrollArea>
            </div>

            {/* Pagination - Only show on small devices */}
            <div className="flex items-center md:justify-center justify-between space-x-2 py-4 rounded-full md:mx-2">
                <button
                    className={`text-[#C2F2FF] font-space-grotesk flex items-center px-2 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    <ChevronLeft className="md:mr-2" /> Previous
                </button>
                <span className="text-[#003B4AB2] font-bold font-rajdhani">
                    Page {totalPages === 0 ? 1 : page} of {totalPages}
                </span>
                <button
                    className={`text-[#C2F2FF] font-space-grotesk flex items-center px-2 ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next <ChevronRight className="md:ml-2" />
                </button>
            </div>
        </div>
    );
};

export default JackpotBettingHistory;