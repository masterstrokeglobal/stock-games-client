import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import {
  BLACK_NUMBERS,
  cn,
  getPlacementString,
  RED_NUMBERS,
} from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import User from "@/models/user";
import {
  useCreateGameRecord,
  useGetMyPlacements,
} from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import BettingChips from "./betting-chip";
import { Bet, Chip } from "./contants";
import GameResultDialog from "./result-dialog";
import { BettingControls } from "./roulette-chips";
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeaderBackground } from "./roulette-header";
import useWindowSize from "@/hooks/use-window-size";
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

type Props = {
  roundRecord: RoundRecord;
  previousRoundId?: string;
  className?: string;
};

const gameTimer = (gameState: any) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
        <svg
          width={40}
          height={40}
          className="block"
          style={{ display: "block" }}
        >
          {/* Empty circle background */}
          <circle
            cx={20} // ✅ center horizontally
            cy={20} // ✅ center vertically
            r={18} // ✅ radius = (40 - strokeWidth) / 2 → keeps stroke inside
            stroke="#1E3A8A"
            strokeWidth={4}
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx={20}
            cy={20}
            r={18}
            stroke="#3B82F6"
            strokeWidth={4}
            fill="none"
            strokeLinecap="butt"
            strokeDasharray={113.1} // ✅ circumference = 2πr ≈ 113.1
            strokeDashoffset={(() => {
              const getTime = () => {
                if (gameState.isGameOver) {
                  return "00:00";
                }
                return gameState.isPlaceOver
                  ? gameState.gameTimeLeft.formatted
                  : gameState.placeTimeLeft.formatted;
              };
              const getTimeInSeconds = () => {
                const timeStr = getTime();
                const [minutes, seconds] = timeStr.split(":").map(Number);
                return minutes * 60 + seconds;
              };
              const totalTime = 27;
              const timeLeft = getTimeInSeconds();
              const progress = timeLeft / totalTime;
              return 113.1 * (1 - progress);
            })()}
            style={{
              transition: "stroke-dashoffset 1s linear",
            }}
            transform="rotate(-90 20 20)" // ✅ rotate around center
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-white text-sm font-normal"
            style={{ fontFamily: "inherit" }}
          >
            {(() => {
              if (gameState.isGameOver) {
                return "00:00";
              }
              return gameState.isPlaceOver
                ? gameState.gameTimeLeft.formatted
                : gameState.placeTimeLeft.formatted;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

const RouletteGame = ({ roundRecord, className }: Props) => {
  const t = useTranslations("game");
  const [betAmount, setBetAmount] = useState<number>(100);
  const gameState = useGameState(roundRecord);
  const { userDetails } = useAuthStore();
  const currentUser = userDetails as User;
  const { mutate, isPending: isPlacingBet } = useCreateGameRecord();
  const { isMobile } = useWindowSize();
  const boardRef = useRef<HTMLDivElement>(null);

  const { data, isSuccess } = useGetMyPlacements({ roundId: roundRecord.id });

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

  const { currentRoundId: previousRoundId, showResults } = useShowResults(
    roundRecord,
    bettedChips
  );

  const {
    chips,
    setChips,
    hoveredCell,
    getBetPosition,
    setHoveredCell,
    getBetTypeFromClick,
  } = useRouletteBetting({ container: boardRef });

  // Function to check if there's a bet on a specific type and numbers
  const getBetForPosition = (type: PlacementType, numbers: number[]) => {
    const allChips = [...bettedChips];
    const chip = allChips.find(
      (chip) =>
        chip.type === type &&
        chip.numbers.length === numbers.length &&
        chip.numbers.every((num) => numbers.includes(num))
    );
    return chip;
  };

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

  const ButtonChip = ({
    amount,
    className,
  }: {
    amount: number;
    className?: string;
  }) => (
    <div
      className={cn(
        "absolute top-1/2 right-4 translate-x-1/2 -translate-y-1/2 bg-[url('/images/betting-chip.png')] bg-contain bg-no-repeat aspect-square bg-center p-1 text-white text-[10px] font-semibold rounded-full  min-w-6 min-h-6 flex items-center justify-center ",
        className
      )}
    >
      {amount}
    </div>
  );

  // Handler for side bets using DOUBLE_STREET type
  const handleSideBet = (numbers: number[]) => {
    if (gameState.isPlaceOver || isPlacingBet) return;
    if (!verifyBetAmount(betAmount)) return;

    const markets = numbers
      .map((number) => roundRecord.market[number - 1]?.id)
      .filter((id) => id !== undefined);

    mutate({
      amount: betAmount,
      round: roundRecord.id,
      horseNumbers: numbers,
      placementType: PlacementType.DOUBLE_STREET,
      market: markets,
      placedValues: getPlacementString(
        {
          market: markets as number[],
          placementType: PlacementType.DOUBLE_STREET,
        },
        roundRecord
      ),
    });
  };

  const handleColorBet = (numbers: number[]) => {
    if (gameState.isPlaceOver || isPlacingBet) return;
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

  const handleSpecialBet = (betType: PlacementType, numbers: number[]) => {
    if (gameState.isPlaceOver || isPlacingBet) return;
    if (!verifyBetAmount(betAmount)) return;

    const markets = numbers
      .map((number) => roundRecord.market[number - 1]?.id)
      .filter((id) => id !== undefined);

    mutate(
      {
        amount: betAmount,
        round: roundRecord.id,
        placementType: betType,
        market: markets,
        horseNumbers: numbers,
        placedValues: getPlacementString(
          {
            market: markets as number[],
            placementType: betType,
          },
          roundRecord
        ),
      },
      {
        onSuccess: () => {
          setChips([]);
        },
      }
    );
  };
  const handleZeroBet = () => {
    if (gameState.isPlaceOver || isPlacingBet) return;
    if (!verifyBetAmount(betAmount)) return;

    const marketId = roundRecord.market[roundRecord.market.length - 1]?.id;
    if (!marketId) return;
    mutate({
      amount: betAmount,
      round: roundRecord.id,
      placementType: PlacementType.SINGLE,
      horseNumbers: [17],
      market: [marketId],
      placedValues: getPlacementString(
        { market: [marketId], placementType: PlacementType.SINGLE },
        roundRecord
      ),
    });
  };

  // Get all numbers for specific sections and other bets
  const first8Numbers = Array.from({ length: 8 }, (_, i) => i + 1);
  const second8Numbers = Array.from({ length: 8 }, (_, i) => i + 1 + 8);

  const evenNumbers = Array.from({ length: 8 }, (_, i) => (i + 1) * 2);
  const oddNumbers = Array.from({ length: 8 }, (_, i) => i * 2 + 1);

  const handleBoardClick = (e: React.MouseEvent) => {
    if (gameState.isPlaceOver || isPlacingBet) return;
    if (!verifyBetAmount(betAmount)) return;
    const bet = getBetTypeFromClick(e, boardRef);
    if (!bet) return;

    const position = getBetPosition(bet);
    setChips([
      {
        ...bet,
        amount: betAmount,
        position,
      },
    ]);

    const markets = bet.numbers
      .map((number) => roundRecord.market[number - 1]?.id)
      .filter((id) => id !== undefined);

    mutate(
      {
        amount: betAmount,
        round: roundRecord.id,
        placementType: bet.type,
        market: markets,
        horseNumbers: bet.numbers,
        placedValues: getPlacementString(
          {
            market: markets as number[],
            placementType: bet.type,
          },
          roundRecord
        ),
      },
      {
        onSuccess: () => {
          setChips([]);
        },
      }
    );
  };

  const boardChips = gameState.isPlaceOver
    ? bettedChips
    : [...bettedChips, ...chips];

  const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(
    roundRecord.type
  );

  return (
    <>
      <div
        className={cn(
          "mx-auto  lg:pr-4  md:py-2 md:rounded-sm  bg-[#000E37] h-full ",
          className
        )}
      >
        <div className="relative rounded-xl lg:flex-row w-full flex-col flex border-brown-800">
          <div className="lg:w-7/12 max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center w-full relative">
              <h1
                id="betting-game-header"
                className="text-xl text-left md:py-2 py-4 md:mx-4 md:px-0 px-4 leading-none text-game-secondary font-semibold "
              >
                {gameState.isPlaceOver
                  ? t("betting-closed")
                  : t("place-your-bets")}
              </h1>
              {isMobile && !gameState.isPlaceOver && (
                <div className="px-4">
                  {gameTimer(gameState)}
                </div>
              )}

              <div className="gradient-line absolute bottom-0 left-0 w-full" />
            </div>

            <div
              className={cn(
                "relative w-full  p-4  ",
                gameState.isPlaceOver || isNotAllowedToPlaceBet
                  ? "cursor-not-allowed opacity-100"
                  : "cursor-crosshair"
              )}
            >
              {isNotAllowedToPlaceBet && (
                <div className="absolute top-0 left-0 w-full text-center h-full z-40 bg-black bg-opacity-80">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-game-text text-lg opacity-100  font-semibold">
                      {t("betting-not-allowed")}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex w-full ">
                <div
                  ref={boardRef}
                  onClick={
                    !(gameState.isPlaceOver || isNotAllowedToPlaceBet)
                      ? handleBoardClick
                      : undefined
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`relative flex-1 mx-auto`}
                >
                  <RouletteBettingGrid
                    roundRecord={roundRecord}
                    hoveredCell={hoveredCell as unknown as Bet}
                    chips={chips as unknown as Chip[]}
                    previousRoundId={previousRoundId?.toString()}
                  />
                  <BettingChips
                    chips={boardChips}
                    getBetPosition={getBetPosition}
                    roundRecord={roundRecord}
                  />
                </div>

                <div className="grid grid-rows-1 gap-2 ">
                  <Button
                    disabled={gameState.isPlaceOver || isNotAllowedToPlaceBet}
                    onClick={handleZeroBet}
                    variant="game-secondary"
                    className="col-span-1 w-10 relative bg-[linear-gradient(177deg,#FFC857_-0.32%,#7F5E1B_50.24%,#FFC857_100.79%)] justify-center gap-4 text-white ml-2 h-full "
                  >
                    <span className="rotate-text">
                      0 &nbsp;
                      {roundRecord.market[16]?.codeName}
                    </span>
                    {getBetForPosition(PlacementType.SINGLE, [17]) && (
                      <ButtonChip
                        className=" top/1/2  right-1/2 translate-x-1/2 -translate-y-1/2"
                        amount={
                          getBetForPosition(PlacementType.SINGLE, [17])!.amount
                        }
                      />
                    )}
                    {roundRecord.winningId === roundRecord.market[16]?.id && (
                      <img
                        className="z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto md:h-7 h-6 animate-pulse  duration-500 "
                        src="/images/crown.png"
                      />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Button
                      variant="game-tertiary"
                      className="h-full w-full flex items-center justify-center relative"
                      onClick={() => handleSideBet(first8Numbers)}
                    >
                      <span>1 to 8</span>
                    </Button>
                    {getBetForPosition(
                      PlacementType.DOUBLE_STREET,
                      first8Numbers
                    ) && (
                      <ButtonChip
                        amount={
                          getBetForPosition(
                            PlacementType.DOUBLE_STREET,
                            first8Numbers
                          )!.amount
                        }
                      />
                    )}
                  </div>

                  <div className="relative">
                    <Button
                      variant="game-tertiary"
                      className="h-full w-full flex items-center justify-center relative"
                      onClick={() => handleSideBet(second8Numbers)}
                    >
                      <span>9 to 16</span>
                    </Button>
                    {getBetForPosition(
                      PlacementType.DOUBLE_STREET,
                      second8Numbers
                    ) && (
                      <ButtonChip
                        amount={
                          getBetForPosition(
                            PlacementType.DOUBLE_STREET,
                            second8Numbers
                          )!.amount
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Button
                      variant="game-quaternary"
                      className="h-full w-full flex items-center justify-center relative"
                      onClick={() => handleColorBet(RED_NUMBERS)}
                    >
                      <span className="size-5  routelette-piece-red !border-game-text rounded-none rotate-45" />
                    </Button>
                    {getBetForPosition(PlacementType.COLOR, RED_NUMBERS) && (
                      <ButtonChip
                        amount={
                          getBetForPosition(PlacementType.COLOR, RED_NUMBERS)!
                            .amount
                        }
                      />
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      variant="game-quaternary"
                      className="h-full w-full flex items-center justify-center relative"
                      onClick={() => handleColorBet(BLACK_NUMBERS)}
                    >
                      <span className="size-5  routelette-piece-black rotate-45 !border-game-text rounded-none" />
                    </Button>
                    {getBetForPosition(PlacementType.COLOR, BLACK_NUMBERS) && (
                      <ButtonChip
                        amount={
                          getBetForPosition(PlacementType.COLOR, BLACK_NUMBERS)!
                            .amount
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Button
                      variant="game-tertiary"
                      className="h-10 w-full text-center flex items-center justify-center"
                      onClick={() =>
                        handleSpecialBet(PlacementType.EVEN_ODD, evenNumbers)
                      }
                    >
                      EVEN
                    </Button>
                    {getBetForPosition(PlacementType.EVEN_ODD, evenNumbers) && (
                      <ButtonChip
                        amount={
                          getBetForPosition(
                            PlacementType.EVEN_ODD,
                            evenNumbers
                          )!.amount
                        }
                      />
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      variant="game-tertiary"
                      className="h-10 w-full flex items-center justify-center"
                      onClick={() =>
                        handleSpecialBet(PlacementType.EVEN_ODD, oddNumbers)
                      }
                    >
                      ODD
                    </Button>
                    {getBetForPosition(PlacementType.EVEN_ODD, oddNumbers) && (
                      <ButtonChip
                        amount={
                          getBetForPosition(PlacementType.EVEN_ODD, oddNumbers)!
                            .amount
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-5/12 flex justify-between flex-col">
            <GameHeaderBackground gameState={gameState} className="flex-1" />
            <BettingControls
              isLoading={isPlacingBet}
              betAmount={betAmount}
              roundId={roundRecord.id}
              setBetAmount={setBetAmount}
              isPlaceOver={gameState.isPlaceOver || isNotAllowedToPlaceBet}
            />
          </div>
        </div>
      </div>
      <GameResultDialog
        key={String(showResults)}
        open={showResults}
        roundRecordId={previousRoundId!}
      />
    </>
  );
};

export default RouletteGame;
