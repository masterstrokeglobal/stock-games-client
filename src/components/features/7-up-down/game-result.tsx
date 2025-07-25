import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { getWinnerSide } from '@/lib/axios/7-up-down-API';
import { cn, INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useGetSevenUpDownRoundResult } from '@/react-query/7-up-down';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import SevenUpDownChip from './chip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const SevenUpDownResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const { data: roundResult, isLoading } = useGetSevenUpDownRoundResult(roundRecordId, true);

  useEffect(() => {
    setShowDialog(open);
  }, [open]);



  const totalPlaced = roundResult?.reduce((total, bet) => {
    return total + bet.amountPlaced;
  }, 0) ?? 0;

  const totalWon = roundResult?.reduce((total, bet) => {
    return total + (bet.isWinner ? bet.amountWon : 0);
  }, 0) ?? 0;

  const totalNetResult = totalWon - totalPlaced;

  console.log(totalPlaced, totalWon, totalNetResult);

  const round = roundResult?.[0]?.round ? new RoundRecord(roundResult[0].round) : null;

  return (
    <Dialog  defaultOpen={showDialog}>
      <DialogContent
        showButton={false}
        className={cn(
          "border-2  border-none h-screen overflow-y-auto overflow-x-hidden max-w-none outline-none flex flex-col sm:justify-center justify-start shadow-none mx-auto p-0",
        )}
        style={{
          background: "radial-gradient(133.68% 74.71% at 55.58% 46.9%, #01144C 0%, #000313 100%)",
          backdropFilter: "blur(3.15px)",
      }}
      >
        <img src="/images/seven-up-down/setting-bg.png" alt="7Up & 7Down" className='absolute sm:top-0 -top-1/4 left-0 w-full h-full opacity-50 object-cover' />
        <img src="/images/seven-up-down/bull.png" alt="Bull" className="absolute z-[11] sm:bottom-0 bottom-16 left-0  -translate-x-1/4 w-auto h-32  sm:h-40 md:h-52 xl:h-64 2xl:h-80" />
        <img src="/images/seven-up-down/bear.png" alt="Bear" className="absolute z-[11] sm:bottom-0 bottom-16 right-0 translate-x-1/4 w-auto h-32  sm:h-40 md:h-52 xl:h-64 2xl:h-80" />

        {
          isLoading && <div className='flex justify-center items-center h-full'>
            <Loader2 className='w-10 h-10 text-white animate-spin' />
          </div>
        }

        {round && roundResult && <section className='sm:h-[80vh] h-full  md:my-auto flex flex-col items-center max-w-3xl w-full mx-auto'>
          <div className="relative rounded-2xl w-full flex flex-col sm:justify-center justify-start mt-12 sm:mt-0 mx-auto flex-1 font-poppins">
            <div
              className="text-center text-white md:text-4xl text-2xl px-6 py-6 font-semibold xl:text-5xl tracking-wide font-poppins mb-2"
              style={{
                textShadow: "0px 2px 8px rgba(255, 222, 33, 0.8), 0px 0px 2px #fff"
              }}
            >
              Result
              <DialogClose className='absolute top-0 right-0 bg-[#517ED4] z-[61] font-play rounded-full  aspect-square sm:size-10 size-8 p-0 flex items-center justify-center border-white text-white focus:ring-0 border'>
                <span
                  className='sm:text-2xl text-lg leading-none  font-light'
                  style={{
                    textShadow: "0px 2px 8px #CDDDFF, 0px 0px 2px #fff"
                  }}
                >
                  x
                </span>
              </DialogClose>
            </div>
            <div className="relative sm:px-0 px-2 w-full mx-auto flex-1 flex flex-col items-center sm:justify-center justify-between sm:pb-0 pb-4 bg-transparent">
              <div className="sm:flex-1 sm:h-fit relative  w-full grid grid-cols-1 grid-rows-1">
                <div className="absolute -rotate-[2deg] z-0 top-0 left-0 w-full h-full rounded-2xl bg-[#517ED4]" />
                <div
                  className={cn(
                    "w-full relative z-10 grid rounded-2xl h-full bg-[linear-gradient(99deg,_#295AB2_0%,_#171E57_100.75%)] shadow-[0px_0px_7.1px_0px_rgba(1,59,177,0.25)_inset] border-2 border-[#295CB5] flex-1 sm:p-6 xs:p-4 p-2 ")}
                >
                  <div className="flex items-start justify-between sm:mb-10 mb-4  rounded-t-2xl">
                    <span className="text-white sm:text-lg text-base font-semibold font-poppins">
                      Round :<span className="text-[#F5C201] md:text-base text-sm font-normal font-poppins">#{round.id}</span>
                    </span>
                    <span className="text-white sm:text-lg text-base font-semibold font-poppins">
                      Time :<span className="text-[#F5C201] md:text-base text-sm font-normal font-poppins">{round.startTime ? dayjs(round.startTime).format("HH:mm A") : "--"}</span>
                    </span>
                  </div>
                  <div className='md:mx-10 '>
                    <div className="grid grid-cols-3 items-center md:text-base sm:text-sm text-xs font-bold font-montserrat uppercase xs:px-4 gap-2 border-b border-[#6FB0FF] text-[#8EC2FF] pb-2 mb-2">
                      <div className="text-left whitespace-nowrap">Selected Side</div>
                      <div className="text-center whitespace-nowrap">Bet INR</div>
                      <div className="text-center whitespace-nowrap">Winner</div>
                    </div>

                    <ScrollArea className='h-[150px]' scrollThumbClassName="bg-[#517ED4]">
                      {
                        roundResult.map((result, index) => {
                          return (
                            <div key={index} className="grid grid-cols-3 text-white font-poppins font-light uppercase xs:px-4 gap-2 sm:text-[15px] text-xs bg-[#355DAE] py-2 rounded-xl mb-2">
                              <div className="text-left"><SevenUpDownChip className='justify-start' side={result.selectedSide} /></div>
                              <div className="text-center">{INR(result.amountPlaced)}</div>
                              <div className="text-center">{<SevenUpDownChip className='justify-center' side={getWinnerSide(result.winner)} />}</div>
                            </div>
                          )
                        })
                      }
                    </ScrollArea>
                  </div>
                  <div className='flex justify-center sm:mb-2 sm:mt-4 h-fit'>
                    <div className='text-center text-lg font-poppins  leading-none xl:text-4xl md:text-3xl font-bold sm:text-2xl xs:text-xl text-white' style={{ textShadow: '0px 0px 9.5px #2A8BFF' }}>
                      Net Result : {INR(totalNetResult)}
                    </div>
                  </div>
                  <NextRound round={round} className='my-2 md:text-3xl h-fit sm:text-2xl xs:text-xl  md:hidden block' />
                </div>
              </div>

              <NextRound round={round} className='my-4 md:my-6  md:text-3xl  sm:text-2xl xs:text-xl  md:flex hidden' />
             
              <DialogClose asChild>
                <button
                  className="w-full self-end  text-white max-w-sm mx-auto py-3 rounded-xl sm:mt-0 mt-4 xl:text-2xl md:text-xl sm:text-lg text-sm font-poppins transition border border-[#6FB0FF]"
                  style={{
                    background: "linear-gradient(0deg, #002067 0%, #00339D 90.29%)",
                  }}
                >
                  PLAY AGAIN
                </button>
              </DialogClose>
            </div>
          </div>
        </section>}
      </DialogContent>
    </Dialog>
  );
};

export default SevenUpDownResultDialog;


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
      className={cn("text-center font-medium text-[#F5C201] font-poppins", className)}
      style={{
        textShadow: "0px 0px 10px #001B50",
      }}
    >
      Next Round starts in {timeLeft.toString().padStart(2, '0')}
    </div>
  );
};


