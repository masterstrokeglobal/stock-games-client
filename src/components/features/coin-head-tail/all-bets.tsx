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
                    "rounded-2xl md:p-4  flex flex-col  bg-[#004DA982] ",
                    className
                )}
            >
                <header className="bg-[#004DA9] rounded-[10px] px-4 py-2">
                    <h2 className="font-play tracking-wider font-bold md:text-xl text-center"> My Bets</h2>
                </header>
                <Tabs defaultValue="current" className="w-full mt-4 ">
                    <TabsList
                        className={cn(
                            "w-full flex bg-[#004DA9] rounded-[10px] p-1 h-10  mb-4",
                            "justify-between"
                        )}
                    >
                        <TabsTrigger
                            value="current"
                            className={cn(
                                "flex-1  font-semibold tracking-wider transition-none rounded-[10px] h-8",
                                "data-[state=active]:bg-[#00033DB0] data-[state=active]:text-white data-[state=active]:border-[#0074FF] data-[state=active]:shadow-[0px_0px_3.6px_1px_rgba(0,116,255,1)_inset]",
                                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#A3D1FF]",
                                "border-none"
                            )}
                        >
                            Current Bets
                        </TabsTrigger>
                        <TabsTrigger
                            value="previous"
                            className={cn(
                                "flex-1  font-semibold tracking-wider transition-none rounded-[10px] h-8",
                                "data-[state=active]:bg-[#00033DB0] data-[state=active]:text-white data-[state=active]:border-[#0074FF] data-[state=active]:shadow-[0px_0px_3.6px_1px_rgba(0,116,255,1)_inset]",
                                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#A3D1FF]",
                                "border-none"
                            )}
                        >
                            Previous Bets
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent className="grid grid-cols-1 data-[state=active]:h-full " value="current">
                        <CurrentBets roundRecord={roundRecord} />
                    </TabsContent>
                    <TabsContent className="data-[state=active]:h-full" value="previous">
                        <PreviousBets />
                    </TabsContent>
                </Tabs>
            </aside>
            <CoinHeadTailResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
        </>
    );
};

export default AllBets;