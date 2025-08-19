import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameType } from "@/hooks/use-game-type";
import { cn } from "@/lib/utils";
import { RoundRecordGameType } from '@/models/round-record';
import { useGetAllGameHistory } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Loader, RefreshCcw, RefreshCw, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
    return (
        <div className="flex items-center z-10 relative justify-center gap-2 p-2 border-t border-platform-border">
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
    const [gameType] = useGameType();
    const { data: gameHistory, refetch, isFetching } = useGetAllGameHistory({ page, roundRecordGameType: RoundRecordGameType.DERBY , type: gameType});

    const { history, totalPages } = useMemo(() => {
        const history = gameHistory?.rounds || [];
        const totalPages = Math.ceil((gameHistory?.count || 0) / 10);
        return { history, totalPages };
    }, [gameHistory]);

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
            <DialogContent showButton={false} className="max-w-lg xs:w-[95vw] bg-transparent w-full p-0 border-none backdrop-blur-md">
                <div
                    className="w-full game-gradient-card-parent rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    <div className="game-gradient-card md:rounded-sm h-full">
                        {/* Header */}
                        <div className="flex items-center border-b border-game-border-line justify-between px-6 py-4 flex-shrink-0">
                            <div className="flex items-center text-white text-center text-lg flex-1 justify-center font-bold w-full">
                                Game History
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleRefresh}
                                    disabled={isFetching}
                                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-white hover:bg-gray-500/20 transition-colors"
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
                        <ScrollArea className=" h-[400px] flex flex-col">
                            <div className="overflow-x-auto flex-1">
                                <table className="min-w-full text-sm text-left text-white">
                                    <thead className="bg-[#002357] relative">
                                        <div className="gradient-line" />
                                        <tr className="flex">
                                            <th className="p-2 text-sm text-left text-game-secondary rounded-tl-lg flex-1">
                                                Round Id
                                            </th>
                                            <th className="p-2 text-sm text-left text-game-secondary rounded-tl-lg flex-1">
                                                Time
                                            </th>
                                            <th className="p-2 text-sm text-center text-game-secondary flex-1">
                                                Winner
                                            </th>
                                        </tr>
                                        <div className="gradient-line" />
                                    </thead>
                                    <tbody className="text-game-secondary">
                                        {history.length === 0 && !isFetching && (
                                            <tr>
                                                <td colSpan={2} className="p-4 text-center text-white">No data found</td>
                                            </tr>
                                        )}
                                        {isFetching && (
                                            <tr>
                                                <td colSpan={2} className="p-4 text-center text-white">
                                                    <Loader size={20} className="animate-spin mx-auto" />
                                                </td>
                                            </tr>
                                        )}
                                        {history.map((round: any, index: number) => (
                                            <tr key={index} className="flex">
                                                <td className="p-2 text-sm flex-1">
                                                   # {round.id}
                                                </td>
                                                <td className="p-2 text-sm flex-1">
                                                    {dayjs(round.startTime).format("hh:mm A")} 
                                                </td>
                                                <td className="p-2 text-sm flex-1 text-center">
                                                    <span
                                                        className={cn(
                                                            "font-semibold",
                                                            round.winningColor === "red" && "text-red-500",
                                                            round.winningColor === "white" && "text-white",
                                                            round.winningColor === "green" && "text-green-500",
                                                        )}
                                                    >
                                                        {round.winningNumber}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollArea>
                        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameHistoryDialog;