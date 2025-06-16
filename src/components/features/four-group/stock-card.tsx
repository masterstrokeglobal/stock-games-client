import { RankedMarketItem } from "@/hooks/use-leadboard";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { SinglePlayerGamePlacement } from "@/models/singleplayer-game-placement";
import { useGetMyCurrentPlacement } from "@/react-query/game-record-queries";
import { Triangle } from "lucide-react";
import { useMemo } from "react";

const StockCard = ({ stock, className, amount }: { stock?: RankedMarketItem, className?: string, amount?: number }) => {
    if (!stock) return null;
    return (
        <div className="relative w-fit">
            <div className={cn(
                "w-10 md:w-16 lg:w-20 h-14 md:h-16 lg:h-20 bg-white rounded-lg shadow-lg relative transform hover:scale-105 transition-transform cursor-pointer md:p-2 p-1",
                className
            )} style={{ background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)' }}>
                <div className="h-full flex flex-col items-center justify-center gap-1">
                    <span className="text-black text-[8px] md:text-[10px] lg:text-xs font-bold truncate w-full">{stock.name}</span>

                    <span className={cn("text-black md:text-xs text-[8px] whitespace-nowrap font-bold line-clamp-2 w-full", Number(stock.change_percent) >= 0 ? "text-green-600" : "text-red-600")}>
                        {stock.currency} <br /> {stock.price}
                    </span>
                    <div className={`text-[8px] md:text-[10px] lg:text-sm font-bold flex items-center gap-0.5 ${Number(stock.change_percent) >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                        {Number(stock.change_percent) >= 0 ? (
                            <>
                                <Triangle className="md:w-4 md:h-4 w-3 h-3 text-green-600 fill-green-600 flex-shrink-0" />
                            </>
                        ) : (
                            <Triangle className="md:w-4 md:h-4 w-3 h-3 text-red-600 fill-red-600 rotate-180 flex-shrink-0" />
                        )}
                    </div>
                </div>
            </div>
            {amount && (
                <div className=" bg-amber-500 text-white text-[8px] md:text-xs  text-center w-fit mx-auto px-2 py-0.5 rounded-full font-bold shadow-lg">
                    ₹{amount}
                </div>
            )}
        </div>
    )
}

const StockCardStack = ({ roundRecord, className, marketItems, order = "desc" }: { roundRecord: RoundRecord, className?: string, marketItems: RankedMarketItem[] , order?: "asc" | "desc"}) => {
    const { data, isSuccess } = useGetMyCurrentPlacement(roundRecord.id!.toString());

    const bettedMarketItems = useMemo(() => {
        if (!isSuccess) return [];
        const gameRecords: SinglePlayerGamePlacement[] = data.data.placement ? data.data.placement.map((placement: any) => new SinglePlayerGamePlacement(placement)) : [];

        if (gameRecords.length === 0) return [];
        return gameRecords;
    }, [data]);

    // Sort market items by change percent
    const sortedStocks = useMemo(() => {
        return [...marketItems].sort((a, b) => order === "asc" ? Number(a.change_percent) - Number(b.change_percent) : Number(b.change_percent) - Number(a.change_percent));
    }, [marketItems]);

    // Get top 4 stocks
    const topStocks = sortedStocks.slice(0, 4);

    return (
        <div className={cn("p-2 z-20 w-full md:max-w-xl sm:max-w-sm max-w-[280px]", className)}>
            <div style={{ transform: 'perspective(1000px) rotateX(15deg)' }} className="origin-center mx-auto flex md:items-start items-center z-10 gap-2 md:gap-4 h-fit w-full">
                {/* Single bet display */}
                <div className="w-full">
                    <div className="flex flex-col gap-2">
                        <div className="text-center font-bold text-xs md:text-sm">YOUR BETS</div>
                        {bettedMarketItems.length > 0 ? (
                            <div className="flex justify-center gap-2">
                                {
                                    bettedMarketItems.map((bet) => (

                                        <StockCard
                                            key={bet.id}
                                            stock={marketItems.find(item => item.id === bet.marketItem?.id)}
                                            amount={bet.amount}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center border border-dashed border-gray-400 p-2 text-gray-400 text-xs md:text-sm rounded-lg">No stocks selected</div>
                        )}
                    </div>

                </div>
                <div className="w-full md:block hidden">
                    <table className="w-full backdrop-blur-sm rounded-lg overflow-hidden border border-amber-500/30">
                        <tbody>
                            {topStocks.map((stock, index) => (
                                <tr key={stock.id} className="border-t border-white/10">
                                    <td className="p-1.5 text-[0.6rem] flex flex-col">
                                        <span
                                            className="line-clamp-1 text-white"
                                            style={{
                                                fontSize: "clamp(8px, 1.2vw, 0.9rem)",
                                                fontWeight: "700",
                                                letterSpacing: "0.08em",
                                                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            {stock.name}
                                        </span>
                                        <span className={cn("md:text-[10px] text-[8px] flex items-center whitespace-nowrap gap-1")}>{stock.currency} {stock.price ?? roundRecord.getInitialPrice(stock.bitcode?.toLocaleLowerCase() ?? "")}
                                            {Number(stock.change_percent) >= 0 ? (
                                                <Triangle className="md:w-3 md:h-3 w-2 h-2 text-green-600 fill-green-600 flex-shrink-0" />
                                            ) : (
                                                <Triangle className="md:w-3 md:h-3 w-2 h-2 text-red-600 fill-red-600 rotate-180 flex-shrink-0" />
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-1.5 text-[0.6rem]">
                                        <span
                                            className="whitespace-nowrap"
                                            style={{
                                                fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
                                                fontWeight: "700",
                                                letterSpacing: "0.08em",
                                                background: "linear-gradient(to bottom, #F5DEB3, #D2B48C)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                color: "transparent",
                                                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            { index + 1 }.  { order === "asc" ? ['Mario', 'Walter', 'Romeo', 'Akbar'][index] : ['Akbar', 'Romeo', 'Walter', 'Mario'][index]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody >
                    </table>
                </div>

            </div>
        </div>
    );
};

export const StockCardStackMobile = ({ roundRecord, className, marketItems, order = "desc" }: { roundRecord: RoundRecord, className?: string, marketItems: RankedMarketItem[] , order?: "asc" | "desc"}) => {

    // Sort market items by change percent
    const sortedStocks = useMemo(() => {
        return [...marketItems].sort((a, b) => order === "asc" ? Number(a.change_percent) - Number(b.change_percent) : Number(b.change_percent) - Number(a.change_percent));
    }, [marketItems]);

    // Get top 4 stocks
    const topStocks = sortedStocks.slice(0, 4);
    return (
        <table className={cn("w-fit backdrop-blur-sm rounded-lg overflow-hidden bg-black/50 border border-amber-500/30", className)}>
            <tbody>
                {topStocks.map((stock, index) => (
                    <tr key={stock.id} className="border-t border-white/10">
                        <td className="p-1.5 text-[0.6rem] flex flex-col">
                            <span
                                className="line-clamp-1 text-white"
                                style={{
                                    fontSize: "clamp(8px, 1.2vw, 0.9rem)",
                                    fontWeight: "700",
                                    letterSpacing: "0.08em",
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                                }}
                            >
                                {stock.name}
                            </span>
                            <span className={cn("md:text-[10px] text-[8px] flex items-center whitespace-nowrap gap-1")}>{stock.currency} {stock.price ?? roundRecord.getInitialPrice(stock.bitcode?.toLocaleLowerCase() ?? "")}
                                {Number(stock.change_percent) >= 0 ? (
                                    <Triangle className="md:w-3 md:h-3 w-2 h-2 text-green-600 fill-green-600 flex-shrink-0" />
                                ) : (
                                    <Triangle className="md:w-3 md:h-3 w-2 h-2 text-red-600 fill-red-600 rotate-180 flex-shrink-0" />
                                )}
                            </span>
                        </td>
                        <td className="p-1.5 text-[0.6rem]">
                            <span
                                className="whitespace-nowrap"
                                style={{
                                    fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
                                    fontWeight: "700",
                                    letterSpacing: "0.08em",
                                    background: "linear-gradient(to bottom, #F5DEB3, #D2B48C)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                                }}
                            >
                                {index + 1}.  { order === "desc" ? ['Akbar', 'Romeo', 'Walter', 'Mario'][index] : ['Mario', 'Walter', 'Romeo', 'Akbar'][index]}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody >
        </table>
    )
};

export default StockCardStack;