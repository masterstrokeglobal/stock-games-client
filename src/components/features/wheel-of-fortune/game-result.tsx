import { useGetWheelOfFortuneRoundResult } from '@/react-query/wheel-of-fortune-queries';
import { useMemo } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, X } from "lucide-react";
import { cn, INR } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import TriangleUpGlow from '../common/triangle-up-glow';
import TriangleDownGlow from '../common/triangle-down-glow';
import { WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';

interface GameResultDialogProps {
    open: boolean;
    roundRecordId: number;
}

const WheelOfFortuneResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
    const { data, isLoading, isError } = useGetWheelOfFortuneRoundResult(roundRecordId, open);
    const netProfitLoss = useMemo(() => {
        if (!data) return 0;
        return data.placements.reduce((acc: number, placement: any) => acc + placement.amountWon, 0);
    }, [data]);

    const isWin = netProfitLoss > 0;

    const totalPlaced = useMemo(() => {
        if (!data) return 0;
        return data.placements.reduce((acc: number, placement: any) => acc + placement.amountPlaced, 0);
    }, [data]);

    const netWinning = netProfitLoss - totalPlaced;

    return (
        <Dialog defaultOpen={open}>
            <DialogContent
                showButton={false}
                className={cn(" border-2 shadow-2xl backdrop-blur-md max-w-md mx-auto", isWin ? "border-[#2be37c]" : "border-red-600")}
                style={{
                    boxShadow: "0 0 24px 0 #2be37c80",
                    background: "linear-gradient(299.61deg, rgba(1, 14, 2, 0.8) -20.13%, rgba(48, 63, 61, 0.8) 100.88%)",
                    minWidth: 340,
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-center text-white text-xl font-bold tracking-widest">
                        RESULT
                    </DialogTitle>
                    <DialogClose asChild>
                        <Button variant="ghost" className="absolute bg-transparent border-none top-2 right-2">
                            <X className="size-4 text-white" />
                        </Button>
                    </DialogClose>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-gray-400 text-base">Loading results...</p>
                    </div>
                ) : isError ? (
                    <Alert variant="destructive" className="border-red-600 bg-red-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">
                            Failed to load round results.
                        </AlertDescription>
                    </Alert>
                ) : data && Array.isArray(data.placements) && data.placements.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-2 font-medium border-b border-[#AFE7CC]  text-[#AFE7CC] pb-2">
                            <div className="text-left">COLOR BETTED</div>
                            <div className="text-center">BET INR</div>
                            <div className="text-right">RESULT</div>
                        </div>
                        <div className="space-y-2 mb-6">
                            {data.placements.map((placement: any, idx: number) => {
                                const colorConfig = WHEEL_COLOR_CONFIG[placement.colorBetted as WheelColor];
                                return (
                                    <div className="grid grid-cols-3 gap-2 items-center" key={idx}>
                                        <div className="flex items-center">
                                            <span
                                                style={{
                                                    backgroundColor: colorConfig.actualColor,
                                                }}
                                                className={cn("px-3 py-1 rounded-full text-xs font-bold border border-white/20")}
                                            >
                                                {colorConfig.name}
                                            </span>
                                        </div>
                                        <div className="text-center text-white font-medium">
                                            {INR(placement.amountPlaced, true)}
                                        </div>
                                        <div className="text-right">
                                            {placement.isWinner ? (
                                                <span className="text-green-400 font-bold flex items-center gap-1">
                                                    Won <TriangleUpGlow />
                                                    <span className="font-normal">({INR(placement.amountWon, true)})</span>
                                                </span>
                                            ) : (
                                                <span className="text-red-400 font-bold flex items-center gap-1">
                                                    Loss <TriangleDownGlow />
                                                    <span className="font-normal">({INR(placement.amountWon, true)})</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-center">
                            <div
                                className={cn(
                                    "rounded-lg px-6 py-3 text-center border-2",
                                    netWinning >= 0
                                        ? "bg-[#101c13] border-[#2be37c]"
                                        : "bg-red-900/20 border-red-600"
                                )}
                                style={{
                                    boxShadow: netWinning >= 0
                                        ? "0 0 8px 0 #2be37c80"
                                        : "0 0 8px 0 rgba(239, 68, 68, 0.5)"
                                }}
                            >
                                <span className={cn("block text-lg font-bold tracking-wide", netWinning >= 0 ? "text-[#2be37c]" : "text-red-400")}>
                                    Net Result : {netWinning >= 0 ? (
                                        <span className="text-[#2be37c]">₹ {netWinning}</span>
                                    ) : (
                                        <span className="text-red-400">₹ {Math.abs(netWinning)}</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-base">No results available</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default WheelOfFortuneResultDialog;
