import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RoundRecord, WHEEL_COLOR_CONFIG } from "@/models/round-record";
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { useGetMyCurrentRoundWheelOfFortunePlacement } from "@/react-query/wheel-of-fortune-queries";
import { colorConfig } from "./game-board";

const CurrentBets = ({ roundRecord, className, tableClassName }: { roundRecord: RoundRecord, className?: string, tableClassName?: string }) => {
    const { data: placements } = useGetMyCurrentRoundWheelOfFortunePlacement(roundRecord.id);
    console.log("placements in current bets", placements?.length);

    const aggregatedPlacements: Record<WheelColor, number> = {
        [WheelColor.COLOR1]: 0,
        [WheelColor.COLOR2]: 0,
        [WheelColor.COLOR3]: 0,
        [WheelColor.COLOR4]: 0,
        [WheelColor.COLOR5]: 0,
    };

    placements?.forEach((placement) => {
        if (!aggregatedPlacements[placement.placementColor]) {
            aggregatedPlacements[placement.placementColor] = 0;
        }
        aggregatedPlacements[placement.placementColor] += placement.amount;
    });

    return (
        <section style={{
            background: 'linear-gradient(95.47deg, rgba(50, 66, 65, 0.8) 5.8%, rgba(25, 23, 18, 0.8) 97.51%)',
        }} className={cn("rounded-[10px] border overflow-hidden border-[#598F88] backdrop-blur-sm", className)}>
            <header className="text-white uppercase bg-[#366D51] border-[#5DA69A] border-b md:text-xl text-base space-y-2 relative py-3 px-4 font-medium">
                CURRENT BETS
            </header>
            {placements?.length === 0 ? <NoBets /> : <BetsTable placements={aggregatedPlacements ?? []} tableClassName={tableClassName} />}
        </section>
    );
};

const NoBets = () => {
    return (
        <div className="text-white space-y-2 text-center flex flex-col items-center py-4 justify-center h-full">
            <p className="md:text-lg text-base md:max-w-sm max-w-xs font-semibold px-12">{`You haven't placed
                any bets yet`}</p>
        </div>
    );
};

const BetsTable = ({ placements, tableClassName }: { placements: Record<WheelColor, number>, tableClassName?: string }) => {
    return (
        <div className="md:rounded-sm h-full !pb-0.5 overflow-hidden w-full">
            <div className="md:rounded-sm h-full">
                <div className="relative mx-4 flex-1 w-[calc(100%-2rem)]">
                    {/* Header */}
                    <div className="sticky w-full flex justify-between top-0">
                        <div className="p-2 py-3 text-left text-white w-1/2 whitespace-nowrap">
                            Betting Color
                        </div>
                        <div className="p-2 pr-4 py-3 text-right text-white w-1/2 whitespace-nowrap">
                            Bets INR
                        </div>
                    </div>

                    <ScrollArea
                        type="auto"
                        className={cn("h-[140px]", tableClassName)}
                        scrollThumbClassName="bg-[#366D51]"
                    >
                        {/* Body */}
                        <div className="space-y-2">
                            {Object.entries(placements).map(([color, amount], index) => {
                                if (amount === 0) return null;
                                return <div
                                    key={index}
                                    style={{
                                        background: colorConfig.find(c => c.color === color)?.bgColor,
                                    }}
                                    className="shadow-xl rounded-xl px-4 text-game-secondary overflow-hidden text-sm flex items-center justify-between"
                                >
                                    <div className="p-2 w-1/2">
                                        <div className="text-game-secondary w-full whitespace-nowrap text-start">
                                            {WHEEL_COLOR_CONFIG[color as WheelColor].name}
                                        </div>
                                    </div>
                                    <div className="py-2 w-1/2 text-right whitespace-nowrap">
                                        Rs. {amount}
                                    </div>
                                </div>
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default CurrentBets;