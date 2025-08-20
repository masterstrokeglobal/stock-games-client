import useMaxPlacement from "@/hooks/use-max-placement";
import { cn } from "@/lib/utils";
import { RoundRecord, RoundRecordGameType } from "@/models/round-record";
import { useGetMyStockJackpotGameRecord } from "@/react-query/game-record-queries";
import { Minus, Plus } from "lucide-react";

type BettingAmountProps = {
    globalBetAmount: number,
    className?: string,
    showBetting: boolean,
    roundRecord: RoundRecord,
    handleGlobalBetAmountChange: (amount: number) => void
}

const BettingChips = ({ globalBetAmount, handleGlobalBetAmountChange, className, roundRecord }: BettingAmountProps) => {
    const { data: stockSlotPlacements } = useGetMyStockJackpotGameRecord(roundRecord?.id);
    const totalAmount = Array.isArray(stockSlotPlacements)?stockSlotPlacements.reduce((sum, placement) => sum + (placement.amount || 0), 0): 0;
    const { maxPlacement, minPlacement } = useMaxPlacement(RoundRecordGameType.STOCK_JACKPOT);

    return (
        <div id="betting-amount" className={cn("transition-all duration-200 px-4", className)}>
            <div className="flex lg:justify-center justify-between items-center gap-2 w-full mx-auto ">
                {/* Betting Chips */}
                <div className="lg:flex gap-2 grid grid-cols-2">
                    {[100, 500, 1000, 2000].map((amount) => (
                        <button
                            key={amount}
                            className={cn(
                                'relative rounded-md h-8 sm:px-6 px-2 font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95',
                                'border-2 transform skew-x-[14deg]',
                            )}
                            onClick={() => handleGlobalBetAmountChange(amount)}
                            style={{
                                backgroundColor: '#002C3E',
                                borderColor: '#39A0C7',
                                boxShadow: globalBetAmount === amount
                                    ? '0px 0px 7.9px 0px #00ACE7'
                                    : '0px 4px 4px 0px #00000040',
                            }}
                        >
                            <span className="transform font-orbitron sm:text-sm text-xs -skew-x-12 block">
                                {amount}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Plus/Minus Controls */}
                <div className="flex gap-2 lg:flex-row flex-col">
                    <div
                        className="flex items-center lg:ml-6 sm:min-w-40 min-w-32  rounded-md  justify-between border-2 px-2 overflow-hidden transform -skew-x-[20deg] h-8"
                        style={{
                            backgroundColor: '#002C3E',
                            borderColor: '#39A0C7',
                            boxShadow: '0px 4px 4px 0px #00000040'
                        }}
                    >
                        <button
                            disabled={globalBetAmount >= maxPlacement}
                            className="px-2 py-1 hover:opacity-80 transition-opacity transform rounded bg-[#008DC2] "
                            onClick={() => handleGlobalBetAmountChange(globalBetAmount + 100)}
                        >
                            <Plus className="w-3 h-3 text-white" />
                        </button>
                        <input
                            min={minPlacement}
                            max={maxPlacement}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (!isNaN(value) && value >= 0) {
                                    handleGlobalBetAmountChange(value);
                                }
                            }}
                            className="px-3 py-1 text-white bg-transparent border-none ring-0 outline-none font-orbitron sm:text-sm text-xs font-bold w-16  text-center transform skew-x-[14deg]"
                            value={globalBetAmount}

                        />
                        <button
                            disabled={globalBetAmount <= minPlacement}
                            className="px-2 py-1 hover:opacity-80 transition-opacity transform rounded  bg-[#008DC2] "
                            onClick={() => handleGlobalBetAmountChange(globalBetAmount - 100)}
                        >
                            <Minus className="w-3 h-3 text-white" />
                        </button>
                    </div>
                    {/* Total Bet Display */}
                    <div
                        className=" sm:px-4 px-2 py-2 rounded-md border-2  transform sm:min-w-48 w-full  -skew-x-[18deg] h-8 flex sm:gap-4 sm:justify-center justify-between"
                        style={{
                            backgroundColor: '#008DC2',
                            borderColor: '#39A0C7',
                            boxShadow: '0px 4px 4px 0px #00000040',

                        }}
                    >
                        <div className="text-xs text-white/80 uppercase tracking-wide transform skew-x-[14deg] font-orbitron leading-none">Total Bet</div>
                        <div className="text-sm font-bold text-white transform skew-x-[14deg] font-orbitron leading-none">{totalAmount}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BettingChips;