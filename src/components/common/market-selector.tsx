import { useAuthStore } from "@/context/auth-context";
import { useGameType, useMarketSelector } from "@/hooks/use-market-selector";
import useNSEAvailable from "@/hooks/use-nse-available";
import useUSAMarketAvailable from "@/hooks/use-usa-available";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import User from "@/models/user";
import { RoundRecordGameType } from "@/models/round-record";
import useSchedularCheck from "@/hooks/use-schedular-check";

type MarketSelectorProps = {
    title: string;
    className?: string;
    variant?: 'aviator' | 'all';
    roundRecordType?: RoundRecordGameType;
}

const MarketSelector = ({ title = "STOCK SLOT MARKET", className, roundRecordType = RoundRecordGameType.DERBY }: MarketSelectorProps) => {
    const isNSEAvailable = useNSEAvailable();
    const isUSAMarketAvailable = useUSAMarketAvailable();

    const { setMarketSelected } = useMarketSelector();
    const { schedulerStatus } = useSchedularCheck();
    const { setGameType } = useGameType();

    const { userDetails } = useAuthStore();

    const currentUser = userDetails as User;
    const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
    const isCryptoAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO);
    const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);

    const handleMarketSelection = (market: SchedulerType) => {
        setGameType(market);
        setMarketSelected(true);
    }

    const isMCXAllowed = roundRecordType === RoundRecordGameType.HEAD_TAIL;

    const markets = [
        {
            id: SchedulerType.NSE,
            title: "NSE",
            subtitle: "National Stock Exchange",
            available: isNSEAvailable && schedulerStatus[SchedulerType.NSE],
            allowed: isNSEAllowed,
            color: "from-blue-400 to-blue-600",
            icon: "📈"
        },
        {
            id: SchedulerType.CRYPTO,
            title: "CRYPTO",
            subtitle: "Digital Currency",
            available: schedulerStatus[SchedulerType.CRYPTO],
            allowed: RoundRecordGameType.SEVEN_UP_DOWN == roundRecordType ? false : isCryptoAllowed,
            color: "from-orange-400 to-red-500",
            icon: "₿"
        },
        {
            id: SchedulerType.USA_MARKET,
            title: "USA",
            subtitle: "US Stock Market",
            available: schedulerStatus[SchedulerType.USA_MARKET] && isUSAMarketAvailable,
            allowed: isUSAMarketAllowed,
            color: "from-green-400 to-emerald-600",
            icon: "🇺🇸"
        },
        {
            id: SchedulerType.MCX,
            title: "MCX",
            subtitle: "MCX Stock Market",
            available: schedulerStatus[SchedulerType.MCX],
            allowed: isMCXAllowed && schedulerStatus[SchedulerType.MCX],
        }
    ];

    const availableMarkets = markets.filter(market => market.allowed);

    return (
        <div
            className={cn("min-h-screen bg-[url('/images/platform/market-selector-bg.png')] w-full bg-cover bg-center flex flex-col items-center justify-center p-4", className)}>
            {/* Header */}
            <div className="bg-[#04002968] backdrop-blur-[2px] w-full h-full absolute top-0 left-0"/>
            <div className="mx-auto max-w-3xl w-full">
            <header className="text-center mb-8 relative z-10">
                <h1 className="text-4xl font-bold text-white mb-2 ">
                    {title}
                </h1>
                <p className="text-white/80">Choose your trading market to continue</p>
            </header>

            {/* Market Cards Grid */}
            <div className="grid grid-cols-1  gap-6  w-full">
                {availableMarkets.map((market) => (
                    <div
                    key={market.id}
                    style={{ boxShadow: "5px 5px 50px 5px #4467CC inset" }}
                    className={cn(
                        "relative overflow-hidden rounded-sm shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer",
                        "border-2 border-[#4467CC33]",
                            !market.available && "opacity-60 cursor-not-allowed hover:scale-100"
                        )}
                        onClick={() => market.available && handleMarketSelection(market.id)}
                        >
                        {/* Card Content */}
                        <div className="p-6 h-40 flex flex-col justify-between relative">
                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div>
                                   
                                </div>

                                {/* Status Badge */}
                                <div
                                    className={cn(
                                        "px-2 py-1 rounded-full text-sm tracking-wide font-semibold border-2 min-w-20 text-center  border-[#4467CC] text-platform-text"
                                    )}
                                    style={
                                        market.available
                                            ? { boxShadow: "0px 0px 12px 2px #08FF0080" }
                                            : { boxShadow: "0px 0px 7.8px 0px #FF0000" }
                                    }
                                >
                                    {market.available ? "OPEN" : "CLOSED"}
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="">

                            <h3 className="text-2xl font-bold text-platform-text mb-2">
                                        {market.title}
                                    </h3>
                                    <p className="text-platform-text/70 text-sm mb-1">
                                        {market.subtitle}
                                    </p>
                                <div className="text-platform-text/60 text-xs">
                                    Tap to select
                                </div>

                            </div>

                            {/* Decorative corner elements */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-platform-text/0 to-platform-text/0 hover:from-platform-text/5 hover:to-platform-text/5 transition-all duration-300"></div>
                    </div>
                ))}
            </div>

            {/* No markets available message */}
            {availableMarkets.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-yellow-200/60 text-lg mb-2">No markets available</div>
                    <div className="text-yellow-100/40 text-sm">Please check your permissions or try again later</div>
                </div>
            )}
            </div>
        </div>
    );
};

export default MarketSelector;