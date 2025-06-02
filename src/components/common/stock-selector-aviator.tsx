import { useStockSelectorAviator, useStockType } from "@/hooks/use-market-selector";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { useSearchParams } from "next/navigation";


type MarketSelectorProps = {
    title: string;
    className?: string;
}

const MarketSelector = ({ title, className}: MarketSelectorProps) => {
    const { setStockSelectedAviator } = useStockSelectorAviator();
    const { setStockType } = useStockType();
    // get it from url parameter 
    const searchParams = useSearchParams();
    const selectedMarket = searchParams.get('gameType');


    const handleMarketSelection = (stock: string) => {
        setStockType(stock);
        setStockSelectedAviator(true);
    }

    const usa_markets = [
        {
            id: "AAPL",
            title: "AAPL",
            subtitle: "Apple Inc.",
            available: true,
            allowed: true,
            color: "from-gray-400 to-gray-600",
            icon: "🍎"
        },
        {
            id: "GOOGL",
            title: "GOOGL",
            subtitle: "Alphabet Inc. (Google)",
            available: true,
            allowed: true,
            color: "from-red-400 to-yellow-500",
            icon: "🔍"
        },
        {
            id: "MSFT",
            title: "MSFT",
            subtitle: "Microsoft Corporation",
            available: true,
            allowed: true,
            color: "from-blue-400 to-blue-600",
            icon: "💻"
        },
        {
            id: "TSLA",
            title: "TSLA",
            subtitle: "Tesla Inc.",
            available: true,
            allowed: true,
            color: "from-red-500 to-red-700",
            icon: "⚡"
        },
        {
            id: "AMZN",
            title: "AMZN",
            subtitle: "Amazon.com Inc.",
            available: true,
            allowed: true,
            color: "from-orange-400 to-yellow-500",
            icon: "📦"
        }
    ];

    const nse_markets = [
        {
            id: "RELIANCE",
            title: "RELIANCE",
            subtitle: "Reliance Industries Ltd.",
            available: true,
            allowed: true,
            color: "from-blue-500 to-blue-700",
            icon: "⛽"
        },
        {
            id: "TCS",
            title: "TCS",
            subtitle: "Tata Consultancy Services Ltd.",
            available: true,
            allowed: true,
            color: "from-blue-400 to-blue-600",
            icon: "💼"
        },
        {
            id: "HDFCBANK",
            title: "HDFCBANK",
            subtitle: "HDFC Bank Ltd.",
            available: true,
            allowed: true,
            color: "from-red-400 to-red-600",
            icon: "🏦"
        },
        {
            id: "INFY",
            title: "INFY",
            subtitle: "Infosys Ltd.",
            available: true,
            allowed: true,
            color: "from-green-400 to-green-600",
            icon: "💻"
        },
        {
            id: "ITC",
            title: "ITC",
            subtitle: "ITC Ltd.",
            available: true,
            allowed: true,
            color: "from-brown-400 to-brown-600",
            icon: "🚬"
        }
    ];

    const availableMarkets = selectedMarket === SchedulerType.USA_MARKET ? usa_markets : nse_markets;

    return (
        <div
            className={cn("min-h-screen flex flex-col items-center justify-center p-4", className)}
            style={{
                background: 'radial-gradient(ellipse at center, #8B4513 0%, #654321 50%, #3C2415 100%)',
                backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(255,215,0,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,140,0,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(139,69,19,0.2) 0%, transparent 50%)
                `
            }}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg mb-4">
                    <span className="text-3xl">📊</span>
                </div>
                <h1 className="text-4xl font-bold text-yellow-200 mb-2 drop-shadow-lg">
                    {title}
                </h1>
                <p className="text-yellow-100/80">Choose your trading market to continue</p>
            </div>

            {/* Market Cards Grid */}
            <div className="grid grid-cols-1  gap-6 max-w-4xl w-full">
                {availableMarkets.map((market) => (
                    <div
                        key={market.id}
                        className={cn(
                            "relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer",
                            "border-2 border-yellow-600/30",
                            !market.available && "opacity-60 cursor-not-allowed hover:scale-100"
                        )}
                        onClick={() => market.available && handleMarketSelection(market.id)}
                        style={{
                            background: 'linear-gradient(135deg, rgba(139,69,19,0.9) 0%, rgba(101,67,33,0.9) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                    >
                        {/* Card Content */}
                        <div className="p-6 h-40 flex flex-col justify-between relative">
                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-3xl mb-2">{market.icon}</div>
                                    <h3 className="text-2xl font-bold text-yellow-200 mb-1">
                                        {market.title}
                                    </h3>
                                    <p className="text-yellow-100/70 text-sm">
                                        {market.subtitle}
                                    </p>
                                </div>

                            </div>

                            {/* Bottom Section */}
                            <div className="flex items-center justify-between">
                                <div className="text-yellow-100/60 text-xs">
                                    Tap to select
                                </div>

                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        "bg-gradient-to-br shadow-inner border border-yellow-500/30",
                                        market.color
                                    )}
                                >
                                    <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                                </div>
                            </div>

                            {/* Decorative corner elements */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full translate-y-6 -translate-x-6"></div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-orange-400/0 hover:from-yellow-400/5 hover:to-orange-400/5 transition-all duration-300"></div>
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
    );
};

export default MarketSelector;