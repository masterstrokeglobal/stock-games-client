import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { RoundRecordGameType, WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { useGetUserGameHistory } from '@/react-query/game-user-queries';
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Mobile-specific component for bet history
const MobileBettingHistory = ({ history }: { history: History[] }) => {
    return (
        <ScrollArea scrollThumbClassName="bg-[#5C8983]" className="flex h-[60svh] overflow-y-auto">
            {history.length === 0 && (
                <div className="px-4 py-3 text-center text-white">No data found</div>
            )}
            {history.map((row, idx) => (
                <div
                    key={idx}
                    className="rounded-2xl mb-4 max-h-[80svh] border overflow-hidden  space-y-2 border-[#5C8983] bg-[#2B4643] shadow-md"
                >
                    <div className="flex justify-between items-center px-4 py-2 bg-[#242D2D] mb-2">
                        <div className="font-semibold text-white text-base">
                            {dayjs(row.createdAt).format("DD/MM/YYYY")}
                        </div>
                        <div className="text-white text-sm opacity-80">
                            {dayjs(row.createdAt).format("dddd")}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 pb-2 text-sm px-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="text-white flex flex-nowrap">Color betted :
                                <span
                                    className="px-2 py-0.5 rounded-full ml-2  font-semibold text-xs"
                                    style={{
                                        background: WHEEL_COLOR_CONFIG[row.colorBetted].chipColor,
                                        color: "#fff",
                                        minWidth: 48,
                                        display: "inline-block",
                                        textAlign: "center"
                                    }}
                                >
                                    {WHEEL_COLOR_CONFIG[row.colorBetted].name}
                                </span>
                            </div>
                            <span className=" whitespace-nowrap text-white">Bet : <span className="font-bold">{row.amount}</span></span>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex flex-nowrap text-white">Color Won :
                                <span
                                    className="px-2 py-0.5 rounded-full ml-2  font-semibold text-xs"
                                    style={{
                                        background: WHEEL_COLOR_CONFIG[row.winningColor].chipColor,
                                        color: "#fff",
                                        minWidth: 48,
                                        display: "inline-block",
                                        textAlign: "center"
                                    }}
                                >
                                    {WHEEL_COLOR_CONFIG[row.winningColor].name}
                                </span>
                            </div>
                            <span className=" text-white">Cashout : <span className="font-bold">{row.netProfitLoss > 0 ? `+${row.netProfitLoss}` : row.netProfitLoss}</span></span>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-[#366D51] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#28533D] transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-white px-4 py-2">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg bg-[#366D51] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#28533D] transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

interface BettingHistoryDialogProps {
    children: React.ReactNode;
}

type History = {
    id: number;
    roundId: number;
    amount: number;
    winningColor: WheelColor;
    colorBetted: WheelColor;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
}

const BettingHistoryDialog = ({ children }: BettingHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const { isMobile } = useWindowSize();
    const { data: userGameHistory, refetch, isFetching } = useGetUserGameHistory({ page, roundRecordGameType: RoundRecordGameType.WHEEL_OF_FORTUNE });

    const { history, totalPages } = useMemo(() => {
        const history: History[] = userGameHistory?.data || [];
        const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10);
        return { history, totalPages };
    }, [userGameHistory]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRefresh = () => {
        refetch();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showButton={false} overlayClassName="bg-gradient-to-b from-[rgba(12,21,24,0.6)] via-[rgba(12,21,24,0.6)] to-[rgba(54,109,81,0.6)]" className="max-w-7xl xs:w-[90vw] w-full p-0 border-none bg-transparent backdrop-blur-md h-fit ">
                <div style={{
                    background: 'linear-gradient(0deg, rgba(31, 41, 41, 0.9) 0%, rgba(43, 70, 67, 0.9) 90.29%)',
                }}
                    className="w-full border backdrop-blur-md border-[#5C8983] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center border-b border-[#5C8983] bg-[#366D51] justify-between p-6 pb-4 flex-shrink-0">
                        <div className="flex items-center text-white text-lg font-medium space-x-3">
                            My Bet History
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={isFetching}
                                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-[#28533D] text-white hover:bg-[#1e3d2e] transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={20} className={cn(isFetching && "animate-spin")} />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 flex-1 overflow-hidden flex flex-col">
                        {/* Desktop Table */}
                        {!isMobile && <div className="overflow-x-auto hidden md:block flex-1">
                            <div className="min-w-full text-sm text-left text-white relative overflow-y-auto scrollbar-thin scrollbar-thumb-[#5C8983] scrollbar-track-transparent">
                                {/* Header */}
                                <div className="border-b mb-4 border-[#5C8983]  text-base flex sticky top-0  z-10">
                                    <div className="px-4 py-3 font-semibold flex-1">Date</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Time</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Color Betted</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Win Color</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Bet INR</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Cashout INR</div>
                                </div>
                                {/* Body */}
                                {history.length === 0 && (
                                    <div className="px-4 py-3 text-center">No data found</div>
                                )}
                                <div className="max-h-[60svh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#5C8983] scrollbar-track-transparent">
                                    {history?.map((row, idx) => (
                                        <div
                                            key={idx}
                                            className="text-white flex"
                                        >
                                            <div className={cn("px-4 py-3 flex-1 flex items-center", `${idx % 2 === 0 ? "bg-[#28533D] rounded-l-full" : ""}`)}>{dayjs(row.createdAt).format("DD/MM/YYYY")}</div>
                                            <div className={cn("px-4 py-3 flex-1 flex items-center", `${idx % 2 === 0 ? "bg-[#28533D]" : ""}`)}>{dayjs(row.createdAt).format("HH:mm A")}</div>
                                            <div className={cn("px-4 py-3 flex-1 flex items-center", `${idx % 2 === 0 ? "bg-[#28533D]" : ""}`)}>
                                                <span
                                                    className="px-3 py-1 rounded-full font-semibold"
                                                    style={{
                                                        background: WHEEL_COLOR_CONFIG[row.colorBetted].chipColor,
                                                        color: "#fff",
                                                        minWidth: 60,
                                                        display: "inline-block",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {WHEEL_COLOR_CONFIG[row.colorBetted].name}
                                                </span>
                                            </div>
                                            <div className={cn("px-4 py-3 flex-1 flex items-center", `${idx % 2 === 0 ? "bg-[#28533D]" : ""}`)}>
                                                <span
                                                    className="px-3 py-1 rounded-full font-semibold"
                                                    style={{
                                                        background: WHEEL_COLOR_CONFIG[row.winningColor].chipColor,
                                                        color: "#fff",
                                                        minWidth: 60,
                                                        display: "inline-block",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {WHEEL_COLOR_CONFIG[row.winningColor].name}
                                                </span>
                                            </div>
                                            <div className={cn("px-4 py-3 flex-1 flex items-center", `${idx % 2 === 0 ? "bg-[#28533D]" : ""}`)}>Rs. {row.amount}</div>
                                            <div className={cn("px-4 py-3 flex-1 flex items-center", `${idx % 2 === 0 ? "bg-[#28533D] rounded-r-full" : ""}`)}>
                                                {row.netProfitLoss > 0 ? `+Rs.${row.netProfitLoss}` : row.netProfitLoss < 0 ? `-Rs.${Math.abs(row.netProfitLoss)}` : `Rs.${row.netProfitLoss}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>}
                        {/* Mobile Card List */}
                        {isMobile && <MobileBettingHistory history={history} />}
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BettingHistoryDialog;