import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { cn, getPlacementString } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useCreateGameRecord, useGetMyPlacements } from "@/react-query/game-record-queries";
import { Tabs } from "@radix-ui/react-tabs";
import { useMemo, useRef, useState } from "react";
import BettingChips from "./betting-chip";
import { Bet, Chip } from "./contants";
import { BettingControls } from "./roulette-chips";
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeader } from "./roulette-header";
import useNSEAvailable from "@/hooks/use-nse-available";
import GameResultDialog from "./result-dialog";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";

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
    previousRoundId?: string;
};

const RouletteGame = ({ roundRecord }: Props) => {

    const t = useTranslations("game");
    const [betAmount, setBetAmount] = useState<number>(10);
    const gameState = useGameState(roundRecord);
    const isNSEAvailable = useNSEAvailable();
    const [tab, setTab] = useGameType();
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as User;
    const { mutate, isPending: isPlacingBet } = useCreateGameRecord();

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

    // Function to check if there's a bet on a specific type and numbers
    const getBetForPosition = (type: PlacementType, numbers: number[]) => {
        const allChips = [...bettedChips, ...chips];
        const chip = allChips.find(chip =>
            chip.type === type &&
            chip.numbers.length === numbers.length &&
            chip.numbers.every(num => numbers.includes(num))
        );
        return chip;
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

    /*     // Handler for bottom bets using COLUMN type
        const handleBottomBet = (numbers: number[]) => {
            if (gameState.isPlaceOver) return;
    
            const position = getBetPosition({
                type: PlacementType.HIGH_LOW,
                numbers,
            });
    
            setChips([{
                type: PlacementType.HIGH_LOW,
                numbers,
                amount: betAmount,
                position,
            }]);
        };
     */
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

        const markets = chip.numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);

        mutate({
            amount: chip.amount,
            round: roundRecord.id,
            placementType: chip.type,
            market: markets,
            placedValues: getPlacementString({
                market: markets as number[],
                placementType: chip.type,
            }, roundRecord),
        }, {
            onSuccess: () => {
                setChips([]);
            }
        });
    };

    // Get all numbers for specific sections and other bets
    const first8Numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    const second8Numbers = Array.from({ length: 8 }, (_, i) => i + 1 + 8);
    /*     const firstHigh = [1, 2, 5, 6, 9, 10, 13, 14];
        const secondHigh = [3, 4, 7, 8, 11, 12, 15, 16]
        const redNumbers = [1, 3, 5, 7, 9, 11, 13, 15];
        const blackNumbers = [2, 4, 6, 8, 10, 12, 14, 16]; */
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

    const boardChips = gameState.isPlaceOver ? bettedChips : [...bettedChips, ...chips];

    const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(roundRecord.type);
    return (
        <>
            <div className="max-w-4xl mx-auto lg:px-4 px-2 py-2 bg-secondary-game h-full ">
                <div className="relative rounded-xl lg:flex-row flex-col flex gap-8 border-brown-800">
                    <div className='lg:w-6/12'>
                        <h1 className='text-xl lg:text-left text-center mt-2 mb-4 leading-none text-white font-semibold'>
                            {gameState.isPlaceOver ? t("betting-closed") : t("place-your-bets")}
                        </h1>
                        <Tabs
                            value={tab}
                            onValueChange={(value) => setTab(value as SchedulerType)}
                            className="w-full relative z-10 mb-6"
                        >
                            <TabsList className="w-full flex lg:hidden h-10 p-1 bg-tertiary">
                                <TabsTrigger disabled={!isNSEAvailable} className={cn("flex-1 h-8", !isNSEAvailable && 'cursor-not-allowed')} value="nse">NSE</TabsTrigger>
                                <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
                            </TabsList>
                        </Tabs>

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

                                <div className="grid grid-rows-2 gap-2 ml-2">
                                    <div className="relative">
                                        <Button
                                            variant="game-secondary"
                                            className="h-full w-10 flex items-center justify-center relative"
                                            onClick={() => handleSideBet(first8Numbers)}
                                        >
                                            <span className="rotate-text">1 to 8</span>
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
                                            <span className="rotate-text">9 to 16</span>
                                        </Button>
                                        {getBetForPosition(PlacementType.DOUBLE_STREET, second8Numbers) && (
                                            <ButtonChip amount={getBetForPosition(PlacementType.DOUBLE_STREET, second8Numbers)!.amount} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="game-secondary"
                                className="col-span-1 justify-center gap-4 w-full mt-2 opacity-80"
                            >
                                <span>
                                    0
                                </span>
                                {roundRecord.market[16]?.codeName}
                            </Button>


                            {/*         <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="col-span-1 justify-center w-full"
                                        onClick={() => handleBottomBet(firstHigh)}
                                    >
                                        Column (1-14)
                                    </Button>
                                    {getBetForPosition(PlacementType.HIGH_LOW, firstHigh) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.HIGH_LOW, firstHigh)!.amount} />
                                    )}
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="col-span-1 justify-center w-full"
                                        onClick={() => handleBottomBet(secondHigh)}
                                    >
                                        Column (3-16)
                                    </Button>
                                    {getBetForPosition(PlacementType.HIGH_LOW, secondHigh) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.HIGH_LOW, secondHigh)!.amount} />
                                    )}
                                </div>
                            </div>
 */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
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
                                {/*                                 <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="roulette-piece-black-select h-10 w-full"
                                        onClick={() => handleSpecialBet(PlacementType.COLOR, blackNumbers)}
                                    >
                                        Black
                                    </Button>

                                    {getBetForPosition(PlacementType.COLOR, blackNumbers) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.COLOR, blackNumbers)!.amount} />
                                    )}
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="roulette-piece-red-select h-10 w-full"
                                        onClick={() => handleSpecialBet(PlacementType.COLOR, redNumbers)}
                                    >
                                        Red
                                    </  Button>

                                    {getBetForPosition(PlacementType.COLOR, redNumbers) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.COLOR, redNumbers)!.amount} />
                                    )}
                                </div> */}
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

                    <div className='lg:w-6/12 flex justify-between flex-col '>
                        <Tabs
                            value={tab}
                            onValueChange={(value) => setTab(value as SchedulerType)}
                            className="w-full relative z-10"
                        >
                            <TabsList className="w-full hidden lg:flex h-10 p-1 bg-tertiary ">
                                <TabsTrigger disabled={!isNSEAvailable} className={cn("flex-1 h-8", !isNSEAvailable && '!cursor-not-allowed')} value="nse">NSE</TabsTrigger>
                                <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
                            </TabsList>

                            <GameHeader gameState={gameState} />

                            <BettingControls
                                isLoading={isPlacingBet}
                                betAmount={betAmount}
                                onPlaceBet={handlePlaceBet}
                                setBetAmount={setBetAmount}
                                isPlaceOver={gameState.isPlaceOver || isNotAllowedToPlaceBet}
                            />
                        </Tabs>
                    </div>
                </div>
            </div>
            <GameResultDialog key={String(showResults)} open={showResults} roundRecordId={previousRoundId!} />
        </>


    );
};

export default RouletteGame;