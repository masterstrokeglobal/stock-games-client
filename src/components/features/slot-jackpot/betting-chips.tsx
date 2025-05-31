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
                        className="rounded-full bg-amber-600/20 hover:bg-amber-600/40 border-2 border-amber-600 hover:rotate-90 transition-transform"
                        onClick={() => setShowBettingInput(true)}
                    >
                        <Settings2 className="h-4 w-4 text-amber-200" />
                    </Button>
                    {[100, 500, 1000, 5000, 10000].map((amount) => (
                        <Button
                            key={amount}
                            variant="ghost"
                            className={cn(
                                'h-10 w-20 text-base font-bold rounded-full bg-amber-600/20 hover:bg-amber-600/40 text-amber-200 border-2 border-amber-600',
                                globalBetAmount === amount && 'bg-amber-600 text-white'
                            )}
                            onClick={() => handleGlobalBetAmountChange(amount)}
                        >
                            ₹{amount}
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2 max-w-sm mx-auto animate-in slide-in-from-top">
                    <div className="relative flex-1">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <img src="/coin.svg" className="w-6 h-6" alt="coin" />
                        </div>
                        <Input
                            placeholder="Enter bet amount"
                            value={globalBetAmount}
                            onChange={(e) => handleGlobalBetAmountChange(Number(e.target.value))}
                            className="pl-10 h-10 bg-amber-600/20 border-2 border-amber-600 text-amber-200 text-base rounded-full"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
                        onClick={() => setShowBettingInput(false)}
                    >
                        Done
                    </Button>
                </div>
            )}
        </div>
    );
}

export default BettingChips;