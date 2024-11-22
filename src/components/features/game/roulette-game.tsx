import { SchedulerType } from "@/models/market-item";
import { useMemo, useRef, useState } from "react";
import { CurrentGameState, Bet, Chip } from "./contants";
import { getBetPosition, useRouletteBetting } from "@/hooks/use-roulette-betting";
import { RouletteBettingGrid } from "./roulette-grid";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameHeader } from "./roulette-header";
import { BettingControls } from "./roulette-chips";
import { useGameState } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import { RoundRecord } from "@/models/round-record";
import BettingChips from "./betting-chip";
import { Button } from "@/components/ui/button";
import { useCreateGameRecord, useGetMyPlacements } from "@/react-query/game-record-queries";
import { set } from "react-hook-form";
import GameRecord from "@/models/game-record";

type Props = {
    roundRecord: RoundRecord;
};

const RouletteGame = ({ roundRecord }: Props) => {
    const [betAmount, setBetAmount] = useState<number>(10);
    const gameState = useGameState(roundRecord);
    const [tab, setTab] = useGameType();
    const { mutate, isPending: isPlacingBet } = useCreateGameRecord();

    const boardRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isSuccess } = useGetMyPlacements({ roundId: roundRecord.id });

    const bettedChips = useMemo(() => {
        if (!isSuccess) return [];
        console.log('data', data.data);
        const gameRecords: GameRecord[] = data.data.map((record: Partial<GameRecord>) => new GameRecord(record));
        const chips = gameRecords.map((record) => ({
            type: record.placementType,
            amount: record.amount,
            numbers: record.market.map((market) => roundRecord.market.findIndex((m) => m.id === market))
        }));

        return chips;
    }, [data]);

    const {
        chips,
        setChips,
        hoveredCell,
        setHoveredCell,
        getBetTypeFromClick
    } = useRouletteBetting();


    const handlePlaceBet = () => {

        const chip = chips[0];

        const markets = chip.numbers.map((number) => roundRecord.market[number]?.id).filter((id) => id !== undefined);

        mutate({
            amount: chips[0].amount,
            round: roundRecord.id,
            placementType: chips[0].type,
            market: markets
        }, {
            onSuccess: () => {
                setChips([]);
            }
        });
    };

    const handleBoardClick = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        if (!bet) return;

        const posistion = getBetPosition(bet);
        setChips([{
            ...bet,
            amount: betAmount,
            position: posistion
        }]);
    };

    const handleBoardHover = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        setHoveredCell(bet);
    };

    const handleBetChipClick = () => {
        if (gameState.isPlaceOver) return;

        const newChips = [...chips];
        console.log('newChips', newChips);
    };

    console.log('bettedChips', bettedChips);
    console.log('chips', chips);


    return (
        <div className="max-w-4xl mx-auto xl:p-4 p-2 space-y-8">
            <div className="relative rounded-xl xl:flex-row flex-col flex gap-8 border-brown-800">
                <div className='xl:w-6/12'>
                    <h1 className='text-xl xl:mb-2 mb-4 xl:text-left text-center text-white font-semibold'>
                        {gameState.isPlaceOver ? "Betting Closed" : "Place Your Bets"}
                    </h1>

                    <div className="relative w-full max-w-4xl mx-auto">
                        {/* Main betting board and side buttons */}
                        <div className="flex w-full">
                            {/* Main betting grid */}
                            <div
                                ref={boardRef}
                                onClick={!gameState.isPlaceOver ? handleBoardClick : undefined}
                                onMouseMove={!gameState.isPlaceOver ? handleBoardHover : undefined}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`relative flex-1 mx-auto ${false ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair'}`}
                            >
                                <RouletteBettingGrid
                                    roundRecord={roundRecord}
                                    hoveredCell={hoveredCell as unknown as Bet}
                                    chips={chips as unknown as Chip[]}
                                />
                                <BettingChips chips={[...bettedChips, ...chips]} />
                            </div>

                            {/* Side buttons */}
                            <div className="grid grid-rows-2 gap-2 ml-2">
                                <Button
                                    variant="game-secondary"
                                    className="h-full w-10 flex items-center justify-center"
                                >
                                    <span className="rotate-text">1st 8</span>
                                </Button>
                                <Button
                                    variant="game-secondary"
                                    className="h-full w-10 flex items-center justify-center"
                                >
                                    <span className="rotate-text">2nd 8</span>
                                </Button>
                            </div>
                        </div>

                        {/* Bottom section buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <Button
                                variant="game-secondary"
                                className="col-span-1 justify-center"
                            >
                                1st 8
                            </Button>
                            <Button
                                variant="game-secondary"
                                className="col-span-1 justify-center"
                            >
                                2nd 8
                            </Button>
                        </div>

                        {/* Bottom row buttons */}
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            <Button
                                variant="game-secondary"
                                className="h-10"
                            >
                                EVEN
                            </Button>
                            <Button
                                variant="game-secondary"
                                className="roulette-piece-black-select h-10"
                            />
                            <Button
                                variant="game-secondary"
                                className="roulette-piece-red-select h-10"
                            />
                            <Button
                                variant="game-secondary"
                                className="h-10"
                            >
                                ODD
                            </Button>
                        </div>

                    </div>
                </div>

                <div className='xl:w-6/12 flex justify-between flex-col h-full'>
                    <Tabs
                        defaultValue={tab}
                        onValueChange={(value) => setTab(value as SchedulerType)}
                        className="w-full relative z-10"
                    >
                        <TabsList className="w-full hidden xl:flex h-10 p-1 bg-[#0F214F]">
                            <TabsTrigger className="flex-1 h-8" value="nse">NSE</TabsTrigger>
                            <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
                        </TabsList>

                        <GameHeader gameState={gameState} />

                        <BettingControls
                            betAmount={betAmount}
                            onPlaceBet={handlePlaceBet}
                            setBetAmount={setBetAmount}
                            isPlaceOver={gameState.isPlaceOver}
                        />
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default RouletteGame;
