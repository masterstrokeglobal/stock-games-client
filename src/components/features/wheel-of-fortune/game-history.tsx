import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useGameType } from "@/hooks/use-game-type";
import { cn } from "@/lib/utils";
import { RoundRecordGameType, WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { useGetAllGameHistory } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Mobile card component for game history
const MobileGameHistoryCard: React.FC<{
    row: { createdAt: string; winningColor: WheelColor };
}> = ({ row }) => {
    const date = dayjs(row.createdAt);
    return (
        <div
            className="rounded-lg border border-[#5C8983] shadow-xl bg-[#223C38] mb-4 overflow-hidden"
            style={{
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            }}
        >
            <div className="flex justify-between items-center px-4 py-2 bg-[#26302F]">
                <span className="text-sm text-white font-medium tracking-wide">
                    {date.format("DD/MM/YYYY")}
                </span>
                <span className="text-sm text-white font-medium">
                    {date.format("dddd")}
                </span>
            </div>
            <div className="px-4 py-2 bg-[#28533D] flex items-center  justify-between rounded-b-lg">
                <div     className="text-white text-sm mr-2">Winning color :</div>
                <div
                    className="px-3 py-1 rounded-full font-semibold text-xs"
                    style={{
                        background: WHEEL_COLOR_CONFIG[row.winningColor].actualColor,
                        color: "#fff",
                        minWidth: 48,
                        display: "inline-block",
                        textAlign: "center"
                    }}
                >
                    {WHEEL_COLOR_CONFIG[row.winningColor].name}
                </div>
            </div>
        </div>
    );
};

interface GameHistoryDialogProps {
    children: React.ReactNode;
}

type History = {
    createdAt: string;
    winningColor: WheelColor;
}

const GameHistoryDialog = ({ children }: GameHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [gameType] = useGameType()
    const { data: allGameHistory, isLoading } = useGetAllGameHistory({ roundRecordGameType: RoundRecordGameType.WHEEL_OF_FORTUNE, type: gameType, page: 1, limit: 10 });
    const { history, totalPages } = useMemo(() => {
        const history: History[] = allGameHistory?.rounds || [];
        const totalPages = Math.ceil(allGameHistory?.count / 10);
        return { history, totalPages };
    }, [allGameHistory]);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showButton={false} overlayClassName="bg-gradient-to-b from-[rgba(12,21,24,0.6)] via-[rgba(12,21,24,0.6)] to-[rgba(54,109,81,0.6)]" className="max-w-4xl min-h-[500px] w-full p-0 border-none bg-transparent backdrop-blur-md ">
                <div style={{
                    background: 'linear-gradient(0deg, rgba(31, 41, 41, 0.9) 0%, rgba(43, 70, 67, 0.9) 90.29%)',
                }}
                    className="w-full border backdrop-blur-md border-[#5C8983] rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center border-b border-[#5C8983] bg-[#366D51] justify-between p-6 pb-4">
                        <div className="flex items-center text-white text-lg font-medium space-x-3">
                            Game History
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6">
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <div className="min-w-full text-sm text-left text-white">
                                {/* Header */}
                                <div className="border-b mb-4 border-[#5C8983] text-base flex">
                                    <div className="px-4 py-3 font-semibold flex-1">Date</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Time</div>
                                    <div className="px-4 py-3 font-semibold flex-1">Win Color</div>
                                </div>
                                {/* Body with fixed height and scroll */}
                                <div className="h-[300px] overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="px-4 py-3 text-center">No data found</div>
                                    ) : (
                                        history?.map((row, idx) => (
                                            <div
                                                key={idx}
                                                className="text-white flex"
                                            >
                                                <div className={cn("px-4 py-3 flex-1", `${idx % 2 === 0 ? "bg-[#28533D] rounded-l-full flex items-center " : ""}`)}>{dayjs(row.createdAt).format("DD/MM/YYYY")}</div>
                                                <div className={cn("px-4 py-3 flex-1", `${idx % 2 === 0 ? "bg-[#28533D] flex items-center " : ""}`)}>{dayjs(row.createdAt).format("HH:mm A")}</div>
                                                <div className={cn("px-4 py-3 flex-1", `${idx % 2 === 0 ? "bg-[#28533D] rounded-r-full flex items-center" : ""}`)}>
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
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Cards */}
                        <div className="block sm:hidden">
                            <div className="h-[340px] overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    </div>
                                ) : history.length === 0 ? (
                                    <div className="px-4 py-3 text-center text-white">No data found</div>
                                ) : (
                                    history.map((row, idx) => (
                                        <MobileGameHistoryCard key={idx} row={row} />
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Pagination - Always show if there's data or loading */}
                        {(totalPages > 1 || isLoading) && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#5C8983]">
                                <div className="text-white text-sm">
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        `Page ${page} of ${totalPages}`
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={page <= 1 || isLoading}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                            page <= 1 || isLoading
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-white hover:bg-[#28533D] hover:text-white"
                                        )}
                                    >
                                        <ChevronLeft size={16} className="mr-1" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={page >= totalPages || isLoading}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                            page >= totalPages || isLoading
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-white hover:bg-[#28533D] hover:text-white"
                                        )}
                                    >
                                        Next
                                        <ChevronRight size={16} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameHistoryDialog;