import { useGameState } from "@/hooks/use-current-game";
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
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeader } from "./roulette-header";
import { LobbyResult } from "./lobby-result-dialog";



type Props = {
    lobbyRound: LobbyRound;
    lobby: Lobby;
    previousRoundId?: string;
    result?: LobbyResult;
};

const MultiplayerRouletteGame = ({ lobbyRound, lobby, result }: Props) => {
    const roundRecord = lobbyRound.roundRecord!;
    const t = useTranslations("game");
    const [betAmount, setBetAmount] = useState<number>(lobby.bettedAmount);
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
            amount: lobby.bettedAmount,
            numbers: [marketNumber]
        }];
        return chips;
    }, [data, isSuccess, roundRecord, lobby.bettedAmount]);


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
        <div className="max-w-4xl mx-auto lg:px-4 px-2 py-2">
            <div className="relative rounded-xl lg:flex-row flex-col flex gap-8 border-brown-800">
                <div className='lg:w-6/12'>
                    <h1 className='text-xl lg:text-left text-center mt-2 mb-4 leading-none text-white font-semibold'>
                        {gameState.isPlaceOver ? t("betting-closed") : t("place-your-bets")}
                    </h1>
                    <div className="flex flex-wrap justify-between">
                    <div className="flex mb-4  text-white gap-4">
                        <p className="text-xl font-semibold">{t('total-pool')}</p>
                        <p className="text-xl font-bold text-yellow-500">Rs. {lobby.totalPool?.toLocaleString() || 0}</p>
                    </div>
                        <p className="text-xl font-bold text-white capitalize"> {lobby.getTypeName}</p>
                    </div>

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
                                    result={result}
                                    previousRoundId={roundRecord.id.toString()}
                                />
                                <BettingChips roundRecord={roundRecord} chips={boardChips} getBetPosition={getBetPosition} />
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
            </div>
        </div>
    );
};

export default MultiplayerRouletteGame;