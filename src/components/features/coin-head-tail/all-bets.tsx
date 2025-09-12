import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import CurrentBets from "./current-bets";
import PreviousBets from "./previous-bets";
import { useGetMyCurrentRoundHeadTailPlacement } from "@/react-query/head-tail-queries";
import { useShowResults } from "@/hooks/use-current-game";
import CoinHeadTailResultDialog from "./game-result";
import { memo } from "react";
const AllBets = ({
    roundRecord,
    className,
}: {
    roundRecord: RoundRecord;
    className?: string;
}) => {
    const { data: placements } = useGetMyCurrentRoundHeadTailPlacement(roundRecord.id);
    const showResult = useShowResults(roundRecord, placements ?? []);
    return (
        <>
            <aside
                style={{
                    backdropFilter: "blur(39.5px)",
                    boxShadow: "0px 0px 8px 0px rgba(0, 92, 164, 1) inset",
                }}
                className={cn(
                    "rounded-2xl md:p-4 p-2 overflow-hidden flex flex-col  border border-[#0074FF]  bg-[#004DA982] ",
                    className
                )}
            >
                <header className="bg-[#004DA9] rounded-[10px] px-4 py-1">
                    <h2 className="font-play tracking-wider font-bold md:text-lg text-center"> My Bets</h2>
                </header>
                <Tabs defaultValue="current" className="w-full mt-1 flex flex-col flex-1 ">
                    <TabsList
                        className={cn(
                            "w-full flex bg-[#004DA9] rounded-[10px] p-1 h-10",
                            "justify-between"
                        )}
                    >
                        <TabsTrigger
                            value="current"
                            className={cn(
                                "flex-1 font-semibold tracking-wider transition-none rounded-[10px] font-play text-base h-8",
                                "data-[state=active]:bg-[#00033DB0] data-[state=active]:text-white data-[state=active]:border-[#0074FF] data-[state=active]:border data-[state=active]:shadow-[0px_0px_3.6px_1px_rgba(0,116,255,1)_inset]",
                                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#A3D1FF]",
                            )}
                        >
                            Current Bets
                        </TabsTrigger>
                        <TabsTrigger
                            value="previous"
                            className={cn(
                                "flex-1 font-semibold tracking-wider transition-none rounded-[10px] font-play text-base h-8",
                                "data-[state=active]:bg-[#00033DB0] data-[state=active]:text-white data-[state=active]:border-[#0074FF] data-[state=active]:border data-[state=active]:shadow-[0px_0px_3.6px_1px_rgba(0,116,255,1)_inset]",
                                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#A3D1FF]",
                            )}
                        >
                            Previous Bets
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex-1 flex flex-col">
                        <TabsContent className="data-[state=active]:flex-1 flex-none" value="current">
                            <CurrentBets roundRecord={roundRecord} />
                        </TabsContent>
                        <TabsContent className="data-[state=active]:flex-1 flex-none" value="previous">
                            <PreviousBets />
                        </TabsContent>
                    </div>
                </Tabs>
            </aside>
            <CoinHeadTailResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
        </>
    );
};

export default memo(AllBets);