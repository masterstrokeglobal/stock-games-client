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
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

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

type CoinSide = keyof typeof COIN_SIDE_CONFIG;

export interface CoinHeadTailHistory {
    id: number;
    roundId: number;
    amount: number;
    winningSide: CoinSide;
    selectedSide: CoinSide;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
}

// Mobile-specific component for bet history
const MobileBettingHistory = ({ history }: { history: CoinHeadTailHistory[] }) => {
    return (
        <div className="flex flex-col gap-4">
            {history.length === 0 && (
                <div className="px-4 py-3 text-center text-white">No data found</div>
            )}
            {history.map((row, idx) => (
                <div
                    key={idx}
                    className="rounded-2xl  border overflow-hidden  space-y-2 border-[#0074FF] bg-[#004DA9] shadow-md"
                >
                    <div className="flex justify-between items-center px-4 py-2 bg-[#013E8E] mb-2">
                        <div className="font-semibold text-white text-base">
                            {dayjs(row.createdAt).format("DD/MM/YYYY")}
                        </div>
                        <div className="text-white text-sm opacity-80">
                            {dayjs(row.createdAt).format("hh:mm A")}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 pb-2 text-sm px-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="text-white flex flex-nowrap">Selected Side :
                                <span
                                    className="px-2 py-0.5 rounded-full ml-2 font-semibold text-xs border"
                                    style={{
                                        background: COIN_SIDE_CONFIG[row.selectedSide]?.chipColor,
                                        color: COIN_SIDE_CONFIG[row.selectedSide]?.textColor,
                                        borderColor: COIN_SIDE_CONFIG[row.selectedSide]?.borderColor,
                                        minWidth: 48,
                                        display: "inline-block",
                                        textAlign: "center"
                                    }}
                                >
                                    {COIN_SIDE_CONFIG[row.selectedSide]?.name}
                                </span>
                            </div>
                            <span className="whitespace-nowrap text-white">Bet : <span className="font-bold">₹ {row.amount}</span></span>
                        </div>
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
                            <span className="text-white">Cashout : <span className="font-bold">{row.netProfitLoss > 0 ? `+₹ ${row.netProfitLoss}` : `₹ ${row.netProfitLoss}`}</span></span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-[#004DA9] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003D87] transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-white px-4 py-2">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg bg-[#004DA9] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003D87] transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

interface BettingHistoryDialogProps {
    children: React.ReactNode;
}

const BettingHistoryDialog = ({ children }: BettingHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const { isMobile } = useWindowSize();
    // Use string for roundRecordGameType to avoid enum error
    const { data: userGameHistory, refetch } = useGetUserGameHistory({ page, roundRecordGameType: RoundRecordGameType.HEAD_TAIL });

    const { history, totalPages } = useMemo(() => {
        const history: CoinHeadTailHistory[] = userGameHistory?.data || [];
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
            <DialogContent showButton={false} overlayClassName="bg-[#00033D] bg-opacity-70" className="max-w-5xl xs:w-[90vw] font-phudu w-full p-0 border-none bg-transparent backdrop-blur-md h-fit ">
                <div style={{
                    background: 'linear-gradient(0deg, #0A023B 0%, #002A5A 90.29%)',
                }}
                    className="w-full border backdrop-blur-md border-[#0074FF] rounded-3xl shadow-2xl overflow-hidden  flex flex-col">
                    {/* Header */}
                    <div className="flex items-center border-b border-[#0074FF] bg-[#004DA9] justify-between p-4 pb-3 flex-shrink-0">
                        <div className="flex items-center text-white text-base font-play font-semibold space-x-3">
                            My Bet History
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                className="p-2 rounded-lg bg-[#004DA9] text-white hover:bg-[#1e3d2e] transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
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
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">SELECTED SIDE</div>
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">WINNER</div>
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">BET INR</div>
                                        <div className="px-4 py-3 font-semibold flex-[1.2]">CASHOUT INR</div>
                                    </div>
                                    {/* Table Body */}
                                    {history.length === 0 && (
                                        <div className="px-4 py-3 text-center">No data found</div>
                                    )}
                                    <div className="max-h-[60svh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0074FF] scrollbar-track-transparent">
                                        {history?.map((row, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "text-white flex items-center border-b border-[#0B5AB6]")}
                                            >
                                                <div className="px-4 py-3 flex-[1.2] flex items-center">{dayjs(row.createdAt).format("DD/MM/YYYY")}</div>
                                                <div className="px-4 py-3 flex-[1.2] flex items-center">{dayjs(row.createdAt).format("hh:mm A")}</div>
                                                <div className="px-4 py-3 flex-[1.2] flex items-center">
                                                    <span
                                                        className="px-3 py-0.5 rounded-full font-semibold"
                                                        style={{
                                                            background: COIN_SIDE_CONFIG[row.selectedSide]?.chipColor,
                                                            color: COIN_SIDE_CONFIG[row.selectedSide]?.textColor,
                                                            minWidth: 60,
                                                            display: "inline-block",
                                                            border: "1px solid",
                                                            borderColor: COIN_SIDE_CONFIG[row.selectedSide]?.borderColor,
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        {COIN_SIDE_CONFIG[row.selectedSide]?.name}
                                                    </span>
                                                </div>
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
                                                <div className="px-4 py-3 flex-[1.2] flex items-center">₹ {row.amount}</div>
                                                <div className="px-4 py-3 flex-[1.2] flex items-center">
                                                    {row.netProfitLoss > 0
                                                        ? `+₹ ${row.netProfitLoss}`
                                                        : row.netProfitLoss < 0
                                                            ? `-₹ ${Math.abs(row.netProfitLoss)}`
                                                            : `₹ ${row.netProfitLoss}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Mobile Card List */}
                        {isMobile && <div className="p-4 max-h-[calc(100svh-200px)] overflow-y-auto"><MobileBettingHistory history={history} /></div>}
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BettingHistoryDialog;