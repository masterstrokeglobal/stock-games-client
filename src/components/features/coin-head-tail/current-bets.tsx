import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, INR } from "@/lib/utils";
import { HeadTailPlacement, HeadTailPlacementType } from "@/models/head-tail";
import { RoundRecord } from "@/models/round-record";
import { useGetMyCurrentRoundHeadTailPlacement } from "@/react-query/head-tail-queries";
import dayjs from "dayjs";
import Image from "next/image";

const HEAD_BG =
    "linear-gradient(90deg, rgba(182, 143, 0, 0.3) 0%, rgba(147, 115, 0, 0.3) 100%)";
const TAIL_BG =
    "linear-gradient(90deg, rgba(218, 218, 218, 0.35) 0%, rgba(137, 137, 137, 0.35) 100%)";

const CurrentBets = ({
    roundRecord,
    className,
    tableClassName,
}: {
    roundRecord: RoundRecord;
    className?: string;
    tableClassName?: string;
}) => {
    const { data: placements } = useGetMyCurrentRoundHeadTailPlacement(roundRecord.id);

    return (
        <section className={cn(className)}>
            {placements?.length === 0 ? (
                <NoBets />
            ) : (
                <BetsList placements={placements ?? []} listClassName={tableClassName} />
            )}
        </section>
    );
};

const NoBets = () => {
    return (
        <div className="text-white space-y-2 text-center flex flex-col items-center  justify-center flex-1">
            <Image
                src="/images/dice-game/no-bets.png"
                alt="No Bets"
                className="w-auto h-full aspect-square "
                width={100}
                height={100}
            />
            <p className="text-lg font-semibold max-w-sm px-12">{`You haven't placed
                any bets yet`}</p>
        </div>
    );
};

const BetsList = ({
    placements,
    listClassName,
}: {
    placements: HeadTailPlacement[];
    listClassName?: string;
}) => {
    return (
        <div className={cn("w-full  flex-1", listClassName)}>
            {/* Header */}
            <div className="flex w-full px-4 py-3 font-play tracking-wider text-white text-sm gap-4">
                <div className="flex-1 text-left uppercase text-nowrap   ">Bet</div>
                <div className="flex-1 text-left uppercase text-nowrap ">Time</div>
                <div className="flex-1 text-left uppercase text-nowrap ">Selected Side</div>
                <div className="flex-1 text-left uppercase text-nowrap ">Bets INR</div>
            </div>
            <ScrollArea
                scrollThumbClassName="bg-[#004DA9]"
                type="auto"
                className="md:h-[calc(100svh/2-250px)]"
            >
                <div className="flex flex-col font-phudu gap-3 pb-2">
                    {placements.map((placement, index) => {
                        const isHead = placement.placement === HeadTailPlacementType.HEAD;
                        const rowBg = isHead ? HEAD_BG : TAIL_BG;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center rounded-full px-4 py-2 gap-4 font-phudu tracking-wider text-white text-sm"
                                )}
                                style={{
                                    background: rowBg,
                                }}
                            >
                                <div className="flex-1 text-left">{index + 1}</div>
                                <div className="flex-1 text-left">
                                    {dayjs(placement.createdAt).format("hh:mm A")}
                                </div>
                                <div className="flex-1 text-left uppercase">
                                    {isHead ? "HEAD" : "TAIL"}
                                </div>
                                <div className="flex-1 text-left">{INR(placement.amount)}</div>
                            </div>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export default CurrentBets;