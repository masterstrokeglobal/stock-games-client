import { RankedMarketItem } from "@/hooks/use-leadboard";
import { useLeaderboard } from "@/hooks/use-multi-socket-leaderboard";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot";
import { useGetMyStockJackpotGameRecord } from "@/react-query/game-record-queries";
import { Triangle } from "lucide-react";
import { useMemo } from "react";

const StockCard = ({ stock, className, amount, roundRecord }: { stock?: RankedMarketItem, className?: string, amount?: number, roundRecord?: RoundRecord }) => {
    if (!stock) return null;

    const initialPrice = roundRecord?.getInitialPrice(stock.bitcode as string);

    const price = stock.price ? stock.price : initialPrice;

    return (
        <div className="relative  bg-[#D9D9D9] rounded-xl p-1">
            <div className={cn(
                "w-10 md:w-16 lg:w-20 min-h-14 md:min-h-16 flex flex-col justify-between lg:min-h-20 xl:min-h-24 rounded-lg shadow-lg relative transform  transition-transform cursor-pointer md:p-2 p-1",
                className
            )} style={{ boxShadow: "0px 0px 1.5px 1px #005A7B" }} >
                <div className="h-full flex flex-col items-center justify-center sm:gap-0.5">
                    <span className="font-spacemono text-[8px] md:text-[10px] lg:text-xs uppercase tracking-tighter text-[#005C80] text-center font-bold truncate w-full">{stock.name}</span>
                    <span className={cn(" whitespace-nowrap  font-space-grotesk text-center md:text-[10px] text-[8px]  font-bold truncate w-full", Number(stock.change_percent) >= 0 ? "text-[#519900]" : "text-[#E60004]")}>
                        {stock.currency}
                        {price ? price.toFixed(2) :     "-"}
                    </span>
                    <div className={`text-[8px] md:text-[10px] lg:text-sm font-bold flex items-center gap-0.5 ${Number(stock.change_percent) >= 0 ? "text-[#519900]" : "text-[#E60004]"
                        }`}>
                        {stock.change_percent !== undefined && Number(stock.change_percent) >= 0 ? (
                            <>
                                <Triangle className="md:w-4 md:h-4 w-3 h-3 stroke-green-700 text-[#519900]  fill-[#519900] flex-shrink-0" />
                            </>
                        ) : (
                            <Triangle className="md:w-4 md:h-4 w-3 h-3 stroke-red-700 text-[#E60004] fill-[#E60004] rotate-180 flex-shrink-0" />
                        )}
                    </div>
                </div>
                    <div className=" bg-[#005A7B] self-end border-[#7DB7BB] border-2 w-full text-white font-orbitron md:text-[8px] text-[6px]  text-center mx-auto px-2 py-0.5 rounded-full font-bold shadow-lg">
                        {amount ? `₹${amount}` : "-"}
                    </div>
            </div>


        </div>
    )
}

const StockCardStack = ({ roundRecord, roundRecordWithWinningId }: { roundRecord: RoundRecord, roundRecordWithWinningId: RoundRecord | null }) => {

    const { stocks: marketItems } = useLeaderboard(roundRecord);
    const { data: myStockSlotJackpotGameRecord } = useGetMyStockJackpotGameRecord(roundRecord?.id);

    const bettedMarketItems = useMemo(() => {
        const bettedMarketItems = myStockSlotJackpotGameRecord?.filter((record) => record.placement === StockJackpotPlacementType.HIGH || record.placement === StockJackpotPlacementType.LOW);

        const sortedMarketItems = roundRecordWithWinningId?.sortedMarketItems || marketItems;

        // Group by marketItem.id and placement type
        const groupedBets = bettedMarketItems?.reduce((acc, record) => {
            const key = `${record.marketItem.id}-${record.placement}`;
            if (!acc[key]) {
                acc[key] = {
                    ...record,
                    amount: 0
                };
            }
            acc[key].amount += record.amount;
            return acc;
        }, {} as Record<string, any>);

        // Convert grouped bets back to array and add stock info
        return Object.values(groupedBets || {}).map((record) => ({
            ...record,
            stock: sortedMarketItems?.find((item) => item.id === record.marketItem.id)
        }));
    }, [myStockSlotJackpotGameRecord, marketItems, roundRecordWithWinningId])

    const highStocks = bettedMarketItems?.filter((item) => item.placement === StockJackpotPlacementType.HIGH) || [];
    const lowStocks = bettedMarketItems?.filter((item) => item.placement === StockJackpotPlacementType.LOW) || [];

    return (<div className="absolute p-2 left-1/2 -translate-x-1/2   md:bottom-[calc(40%+1rem)] bottom-[calc(30%+1rem)] z-10 w-full  md:max-w-xl sm:max-w-sm max-w-[280px]  ">
        <div style={{ transform: 'perspective(1000px) rotateX(15deg)' }} className=" origin-center mx-auto flex z-10 gap-2 md:gap-4 h-fit w-full" >
            <div className="flex-1 gap-2 md:gap-4 flex flex-col">
                <div className="flex-1 gap-2 md:gap-4 flex justify-start">
                    {lowStocks.length > 0 ? (
                        lowStocks.map((item) => (
                            <StockCard key={item.id} stock={item.stock} amount={item.amount} roundRecord={roundRecord} />
                        ))
                    ) : (
                        <div className="text-center border border-dashed border-red-600  md:p-2 p-1 text-red-600 font-semibold text-[10px] md:text-sm rounded-lg">No Low stocks selected</div>
                    )}
                </div>
            </div>

            <div className="flex-1 gap-2 md:gap-4 flex flex-col" >
                <div className="flex-1 gap-2 md:gap-4 flex justify-end">
                    {highStocks.length > 0 ? (
                        highStocks.map((item) => (
                            <StockCard key={item.id} stock={item.stock} amount={item.amount} roundRecord={roundRecord} />
                        ))
                    ) : (
                        <div className="text-center text-green-600 text-[10px] md:text-sm border border-dashed border-green-600  font-semibold md:p-2 p-1 rounded-lg">No High stocks selected</div>
                    )}
                </div>
            </div>
        </div>
    </div>
    )
}


export default StockCardStack;