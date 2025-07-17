import React from "react";
import { cn } from "@/lib/utils";
import { useGetAllGameHistory } from "@/react-query/round-record-queries";
import { RoundRecordGameType, WHEEL_COLOR_CONFIG } from "@/models/round-record";
import { useGameType } from "@/hooks/use-game-type";
import dayjs from "dayjs";
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * LastRoundsTable
 * Shows a table of the last Wheel of Fortune rounds using real API data.
 */
const LastRoundsTable: React.FC<{ className?: string; tableClassName?: string }> = ({
  className,
  tableClassName,
}) => {
  const [gameType] = useGameType();
  // Fetch the last 5 rounds for Wheel of Fortune
  const { data, isLoading } = useGetAllGameHistory({
    roundRecordGameType: RoundRecordGameType.WHEEL_OF_FORTUNE,
    type: gameType,
    page: 1,
    limit: 5,
  });

  const rounds = data?.rounds || [];

  console.log(rounds);
  return (
    <section
      className={cn(
        "rounded-[10px] border overflow-hidden border-[#598F88] backdrop-blur-sm",
        className
      )}
      style={{
        background:
          "linear-gradient(95.47deg, rgba(50, 66, 65, 0.8) 5.8%, rgba(25, 23, 18, 0.8) 97.51%)",
      }}
    >
      <header className="text-white uppercase bg-[#366D51] border-[#5DA69A] border-b md:text-xl text-base space-y-2 relative py-3 px-4 font-medium">
        Last Rounds
      </header>
      <div className={cn("px-4 ", tableClassName)}>
        <div className="w-full">
          {/* Table Header */}
          <div className="flex w-full text-white font-semibold text-xs md:text-base">
            <div className="flex-1 px-3 py-2">Round ID</div>
            <div className="flex-1 px-3 py-2">Date</div>
            <div className="flex-1 px-3 py-2">Time</div>
            <div className="flex-1 px-3 py-2">Winner</div>
          </div>
          {/* Table Body */}
          <ScrollArea className="h-[150px]" scrollThumbClassName="bg-[#366D51]">
            {isLoading ? (
              <div className="text-center text-white py-6">Loading...</div>
            ) : rounds.length === 0 ? (
              <div className="text-center text-white py-6">No rounds found.</div>
            ) : (
              rounds.map((round: any, idx: number) => {
                const winnerConfig = round.winningColor
                  ? WHEEL_COLOR_CONFIG[round.winningColor as  WheelColor]
                  : undefined;
                return (
                  <div
                    key={round.id}
                    style={{
                      background: winnerConfig?.chipColor,
                    }}
                    className={cn(
                      "flex w-full items-center text-sm shadow-md mb-2",
                      "rounded-xl",
                      idx === 0 ? "mt-1" : "",
                     
                    )}
                  >
                    <div className="flex-1 px-3 py-2 text-white font-medium">
                      {round.id}
                    </div>
                    <div className="flex-1 px-3 py-2 text-white">
                      {dayjs(round.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className="flex-1 px-3 py-2 text-white">
                      {dayjs(round.createdAt).format("hh:mm A")}
                    </div>
                    <div className="flex-1 px-3 py-2">
                      {winnerConfig ? (
                        <span                          
                        >
                          {winnerConfig.name}
                        </span>
                      ) : (
                        <span className="text-white/60">-</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default LastRoundsTable;