import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { RoundRecordGameType } from '@/models/round-record';
import { useGetUserGameHistory } from '@/react-query/game-user-queries';
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { COIN_SIDE_CONFIG } from './betting-history';
import { ScrollArea } from "@/components/ui/scroll-area";

// Mobile card component for game history
const MobileGameHistoryCard: React.FC<{
    row: { createdAt: string; winningSide: keyof typeof COIN_SIDE_CONFIG };
}> = ({ row }) => {
    const date = dayjs(row.createdAt);
    return (
        <div
            className="rounded-2xl border overflow-hidden space-y-2 border-[#0074FF] bg-[#004DA9] shadow-md mb-4"
        >
            <div className="flex justify-between items-center px-4 py-2 bg-[#013E8E] mb-2">
                <div className="font-semibold text-white text-base">
                    {date.format("DD/MM/YYYY")}
                </div>
                <div className="text-white text-sm opacity-80">
                    {date.format("hh:mm A")}
                </div>
            </div>
            <div className="flex flex-col gap-2 pb-2 text-sm px-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-nowrap text-white">Winner :
                        <span
                            className="px-2 py-0.5 rounded-full ml-2 font-semibold text-xs border"
                            style={{
                                background: COIN_SIDE_CONFIG[row.winningSide]?.chipColor,
                                color: COIN_SIDE_CONFIG[row.winningSide]?.textColor,
                                borderColor: COIN_SIDE_CONFIG[row.winningSide]?.borderColor,
                                minWidth: 48,
                                display: "inline-block",
                                textAlign: "center"
                            }}
                        >
                            {COIN_SIDE_CONFIG[row.winningSide]?.name}
                        </span>
                    </div>
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

// Pagination component (styled like betting-history)
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; isLoading?: boolean }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="p-2 rounded-lg bg-[#004DA9] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003D87] transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-white px-4 py-2">
                {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Loading...</span>
                ) : (
                    <>Page {currentPage} of {totalPages}</>
                )}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="p-2 rounded-lg bg-[#004DA9] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003D87] transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

const GameHistoryDialog = ({ children }: GameHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const { isMobile } = useWindowSize();
    const { data: userGameHistory, isLoading } = useGetUserGameHistory({ page, roundRecordGameType: RoundRecordGameType.HEAD_TAIL });

    const { history, totalPages } = useMemo(() => {
        const history: History[] = (userGameHistory?.data || []).map((row: any) => ({
            createdAt: row.createdAt,
            winningSide: row.winningSide,
        }));
        const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10) || 1;
        return { history, totalPages };
    }, [userGameHistory]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                showButton={false} overlayClassName="backdrop-blur-md" className=" xs:w-[90vw] max-w-3xl font-phudu w-full p-0 border-none bg-transparent  h-fit ">
                <div style={{
                    background: 'linear-gradient(0deg, #0A023B 0%, #002A5A 90.29%)',
                    boxShadow: '0px 0px 8px 1px rgba(0, 92, 164, 1) inset',

                }}
                    className="w-full border backdrop-blur-md border-[#0074FF] rounded-3xl shadow-2xl overflow-hidden  flex flex-col">
                    {/* Header */}
                    <div className="flex items-center border-b border-[#0074FF] bg-[#004DA9] justify-between p-4 pb-3 flex-shrink-0">
                        <div className="flex items-center text-white md:text-xl text-base font-play font-semibold space-x-3">
                            Game History
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 text-2xl px-2 font-play transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden p-4 flex flex-col">
                        {/* Desktop Table */}
                        {!isMobile && (
                            <div className="overflow-x-auto hidden md:block flex-1">
                                <div className="min-w-full text-sm text-left text-white mt-4 relative overflow-y-auto scrollbar-thin scrollbar-thumb-[#0074FF] scrollbar-track-transparent">
                                    {/* Table Header */}
                                    <div className=" text-base font-play text-[#8EC2FF] rounded-full flex sticky top-0 z-10 bg-[#004DA9]">
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">Date</div>
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">Time</div>
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">WINNER</div>
                                    </div>
                                    {/* Table Body */}
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-40">
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="px-4 py-3 text-center">No data found</div>
                                    ) : (
                                        <ScrollArea scrollThumbClassName="bg-[#4467CC]" type="auto" className="h-[60svh] font-phudu font-light overflow-y-auto">
                                            {history.map((row, idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "text-white flex items-center border-b border-[#0B5AB6]")}>
                                                    <div className="px-4 py-3 flex-[1.2] flex items-center">{dayjs(row.createdAt).format("DD/MM/YYYY")}</div>
                                                    <div className="px-4 py-3 flex-[1.2] flex items-center">{dayjs(row.createdAt).format("hh:mm A")}</div>
                                                    <div className="px-4 py-3 flex-[1.2] flex items-center">
                                                        <span
                                                            className="px-3 py-0.5 rounded-full font-semibold"
                                                            style={{
                                                                background: COIN_SIDE_CONFIG[row.winningSide]?.chipColor,
                                                                color: COIN_SIDE_CONFIG[row.winningSide]?.textColor,
                                                                minWidth: 60,
                                                                display: "inline-block",
                                                                border: "1px solid",
                                                                borderColor: COIN_SIDE_CONFIG[row.winningSide]?.borderColor,
                                                                textAlign: "center"
                                                            }}
                                                        >
                                                            {COIN_SIDE_CONFIG[row.winningSide]?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Mobile Card List */}
                        {isMobile && (
                            <div className="p-4 max-h-[calc(100svh-200px)] overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-40">
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
                        )}
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} isLoading={isLoading} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameHistoryDialog;