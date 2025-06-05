import { useAuthStore } from "@/context/auth-context";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { cn } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import User from "@/models/user";
import {
  useGetMyPlacements,
} from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
import { Bet, Chip } from "./contants";
import GameResultDialog from "./result-dialog";
import { RedBlackRouletteBettingGrid } from "./red-black-roulette-grid";
import BettingChips from "../red-black/betting-chips";

type Props = {
  roundRecord: RoundRecord;
  previousRoundId?: string;
  globalBetAmount: number;
  handleGlobalBetAmountChange: (amount: number) => void;
};

const RedBlackRouletteGame = ({ roundRecord, globalBetAmount, handleGlobalBetAmountChange }: Props) => {
  const t = useTranslations("game");


  const gameState = useGameState(roundRecord);

  const { userDetails } = useAuthStore();
  const currentUser = userDetails as User;

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

  const { previousRoundId, showResults } = useShowResults(
    roundRecord,
    bettedChips
  );

  const {
    chips,
    hoveredCell,
    setHoveredCell,
  } = useRouletteBetting({ container: boardRef });



  const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(
    roundRecord.type
  );

  return (
    <>
      {/* {!isMobile && <ParticlesContainer />} */}
      <div >
        <div className="relative lg:flex-row w-full flex-col flex border-brown-800">
          <div className="max-w-2xl mx-auto w-full">
            <div
              className={cn(
                "relative w-full  ",
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
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`relative flex-1 mx-auto`}
                >
                  <RedBlackRouletteBettingGrid
                    roundRecord={roundRecord}
                    hoveredCell={hoveredCell as unknown as Bet}
                    chips={chips as unknown as Chip[]}
                    previousRoundId={previousRoundId?.toString()}
                    gameState={gameState}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <BettingChips globalBetAmount={globalBetAmount} showBetting={true} handleGlobalBetAmountChange={handleGlobalBetAmountChange} />
      </div>

      <GameResultDialog
        key={String(showResults)}
        open={showResults}
        roundRecordId={previousRoundId!}
      />
    </>
  );
};

export default RedBlackRouletteGame;
