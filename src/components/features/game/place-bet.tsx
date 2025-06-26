"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import {
  BLACK_NUMBERS,
  cn,
  getPlacementString,
  RED_NUMBERS,
} from "@/lib/utils";
import AdvanceGameRecord, { RedBlackAdvancePlacementType, RedBlackPlacementType } from "@/models/advance-game-record";
import GameRecord, { PlacementType } from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { useCreateAdvanceGameRecord } from "@/react-query/advance-game-record-queries";
import { useCreateGameRecord, useGetAdvancePlacements, useGetMyPlacements } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

type Props = {
  className?: string;
  roundRecord: RoundRecord;
  globalBetAmount: number;
};

const PlaceBets = ({ className, roundRecord, globalBetAmount }: Props) => {
  const t = useTranslations("game");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data: advanceData } = useGetAdvancePlacements({ roundId: roundRecord.id.toString() });

  const advancePlacements: AdvanceGameRecord[] = useMemo(() => {
    return advanceData?.data.placements.map((item: any) => new AdvanceGameRecord(item)) || [];
  }, [advanceData]);

  const { redBets, blackBets } = useMemo(() => {  

    if (!advancePlacements) return { placements: [], redBets: 0, blackBets: 0 };

      const redBets = advancePlacements?.filter((p) => p.placementType == RedBlackPlacementType.RED && (p.advancePlacementType == RedBlackAdvancePlacementType.CURRENT || p.advancePlacementType == RedBlackAdvancePlacementType.NEXT) && p.startRound == roundRecord.todayCount && p.endRound == roundRecord.todayCount).reduce((sum, p) => sum + p.amount, 0) || 0;

    const blackBets = advancePlacements?.filter((p) => p.placementType == RedBlackPlacementType.BLACK && (p.advancePlacementType == RedBlackAdvancePlacementType.CURRENT || p.advancePlacementType == RedBlackAdvancePlacementType.NEXT) && p.startRound == roundRecord.todayCount && p.endRound == roundRecord.todayCount).reduce((sum, p) => sum + p.amount, 0) || 0;

    return {
      placements: advancePlacements,
      redBets,
      blackBets
    };
  }, [advancePlacements]);

  const gameState = useGameState(roundRecord);
  const currentRound = roundRecord.todayCount || -1;
  const { mutate: mutateAdvanceGameRecord, isPending: isAdvancePlacingBet } = useCreateAdvanceGameRecord();

  const fancyRounds = [
    {
      Description: `Next Round Winner ${currentRound + 1}`,
      start: currentRound + 1,
      end: currentRound + 1,
    },
    ...Array.from({ length: Math.ceil(1440 / 5) }, (_, i) => {
      const start = i * 5 + 1;
      const end = start + 4;
      return {
        Description: `Round ${start} to ${end} Maximum Bet`,
        start,
        end,
      };
    }).filter((round) => round.end >= currentRound),
  ];

  const advanceBets = [
    { start: 1, end: 180, Description: "Maximum Round Winner is Red" },
    { start: 1, end: 180, Description: "Minimum Round Winner is Black" },
  ];

  const handleColorBet = (color: RedBlackPlacementType) => {
    if (gameState.isPlaceOver || isAdvancePlacingBet) {
      toast.error("Betting Time is Over");
      return;
    }

    mutateAdvanceGameRecord({
      amount: globalBetAmount,
      currentRoundId: roundRecord.id,
      placementType: color,
      advancePlacementType: RedBlackAdvancePlacementType.CURRENT,
      startRoundOfBet:roundRecord.todayCount ?? 0,
      endRoundOfBet:roundRecord.todayCount ?? 0,
    });
  };

  const handleRangeBet = (start: number, end: number, color: RedBlackPlacementType) => {
    if (isAdvancePlacingBet) return;

    const isRangeBet = start !== end;
    const advancePlacementType = isRangeBet ? RedBlackAdvancePlacementType.FIVE : RedBlackAdvancePlacementType.NEXT;

    mutateAdvanceGameRecord({
      amount: globalBetAmount,
      currentRoundId: roundRecord.id,
      placementType: color,
        advancePlacementType: advancePlacementType,
      startRoundOfBet:start,
      endRoundOfBet:end,
    });
  };

  const fancyBetCount = useMemo(() => {
    return advancePlacements
      .filter(placement => {
        // Check if placement matches any fancy round
        const matchesFancyRound = fancyRounds.some(
          round => placement.isRangeBet &&
            placement.startRound === round.start &&
            placement.endRound === round.end
        );
        return matchesFancyRound;
      }).length

  }, [advancePlacements, fancyRounds]);

  const advanceBetCount = useMemo(() => {
    return advanceBets.filter(bet => {
      return advancePlacements.some(
        p => p.isRangeBet &&
          p.startRound === bet.start &&
          p.endRound === bet.end
      );
    }).length;
  }, [advancePlacements, advanceBets]);


  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full bg-zinc-900/95 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      <ScrollArea
        className="h-full"
        type="auto"
      >
        <div className="w-full bg-gradient-to-r from-red-500/10 via-zinc-900/50 to-zinc-800/10 py-3 px-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-red-400 to-zinc-300 bg-clip-text text-transparent">
            Place Your Bets
          </h2>
        </div>
        <div className="flex gap-2 md:flex-row flex-col p-4">
          <div className="w-full space-y-6">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="current-bets"
                className="border-none bg-gradient-to-br from-[#a11d4c] to-[#0d123f] overflow-hidden"
              >
                <AccordionTrigger iconClassName="text-white" className="py-4 px-4 hover:no-underline">
                  <span className="text-white font-medium">
                    {t("current-bets")}
                  </span>
                  <div className="text-white text-sm ml-auto space-x-2 mr-2">
                    {redBets > 0 && <span className="bg-red-500 px-2 py-1 rounded-md">Rs. {redBets}</span>}
                    {blackBets > 0 && <span className="bg-zinc-800 px-2 py-1 rounded-md">Rs.{blackBets}</span>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-4">
                    <div className="flex gap-2 w-full justify-between">
                      <button
                        onClick={() =>
                          handleColorBet(RedBlackPlacementType.RED)
                        }
                        className="px-6 py-2 flex-1 text-white text-center hover:from-red-600 hover:to-red-700 transition-all"
                      >
                        RED {redBets > 0 && <span className="text-red-400">(Rs. {redBets})</span>}
                      </button>
                      <button
                        onClick={() =>
                          handleColorBet(RedBlackPlacementType.BLACK)
                        }
                        className="px-6 py-2 text-white text-center flex-1 hover:from-zinc-700 hover:to-zinc-800 transition-all"
                      >
                        BLACK {blackBets > 0 && <span className="text-zinc-400">(Rs.{blackBets})</span>}
                      </button>
                    </div>
                    <div className="flex gap-2 w-full justify-between">
                      <button
                        onClick={() =>
                          handleColorBet(RedBlackPlacementType.RED)
                        }
                        className="rounded-md flex-1 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
                      >
                        1.77x
                      </button>
                      <button
                        onClick={() =>
                          handleColorBet(RedBlackPlacementType.BLACK)
                        }
                        className="rounded-md flex-1 px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-700 hover:to-zinc-800 transition-all"
                      >
                        1.77x
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="fancy-bets"
                className="border-none bg-gradient-to-br from-[#e88a0f] to-[#ad0707] overflow-hidden"
              >
                <AccordionTrigger iconClassName="text-white" className="py-4 px-4 hover:no-underline mr-2">
                  <span className="text-white font-medium">
                    {t("fancy-bets")}
                  </span>
                  <div className="text-white text-sm ml-auto space-x-2">
                    {fancyBetCount > 0 && <span className="bg-orange-500 px-2 py-1 rounded-md">
                      {fancyBetCount} bets
                    </span>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-black w-full space-y-3 p-4">
                    <div className="flex  items-center gap-2">
                      <div className="flex-1"/>
                      <div className="flex  justify-end gap-2">
                        <div className="text-white w-24  text-center font-medium">
                          Red
                        </div>
                        <div className="text-white w-24 text-center font-medium">
                          Black
                        </div>
                      </div>
                    </div>
                    {fancyRounds.map(({ start, end, Description }, index) => {
                      const redBetAmount = advancePlacements
                        .filter(p => p.isRangeBet && p.startRound === start && p.endRound === end && p.placementType === RedBlackPlacementType.RED)
                        .reduce((sum, p) => sum + p.amount, 0);

                      const blackBetAmount = advancePlacements
                        .filter(p => p.isRangeBet && p.startRound === start && p.endRound === end && p.placementType === RedBlackPlacementType.BLACK)
                        .reduce((sum, p) => sum + p.amount, 0);

                      const totalBets = advancePlacements
                        .filter(p => p.isRangeBet && p.startRound === start && p.endRound === end)
                        .length;

                      return (
                        <div key={index} className="flex items-center gap-4 px-2">
                          <div className="flex-1 text-sm text-zinc-200">
                            {Description}
                            {totalBets > 0 && <span className=" text-white"> ({totalBets} bets)</span>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRangeBet(start, end, RedBlackPlacementType.RED)}
                              className="rounded-md px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
                            >
                              {redBetAmount > 0 ? `Rs. ${redBetAmount}` : "1.77x"}
                              {
                                redBetAmount > 0 && <span className="text-white text-xs backdrop-blur-sm p-1 rounded-sm">1.77x</span>
                              }
                            </button>
                            <button
                              onClick={() => handleRangeBet(start, end, RedBlackPlacementType.BLACK)}
                              className="rounded-md px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-700 hover:to-zinc-800 transition-all"
                            >
                              {blackBetAmount > 0 ? `Rs. ${blackBetAmount}` : "1.77x"}
                              {
                                blackBetAmount > 0 && <span className="text-white text-xs backdrop-blur-sm p-1 rounded-sm">1.77x</span>
                              }
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="advance-bets"
                className="border-none bg-gradient-to-br from-[#b91c1c] to-[#450a0a] overflow-hidden"
              >
                <AccordionTrigger iconClassName="text-white" className="py-4 px-4 hover:no-underline">
                  <span className="text-zinc-200 font-medium">
                    {t("advance-bets")}
                  </span>
                  <div className="text-white text-sm space-x-2 ml-auto mr-2">
                    {advanceBetCount > 0 && <span className="bg-red-500 px-2 py-1 rounded-md">
                      {advanceBetCount} bets
                    </span>}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-4">
                  <div className="flex  items-center gap-2">
                      <div className="flex-1"/>
                      <div className="flex  justify-end gap-2">
                        <div className="text-white w-24  text-center font-medium">
                          Yes
                        </div>
                        <div className="text-white w-24 text-center font-medium">
                          No
                        </div>
                      </div>
                    </div>
                    {advanceBets.map(({ start, end, Description }, index) => {
                      const redBetAmount = advancePlacements
                        .filter(p => p.isRangeBet && p.startRound === start && p.endRound === end && p.placementType === RedBlackPlacementType.RED)
                        .reduce((sum, p) => sum + p.amount, 0);

                      const blackBetAmount = advancePlacements
                        .filter(p => p.isRangeBet && p.startRound === start && p.endRound === end && p.placementType === RedBlackPlacementType.BLACK)
                        .reduce((sum, p) => sum + p.amount, 0);

                      return (
                        <div key={index} className="flex items-center gap-4 px-2">
                          <div className="flex-1 text-sm text-zinc-200">
                            {Description}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRangeBet(start, end, RedBlackPlacementType.RED)}
                              className="rounded-md px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
                            >
                              {redBetAmount > 0 ? `Rs. ${redBetAmount}` : "1.77x"}
                            </button>
                            <button
                              onClick={() => handleRangeBet(start, end, RedBlackPlacementType.BLACK)}
                              className="rounded-md px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white hover:from-zinc-700 hover:to-zinc-800 transition-all"
                            >
                              {blackBetAmount > 0 ? `Rs. ${blackBetAmount}` : "1.77x"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
};

export default PlaceBets;
