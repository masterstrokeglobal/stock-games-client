import { useGameType, useStockSelectorAviator } from "@/hooks/use-market-selector";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import GameLoadingScreen from "./game-loading-screen";
import useAviator from "@/hooks/use-aviator";
import { useEffect } from "react";
import { SchedulerType } from "@/models/market-item";

type MarketSelectorProps = {
    title: string;
    roundRecord?: RoundRecord;
    className?: string;
    token: string;
}

const MarketSelector = ({ title, className, roundRecord, token }: MarketSelectorProps) => {
    const { setStockSelectedAviator } = useStockSelectorAviator();

    const handleMarketSelection = (stock: string) => {
        setStockSelectedAviator(stock);
    }

    const {gameType} = useGameType();
    const { planeStatus } = useAviator({
        type: gameType,
        token: token,
        roundRecord: roundRecord! 
    });

    useEffect(() => {
        console.log("🛩️ planeStatus:", planeStatus);
        if (planeStatus) {
            console.log("🛩️ planeStatus entries:", Array.from(planeStatus.entries()));
        }
    }, [planeStatus]);


    if (roundRecord == null) return <GameLoadingScreen />

    return (
        <div
            className={cn("min-h-screen flex flex-col items-center justify-center p-4", className)}
            style={{
                background: 'radial-gradient(ellipse at center, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
                backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(135,206,235,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(25,118,210,0.2) 0%, transparent 50%)
                `
            }}
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg mb-4">
                    <span className="text-4xl">✈️</span>
                </div>
                <h1 className="text-4xl font-bold text-blue-100 mb-2 drop-shadow-lg">
                    {title}
                </h1>
                <p className="text-blue-200/80">Select your aircraft for the journey</p>
            </div>

            <ul className="grid grid-cols-1  gap-6 max-w-6xl w-full">
                {roundRecord.market.map((market, index) => {
                    const codeToCheck = gameType === SchedulerType.CRYPTO ? market.code : market.codeName;
                    const status = planeStatus?.get(codeToCheck ?? "")?.status;
                    const isDisabled = status !== "active";
                    
                    return (
                    <li
                        key={market.id}
                        className={cn(
                            "relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer transform",
                            "border-2 border-blue-400/30 backdrop-blur-sm group",
                            isDisabled 
                                ? "opacity-50 cursor-not-allowed grayscale" 
                                : "hover:scale-105 hover:-rotate-2"
                        )}
                        onClick={() => !isDisabled && market.id ? handleMarketSelection(market.id.toString()) : null}
                        style={{
                            background: isDisabled 
                                ? 'linear-gradient(135deg, rgba(100,100,100,0.9) 0%, rgba(60,60,60,0.9) 100%)'
                                : 'linear-gradient(135deg, rgba(25,118,210,0.9) 0%, rgba(13,71,161,0.9) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                    >
                        <div className="p-6 h-48 flex flex-col justify-between relative overflow-hidden">
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                                        {index % 3 === 0 ? "🛩️" : index % 3 === 1 ? "✈️" : "🚀"}
                                    </div>
                                    <h3 className="text-2xl font-bold text-blue-100 mb-1">
                                        {market.name}
                                    </h3>
                                    <p className="text-blue-200/70 text-sm">
                                        Flight Code: {gameType === SchedulerType.CRYPTO ? market.code : market.codeName} 
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between z-10">
                                <div className="bg-blue-900/40 rounded-lg px-3 py-1">
                                    <span className="text-blue-100/80 text-sm">
                                        {(() => {
                                            if (status === "active") return "Flying";
                                            if (status === "crashed") return "Crashed";
                                            if (status === "flew_away") return "Flew Away";
                                            return "Preparing for takeoff";
                                        })()}
                                    </span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>

                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:translate-y-[-4rem] transition-transform duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 group-hover:translate-y-8 transition-transform duration-500"></div>
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
                    </li>
                );
                })}
            </ul>

            {roundRecord.market.length === 0 && (
                <div className="text-center py-12 bg-blue-900/50 rounded-xl px-8">
                    <div className="text-4xl mb-4">🚫</div>
                    <div className="text-blue-100 text-lg mb-2">No aircraft available</div>
                    <div className="text-blue-200/60 text-sm">Please check back later for available flights</div>
                </div>
            )}
        </div>
    );
};

export default MarketSelector;