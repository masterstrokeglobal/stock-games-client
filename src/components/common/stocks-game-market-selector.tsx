import { useAuthStore } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
// import useCOMEXAvailable from "@/hooks/use-comex-available";
// import useMCXAvailable from "@/hooks/use-mcx-available";
import useNSEAvailable from "@/hooks/use-nse-available";
import useSchedularCheck from "@/hooks/use-schedular-check";
import useMarketSchedule from "@/hooks/use-schedular-timings";
import useUSAMarketAvailable from "@/hooks/use-usa-available";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import User from "@/models/user";
import Navbar from "../features/game/navbar";
import ExternalUserNavbar from "../features/game/external-user-Navbar";
import { useIsExternalUser } from "@/context/auth-context";

type GameMarketSelectorProps = {
    title: string;
    className?: string;
    showNavbar?: boolean;
    onMarketSelect: (market: SchedulerType) => void;
}

function formatTimeLeft(seconds: number) {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(n => n.toString().padStart(2, "0")).join(":");
}

const GameMarketSelector = ({
    title = "SELECT MARKET",
    className,
    showNavbar = true,
    onMarketSelect
}: GameMarketSelectorProps) => {
    const isNSEAvailable = useNSEAvailable();
    const isExternalUser = useIsExternalUser();
    const isUSAMarketAvailable = useUSAMarketAvailable();
    // const isCOMEXAvailable = useCOMEXAvailable();
    // const isMCXAvailable = useMCXAvailable();
    const theme = useTheme();
    const isDarkMode = theme === "dark";

    const { schedulerStatus } = useSchedularCheck();
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as User;

    const marketStatuses = useMarketSchedule();

    const getTimeToOpen = (type: SchedulerType) => {
        const status = marketStatuses.find(s => s.type === type.toLowerCase());
        return status && !status.isOpen && status.timeToOpen && status.timeToOpen > 0
            ? status.timeToOpen
            : null;
    };

    const markets = [
        {
            id: SchedulerType.NSE,
            title: "NSE",
            subtitle: "National Stock Exchange (Start: 9:30 AM IST, End: 3:30 PM IST)",
            available: isNSEAvailable && schedulerStatus[SchedulerType.NSE],
            allowed: !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE),
            icon: "📈"
        },
        {
            id: SchedulerType.CRYPTO,
            title: "CRYPTO",
            subtitle: "Digital Currency (24 X 7)",
            available: schedulerStatus[SchedulerType.CRYPTO],
            allowed: !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO),
            icon: "₿"
        },
        {
            id: SchedulerType.USA_MARKET,
            title: "USA",
            subtitle: "US Stock Market (Start: 7:30 PM IST, End: 1:30 AM IST next day)",
            available: schedulerStatus[SchedulerType.USA_MARKET] && isUSAMarketAvailable,
            allowed: !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET),
            icon: "🇺🇸"
        }
    ];

    const availableMarkets = markets
        .filter(market => market.allowed)
        .sort((a, b) => {
            if (a.available === b.available) return 0;
            return a.available ? -1 : 1;
        });

    return (
        <section className={cn("min-h-screen pt-20 dark:bg-[url('/images/platform/market-selector-bg.png')] bg-[url('/images/platform/market-selector-bg-light.png')] w-full bg-cover bg-center flex flex-col items-center justify-center p-4", className)}>
            {showNavbar ? isExternalUser ? <ExternalUserNavbar /> : <Navbar /> : null}
            <div className="dark:bg-[#04002968] bg-[#e6f6ff8b] backdrop-blur-[2px] w-full h-full absolute top-0 left-0" />
            <div className="mx-auto max-w-3xl w-full">
                <header className="text-center sm:mb-8 xs:mb-4 relative z-10 mt-10">
                    <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold text-platform-text md:mb-2">
                        {title}
                    </h1>
                    <p className="text-platform-text">Choose your trading market to continue</p>
                </header>

                <main className="grid grid-cols-1 md:gap-6 gap-1 w-full">
                    {availableMarkets.map((market) => {
                        const timeToOpen = getTimeToOpen(market.id);
                        return (
                            <div
                                key={market.id}
                                style={{ boxShadow: !isDarkMode ? "1px 1px 20px 5px rgba(100, 183, 254, 1) inset" : "5px 5px 50px 5px rgba(68, 103, 204, 1) inset" }}
                                className={cn(
                                    "relative overflow-hidden rounded-sm bg-[#C2EBFFB2] dark:bg-transparent shadow-2xl transition-all duration-300 cursor-pointer",
                                    "border-2 dark:border-[#4467CC33] border-transparent",
                                    market.available ? "hover:scale-105" : "opacity-80"
                                )}
                                onClick={() => market.available && onMarketSelect(market.id)}
                            >
                                <div className="md:p-6 sm:p-4 p-2 min-h-40 flex flex-col justify-between relative">
                                    <div className="flex justify-between items-start">
                                        <div className="text-2xl">{market.icon}</div>
                                        <div
                                            className={cn(
                                                "px-2 py-1 rounded-full text-sm tracking-wide font-semibold min-w-20 text-center",
                                                isDarkMode ? "" : (market.available
                                                    ? "border-[rgba(55,206,153,1)] border-2 bg-[rgba(66,237,177,0.7)] text-platform-text"
                                                    : "border-[rgba(223,81,108,1)] text-platform-text")
                                            )}
                                            style={market.available
                                                ? { boxShadow: "0px 0px 12px 2px #08FF0080", borderColor: "rgba(55,206,153,1)" }
                                                : { boxShadow: "0px 0px 7.8px 0px #FF0000", borderColor: "rgba(223,81,108,1)" }
                                            }
                                        >
                                            {market.available ? "OPEN" : "CLOSED"}
                                        </div>
                                    </div>

                                    <div className="flex justify-between flex-wrap items-end">
                                        <div>
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
                                        {!market.available && timeToOpen && (
                                            <span className="block mt-1 font-semibold animate-pulse text-platform-text/70">
                                                (Opens in {formatTimeLeft(timeToOpen)})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </main>

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

export default GameMarketSelector;