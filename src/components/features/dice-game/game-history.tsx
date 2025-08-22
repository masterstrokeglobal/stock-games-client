import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RoundRecordGameType } from '@/models/round-record';
import dayjs from "dayjs";
import { X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import useWindowSize from "@/hooks/use-window-size";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGameType } from "@/hooks/use-game-type";
import { useGetAllGameHistory } from "@/react-query/round-record-queries";

// Mobile-specific component for game history
const MobileGameHistory = ({ rounds }: { rounds: any[] }) => {
    return (
        <div className="flex flex-col gap-4">
            {rounds.length === 0 && (
                <div className="px-4 py-3 text-center text-white">No data found</div>
            )}
            {rounds.map((round, idx) => (
                <div
                    key={idx}
                    className="rounded-xl border overflow-hidden border-[#2E3A6A] bg-[#1B1E4B] shadow-md"
                >
                    <div className="flex justify-between items-center px-4 py-2 bg-[#23245A]">
                        <div className="font-semibold text-white text-base">
                            Round #{round.id}
                        </div>
                        <div className="text-xs text-[#A3A8D6]">{dayjs(round.createdAt).format("DD/MM/YYYY HH:mm A")}</div>
                    </div>
                    <div className="flex flex-col gap-2 pb-2 text-sm px-4 pt-2">
                        <div className="flex justify-between">
                            <span className="text-[#A3A8D6]">Result</span>
                            <span className="text-white font-bold">{round.sum ?? "N/A"}</span>
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
        <div className="flex items-center z-10 relative justify-center gap-2 mt-4">
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

interface GameHistoryDialogProps {
    children: React.ReactNode;
}

const GameHistoryDialog = ({ children }: GameHistoryDialogProps) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [type] = useGameType();
    const { data, isSuccess, refetch, isFetching } = useGetAllGameHistory({ roundRecordGameType: RoundRecordGameType.DICE, type: type, page: page, limit: 10 });
    const { isMobile } = useWindowSize();

    const totalPages = Math.ceil(data?.count/10) ?? 1;

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showButton={false} className="max-w-3xl xs:w-[95vw] bg-[#140538] w-full p-0 border-none backdrop-blur-md">
                <div
                    style={{
                        background: 'linear-gradient(180deg, #1B1E4B 0%, #23245A 100%)',
                    }}
                    className="w-full border border-[#4061C0] rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#4467CC] bg-[#140538] justify-between px-6 py-4 flex-shrink-0">
                        <div className="flex items-center text-white text-center text-lg flex-1 justify-center font-bold w-full">
                            Game History
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={isFetching}
                                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-[#23245A] text-white hover:bg-[#2E3A6A] transition-colors"
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
                    <div className="py-4 flex-1 relative px-4 overflow-hidden border-x-[1.5rem] border-b-[1.5rem] border-[#140538] flex flex-col">
                        <Image src="/images/dice-game/table-bg.png" alt="dice-1" fill />
                        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-[#520B8E] bg-opacity-30" />
                        <ScrollArea className="h-[60vh] flex flex-col">
                            {/* Desktop Table */}
                            {!isMobile && (
                                <div className="overflow-x-auto flex-1 hidden md:block">
                                    <table className="min-w-full h-full text-sm text-left text-white max-h-[60vh] overflow-y-auto">
                                        <thead className="sticky border-[#4467CC80] bg-[#140538] border-b top-0 py-2">
                                            <tr className="text-game-text text-sm">
                                                <th className="p-2 py-3 text-left text-white">Round Id</th>
                                                <th className="p-2 py-3 text-left text-white">Time</th>
                                                <th className="p-2 py-3 text-right text-white">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isSuccess && data && data.rounds.length > 0 ? (
                                                data.rounds.map((round: any) => (
                                                    <tr
                                                        key={round.id}
                                                        className="border-b last:border-none text-game-secondary border-[#DADCE00D] overflow-hidden"
                                                    >
                                                        <td className="p-2">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-game-secondary text-sm">#{round.id}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <span className="text-game-secondary text-sm">
                                                                {dayjs(round.createdAt).format("DD/MM/YYYY HH:mm A")}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 text-right">
                                                            <div className="text-white font-bold">{round.sum ?? "N/A"}</div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="text-game-secondary text-center py-8">
                                                        No previous rounds available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {/* Mobile Card List */}
                            {isMobile && <MobileGameHistory rounds={data?.rounds ?? []} />}
                        </ScrollArea>
                        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameHistoryDialog;