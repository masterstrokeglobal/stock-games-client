import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/context/auth-context";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import useNSEAvailable from "@/hooks/use-nse-available";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { cn } from "@/lib/utils";
import { PlacementType } from "@/models/game-record";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { SinglePlayerGamePlacement } from "@/models/singleplayer-game-placement";
import User from "@/models/user";
import { useCreateSinglePlayerRouletteBet, useGetMyCurrentPlacement } from "@/react-query/game-record-queries";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import BettingChips from "./betting-chip";
import { Bet, Chip } from "./contants";
import GameResultDialog from "./result-dialog";
import { BettingControls } from "./roulette-chips";
import { RouletteBettingGrid } from "./roulette-grid";
import { GameHeader } from "./roulette-header";
type Props = {
    roundRecord: RoundRecord;
    previousRoundId?: string;
};

const SinglePlayerRouletteGame = ({ roundRecord }: Props) => {
    const t = useTranslations("game");
    const [betAmount, setBetAmount] = useState<number>(100);
    const gameState = useGameState(roundRecord);
    const isNSEAvailable = useNSEAvailable();
    const { mutate, isPending: isPlacingBet } = useCreateSinglePlayerRouletteBet();
    const [tab, setTab] = useGameType();
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as User;
    const boardRef = useRef<HTMLDivElement>(null);
    const { data, isSuccess } = useGetMyCurrentPlacement(roundRecord.id!.toString());

    const bettedChips = useMemo(() => {
        if (!isSuccess) return [];
        const gameRecords: SinglePlayerGamePlacement[] = data.data.placement ?
            [new SinglePlayerGamePlacement(data.data.placement)] : [];

        if (gameRecords.length === 0) return [];

        const marketNumber = roundRecord.getMarketNumberById(gameRecords[0].marketItem!.id!);
        const chips = [{
            type: PlacementType.SINGLE,
            amount: 100,
            numbers: [marketNumber]
        }];
        return chips;
    }, [data]);

    const { previousRoundId, showResults } = useShowResults(roundRecord, bettedChips);

    const {
        chips,
        hoveredCell,
        getBetPosition,
        setHoveredCell,
        getBetTypeFromClick
    } = useRouletteBetting({ container: boardRef, onlySingleBet: true });

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


    const handleBoardClick = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        if (!bet) return;

        const markets = bet.numbers.map((number) => roundRecord.market[number - 1]?.id).filter((id) => id !== undefined);
        mutate({
            roundId: roundRecord.id,
            amount: betAmount,
            market: markets[0],
        });
    };

    const boardChips = gameState.isPlaceOver ? bettedChips : [...bettedChips, ...chips];

    const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
    const isCryptoAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO);
    const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);
    const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(roundRecord.type);


    const handleZeroBet = () => {
        mutate({
            roundId: roundRecord.id,
            amount: betAmount,
            market: 17,
        });
    }


    const ButtonChip = ({ amount, className }: { amount: number, className?: string }) => (
        <div className={cn("absolute top-1/2 right-4 translate-x-1/2 -translate-y-1/2 bg-chip text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold", className)}>
            {amount}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto lg:px-4 px-2 py-2  ">
            <div className="relative rounded-xl lg:flex-row flex-col flex gap-8 border-brown-800">
                <div className='lg:w-6/12'>
                    <h1 className='text-xl lg:text-left text-center mt-2 mb-4 leading-none text-white font-semibold'>
                        {gameState.isPlaceOver ? t("betting-closed") : t("place-your-bets")}
                    </h1>

                    <h2 className="text-white font-semibold mb-6">
                        {roundRecord.roundGameName}
                    </h2>
                    <div className="flex flex-wrap justify-between">

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
                                        previousRoundId={roundRecord.id.toString()}
                                    />
                                    <BettingChips roundRecord={roundRecord} chips={boardChips} getBetPosition={getBetPosition} />
                                </div>

                            </div>
                            <div className="grid grid-rows-1 gap-2 ">
                                <Button
                                    onClick={handleZeroBet}
                                    variant="game-secondary"
                                    className="col-span-1 w-full relative  bg-emerald-600 justify-center gap-4 text-white  mt-2 h-full "
                                >
                                    <span>
                                        0 &nbsp;
                                        {roundRecord.market[16]?.codeName}
                                    </span>
                                    {getBetForPosition(PlacementType.SINGLE, [17]) && (
                                        <ButtonChip className=" top-4 right-1/2 translate-x-1/2 -translate-y-1/2" amount={getBetForPosition(PlacementType.SINGLE, [17])!.amount} />
                                    )}
                                    {gameState.isPlaceOver && roundRecord.isHorseWinning(17) && <img src="/crown.png" alt="Winner" className="size-16 absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                </Button>
                            </div>

                        </div>
                    </div>

                </div>
                <div className='lg:w-6/12 flex justify-between flex-col'>
                    <div className='w-full flex justify-between flex-col'>
                        <Tabs
                            value={tab}
                            onValueChange={(value) => setTab(value as SchedulerType)}
                            className="w-full relative z-10"
                        >
                            <TabsList className="w-full hidden lg:flex  bg-tertiary ">
                                {isNSEAllowed && (
                                    <TabsTrigger disabled={!isNSEAvailable} className={cn("flex-1 h-8", !isNSEAvailable && '!cursor-not-allowed')} value="nse">NSE</TabsTrigger>
                                )}
                                {isCryptoAllowed && (
                                    <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
                                )}
                                {isUSAMarketAllowed && (
                                    <TabsTrigger className="flex-1 h-8" value="usa_market">USA Market</TabsTrigger>
                                )}
                            </TabsList>

                            <GameHeader gameState={gameState} />

                            <BettingControls
                                roundId={roundRecord.id}
                                isLoading={isPlacingBet}
                                showFooterButtons={false}
                                betAmount={betAmount}
                                setBetAmount={setBetAmount}
                                isPlaceOver={gameState.isPlaceOver || isNotAllowedToPlaceBet}
                            />
                        </Tabs>
                    </div>
                </div>
            </div>
            {previousRoundId && <GameResultDialog key={String(showResults)} open={showResults} roundRecordId={previousRoundId} />}
        </div>
    );
};

export default SinglePlayerRouletteGame;