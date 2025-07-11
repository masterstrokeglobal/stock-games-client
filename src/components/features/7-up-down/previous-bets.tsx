import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getWinnerSide } from "@/lib/axios/7-up-down-API";
import { cn } from "@/lib/utils";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetUserGameHistory } from "@/react-query/game-user-queries";
import dayjs from "dayjs";
import Image from "next/image";
import SevenUpDownChip from "./chip";

type History = {
  id: number;
  roundId: number;
  amount: number;
  winner: "7 Up" | "7 Down" | "7";
  selectedSide: "up" | "down";
  isWinner: boolean;
  createdAt: string;
  netProfitLoss: number;
};

const PreviousBets = ({
  className,
  tableClassName,
}: {
  className?: string;
  tableClassName?: string;
}) => {
  // Use the user game history hook for 7-up-down
  const { data: userGameHistory } = useGetUserGameHistory({
    page: 1,
    roundRecordGameType: RoundRecordGameType.SEVEN_UP_DOWN,
  });

  const history: History[] = userGameHistory?.data || [];

  return (
    <section className={cn(className)}>
      {history.length === 0 ? (
        <NoBets />
      ) : (
        <BetsList history={history} listClassName={tableClassName} />
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
  history,
  listClassName,
}: {
  history: History[];
  listClassName?: string;
}) => {
  return (
    <div className={cn("w-full", listClassName)}>
      {/* Header */}
      <div className="flex w-full px-4 py-3 tracking-wider font-medium font-montserrat uppercase text-white text-sm gap-4">
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">TIME</div>
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">SELECTED SIDE</div>
        <div className="flex-1 text-left text-nowrap whitespace-nowrap">WINNER</div>
      </div>
      <ScrollArea
        scrollThumbClassName="bg-[#4467CC]"
        type="auto"
        className="h-[calc(100vh-320px)]"
      >
        <div className="flex flex-col  gap-3 pb-2">
          {history.map((bet, index) => (
            <div
              key={bet.id ?? index}
              className="flex items-center bg-[#355DAE] font-poppins rounded-xl px-4 py-2 font-light gap-4 tracking-wider text-white text-sm"
            >
              <div className="flex-1 text-left font-light">{dayjs(bet.createdAt).format("hh:mm A")}</div>
              <div className="flex-1 text-left flex items-center gap-2">
               <SevenUpDownChip side={bet.selectedSide} />
              </div>
              <div className="flex-1 text-left flex items-center gap-2">
                <SevenUpDownChip side={getWinnerSide(bet.winner)} />
              </div>
             
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default PreviousBets;