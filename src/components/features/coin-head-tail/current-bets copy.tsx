import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, INR } from "@/lib/utils";
import { HeadTailPlacement, HeadTailPlacementType } from "@/models/head-tail";
import { RoundRecord } from "@/models/round-record";
import { useGetMyCurrentRoundHeadTailPlacement } from "@/react-query/head-tail-queries";
import dayjs from "dayjs";
import Image from "next/image";
const CurrentBets = ({ roundRecord, className, tableClassName }: { roundRecord: RoundRecord, className?: string, tableClassName?: string }) => {
    const { data: placements } = useGetMyCurrentRoundHeadTailPlacement(roundRecord.id);

    return (
        <section className={cn("rounded-sm border border-[#2C3682]", className)}>
            <header className="text-white rounded-b-md text-2xl space-y-4 bg-[#0C309E] backdrop-blur-sm dice-header text-center  py-3 px-4 font-bold">
                Current Bets
            </header>
            {placements?.length === 0 ? <NoBets /> : <BetsTable placements={placements ?? []} tableClassName={tableClassName} />}
        </section>
    );
};

const NoBets = () => {
    return (
        <div className="text-white space-y-2 text-center flex flex-col items-center py-4 justify-center h-64">
            <Image src="/images/dice-game/no-bets.png" alt="No Bets" className="w-auto h-full aspect-square " width={100} height={100} />
            <p className="text-lg font-semibold max-w-sm px-12">{`You haven't placed
                any bets yet`}</p>
        </div>
    );
};
const BetsTable = ({ placements, tableClassName }: { placements: HeadTailPlacement[], tableClassName?: string }) => {
    return (
        <div className="md:rounded-sm h-full !pb-0.5 overflow-hidden w-full">
            <div className="md:rounded-sm h-full">
                <ScrollArea
                    scrollThumbClassName="bg-[#4467CC]"
                    type="auto"
                    className={cn("h-full", tableClassName)}
                >
                    <table className="min-w-full relative table-fixed w-full">
                        <thead className="sticky border-[#4467CC80] bg-[#140538] border-b top-0 py-2">
                            <tr className="text-game-text text-sm">
                                <th className="p-2 py-3 text-left text-white w-1/4">
                                    Bet
                                </th>
                                <th className="p-2 py-3 text-left text-white w-1/4">
                                    Time
                                </th>
                                <th className="p-2 py-3 text-left text-white w-1/4">
                                    Selected Side
                                </th>
                                <th className="p-2 py-3 text-left text-white w-1/4">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {placements.map((placement, index) => (
                                <tr
                                    key={index}
                                    className="border-b last:border-none text-game-secondary rounded-lg border-[#DADCE00D] overflow-hidden text-sm"
                                >
                                    <td className="p-2 w-1/4">
                                        {index + 1}
                                    </td>
                                    <td className="p-2 w-1/4">
                                        <div className="text-game-secondary w-full text-start">
                                            {dayjs(placement.createdAt).format("DD MMM YYYY hh:mm A")}
                                        </div>
                                    </td>
                                    <td className="p-2 w-1/4">
                                        {placement.placement === HeadTailPlacementType.HEAD ? "Head" : "Tail"}
                                    </td>
                                    <td className="p-2 w-1/4">
                                        {INR(placement.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
};

export default CurrentBets; 