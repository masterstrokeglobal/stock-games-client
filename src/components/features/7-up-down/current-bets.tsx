import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, INR } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import SevenUpDownPlacement from "@/models/seven-up-down";
import { useGetMyCurrentRoundSevenUpDownPlacement } from "@/react-query/7-up-down";
import dayjs from "dayjs";
import Image from "next/image";
import SevenUpDownChip from "./chip";


const CurrentBets = ({
  roundRecord,
  className,
  tableClassName,
}: {
  roundRecord: RoundRecord;
  className?: string;
  tableClassName?: string;
}) => {
  const { data: placements } = useGetMyCurrentRoundSevenUpDownPlacement(roundRecord.id);

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
    <div className="text-white space-y-2 text-center flex flex-col items-center py-4 justify-center h-64">
      <Image
        src="/images/dice-game/no-bets.png"
        alt="No Bets"
        className="w-auto h-full aspect-square "
        width={100}
        height={100}
      />
      <p className="text-lg font-semibold max-w-sm px-12">{`You haven't placed any bets yet`}</p>
    </div>
  );
};

const BetsList = ({
  placements,
  listClassName,
}: {
  placements: SevenUpDownPlacement[];
  listClassName?: string;
}) => {
  return (
    <div className={cn("w-full", listClassName)}>

      {/* Header */}
      <div className="flex w-full px-4 py-3 tracking-wider font-montserrat  font-medium uppercase text-white text-sm gap-4">
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">BET</div>
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">TIME</div>
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">SELECTED SIDE</div>
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">BETS INR</div>
      </div>
      <ScrollArea
        scrollThumbClassName="bg-[#517ED4]" type="auto"
        className="h-[calc(100vh-320px)]"
      >
        <div className="flex flex-col gap-3 pb-2">
          {placements.map((placement, index) => {
            return (
              <div
                key={index}
                className="flex items-center bg-[#355DAE] font-poppins font-light rounded-xl px-4 py-2 gap-4 tracking-wider text-white text-sm"
              >
                <div className="flex-1 text-left">{index + 1}</div>
                <div className="flex-1 text-left">
                  {dayjs(placement.createdAt).format("hh:mm A")}
                </div>
                <div className="flex-1 text-left flex items-center gap-2">
                  <SevenUpDownChip
                    side={placement.placement}
                  />
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