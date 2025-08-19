import { useAuthStore } from "@/context/auth-context";
import { useGameType, useMarketSelector } from "@/hooks/use-market-selector";
import useNSEAvailable from "@/hooks/use-nse-available";
import useUSAMarketAvailable from "@/hooks/use-usa-available";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import User from "@/models/user";
import { RoundRecordGameType } from "@/models/round-record";
import useSchedularCheck from "@/hooks/use-schedular-check";
import { useTheme } from "@/context/theme-context";
import Navbar from "../features/game/navbar";
import useMCXAvailable from "@/hooks/use-mcx-available";
import useCOMEXAvailable from "@/hooks/use-comex-available";
import useMarketSchedule from "@/hooks/use-schedular-timings";

type MarketSelectorProps = {
    title: string;
    className?: string;
    variant?: 'aviator' | 'all';
    showNavbar?: boolean;
    roundRecordType?: RoundRecordGameType;
}

// Helper to format seconds as HH:MM:SS
function formatTimeLeft(seconds: number) {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(n => n.toString().padStart(2, "0")).join(":");
}

const MarketSelector = ({
    title = "STOCK SLOT MARKET",
    className,
    roundRecordType = RoundRecordGameType.DERBY,
    showNavbar = true
}: MarketSelectorProps) => {
    const isNSEAvailable = useNSEAvailable();
    const isUSAMarketAvailable = useUSAMarketAvailable();
    const isCOMEXAvailable = useCOMEXAvailable();
    const isMCXAvailable = useMCXAvailable();
    const theme = useTheme();
    const isDarkMode = theme === "dark";

    const { setMarketSelected } = useMarketSelector();
    const { schedulerStatus } = useSchedularCheck();
    const { setGameType } = useGameType();

    const { userDetails } = useAuthStore();

    const currentUser = userDetails as User;
    const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
    const isCryptoAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO) && (roundRecordType !== RoundRecordGameType.HEAD_TAIL && roundRecordType !== RoundRecordGameType.STOCK_JACKPOT);
    const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);
    const isCOMEXAllowed = (!currentUser.isNotAllowedToPlaceOrder(SchedulerType.COMEX) && (roundRecordType === RoundRecordGameType.HEAD_TAIL || roundRecordType === RoundRecordGameType.STOCK_JACKPOT || roundRecordType === RoundRecordGameType.STOCK_SLOTS));

    const handleMarketSelection = (market: SchedulerType) => {
        setGameType(market);
        setMarketSelected(true);
    }

    const isMCXAllowed = (roundRecordType === RoundRecordGameType.HEAD_TAIL || roundRecordType === RoundRecordGameType.SEVEN_UP_DOWN || roundRecordType === RoundRecordGameType.STOCK_SLOTS) && isMCXAvailable;

    // Use the market schedule hook
    const marketStatuses = useMarketSchedule();

    // Helper to get timeToOpen for a market type
    const getTimeToOpen = (type: SchedulerType) => {
        const status = marketStatuses.find(s => s.type === type.toLowerCase());
        return status && !status.isOpen && status.timeToOpen && status.timeToOpen > 0
            ? status.timeToOpen
            : null;
    };

    // Market times in the image are in UTC. IST = UTC + 5:30.
    // We'll convert the times for the subtitle.
    const markets = [
        {
            id: SchedulerType.NSE,
            title: "NSE",
            subtitle: "National Stock Exchange (Start: 9:30 AM IST, End: 3:30 PM IST)",
            available: isNSEAvailable && schedulerStatus[SchedulerType.NSE],
            allowed: isNSEAllowed,
            color: "from-blue-400 to-blue-600",
            icon: "📈"
        },
        {
            id: SchedulerType.CRYPTO,
            title: "CRYPTO",
            subtitle: "Digital Currency (24 X 7)",
            available: schedulerStatus[SchedulerType.CRYPTO],
            allowed: RoundRecordGameType.SEVEN_UP_DOWN == roundRecordType ? false : isCryptoAllowed,
            color: "from-orange-400 to-red-500",
            icon: "₿"
        },
        {
            id: SchedulerType.USA_MARKET,
            title: "USA",
            subtitle: "US Stock Market (Start: 7:30 PM IST, End: 1:30 AM IST next day)",
            available: schedulerStatus[SchedulerType.USA_MARKET] && isUSAMarketAvailable,
            allowed: isUSAMarketAllowed,
            color: "from-green-400 to-emerald-600",
            icon: "🇺🇸"
        },
        {
            id: SchedulerType.MCX,
            title: "MCX",
            subtitle: "MCX Stock Market (Start: 7:30 PM IST, End: 11:30 PM IST)",
            available: schedulerStatus[SchedulerType.MCX],
            allowed: isMCXAllowed && schedulerStatus[SchedulerType.MCX],
        },
        {
            id: SchedulerType.COMEX,
            title: "International",
            subtitle: "International Stock Market (Start: 3:30 PM IST, End: 7:30 PM IST)",
            available: schedulerStatus[SchedulerType.COMEX] && isCOMEXAvailable,
            allowed: isCOMEXAllowed && schedulerStatus[SchedulerType.COMEX],
        }
    ];
    

    console.log( isCOMEXAllowed , schedulerStatus[SchedulerType.COMEX], "isCOMEXAllowed && schedulerStatus[SchedulerType.COMEX]")

    const availableMarkets = markets.filter(market => market.allowed);

    return (
        <section
            className={cn("min-h-screen pt-20 dark:bg-[url('/images/platform/market-selector-bg.png')] bg-[url('/images/platform/market-selector-bg-light.png')] w-full bg-cover bg-center flex flex-col items-center justify-center p-4", className)}>
            {/* Header */}
            {showNavbar && <Navbar />}
            <div className="dark:bg-[#04002968] bg-[#e6f6ff8b] backdrop-blur-[2px] w-full h-full absolute top-0 left-0" />
            <div className="mx-auto max-w-3xl w-full">
                <header className="text-center mb-8 relative z-10 mt-10">
                    <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold text-platform-text mb-2 ">
                        {title}
                    </h1>
                    <p className="text-platform-text">Choose your trading market to continue</p>
                </header>

                {/* Market Cards Grid */}
                <main className="grid grid-cols-1  gap-6  w-full">
                    {availableMarkets.map((market) => {
                        const timeToOpen = getTimeToOpen(market.id);
                        return (
                            <div
                                key={market.id}
                                style={{ boxShadow: !isDarkMode ? "1px 1px 20px 5px rgba(100, 183, 254, 1) inset" : "5px 5px 50px 5px rgba(68, 103, 204, 1) inset" }}
                                className={cn(
                                    "relative overflow-hidden rounded-sm bg-[#C2EBFFB2] dark:bg-transparent shadow-2xl transition-all duration-300  cursor-pointer",
                                    "border-2 dark:border-[#4467CC33] border-transparent", market.available ? "hover:scale-105" : "opacity-80")}
                                onClick={() => market.available && handleMarketSelection(market.id)}
                            >
                                {/* Card Content */}
                                <div className="p-6 min-h-40 flex flex-col justify-between relative">
                                    {/* Top Section */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* Optionally, show icon here */}
                                        </div>

                                        {/* Status Badge */}
                                        <div
                                            className={cn(
                                                "px-2 py-1 rounded-full text-sm tracking-wide font-semibold min-w-20 text-center",
                                                isDarkMode
                                                    ? ""
                                                    : (market.available
                                                        ? "border-[rgba(55,206,153,1)] border-2 bg-[rgba(66,237,177,0.7)] text-platform-text"
                                                        : "border-[rgba(223,81,108,1)] text-platform-text")
                                            )}
                                            style={
                                                market.available
                                                    ? {
                                                        boxShadow: "0px 0px 12px 2px #08FF0080",
                                                        borderColor: "rgba(55,206,153,1)",
                                                    }
                                                    : {
                                                        boxShadow: "0px 0px 7.8px 0px #FF0000",
                                                        borderColor: "rgba(223,81,108,1)",
                                                    }
                                            }
                                        >
                                            {market.available ? "OPEN" : "CLOSED"}
                                            {/* Show time to open if closed and timeToOpen exists */}

                                        </div>
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="flex justify-between flex-wrap items-end">
                                        <div className="">
                                            <h3 className="md:text-2xl sm:text-xl text-lg font-bold text-platform-text mb-2">
                                                {market.title}
                                            </h3>
                                            <p className="text-platform-text/70 flex text-sm mb-1">
                                                {market.subtitle}
                                            </p>
                                            <div className="text-platform-text/60 text-xs">
                                                Tap to select
                                            </div>
                                        </div>
                                        <h2> {!market.available && timeToOpen && (
                                            <span className="block  mt-1 font-semibold animate-pulse text-platform-text/70">
                                                (  Opens in {formatTimeLeft(timeToOpen)})
                                            </span>
                                        )}</h2>
                                    </div>
                                    {/* Decorative corner elements */}
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-platform-text/0 to-platform-text/0 hover:from-platform-text/5 hover:to-platform-text/5 transition-all duration-300"></div>
                            </div>
                        );
                    })}
                </main>

                {/* No markets available message */}
                {availableMarkets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-yellow-200/60 text-lg mb-2">No markets available</div>
                        <div className="text-yellow-100/40 text-sm">Please check your permissions or try again later</div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MarketSelector;