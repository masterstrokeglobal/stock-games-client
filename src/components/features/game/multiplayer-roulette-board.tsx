import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { cn } from "@/lib/utils";
import { PlacementType } from "@/models/game-record";
import Lobby from "@/models/lobby";
import LobbyPlacement from "@/models/lobby-placement";
import LobbyRound from "@/models/lobby-round";
import { useCreatePlacementBet, useGetCurrentPlacementForLobbyRound } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import BettingChips from "./betting-chip";
import { Bet, Chip } from "./contants";
import { BettingControls } from "./multiplayer-betting-game";
import GameResultDialog from "./result-dialog";
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeader } from "./roulette-header";
import Link from "next/link";



type Props = {
    lobbyRound: LobbyRound;
    lobby: Lobby;
    previousRoundId?: string;
};

const MultiplayerRouletteGame = ({ lobbyRound, lobby }: Props) => {
    const roundRecord = lobbyRound.roundRecord!;
    const t = useTranslations("game");
    const [betAmount, setBetAmount] = useState<number>(lobby.amount);
    const gameState = useGameState(roundRecord);
    const { mutate, isPending: isPlacingBet } = useCreatePlacementBet();

    const boardRef = useRef<HTMLDivElement>(null);
    const { data, isSuccess } = useGetCurrentPlacementForLobbyRound(lobbyRound.id!.toString());


    const bettedChips = useMemo(() => {
        if (!isSuccess) return [];
        const gameRecords: LobbyPlacement[] = data.data.placements.map((record: Partial<LobbyPlacement>) => new LobbyPlacement(record));

        if (gameRecords.length === 0) return [];
        const marketNumber = roundRecord.getMarketNumberById(gameRecords[0].marketItem!.id!);
        const chips = [{
            type: PlacementType.SINGLE,
            amount: lobby.amount,
            numbers: [marketNumber]
        }];
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
    } = useRouletteBetting({ container: boardRef, onlySingleBet: true });

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

    return (
        <div className="max-w-4xl mx-auto lg:px-4 px-2 py-2  ">
            <div className="relative rounded-xl lg:flex-row flex-col flex gap-8 border-brown-800">
                <div className='lg:w-6/12'>
                    <h1 className='text-xl lg:text-left text-center mt-2 mb-4 leading-none text-white font-semibold'>
                        {gameState.isPlaceOver ? t("betting-closed") : t("place-your-bets")}
                    </h1>

                    <div className={cn("relative w-full max-w-4xl mx-auto ", gameState.isPlaceOver ? 'cursor-not-allowed opacity-100' : 'cursor-crosshair')}>


                        <div className="flex w-full">
                            <div
                                ref={boardRef}
                                onClick={!(gameState.isPlaceOver) ? handleBoardClick : undefined}
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
                        isGameOver={gameState.isGameOver}
                        joiningCode={lobby.joiningCode}
                        isPlaceOver={gameState.isPlaceOver}
                    />

                </div>
                <GameResultDialog key={String(showResults)} open={showResults} roundRecordId={previousRoundId!} />
            </div>
        </div>
    );
};

export default MultiplayerRouletteGame;