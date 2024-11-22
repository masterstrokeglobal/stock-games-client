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
import GameRecord from "@/models/game-record";
import { cn } from "@/lib/utils";

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
    HIGH_LOW = "high_low"
}

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

    // Function to check if there's a bet on a specific type and numbers
    const getBetForPosition = (type: PlacementType, numbers: number[]) => {
        const allChips = [...bettedChips, ...chips];
        return allChips.find(chip =>
            chip.type === type &&
            chip.numbers.length === numbers.length &&
            chip.numbers.every(num => numbers.includes(num))
        );
    };

    const ButtonChip = ({ amount }: { amount: number }) => (
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {amount}
        </div>
    );

    // Handler for side bets using DOUBLE_STREET type
    const handleSideBet = (numbers: number[]) => {
        if (gameState.isPlaceOver) return;

        const position = getBetPosition({
            type: PlacementType.DOUBLE_STREET,
            numbers,
        });

        setChips([{
            type: PlacementType.DOUBLE_STREET,
            numbers,
            amount: betAmount,
            position,
        }]);
    };

    // Handler for bottom bets using COLUMN type
    const handleBottomBet = (numbers: number[]) => {
        if (gameState.isPlaceOver) return;

        const position = getBetPosition({
            type: PlacementType.COLUMN,
            numbers,
        });

        setChips([{
            type: PlacementType.COLUMN,
            numbers,
            amount: betAmount,
            position,
        }]);
    };

    const handleSpecialBet = (betType: PlacementType, numbers: number[]) => {
        if (gameState.isPlaceOver) return;

        const position = getBetPosition({
            type: betType,
            numbers,
        });

        setChips([{
            type: betType,
            numbers,
            amount: betAmount,
            position,
        }]);
    };

    const handlePlaceBet = () => {
        const chip = chips[0];
        if (!chip) return;

        const markets = chip.numbers.map((number) => roundRecord.market[number]?.id).filter((id) => id !== undefined);

        mutate({
            amount: chip.amount,
            round: roundRecord.id,
            placementType: chip.type,
            market: markets
        }, {
            onSuccess: () => {
                setChips([]);
            }
        });
    };

    // Get all numbers for specific sections and other bets
    const first8Numbers = Array.from({ length: 8 }, (_, i) => i);
    const second8Numbers = Array.from({ length: 8 }, (_, i) => i + 8);
    const redNumbers = [1, 3, 5, 7, 9, 11, 13, 15];
    const blackNumbers = [2, 4, 6, 8, 10, 12, 14, 16];
    const evenNumbers = Array.from({ length: 8 }, (_, i) => (i + 1) * 2);
    const oddNumbers = Array.from({ length: 8 }, (_, i) => (i * 2) + 1);

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

    return (
        <div className="max-w-4xl mx-auto xl:p-4 p-2 space-y-8">
            <div className="relative rounded-xl xl:flex-row flex-col flex gap-8 border-brown-800">
                <div className='xl:w-6/12'>
                    <h1 className='text-xl xl:mb-2 mb-4 xl:text-left text-center text-white font-semibold'>
                        {gameState.isPlaceOver ? "Betting Closed" : "Place Your Bets"}
                    </h1>

                    <div className={cn("relative w-full max-w-4xl mx-auto", gameState.isPlaceOver ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair')}>
                        <div className="flex w-full">
                            <div
                                ref={boardRef}
                                onClick={!gameState.isPlaceOver ? handleBoardClick : undefined}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`relative flex-1 mx-auto`}
                            >
                                <RouletteBettingGrid
                                    roundRecord={roundRecord}
                                    hoveredCell={hoveredCell as unknown as Bet}
                                    chips={chips as unknown as Chip[]}
                                />
                                <BettingChips chips={[...bettedChips, ...chips]} />
                            </div>

                            <div className="grid grid-rows-2 gap-2 ml-2">
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-full w-10 flex items-center justify-center relative"
                                        onClick={() => handleSideBet(first8Numbers)}
                                    >
                                        <span className="rotate-text">1st 8</span>
                                    </Button>
                                    {getBetForPosition(PlacementType.DOUBLE_STREET, first8Numbers) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.DOUBLE_STREET, first8Numbers)!.amount} />
                                    )}
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-full w-10 flex items-center justify-center relative"
                                        onClick={() => handleSideBet(second8Numbers)}
                                    >
                                        <span className="rotate-text">2nd 8</span>
                                    </Button>
                                    {getBetForPosition(PlacementType.DOUBLE_STREET, second8Numbers) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.DOUBLE_STREET, second8Numbers)!.amount} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="relative">
                                <Button
                                    variant="game-secondary"
                                    className="col-span-1 justify-center w-full"
                                    onClick={() => handleBottomBet(first8Numbers)}
                                >
                                    1st 8
                                </Button>
                                {getBetForPosition(PlacementType.COLUMN, first8Numbers) && (
                                    <ButtonChip amount={getBetForPosition(PlacementType.COLUMN, first8Numbers)!.amount} />
                                )}
                            </div>
                            <div className="relative">
                                <Button
                                    variant="game-secondary"
                                    className="col-span-1 justify-center w-full"
                                    onClick={() => handleBottomBet(second8Numbers)}
                                >
                                    2nd 8
                                </Button>
                                {getBetForPosition(PlacementType.COLUMN, second8Numbers) && (
                                    <ButtonChip amount={getBetForPosition(PlacementType.COLUMN, second8Numbers)!.amount} />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-4">
                            <div className="relative">
                                <Button
                                    variant="game-secondary"
                                    className="h-10 w-full"
                                    onClick={() => handleSpecialBet(PlacementType.EVEN_ODD, evenNumbers)}
                                >
                                    EVEN
                                </Button>
                                {getBetForPosition(PlacementType.EVEN_ODD, evenNumbers) && (
                                    <ButtonChip amount={getBetForPosition(PlacementType.EVEN_ODD, evenNumbers)!.amount} />
                                )}
                            </div>
                            <div className="relative">
                                <Button
                                    variant="game-secondary"
                                    className="roulette-piece-black-select h-10 w-full"
                                    onClick={() => handleSpecialBet(PlacementType.COLOR, blackNumbers)}
                                />
                                {getBetForPosition(PlacementType.COLOR, blackNumbers) && (
                                    <ButtonChip amount={getBetForPosition(PlacementType.COLOR, blackNumbers)!.amount} />
                                )}
                            </div>
                            <div className="relative">
                                <Button
                                    variant="game-secondary"
                                    className="roulette-piece-red-select h-10 w-full"
                                    onClick={() => handleSpecialBet(PlacementType.COLOR, redNumbers)}
                                />
                                {getBetForPosition(PlacementType.COLOR, redNumbers) && (
                                    <ButtonChip amount={getBetForPosition(PlacementType.COLOR, redNumbers)!.amount} />
                                )}
                            </div>
                            <div className="relative">
                                <Button
                                    variant="game-secondary"
                                    className="h-10 w-full"
                                    onClick={() => handleSpecialBet(PlacementType.EVEN_ODD, oddNumbers)}
                                >
                                    ODD
                                </Button>
                                {getBetForPosition(PlacementType.EVEN_ODD, oddNumbers) && (
                                    <ButtonChip amount={getBetForPosition(PlacementType.EVEN_ODD, oddNumbers)!.amount} />
                                )}
                            </div>
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
                            isLoading={isPlacingBet}
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