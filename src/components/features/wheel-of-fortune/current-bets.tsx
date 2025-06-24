import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { WheelOfFortunePlacement } from "@/models/wheel-of-fortune-placement";
import { useGetMyCurrentRoundWheelOfFortunePlacement } from "@/react-query/wheel-of-fortune-queries";

const CurrentBets = ({ roundRecord, className, tableClassName }: { roundRecord: RoundRecord, className?: string, tableClassName?: string }) => {
    const { data: placements } = useGetMyCurrentRoundWheelOfFortunePlacement(roundRecord.id);

    const aggregatedPlacements = placements?.reduce((acc, placement) => {
        const existingPlacement = acc.find(p => p.placementColor === placement.placementColor);
        if (existingPlacement) {
            existingPlacement.amount += placement.amount;
        } else {
            acc.push(placement); 
        }
        return acc;
    }, [] as WheelOfFortunePlacement[]) || [];
    return (
        <section style={{
            background: 'linear-gradient(95.47deg, rgba(50, 66, 65, 0.8) 5.8%, rgba(25, 23, 18, 0.8) 97.51%)',
        }} className={cn("rounded-[10px] border overflow-hidden border-[#598F88] backdrop-blur-sm", className)}>
            <header className="text-white md:text-2xl text-xl  space-y-2 dice-header relative   py-3 px-4 font-medium">
                Your Bets
                <div style={{
                    background: 'linear-gradient(90deg, #5D8B86 0%, #1E3D11 100%)',
                }} className="w-full h-px z-[11] absolute bottom-0 left-0" />
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

const BetsTable = ({ placements, tableClassName }: { placements: WheelOfFortunePlacement[], tableClassName?: string }) => {
    return (
        <div className="md:rounded-sm h-full !pb-0.5 overflow-hidden w-full">
            <div className="md:rounded-sm h-full">
                <ScrollArea
                    type="auto"
                    className={cn("h-full", tableClassName)}
                >
                    <div className="relative mx-4 flex-1 w-[calc(100%-2rem)]">
                        {/* Header */}
                        <div className="sticky w-full flex justify-between top-0 py-2">
                                <div className="p-2 py-3 text-left text-white w-1/3">
                                    Betting Color
                                </div>
                                <div className="p-2 pr-4 py-3 text-right text-white w-1/3">
                                    Bets INR
                                </div>
                        </div>
                        
                        {/* Body */}
                        <div className="space-y-2">
                            {placements.map((placement, index) => (
                                <div    
                                    key={index}
                                    style={{
                                        background: placement.colorConfig.backgroundGradient,
                                    }}
                                    className="shadow-xl rounded-full px-8 text-game-secondary overflow-hidden text-sm flex items-center justify-between"
                                >
                                    <div className="p-2 w-1/2">
                                        <div className="text-game-secondary w-full text-start">
                                            {placement.colorName} 
                                        </div>
                                    </div>
                                    <div className="py-2 w-1/2 text-right">
                                        Rs. {placement.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
};

export default CurrentBets;