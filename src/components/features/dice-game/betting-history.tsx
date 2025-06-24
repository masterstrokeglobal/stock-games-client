import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RoundRecordGameType } from '@/models/round-record';
import { useGetUserGameHistory } from '@/react-query/game-user-queries';
import dayjs from "dayjs";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import useWindowSize from "@/hooks/use-window-size";

// Status indicator for Win/Loss
const StatusIndicator = ({ isWinner }: { isWinner: boolean }) => (
    <span
        className={`flex items-center gap-1 font-semibold ${isWinner ? "text-[#00FF85]" : "text-[#FF4B4B]"}`}
    >
        {isWinner ? (
            <>
                <svg width="12" height="12" viewBox="0 0 12 12" className="inline rotate-180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 10L10 4H2L6 10Z" fill="#00FF85" />
                </svg>
                Win
            </>
        ) : (
            <>
                <svg width="12" height="12" viewBox="0 0 12 12" className="inline" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2L2 8H10L6 2Z" fill="#FF4B4B" />
                </svg>
                Lost
            </>
        )}
    </span>
);

// Mobile-specific component for bet history
const MobileBettingHistory = ({ history }: { history: History[] }) => {
    return (
        <div className="flex flex-col gap-4">
            {history.length === 0 && (
                <div className="px-4 py-3 text-center text-white">No data found</div>
            )}
            {history.map((row, idx) => (
                <div
                    key={idx}
                    className="rounded-xl border overflow-hidden border-[#2E3A6A] bg-[#1B1E4B] shadow-md"
                >
                    <div className="flex justify-between items-center px-4 py-2 bg-[#23245A]">
                        <div className="font-semibold text-white text-base">
                            Round #{row.roundId}
                        </div>
                        <button className="text-xs text-[#A3A8D6]">{dayjs(row.createdAt).format("DD/MM/YYYY")}</button>
                    </div>
                    <div className="flex flex-col gap-2 pb-2 text-sm px-4 pt-2">
                        <div className="flex justify-between">
                            <span className="text-[#A3A8D6]">Amount</span>
                            <span className="text-white font-semibold">₹ {row.amount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#A3A8D6]">Dice Result</span>
                            <span className="text-white font-semibold">{row.DiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#A3A8D6]">Status</span>
                            <StatusIndicator isWinner={row.isWinner} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#A3A8D6]">Profit/Loss</span>
                            <span className={`font-semibold ${row.netProfitLoss > 0 ? "text-[#00FF85]" : "text-[#FF4B4B]"}`}>
                                {row.netProfitLoss > 0 ? `+ ₹ ${row.netProfitLoss}` : `- ₹ ${Math.abs(row.netProfitLoss)}`}
                            </span>
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
                className="p-2 rounded-lg bg-[#23245A] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2E3A6A] transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-white px-4 py-2">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg bg-[#23245A] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2E3A6A] transition-colors"
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
    number: number;
    isWinner: boolean;
    createdAt: string;
    DiceNumber: string;
    roundRecordGameType: string;
    netProfitLoss: number
}

const BettingHistoryDialog = ({ children }: BettingHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const { isMobile } = useWindowSize();
    const { data: userGameHistory } = useGetUserGameHistory({ page, roundRecordGameType: RoundRecordGameType.DICE });

    const { history, totalPages } = useMemo(() => {
        const history: History[] = userGameHistory?.data || [];
        const totalPages = Math.ceil((userGameHistory?.countOfGame || 0) / 10);
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
            <DialogContent showButton={false} className="max-w-3xl xs:w-[95vw] bg-[#140538] w-full p-0 border-none  backdrop-blur-md max-h-[80vh]">
                <div
                    style={{
                        background: 'linear-gradient(180deg, #1B1E4B 0%, #23245A 100%)',
                    }}
                    className="w-full border border-[#2E3A6A] rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#2E3A6A] bg-[#140538] justify-between px-6 py-4 flex-shrink-0">
                        <div className="flex items-center text-white text-center text-lg flex-1 justify-center font-bold w-full">
                            Betting History
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className=" py-4 flex-1 px-4 overflow-hidden bg-[#140538] flex flex-col">
                        <ScrollArea className="h-[80vh]">
                            {/* Desktop Table */}
                            {!isMobile && (
                                <div className="overflow-x-auto bg-[#00225F] p-4 hidden md:block flex-1">
                                    <table className="min-w-full text-sm text-left text-white max-h-[60vh] overflow-y-auto">
                                        <thead>
                                            <tr className="bg-[#003883] dice-header text-[#A3A8D6] text-base">
                                                <th className="px-4 py-3 font-semibold ">Round</th>
                                                <th className="px-4 py-3 font-semibold">Amount</th>
                                                <th className="px-4 py-3 font-semibold">Number</th>
                                                <th className="px-4 py-3 font-semibold">Dice Result</th>
                                                <th className="px-4 py-3 font-semibold">Status</th>
                                                <th className="px-4 py-3 font-semibold ">Profit/Loss</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-3 text-center text-white">No data found</td>
                                                </tr>
                                            )}
                                            {history?.map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={`${idx % 2 !== 0 ? "bg-[#6058C533]" : ""}`}
                                                >
                                                    <td className="px-4 py-3 font-semibold text-white">#{row.roundId}</td>
                                                    <td className="px-4 py-3 text-white">₹ {row.amount}</td>
                                                    <td className="px-4 py-3 text-white">{row.number}</td>
                                                    <td className="px-4 py-3 text-white">{row.DiceNumber}</td>
                                                    <td className="px-4 py-3">
                                                        <StatusIndicator isWinner={row.isWinner} />
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold text-right">
                                                        <span className={row.netProfitLoss > 0 ? "text-[#00FF85]" : "text-[#FF4B4B]"}>
                                                            {row.netProfitLoss > 0
                                                                ? `+ ₹ ${row.netProfitLoss}`
                                                                : `- ₹ ${Math.abs(row.netProfitLoss)}`}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {/* Mobile Card List */}
                            {isMobile && <MobileBettingHistory history={history} />}
                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BettingHistoryDialog;