import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RoundRecordGameType } from '@/models/round-record';
import { useGetUserGameHistory } from '@/react-query/game-user-queries';
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { COIN_SIDE_CONFIG } from './betting-history';

// Mobile card component for game history
const MobileGameHistoryCard: React.FC<{
    row: { createdAt: string; winningSide: keyof typeof COIN_SIDE_CONFIG };
}> = ({ row }) => {
    const date = dayjs(row.createdAt);
    return (
        <div
            className="rounded-lg border border-[#0074FF] shadow-xl bg-[#1B2B4A] mb-4 overflow-hidden"
            style={{
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            }}
        >
            <div className="flex justify-between items-center px-4 py-2 bg-[#004DA9]">
                <span className="text-sm text-white font-medium tracking-wide">
                    {date.format("DD/MM/YYYY")}
                </span>
                <span className="text-sm text-white font-medium">
                    {date.format("hh:mm A")}
                </span>
            </div>
            <div className="px-4 py-2 bg-[#11204A] flex items-center justify-between rounded-b-lg">
                <div className="text-white text-sm mr-2">Winner :</div>
                <div
                    className="px-3 py-1 rounded-full font-semibold text-xs border"
                    style={{
                        background: COIN_SIDE_CONFIG[row.winningSide]?.chipColor,
                        color: COIN_SIDE_CONFIG[row.winningSide]?.textColor,
                        borderColor: COIN_SIDE_CONFIG[row.winningSide]?.borderColor,
                        minWidth: 60,
                        display: "inline-block",
                        textAlign: "center"
                    }}
                >
                    {COIN_SIDE_CONFIG[row.winningSide]?.name}
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
    winningSide: keyof typeof COIN_SIDE_CONFIG;
}

const GameHistoryDialog = ({ children }: GameHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const { data: userGameHistory, isLoading } = useGetUserGameHistory({ page, roundRecordGameType: RoundRecordGameType.HEAD_TAIL });

    const { history, totalPages } = useMemo(() => {
        const history: History[] = (userGameHistory?.data || []).map((row: any) => ({
            createdAt: row.createdAt,
            winningSide: row.winningSide,
        }));
        const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10);
        return { history, totalPages };
    }, [userGameHistory]);

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
            <DialogContent
                showButton={false}
                overlayClassName="bg-[#00033D] bg-opacity-70"
                className="max-w-2xl min-h-[400px] w-full p-0 border-none bg-transparent backdrop-blur-md"
            >
                <div
                    style={{
                        background: 'linear-gradient(0deg, #0A023B 0%, #002A5A 90.29%)',
                    }}
                    className="w-full border backdrop-blur-md border-[#0074FF] rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#0074FF] bg-[#004DA9] justify-between p-4 pb-3 flex-shrink-0">
                        <div className="flex items-center text-white text-base font-semibold space-x-3">
                            Game History
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <div className="min-w-full text-sm text-left text-white">
                                {/* Header */}
                                <div className="border-b mb-0 border-[#0074FF] text-base flex bg-[#003D87]">
                                    <div className="px-4 py-3 font-semibold flex-1 text-[#8EC2FF]">Date</div>
                                    <div className="px-4 py-3 font-semibold flex-1 text-[#8EC2FF]">TIME</div>
                                    <div className="px-4 py-3 font-semibold flex-1 text-[#8EC2FF]">WINNER</div>
                                </div>
                                {/* Body with fixed height and scroll */}
                                <div className="h-[260px] overflow-y-auto">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="px-4 py-3 text-center text-white">No data found</div>
                                    ) : (
                                        history.map((row, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "flex items-center",
                                                    idx % 2 === 0 ? "bg-[#11204A]" : "bg-transparent"
                                                )}
                                            >
                                                <div className="px-4 py-3 flex-1 text-white">{dayjs(row.createdAt).format("DD/MM/YYYY")}</div>
                                                <div className="px-4 py-3 flex-1 text-white">{dayjs(row.createdAt).format("hh:mm A")}</div>
                                                <div className="px-4 py-3 flex-1">
                                                    <span
                                                        className="px-3 py-1 rounded-full font-semibold text-xs border"
                                                        style={{
                                                            background: COIN_SIDE_CONFIG[row.winningSide]?.chipColor,
                                                            color: COIN_SIDE_CONFIG[row.winningSide]?.textColor,
                                                            borderColor: COIN_SIDE_CONFIG[row.winningSide]?.borderColor,
                                                            minWidth: 60,
                                                            display: "inline-block",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        {COIN_SIDE_CONFIG[row.winningSide]?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Mobile Cards */}
                        <div className="block sm:hidden p-4">
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
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#0074FF] px-4">
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
                                                : "text-white hover:bg-[#003D87] hover:text-white"
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
                                                : "text-white hover:bg-[#003D87] hover:text-white"
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