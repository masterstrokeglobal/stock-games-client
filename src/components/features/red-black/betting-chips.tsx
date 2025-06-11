import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Settings2 } from "lucide-react";

type BettingAmountProps = {
    globalBetAmount: number,
    className?: string,
    showBetting: boolean,
    handleGlobalBetAmountChange: (amount: number) => void
}

const BettingChips = ({ globalBetAmount, handleGlobalBetAmountChange, className, showBetting }: BettingAmountProps) => {
    const [showBettingInput, setShowBettingInput] = useState(false);

    if (!showBetting) return null;
    return (
        <div id="betting-amount" className={cn("transition-all duration-200 p-4", className)}>
            {!showBettingInput ? (
                <div className="flex justify-center gap-4 w-full flex-wrap">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full relative overflow-hidden group transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-red-500/50"
                        style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
                            border: '2px solid #fbbf24',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(220,38,38,0.5)'
                        }}
                        onClick={() => setShowBettingInput(true)}
                    >
                        <Settings2 className="h-4 w-4 text-yellow-200 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-red-600/20" />
                    </Button>
                    {[100, 500, 1000, 5000, 10000].map((amount) => (
                        <Button
                            key={amount}
                            variant="ghost"
                            className={cn(
                                'h-12 w-24 text-base font-bold rounded-full relative overflow-hidden group transform hover:scale-110 transition-all duration-300 shadow-2xl',
                                globalBetAmount === amount 
                                    ? 'shadow-yellow-500/70 hover:shadow-yellow-500/90' 
                                    : 'hover:shadow-red-500/50'
                            )}
                            style={{
                                background: globalBetAmount === amount 
                                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
                                    : 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
                                border: '2px solid #fbbf24',
                                boxShadow: globalBetAmount === amount
                                    ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 0 25px rgba(251,191,36,0.7)'
                                    : 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(220,38,38,0.5)'
                            }}
                            onClick={() => handleGlobalBetAmountChange(amount)}
                        >
                            <span className={cn(
                                "relative z-10 font-extrabold text-lg tracking-wide",
                                globalBetAmount === amount ? "text-red-900 drop-shadow-lg" : "text-yellow-200"
                            )}>
                                ₹{amount}
                            </span>
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
                            )} />
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-red-600/20" />
                            {globalBetAmount === amount && (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400/10 via-yellow-300/20 to-yellow-400/10" />
                            )}
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2 max-w-sm mx-auto animate-in slide-in-from-top">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                            <div 
                                className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.3)'
                                }}
                            >
                                <span className="text-sm font-bold text-red-900">₹</span>
                            </div>
                        </div>
                        <Input
                            type="number"
                            placeholder="Enter bet amount"
                            value={globalBetAmount}
                            onChange={(e) => handleGlobalBetAmountChange(Number(e.target.value))}
                            className="pl-12 pr-4 h-12 text-base rounded-full font-semibold text-yellow-200 placeholder:text-yellow-300/70 border-2"
                            style={{
                                background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)',
                                borderColor: '#fbbf24',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 15px rgba(220,38,38,0.4)'
                            }}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-12 px-6 rounded-full font-bold relative overflow-hidden group transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50"
                        style={{
                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
                            border: '2px solid #fbbf24',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 20px rgba(22,163,74,0.5)'
                        }}
                        onClick={() => setShowBettingInput(false)}
                    >
                        <span className="text-yellow-200 relative z-10 font-extrabold tracking-wide">Done</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-green-600/20" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default BettingChips;