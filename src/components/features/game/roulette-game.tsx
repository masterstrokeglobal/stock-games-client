import { Button } from "@/components/ui/button";
import ParticlesContainer from "@/components/ui/solar-particle";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/context/auth-context";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import useNSEAvailable from "@/hooks/use-nse-available";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { BLACK_NUMBERS, cn, getPlacementString, RED_NUMBERS } from "@/lib/utils";
import GameRecord from "@/models/game-record";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import User from "@/models/user";
import { useCreateGameRecord, useGetMyPlacements } from "@/react-query/game-record-queries";
import { Tabs } from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import BettingChips from "./betting-chip";
import { Bet, Chip } from "./contants";
import GameResultDialog from "./result-dialog";
import { BettingControls } from "./roulette-chips";
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeader } from "./roulette-header";

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
    const [betAmount, setBetAmount] = useState<number>(100);
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

        // aggregate chips with the same type and numbers
        const aggregatedChips: Chip[] = [];

        chips.forEach((chip) => {
            const existingChip = aggregatedChips.find((c) => c.type === chip.type && c.numbers.length === chip.numbers.length && c.numbers.every((num) => chip.numbers.includes(num)));
            if (existingChip) {
                existingChip.amount += chip.amount;
            } else {
                aggregatedChips.push(chip);
            }
        });
        return aggregatedChips;
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
        const allChips = [...bettedChips];
        const chip = allChips.find(chip =>
            chip.type === type &&
            chip.numbers.length === numbers.length &&
            chip.numbers.every(num => numbers.includes(num))
        );
        return chip;
    };

    const verifyBetAmount = useCallback((amount: number) => {
        const minAmount = currentUser.company?.minPlacement;
        const maxAmount = currentUser.company?.maxPlacement;
        const totalBetAmount = bettedChips.reduce((acc, chip) => acc + chip.amount, 0);
        if (minAmount && totalBetAmount + amount < minAmount) {
            toast.error("Minimum bet amount is " + minAmount);
            return false;
        }
        if (maxAmount && totalBetAmount + amount > maxAmount) {
            toast.error("Maximum bet amount is " + maxAmount);
            return false;
        }
        return true;
    }, [currentUser, bettedChips]);

    const ButtonChip = ({ amount, className }: { amount: number, className?: string }) => (
        <div className={cn("absolute top-1/2 right-4 translate-x-1/2 -translate-y-1/2 bg-chip text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold", className)}>
            {amount}
        </div>
    );

    // Handler for side bets using DOUBLE_STREET type
    const handleSideBet = (numbers: number[]) => {
        if (gameState.isPlaceOver || isPlacingBet) return;
        if (!verifyBetAmount(betAmount)) return;

        const markets = numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);

        mutate({
            amount: betAmount,
            round: roundRecord.id,
            horseNumbers: numbers,
            placementType: PlacementType.DOUBLE_STREET,
            market: markets,
            placedValues: getPlacementString({
                market: markets as number[],
                placementType: PlacementType.DOUBLE_STREET,
            }, roundRecord),
        });

    };

    const handleColorBet = (numbers: number[]) => {
        if (gameState.isPlaceOver || isPlacingBet) return;
        if (!verifyBetAmount(betAmount)) return;

        const markets = numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);

        mutate({
            amount: betAmount,
            round: roundRecord.id,
            horseNumbers: numbers,
            placementType: PlacementType.COLOR,
            market: markets,
            placedValues: getPlacementString({
                market: markets as number[],
                placementType: PlacementType.COLOR,
            }, roundRecord),
        });
    }

    const handleSpecialBet = (betType: PlacementType, numbers: number[]) => {
        if (gameState.isPlaceOver || isPlacingBet) return;
        if (!verifyBetAmount(betAmount)) return;

        const markets = numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);

        mutate({
            amount: betAmount,
            round: roundRecord.id,
            placementType: betType,
            market: markets,
            horseNumbers: numbers,
            placedValues: getPlacementString({
                market: markets as number[],
                placementType: betType,
            }, roundRecord),
        }, {
            onSuccess: () => {
                setChips([]);
            }
        });

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
            placedValues: getPlacementString({ market: [marketId], placementType: PlacementType.SINGLE }, roundRecord),
        });
    }

    // Get all numbers for specific sections and other bets
    const first8Numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    const second8Numbers = Array.from({ length: 8 }, (_, i) => i + 1 + 8);

    const evenNumbers = Array.from({ length: 8 }, (_, i) => (i + 1) * 2);
    const oddNumbers = Array.from({ length: 8 }, (_, i) => (i * 2) + 1);

    const handleBoardClick = (e: React.MouseEvent) => {
        if (gameState.isPlaceOver || isPlacingBet) return;
        if (!verifyBetAmount(betAmount)) return;
        const bet = getBetTypeFromClick(e, boardRef);
        if (!bet) return;

        const position = getBetPosition(bet);
        setChips([{
            ...bet,
            amount: betAmount,
            position,
        }]);

        const markets = bet.numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);

        mutate({
            amount: betAmount,
            round: roundRecord.id,
            placementType: bet.type,
            market: markets,
            horseNumbers: bet.numbers,
            placedValues: getPlacementString({
                market: markets as number[],
                placementType: bet.type,
            }, roundRecord),
        }, {
            onSuccess: () => {
                setChips([]);
            }
        });
    };

    const boardChips = gameState.isPlaceOver ? bettedChips : [...bettedChips, ...chips];

    const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
    const isCryptoAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO);
/*     const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);
 */
    const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(roundRecord.type);

    return (
        <>

            <ParticlesContainer />
            <div className="mx-auto  lg:pr-4  py-2 bg-background-secondary h-full ">
                <div className="relative rounded-xl lg:flex-row w-full flex-col flex border-brown-800">
                    <div className='lg:w-7/12 max-w-2xl mx-auto w-full'>
                        <h1 className='text-xl lg:text-left text-center mt-2 mb-4 leading-none text-game-text font-semibold game-header-highlight lg:pl-4 pl-2   '>
                            {gameState.isPlaceOver ? t("betting-closed") : t("place-your-bets")}
                        </h1>
                        <Tabs
                            value={tab}
                            onValueChange={(value) => setTab(value as SchedulerType)}
                            className="w-full relative z-10 mb-6"
                        >
                            <TabsList className="w-full flex lg:hidden h-10 p-1 bg-tertiary">

                                {isNSEAllowed && (
                                    <TabsTrigger disabled={!isNSEAvailable} className={cn("flex-1 h-8", !isNSEAvailable && 'cursor-not-allowed')} value="nse">NSE</TabsTrigger>
                                )}
                                {isCryptoAllowed && (
                                    <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
                                )}
                             {/*    {isUSAMarketAllowed && (
                                    <TabsTrigger className="flex-1 h-8" value="usa_market">USA Market</TabsTrigger>
                                )} */}
                            </TabsList>
                        </Tabs>

                        <div className={cn("relative w-full game-box-background p-4  ", gameState.isPlaceOver || isNotAllowedToPlaceBet ? 'cursor-not-allowed opacity-100' : 'cursor-crosshair')}>
                            {isNotAllowedToPlaceBet && (<div className="absolute top-0 left-0 w-full text-center h-full z-40 bg-black bg-opacity-80">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="text-game-text text-lg opacity-100  font-semibold">{t("betting-not-allowed")}</span>
                                </div>
                            </div>)}

                            <div className="flex w-full ">
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
                                    <BettingChips chips={boardChips} getBetPosition={getBetPosition} roundRecord={roundRecord} />
                                </div>

                                <div className="grid grid-rows-1 gap-2 ">
                                    <Button
                                        variant="game-secondary"
                                        className="col-span-1 w-10 relative cursor-not-allowed  bg-emerald-600 justify-center gap-4 text-white ml-2 h-full "
                                    >
                                        <span className="rotate-text">
                                            0 &nbsp;
                                            {roundRecord.market[16]?.codeName}
                                        </span>
                              {/*           {getBetForPosition(PlacementType.SINGLE, [17]) && (
                                            <ButtonChip className=" top/1/2 right-1/2 translate-x-1/2 -translate-y-1/2" amount={getBetForPosition(PlacementType.SINGLE, [17])!.amount} />
                                        )} */}
                                    </Button>
                                </div>


                            </div>

                            <div className="grid grid-cols-4 gap-2 mt-2">
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-full w-full flex items-center justify-center relative border  text-game-text  bg-secondary-game border-primary"
                                        onClick={() => handleSideBet(first8Numbers)}
                                    >
                                        <span >1 to 8</span>
                                    </Button>
                                    {getBetForPosition(PlacementType.DOUBLE_STREET, first8Numbers) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.DOUBLE_STREET, first8Numbers)!.amount} />
                                    )}
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-full w-full flex items-center justify-center relative  border bg-secondary-game border-primary"
                                        onClick={() => handleColorBet(RED_NUMBERS)}
                                    >
                                        <span className="size-5  routelette-piece-red !border-game-text border rotate-45" />
                                    </Button>
                                    {getBetForPosition(PlacementType.COLOR, RED_NUMBERS) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.COLOR, RED_NUMBERS)!.amount} />
                                    )}
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-full w-full flex items-center justify-center relative  border bg-secondary-game border-primary"
                                        onClick={() => handleColorBet(BLACK_NUMBERS)}
                                    >
                                        <span className="size-5  routelette-piece-black rotate-45 !border-game-text border" />
                                    </Button>
                                    {getBetForPosition(PlacementType.COLOR, BLACK_NUMBERS) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.COLOR, BLACK_NUMBERS)!.amount} />
                                    )}
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-full w-full flex items-center justify-center relative  border  text-game-text bg-secondary-game border-primary"
                                        onClick={() => handleSideBet(second8Numbers)}
                                    >
                                        <span >9 to 16</span>
                                    </Button>
                                    {getBetForPosition(PlacementType.DOUBLE_STREET, second8Numbers) && (
                                        <ButtonChip amount={getBetForPosition(PlacementType.DOUBLE_STREET, second8Numbers)!.amount} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="relative">
                                    <Button
                                        variant="game-secondary"
                                        className="h-10 w-full routelette-piece-black"
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
                                        className="h-10 w-full routelette-piece-black"
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
                    <div className='lg:w-5/12  justify-between flex-col '>
                        <Tabs
                            value={tab}
                            onValueChange={(value) => setTab(value as SchedulerType)}
                            className="w-full relative z-10 mt-2"
                        >
                            <TabsList className="w-full hidden lg:flex  bg-tertiary ">
                                {isNSEAllowed && (
                                    <TabsTrigger disabled={!isNSEAvailable} className={cn("flex-1 h-8", !isNSEAvailable && '!cursor-not-allowed')} value="nse">NSE</TabsTrigger>
                                )}
                                {isCryptoAllowed && (
                                    <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
                                )}
                               {/*  {isUSAMarketAllowed && (
                                    <TabsTrigger className="flex-1 h-8" value="usa_market">USA Market</TabsTrigger>
                                )} */}
                            </TabsList>

                            <GameHeader gameState={gameState} />

                            <BettingControls
                                isLoading={isPlacingBet}
                                betAmount={betAmount}
                                roundId={roundRecord.id}
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