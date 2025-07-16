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
import SevenUpDownResultDialog from "./game-result";
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
                    background: "linear-gradient(107deg, rgba(40, 88, 176, 0.90) 10.7%, rgba(29, 36, 93, 0.90) 111.17%)",
                }}
                className={cn(
                    "rounded-2xl md:p-4 p-2",
                    className
                )}
            >
                <header className="bg-[#0F1E4D] rounded-[10px] px-4 py-2">
                    <h2 className="font-poppins tracking-wider font-bold md:text-xl text-center"> My Bets</h2>
                </header>
                <Tabs defaultValue="current" className="w-full mt-2">
                    <TabsList
                        className={cn(
                            "w-full flex bg-[#0F1E4D] rounded-[10px] p-1 h-10 ",
                            "justify-between"
                        )}
                    >
                        <TabsTrigger
                            value="current"
                            className={cn(
                                "flex-1 font-poppins font-semibold tracking-wider transition-none rounded-[10px] h-8",
                                "data-[state=active]:bg-[#265BB1] data-[state=active]:text-[#A6C5FF] data-[state=active]:border-[#0074FF]",
                                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#A3D1FF]",
                                "border-none"
                            )}
                        >
                            Current Bets
                        </TabsTrigger>
                        <TabsTrigger
                            value="previous"
                            className={cn(
                                "flex-1 font-poppins font-semibold tracking-wider transition-none rounded-[10px] h-8",
                                "data-[state=active]:bg-[#265BB1] data-[state=active]:text-[#A6C5FF] data-[state=active]:border-[#0074FF]",
                                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#A3D1FF]",
                                "border-none"
                            )}
                        >
                            Previous Bets
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent  value="current">
                        <CurrentBets roundRecord={roundRecord} />
                    </TabsContent>
                    <TabsContent value="previous">
                        <PreviousBets />
                    </TabsContent>
                </Tabs>
            </aside>
            <SevenUpDownResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
        </>
    );
};

export default AllBets;