import { useAuthStore } from "@/context/auth-context";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { cn } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import Lobby from "@/models/lobby";
import LobbyRound from "@/models/lobby-round";
import User from "@/models/user";
import { useCreatePlacementBet, useGetMyPlacements } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import BettingChips from "./betting-chip";
import { Bet, Chip } from "./contants";
import { BettingControls } from "./multiplayer-betting-game";
import GameResultDialog from "./result-dialog";
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeader } from "./roulette-header";



type Props = {
    lobbyRound: LobbyRound;
    lobby: Lobby;
    previousRoundId?: string;
};

const MultiplayerRouletteGame = ({ lobbyRound }: Props) => {
    const roundRecord = lobbyRound.roundRecord!;
    const t = useTranslations("game");
    const [betAmount, setBetAmount] = useState<number>(10);
    const gameState = useGameState(roundRecord);
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as User;
    const { mutate, isPending: isPlacingBet } = useCreatePlacementBet();

    const boardRef = useRef<HTMLDivElement>(null);

    const { data, isSuccess } = useGetMyPlacements({ roundId: roundRecord.id });

    const bettedChips = useMemo(() => {
        if (!isSuccess) return [];
        const gameRecords: GameRecord[] = data.data.map((record: Partial<GameRecord>) => new GameRecord(record));
        const chips = gameRecords.map((record) => ({
            type: record.placementType,
            amount: record.amount,
            numbers: record.market.map((market) => roundRecord.market.findIndex((m) => m.id === market) + 1)
        }));
        return chips;
        
    }, [data]);

    const { previousRoundId, showResults } = useShowResults(roundRecord, bettedChips);


    const {
        chips,
        setChips,
        hoveredCell,
        getBetPosition,
        setHoveredCell,
        getBetTypeFromClick
    } = useRouletteBetting({ container: boardRef });

    const handlePlaceBet = () => {
        const chip = chips[0];
        if (!chip) return;

        const markets = chip.numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);

        mutate({
            marketItemId: markets[0],
            lobbyRoundId: lobbyRound.id,
        }, {
            onSuccess: () => {
                setChips([]);
            }
        });
    };


    const handleBoardClick = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        if (!bet) return;

        const position = getBetPosition(bet);
        setChips([{
            ...bet,
            amount: betAmount,
            position,
        }]);
    };

    const boardChips = gameState.isPlaceOver ? bettedChips : [...bettedChips, ...chips];

    const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(roundRecord.type);
    return (
        <div className="max-w-4xl mx-auto lg:px-4 px-2 py-2  ">
            <div className="relative rounded-xl lg:flex-row flex-col flex gap-8 border-brown-800">
                <div className='lg:w-6/12'>
                    <h1 className='text-xl lg:text-left text-center mt-2 mb-4 leading-none text-white font-semibold'>
                        {gameState.isPlaceOver ? t("betting-closed") : t("place-your-bets")}
                    </h1>

                    <div className={cn("relative w-full max-w-4xl mx-auto ", gameState.isPlaceOver || isNotAllowedToPlaceBet ? 'cursor-not-allowed opacity-100' : 'cursor-crosshair')}>

                        {isNotAllowedToPlaceBet && (<div className="absolute top-0 left-0 w-full text-center h-full z-40 bg-black bg-opacity-80">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="text-white text-lg opacity-100  font-semibold">{t("betting-not-allowed")}</span>
                            </div>
                        </div>)}

                        <div className="flex w-full">
                            <div
                                ref={boardRef}
                                onClick={!(gameState.isPlaceOver || isNotAllowedToPlaceBet) ? handleBoardClick : undefined}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`relative flex-1 mx-auto`}
                            >
                                <RouletteBettingGrid
                                    roundRecord={roundRecord}
                                    hoveredCell={hoveredCell as unknown as Bet}
                                    chips={chips as unknown as Chip[]}
                                    previousRoundId={previousRoundId?.toString()}
                                />
                                <BettingChips chips={boardChips} getBetPosition={getBetPosition} />
                            </div>

                        </div>


                    </div>
                </div>
                <div className='lg:w-6/12 flex justify-between flex-col '>
                    <GameHeader gameState={gameState} />
                    <BettingControls
                        isLoading={isPlacingBet}
                        betAmount={betAmount}
                        onPlaceBet={handlePlaceBet}
                        setBetAmount={setBetAmount}
                        isPlaceOver={gameState.isPlaceOver || isNotAllowedToPlaceBet}
                    />
                </div>
                <GameResultDialog key={String(showResults)} open={showResults} roundRecordId={previousRoundId!} />
            </div>
        </div>
    );
};

export default MultiplayerRouletteGame;