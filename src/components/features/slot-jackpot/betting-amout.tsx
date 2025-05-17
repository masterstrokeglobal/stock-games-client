import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";


type BettingAmountProps = {
    globalBetAmount: number,
    className?: string,
    handleGlobalBetAmountChange: (amount: number) => void
}

const BettingAmount = ({ globalBetAmount, handleGlobalBetAmountChange, className }: BettingAmountProps) => {
    return (
        <div id="betting-amount" className={cn("rounded-lg p-4 bg-primary-game  transition-all duration-200 shadow-lg shadow-purple-900/20", className)}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-yellow-100">Betting Amount</span>
                </div>

            </div>
            <div>
                <div className="flex items-center space-x-4">
                    <div className="flex justify-center relative mb-2">
                        <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full">
                            <img src="/coin.svg" className='shadow-custom-glow rounded-full' alt="coin" />
                        </div>
                        <Input
                            placeholder="Enter bet amount"
                            value={globalBetAmount}
                            onChange={(e) => handleGlobalBetAmountChange(Number(e.target.value))}
                            className=" p-2  rounded-2xl pl-14 h-14 border-2 border-game-text text-xl"
                        />
                    </div>

                </div>


                <div className="flex justify-between items-center mb-2">
                    <div className="flex justify-between gap-1 w-full xl:flex-wrap flex-wrap" >
                        {[100, 500, 1000, 5000, 10000].map((amount) => (
                            <Button
                                className='flex-1 text-game-text bg-secondary-game'
                                variant="game-secondary"
                                key={amount}

                                onClick={() => handleGlobalBetAmountChange(amount)}
                            >
                                ₹{amount}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export const BettingAmoutMobile = ({ globalBetAmount, handleGlobalBetAmountChange }: BettingAmountProps) => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button className="fixed md:hidden bottom-0 w-fit left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full space-x-2  gold-button">
                    <span>Betting Amout</span>
                    <div className="flex items-center gap-2">
                        <img src="/coin.svg" alt="coin" className="md:w-auto w-5" />
                        <span className="text-white text-sm font-bold">
                            {globalBetAmount}
                        </span>
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-primary-game">
                <BettingAmount
                    className="bg-primary-game shadow-none"
                    globalBetAmount={globalBetAmount}
                    handleGlobalBetAmountChange={handleGlobalBetAmountChange}
                />
            </SheetContent>
        </Sheet>
    )
}

export default BettingAmount;