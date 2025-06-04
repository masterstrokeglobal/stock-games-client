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
import { PlacementType } from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { useCreateAdvanceGameRecord } from "@/react-query/advance-game-record-queries";
import { useCreateGameRecord } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  roundRecord: RoundRecord;
};

const PlaceBets = ({ className, roundRecord }: Props) => {
  const t = useTranslations("game");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
  const gameState = useGameState(roundRecord);
  const currentRound = roundRecord.todayCount || -1;
  const { mutate: mutateGameRecord, isPending: isPlacingBet } =
    useCreateGameRecord();
  const { mutate: mutateAdvanceGameRecord, isPending: isAdvancePlacingBet } =
    useCreateAdvanceGameRecord();
  const [betAmount, setBetAmount] = useState<number>(100);

  const fancyRounds = [
    {
      Description: "Next Round Winner",
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
    { start: 1, end: 1, Description: "Maximum Round Winner is Red" },
    { start: 1, end: 1, Description: "Minimum Round Winner is Black" },
    { start: 1, end: 1, Description: "In Round 1 to 20 Red will win" },
    { start: 1, end: 1, Description: "In Round 10 to 20 Black will win" },
    { start: 1, end: 1, Description: "In Round 1 to 40 Red will win" },
    { start: 1, end: 1, Description: "In Round 1 to 40 Black will win" },
  ];

  const handleColorBet = (numbers: number[]) => {
    if (gameState.isPlaceOver || isPlacingBet) return;
    // if (!verifyBetAmount(betAmount)) return;
    setBetAmount(100);
    const markets = numbers
      .map((number) => roundRecord.market[number - 1]?.id)
      .filter((id) => id !== undefined);

    mutateGameRecord({
      amount: betAmount,
      round: roundRecord.id,
      horseNumbers: numbers,
      placementType: PlacementType.COLOR,
      market: markets,
      placedValues: getPlacementString(
        {
          market: markets as number[],
          placementType: PlacementType.COLOR,
        },
        roundRecord
      ),
    });
  };

  const handleRangeBet = (start: number, end: number, numbers: number[]) => {
    if (gameState.isPlaceOver || isAdvancePlacingBet) return;
    // if (!verifyBetAmount(betAmount)) return;
    setBetAmount(100);
    const markets = numbers
      .map((number) => roundRecord.market[number - 1]?.id)
      .filter((id) => id !== undefined);

    mutateAdvanceGameRecord({
      amount: betAmount,
      round: roundRecord.id,
      horseNumbers: numbers,
      placementType: PlacementType.ROUND_RANGE,
      market: markets,
      startRoundOfBet: start,
      endRoundOfBet: end,
      placedValues: getPlacementString(
        {
          market: markets as number[],
          placementType: PlacementType.COLOR,
        },
        roundRecord
      ),
    });
  };

  useEffect(() => {
    if (sectionRef.current) {
      const sectionHeight = sectionRef.current.offsetHeight - 30;
      setScrollAreaHeight(sectionHeight);
    }
  }, []);

  console.log("Round Record:", roundRecord);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "md:rounded-2xl w-full bg-zinc-900/95 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      <ScrollArea
        className="h-full"
        style={{ height: `${scrollAreaHeight}px` }}
        type="auto"
      >
        <div className="w-full bg-gradient-to-r from-red-500/10 via-zinc-900/50 to-zinc-800/10 py-3 px-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-red-400 to-zinc-300 bg-clip-text text-transparent">
            Place Your Bets
          </h2>
        </div>
        <div className="flex gap-2 md:flex-row flex-col p-4">
          <div className="w-full space-y-6">
            <div className="bg-zinc-800/30 rounded-xl overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="flex border-b border-zinc-700/50">
                    <th className="p-4 text-lg font-semibold text-center bg-gradient-to-r from-red-400 to-zinc-300 bg-clip-text text-transparent w-full">
                      {t("current-bets")}
                    </th>
                  </tr>
                  <tr className="flex border-b border-zinc-700/50">
                    <th className="p-4 text-base font-medium text-center flex-1">
                      <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                        {t("red")}
                      </span>
                    </th>
                    <th className="p-4 text-base font-medium text-center flex-1">
                      <span className="bg-gradient-to-r from-zinc-200 to-zinc-300 bg-clip-text text-transparent">
                        {t("black")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex">
                    <td className="p-4 text-sm flex-1">
                      <button
                        onClick={() => handleColorBet(RED_NUMBERS)}
                        className="w-full py-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
                      >
                        1.77x
                      </button>
                    </td>
                    <td className="p-4 text-sm flex-1">
                      <button
                        onClick={() => handleColorBet(BLACK_NUMBERS)}
                        className="w-full py-3 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
                      >
                        1.99x
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="fancy-bets"
                className="border-none bg-zinc-800/30 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="py-4 px-4 hover:no-underline">
                  <span className="text-red-400 font-medium">
                    {t("fancy-bets")}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-4">
                    {fancyRounds.map(({ start, end, Description }, index) => (
                      <div key={index} className="flex items-center gap-4 px-2">
                        <div className="flex-1 text-sm text-zinc-400">
                          {Description}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleRangeBet(start, end, RED_NUMBERS)
                            }
                            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                          >
                            1.77x
                          </button>
                          <button
                            onClick={() =>
                              handleRangeBet(start, end, BLACK_NUMBERS)
                            }
                            className="px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all"
                          >
                            1.77x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="advance-bets"
                className="border-none bg-zinc-800/30 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="py-4 px-4 hover:no-underline">
                  <span className="text-zinc-200 font-medium">
                    {t("advance-bets")}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 p-4">
                    {advanceBets.map(({ start, end, Description }, index) => (
                      <div key={index} className="flex items-center gap-4 px-2">
                        <div className="flex-1 text-sm text-zinc-400">
                          {Description}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleRangeBet(start, end, RED_NUMBERS)
                            }
                            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                          >
                            1.77x
                          </button>
                          <button
                            onClick={() =>
                              handleRangeBet(start, end, BLACK_NUMBERS)
                            }
                            className="px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all"
                          >
                            1.77x
                          </button>
                        </div>
                      </div>
                    ))}
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
