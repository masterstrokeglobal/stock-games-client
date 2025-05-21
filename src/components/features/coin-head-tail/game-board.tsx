import { cn } from '@/lib/utils';
import { HeadTailPlacementType } from '@/models/head-tail';
import { RoundRecord } from '@/models/round-record';
import { useCreateHeadTailPlacement } from '@/react-query/head-tail-queries';

export default function CoinFlipGame({ roundRecord, amount, className, children }: { roundRecord: RoundRecord, amount: number, className?: string, children?: React.ReactNode }) {

  const { mutate: createHeadTailPlacement, isPending } = useCreateHeadTailPlacement()

  const handleCardClick = (side: HeadTailPlacementType) => {
    if (isPending) return;
    createHeadTailPlacement({ roundId: roundRecord.id, placement: side, amount })
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full bg-amber-800 p-4 pt-20 rounded-lg bg-center relative ", className)}>
      {children}
      <img src="/images/wodden-board.jpg" alt="wodden-board" className="w-full h-full object-fill absolute top-0 left-0 z-0" />
      <div className="flex w-full max-w-md gap-4 p-4">
        {/* HEAD CARD */}
        <div
          className={`w-1/2 h-64 z-10 rounded-md flex flex-col cursor-pointer transition-all duration-300`}
          onClick={() => handleCardClick(HeadTailPlacementType.HEAD)}
        >
          <div className="bg-amber-500 rounded-t-md p-3 text-center">
            <span className="text-white text-2xl font-bold">HEAD</span>
          </div>
          <div className="bg-amber-100 flex-1 rounded-b-md flex flex-col items-center justify-center p-4 relative">
            <div className="w-20 h-20 rounded-full border-2 border-amber-800 flex items-center justify-center">
              <div className="text-red-600 text-4xl font-bold">M</div>
            </div>
            <div className="mt-4 text-amber-900 font-bold">1:0.7</div>
            <div className="absolute bottom-2 right-2">
              <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* TAIL CARD */}
        <div
          className={`w-1/2 h-64 z-10 rounded-md flex flex-col cursor-pointer transition-all duration-300`}
          onClick={() => handleCardClick(HeadTailPlacementType.TAIL)}
        >
          <div className="bg-green-600 rounded-t-md p-3 text-center">
            <span className="text-white text-2xl font-bold">TAIL</span>
          </div>
          <div className="bg-green-100 flex-1 rounded-b-md flex flex-col items-center justify-center p-4 relative">
            <div className="w-20 h-20 rounded-full border-2 border-amber-800 flex items-center justify-center">
              <div className="text-gray-400 text-4xl font-bold">M</div>
            </div>
            <div className="mt-4 text-amber-900 font-bold">1:0.7</div>
            <div className="absolute bottom-2 right-2">
              <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 text-xs font-bold">x2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}