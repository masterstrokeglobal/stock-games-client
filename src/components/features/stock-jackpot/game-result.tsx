import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SkewedButton } from '@/components/ui/skew-button';
import { cn, INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useGetStockJackpotRoundResult } from '@/react-query/game-record-queries';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    open: boolean;
    roundRecordId: number;
}

const JackpotResultDialog = ({ open, roundRecordId }: Props) => {
    const { data: roundResult, isLoading } = useGetStockJackpotRoundResult(roundRecordId, open);

    const [isOpen, setIsOpen] = useState(open);

    useEffect(()=>{
      const timeout = setTimeout(() => {
        setIsOpen(open);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      }
    },[open])

    // Defensive fallback if roundResult is not loaded yet
    const placements = roundResult?.placements ?? [];
    const round = roundResult?.round ?? null;

    // Calculate totals
    const grossProfit = placements.reduce((total, bet) => total + (bet.netProfitLoss > 0 ? bet.netProfitLoss : 0), 0);
    const totalPlaced = placements.reduce((total, bet) => total + (bet.amount), 0);

    const totalNetResult = grossProfit - totalPlaced;
    // Use round info if available, otherwise fallback to first placement
    const roundId = round?.id ?? (placements[0]?.roundId ?? "--");
    const roundStartTime = round?.createdAt ?? (placements[0]?.createdAt ?? null);

    return (
        <Dialog  defaultOpen={isOpen}>
            <DialogContent
                showButton={false}
                className={cn(
                    "h-screen overflow-y-auto bg-transparent rounded-none border-none ring-0 w-full focus:border-none  overflow-x-hidden max-w-none outline-none flex flex-col justify-center items-center mx-auto p-0"
                )}
            >
                <img src='/images/jackpot/bg.png' className='absolute w-full h-full' />
                <div className='w-full h-full bg-black/40 backdrop-blur absolute' />
                <img src='/images/jackpot/result-bg.png' className='absolute w-full h-full' />
                <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="w-full flex flex-col items-center">
                        <div
                            className="text-center text-white font-normal sm:text-3xl text-2xl font-audiowale xl:text-4xl  tracking-wide mb-4"
                        >
                            Result
                        </div>
                        <div className="w-full flex flex-col font-spacemono items-center">
                            <div className="w-full max-w-2xl px-4 mx-auto">
                                <div
                                    className="rounded-3xl w-full border-[#50D8F2] md:border-[6px] border-[4px] mx-auto p-0"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(116, 245, 255, 0.6) 0%, rgba(0, 150, 162, 0.6) 100%)",
                                        boxShadow: "0px 0px 24px 0px #51C5CD, 0px 0px 48px 0px rgba(81, 197, 205, 0.5)",
                                    }}
                                >
                                    <div className="flex items-center font-orbitron justify-between px-4 pt-6 pb-2">
                                        <span
                                            className="text-[#00586E] lg:text-[17px] text-base font-semibold"
                                        >
                                            Round: <span className="text-white lg:text-[15px] text-sm font-medium font-space-grotesk">#{roundId ?? "--"}</span>
                                        </span>
                                        <span
                                            className="text-[#00586E] lg:text-[17px] text-base font-semibold"
                                        >
                                            Time: <span className="text-white lg:text-[15px] text-sm font-medium font-space-grotesk">{roundStartTime ? dayjs(roundStartTime).format("hh:mm A") : "--"}</span>
                                        </span>
                                    </div>
                                    <div className="px-4 pb-4">
                                        <div className="grid grid-cols-3 items-center sm:text-base text-xs text-white px-4 font-orbitron font-semibold uppercase bg-[#007E9F99]   rounded-full py-2 mb-2">
                                            <div className="text-left whitespace-nowrap">BETTED ON</div>
                                            <div className="text-center whitespace-nowrap">BET INR</div>
                                            <div className="text-center whitespace-nowrap">CASHOUT INR</div>
                                        </div>
                                        {isLoading ? (
                                            <div className="flex justify-center items-center h-32">
                                                <Loader2 className="w-10 h-10 text-[#50D8F2] animate-spin" />
                                            </div>
                                        ) : (
                                            <ScrollArea className="h-[180px]" scrollThumbClassName="bg-[#50D8F2]">
                                                {placements.length > 0 ? (
                                                    placements.map((result, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="grid grid-cols-3 px-4 font-space-grotesk items-center text-[#C2F2FF] font-medium sm:text-sm text-xs py-1 rounded-xl mb-2"
                                                        >
                                                            <div className="text-left pl-2">{result.placement?.toUpperCase() ?? "--"}</div>
                                                            <div className="text-center">{INR(result.amount)}</div>
                                                            <div className="text-center">{INR(result.netProfitLoss > 0 ? result.netProfitLoss : 0)}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-[#88DCEE] py-8 font-audiowale">
                                                        No bets placed.
                                                    </div>
                                                )}
                                            </ScrollArea>
                                        )}
                                        <div className="grid grid-cols-3 text-white sm:text-sm text-xs  px-4 font-space-grotesk  border-t py-2 border-gray-200">
                                            <span
                                                className=" font-audiowale">
                                                Total :
                                            </span>
                                            <span className="pl-2 text-center">{INR(totalPlaced, true)}</span>
                                            <span className='font-orbitron font-semibold text-center'>{INR(grossProfit)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="text-center sm:text-2xl text-xl md:text-[28px] font-normal text-white font-audiowale">
                                            Net Result : {INR(totalNetResult)}
                                        </div>
                                    </div>
                                </div>
                                <NextRound round={round ?? undefined} className="my-4" />
                            </div>
                            <div className="flex w-full max-w-40 justify-center gap-6 ">
                                <DialogClose asChild>
                                    <SkewedButton
                                        size="md"
                                        skew="right"
                                        variant="red"
                                        className='flex-1 cursor-pointer'
                                    >
                                        Quit
                                    </SkewedButton>
                                </DialogClose>
                                <DialogClose asChild>
                                    <SkewedButton
                                        size="md"
                                        skew="left"
                                        variant="green"
                                        className="flex-1 cursor-pointer"
                                    >
                                        Play
                                    </SkewedButton>
                                </DialogClose>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JackpotResultDialog;

const NextRound = ({ round, className }: { round?: RoundRecord, className?: string }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        if (!round?.endTime) return;

        const calculateTimeLeft = () => {
            const endTime = new Date(round.endTime);
            const now = new Date();
            // Add 10 seconds to the end time
            const nextRoundStartTime = endTime.getTime() + 10000;
            const timeUntilNextRound = nextRoundStartTime - now.getTime();
            if (timeUntilNextRound <= 0) {
                setTimeLeft(0);
                return;
            }
            const secondsLeft = Math.ceil(timeUntilNextRound / 1000);
            setTimeLeft(secondsLeft);
        };

        // Calculate initial time
        calculateTimeLeft();

        const timer = setInterval(() => {
            calculateTimeLeft();
        }, 1000);

        return () => clearInterval(timer);
    }, [round?.endTime]);

    return (
        <div
            className={cn("text-center font-medium text-[#86EBFF]  font-orbitron md:text-xl sm:text-lg ", className)}
            style={{
                textShadow: "0px 0px 10px #001B50",
            }}
        >
            Next Round starts in {timeLeft.toString().padStart(2, '0')}
        </div>
    );
};

