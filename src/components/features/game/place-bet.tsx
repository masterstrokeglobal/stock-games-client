"use client";
import FancyButton from "@/components/ui/fancy-btn";
// import FancyBetButton from "@/components/ui/fancyBetBtn";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  cn,
  getPlacementString,
} from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { useCreateGameRecord, useGetMyPlacements } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "./contants";
import { useGameState } from "@/hooks/use-current-game";
import { toast } from "sonner";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";

type Props = {
  className?: string;
  roundRecord: RoundRecord;
  previousRoundId?: string;
};

enum PlacementType {
  SINGLE = "single",
  SPLIT = "split",
  QUARTER = "quarter",
  STREET = "street",
  DOUBLE_STREET = "double_street",
  CORNER = "corner",
  COLUMN = "column",
  COLOR = "color",
  EVEN_ODD = "even_odd",
  HIGH_LOW = "high_low",
}

const PlaceBets = ({ className, roundRecord  }: Props) => {
  console.log("Round:", roundRecord);
  const gameState = useGameState(roundRecord);
  const { mutate, isPending: isPlacingBet } = useCreateGameRecord();
  const t = useTranslations("game");
  const [betAmount, setBetAmount] = useState<number>(100);
  const { userDetails } = useAuthStore();
  const currentUser = userDetails as User;
  const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(
  roundRecord.type
);
  const { data, isSuccess } = useGetMyPlacements({
    roundId: roundRecord.id.toString(),
  });

  const currentBetsData: GameRecord[] = useMemo(() => {
  if (isSuccess) {
    return data.data;
  }
  return [];
}, [isSuccess, data]);

  console.log("Bets Placed : " , currentBetsData);



  const bettedChips = useMemo(() => {
    if (!isSuccess) return [];
    const gameRecords: GameRecord[] = data.data.map(
      (record: Partial<GameRecord>) => new GameRecord(record)
    );
    const chips = gameRecords.map((record) => ({
      type: record.placementType,
      amount: record.amount,
      numbers: record.market.map(
        (market) => roundRecord.market.findIndex((m) => m.id === market) + 1
      ),
    }));

    // aggregate chips with the same type and numbers
    const aggregatedChips: Chip[] = [];

    chips.forEach((chip) => {
      const existingChip = aggregatedChips.find(
        (c) =>
          c.type === chip.type &&
          c.numbers.length === chip.numbers.length &&
          c.numbers.every((num) => chip.numbers.includes(num))
      );
      if (existingChip) {
        existingChip.amount += chip.amount;
      } else {
        aggregatedChips.push(chip);
      }
    });
    return aggregatedChips;
  }, [data]);


  const verifyBetAmount = useCallback(
    (amount: number) => {
      const minAmount = currentUser.company?.minPlacement;
      const maxAmount = currentUser.company?.maxPlacement;
      const totalBetAmount = bettedChips.reduce(
        (acc, chip) => acc + chip.amount,
        0
      );
      if (minAmount && totalBetAmount + amount < minAmount) {
        toast.error("Minimum bet amount is " + minAmount);
        return false;
      }
      if (maxAmount && totalBetAmount + amount > maxAmount) {
        toast.error("Maximum bet amount is " + maxAmount);
        return false;
      }
      return true;
    },
    [currentUser, bettedChips]
  );

  const handleColorBet = (numbers: number[]) => {
  if (isNotAllowedToPlaceBet) {
    toast.error("You are not allowed to place bets");
    return;
  }
  if( isPlacingBet) {
    toast.error("Betting is in progress, please wait");
    return;
  }

  if (gameState.isPlaceOver || isPlacingBet) {
    toast.error("Betting Time is Over");
    return;
  }
  setBetAmount(betAmount);
  if (!verifyBetAmount(betAmount)) return;

  const markets = numbers
    .map((number) => roundRecord.market[number - 1]?.id)
    .filter((id) => id !== undefined);

  mutate({
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
  

  // const totalAmount = useMemo(() => {
  //   return currentBetsData.reduce((acc, bet) => acc + bet.amount, 0);
  // }, [currentBetsData]);


  const getRoundNumber = (currentTime: any) => {
    const startTime: any = new Date();
    startTime.setHours(9, 30, 0, 0); // 9:30 AM

    const endTime: any = new Date();
    endTime.setHours(15, 25, 0, 0); // 3:25 PM

    const now: any =
      currentTime instanceof Date ? currentTime : new Date(currentTime);

    if (now < startTime || now > endTime) {
      return null; // Outside of trading hours
    }

    const minutesSinceStart = Math.floor((now - startTime) / (1000 * 60));

    const roundNumber = Math.floor(minutesSinceStart / 2) + 1;

    return roundNumber;
  };

  const totalRounds = 178;
  const roundIncrement = 5;
  const roundRanges = Array.from(
    { length: Math.ceil(totalRounds / roundIncrement) },
    (_, index) => {
      const start = index * roundIncrement + 1;
      const end = Math.min(start + roundIncrement - 1, totalRounds);
      return {
        Description: `Round ${start} to ${end} Maximum Bet`,
        start,
        end,
      };
    }
  );

  const [currentRound, setCurrentRound] = useState<number | null>(null);

  useEffect(() => {
    const updateRound = () => {
      const round = getRoundNumber(new Date());
      setCurrentRound(round);
    };
    console.log("Current Round:", currentRound);
    updateRound(); // Initial call
    const interval = setInterval(updateRound, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fancyRounds = roundRanges.filter(
    ({ end }) => currentRound === null || end >= currentRound
  );

  if (fancyRounds.length > 0) {
    fancyRounds.unshift({ Description: "Next Round Winner", start: 0, end: 0 });
  }

  const advanceBets = [
    { Description: "Maximum Round Winner is Red", start: 0, end: 0 },
    { Description: "Minimum Round Winner is Black", start: 0, end: 0 },
    { Description: "In Round 1 to 20 Red will win", start: 1, end: 20 },
    { Description: "In Round 10 to 20 Black will win", start: 10, end: 20 },
    { Description: "In Round 1 to 40 Red will win", start: 1, end: 40 },
    { Description: "In Round 1 to 40 Black will win", start: 1, end: 40 },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState(0);

  // Calculate section height on mount and resize
  useEffect(() => {
    const updateSectionHeight = () => {
      if (sectionRef.current) {
        setSectionHeight(sectionRef.current.offsetHeight);
      }
    };

    // Initial height calculation
    updateSectionHeight();

    // Update height on window resize
    window.addEventListener("resize", updateSectionHeight);
    return () => window.removeEventListener("resize", updateSectionHeight);
  }, []);

  // const firstScrollAreaHeight = sectionHeight * 0.3; // 30%
  const secondScrollAreaHeight = sectionHeight * 0.6; // 40%
  const thirdScrollAreaHeight = sectionHeight * 0.4; // 30%

  return (
    <section
      ref={sectionRef}
      className={cn("md:rounded-2xl h-full w-full", className)}
    >
      <div className="flex gap-2 md:flex-row flex-col">
        <div className="w-full">
          <div>
            <table className="min-w-full">
              <thead className="game-header-highlight">
                <tr className="flex">
                  <th className="p-2 text-sm text-center text-game-secondary rounded-tl-lg flex-1">
                    {t("current-bets")}
                  </th>
                  <th className="p-2 text-sm text-center text-game-secondary rounded-tl-lg flex-1">
                    {t("red")}
                  </th>
                  <th className="p-2 text-sm text-center text-game-secondary rounded-tr-lg flex-1">
                    {t("black")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <td className="p-2 text-sm text-balance text-game-secondary rounded-l-lg flex-1"></td>
                  <td className="p-2 text-sm text-game-secondary rounded-l-lg flex-1">
                    <FancyButton handleColorBet={handleColorBet} number="1.77" code="Odds" color="red" />
                  </td>
                  <td className="p-2 text-sm text-game-secondary rounded-r-lg flex-1">
                    <FancyButton handleColorBet={handleColorBet} number="1.99" code="Odds" color="black" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {fancyRounds.length > 0 ? (
              <table className="min-w-full">
                <thead className="game-header-highlight">
                  <tr className="flex">
                    <th className="p-2 text-sm text-left capitalize text-game-secondary flex-1">
                      {t("fancy-bets")}
                    </th>
                    <th className="p-2 text-sm text-center text-game-secondary rounded-tl-lg flex-1">
                      {t("red")}
                    </th>
                    <th className="p-2 text-sm text-center text-game-secondary rounded-tr-lg flex-1">
                      {t("black")}
                    </th>
                  </tr>
                </thead>
                <ScrollArea
                  className="w-full flex-[2]"
                  style={{
                    maxHeight: `${secondScrollAreaHeight}px`,
                    overflowY: "auto",
                  }}
                  type="auto"
                >
                  <tbody>
                    {fancyRounds.map(({ Description }, index) => (
                      <tr
                        key={index}
                        className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <td className="p-2 text-sm text-game-secondary capitalize flex-1">
                          {`${Description}`}
                        </td>
                        <td className="p-2 text-sm text-game-secondary rounded-l-lg flex-1">
                          <FancyButton number="1.77" code="Odds" color="red" />
                        </td>
                        <td className="p-2 text-sm text-game-secondary rounded-r-lg flex-1">
                          <FancyButton
                            number="1.77"
                            code="Odds"
                            color="black"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollArea>
              </table>
            ) : (
              <div className="text-game-secondary py-4 text-center">
                {t("no-fancy-bets")}
              </div>
            )}
          </div>
          <div>
            <table className="min-w-full">
              <thead className="game-header-highlight">
                <tr className="flex">
                  <th className="p-2 text-sm text-left capitalize text-game-secondary flex-1">
                    {t("advance-bets")}
                  </th>
                  <th className="p-2 text-sm text-center text-game-secondary rounded-tl-lg flex-1">
                    {t("yes")}
                  </th>
                  <th className="p-2 text-sm text-center text-game-secondary rounded-tr-lg flex-1">
                    {t("no")}
                  </th>
                </tr>
              </thead>
              <ScrollArea
                className="w-full flex-[2]"
                style={{
                  maxHeight: `${thirdScrollAreaHeight}px`,
                  overflowY: "auto",
                }}
                type="auto"
              >
                <tbody>
                  {advanceBets.map(({ Description }, index) => (
                    <tr
                      key={index}
                      className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <td className="p-2 text-sm text-game-secondary capitalize flex-1">
                        {`${Description}`}
                      </td>
                      <td className="p-2 text-sm text-game-secondary rounded-l-lg flex-1">
                        <FancyButton number="1.77" code="Odds" color="red" />
                      </td>
                      <td className="p-2 text-sm text-game-secondary rounded-r-lg flex-1">
                        <FancyButton number="1.77" code="Odds" color="black" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ScrollArea>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceBets;
