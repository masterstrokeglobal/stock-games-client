import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { cn, INR } from '@/lib/utils';
import { useGetHeadTailRoundResult } from '@/react-query/head-tail-queries';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COIN_SIDE_CONFIG } from './betting-history';
import dayjs from 'dayjs';
import TriangleUpGlow from '../common/triangle-up-glow';
import TriangleDownGlow from '../common/triangle-down-glow';
import { RoundRecord } from '@/models/round-record';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const CoinHeadTailResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const { data: roundResult, isLoading, isError } = useGetHeadTailRoundResult(roundRecordId, open);


  useEffect(() => {
    setShowDialog(open);
  }, [open]);

  // Calculate net result from the round result data
  const netResult = roundResult?.placements.reduce((total, bet) => {
    return total + (bet.isWinner ? bet.amountWon : -bet.amountPlaced);
  }, 0);

  return (
    <Dialog defaultOpen={showDialog}>
      <DialogContent
        showButton={false}
        className={cn(
          "border-2 border-none max-w-2xl shadow-none mx-auto p-0",
          "bg-transparent"
        )}
      >
        {isLoading && (
          <div className="relative rounded-2xl w-full mx-auto font-inter">
            <div className="text-center text-white text-2xl px-6 py-6 font-bold tracking-widest font-play mb-2">
              Loading...
            </div>
          </div>
        )}



        {isError && (

          <div className="relative rounded-2xl w-full mx-auto font-inter">
            <div className="text-center text-white text-2xl px-6 py-6 font-bold tracking-widest font-play mb-2">
              Error loading result
            </div>
          </div>
        )}


        {roundResult && (
          <div className="relative rounded-2xl w-full mx-auto font-inter">
            <div className="text-center text-white text-2xl px-6 py-6 font-bold tracking-widest font-play mb-2">
              Result
              <DialogClose className='absolute top-0 right-0 bg-[#001F65] z-[61] rounded-full p-2 border-[#6FB0FF] focus:ring-0 border'>
                <X className='w-6 h-6 text-white' />
              </DialogClose>
            </div>

            <main className='bg-[#1574F4] border-2 border-[#6FB0FF] rounded-2xl p-0.5'>
              <div className='flex flex-col gap-4 bg-gradient-to-b from-[#001F65] to-[#00309D] border-2 border-[#6FB0FF] rounded-2xl p-4'>
                <div className='bg-[#001B50] rounded-2xl border  w-full border-[#6FB0FF] p-4'>
                  <div className="flex items-center justify-between mb-10  py-2 rounded-t-2xl">
                    <span className="text-white text-lg ">
                      Round <span className="text-[#F5C201] font-normal">: #{roundResult?.round?.id}</span>
                    </span>
                    <span className="text-white text-lg ">
                      Time <span className="text-[#F5C201] font-normal">{roundResult?.round?.startTime ? dayjs(roundResult.round.startTime).format("HH:mm A") : "--"}</span>
                    </span>
                  </div>
                  <div className='md:mx-10 '>
                    <div className="grid grid-cols-3 font-play gap-2 font-medium border-b border-[#8EC2FF] text-[#8EC2FF] pb-2 mb-2">
                      <div className="text-left">Winner</div>
                      <div className="text-center">Bet INR</div>
                      <div className="text-center">Cashout INR</div>
                    </div>
                    <div className="space-y-2 mb-4 font-phudu">
                      {roundResult?.placements.map((bet, idx) => {
                        const config = COIN_SIDE_CONFIG[bet.winningSide as keyof typeof COIN_SIDE_CONFIG];
                        return (
                          <div className="grid grid-cols-3 gap-2 items-center" key={idx}>
                            {/* Winner Side */}
                            <div className="flex items-center">
                              <span
                                style={{
                                  backgroundColor: config.chipColor,
                                  color: config.textColor,
                                  border: `2px solid ${config.borderColor}`,
                                }}
                                className={cn(
                                  "px-4 py-1 rounded-full text-base font-bold shadow uppercase",
                                  "min-w-[80px] flex items-center justify-center"
                                )}
                              >
                                {config.name}
                              </span>
                            </div>
                            {/* Bet INR */}
                            <div className="text-center text-white font-medium text-base">
                              {INR(bet.amountPlaced, true)}
                            </div>
                            {/* Cashout INR */}
                            <div className={cn(
                              "text-center font-bold flex items-end justify-center  gap-1 text-base",
                              bet.isWinner ? "text-green-400" : "text-red-500"
                            )}>
                              {bet.isWinner ? (
                                <>
                                  <span className="font-semibold tracking-wide">WON</span>
                                  <TriangleUpGlow />
                                  <span className="font-normal">
                                    (+ {INR(bet.amountWon, true)})
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="font-bold">LOSS</span>
                                  <TriangleDownGlow />
                                  <span className="font-normal">
                                    ({INR(bet.amountWon, true)})
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className='flex justify-center mb-2 mt-16'>
                    <div className='text-center text-lg font-phudu xl:text-4xl md:text-3xl font-bold sm:text-2xl xs:text-xl text-white' style={{ textShadow: '0px 0px 9.5px #2A8BFF' }}>
                      NET RESULT : ₹ {Math.abs(netResult ?? 0)}
                    </div>
                  </div>
                  <PriceLocked round={roundResult?.round} className='mt-4' />
                </div>
                <NextRound round={roundResult?.round} className='text-center xl:text-3xl md:text-2xl sm:text-xl xs:text-lg font-play font-semibold' />
              </div>
            </main>

            <div className='flex justify-center w-full'>
              <button
                className="w-full mt-4 text-white max-w-sm mx-auto py-3 rounded-xl text-lg font-play transition border border-[#6FB0FF]"
                style={{
                  background: "linear-gradient(0deg, #002067 0%, #00339D 90.29%)",
                  textShadow: "0px 0px 5px rgba(255, 255, 255, 1)",
                }}
                onClick={() => setShowDialog(false)}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CoinHeadTailResultDialog;


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
      className={cn("text-center text-[#F5C201]", className)}
      style={{
        textShadow: "0px 0px 10px #001B50",
      }}
    >
      Next Round starts in {timeLeft.toString().padStart(2, '0')}
    </div>
  );
};


const PriceLocked = ({ className, round }: { className?: string, round?: RoundRecord }) => {

  const finalValues = round?.finalDifferences;

  const keys = Object.keys(finalValues ?? {});

  const priceLocked = keys.map((key) => {
    return `${key}: ${finalValues?.[key]}`;
  }).join("  |  ");

  return (
    <div
      className={cn("text-center text-[#F5C201] ", className)}
      style={{
        textShadow: "0px 0px 10px #001B50",
      }}
    >
      Price Locked: {priceLocked}
    </div>
  );
};