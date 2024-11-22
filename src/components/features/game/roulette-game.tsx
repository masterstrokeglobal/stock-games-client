import { SchedulerType } from "@/models/market-item";
import { useRef, useState } from "react";
import { CurrentGameState, Bet, Chip } from "./contants";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
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

type Props = {
    roundRecord: RoundRecord;
};

const RouletteGame = ({ roundRecord }: Props) => {
    const [betAmount, setBetAmount] = useState<number>(10);
    const gameState = useGameState(roundRecord);
    const [tab, setTab] = useGameType();



    return (
        <div className="max-w-4xl mx-auto xl:p-4 p-2 space-y-8">
            <div className="relative rounded-xl xl:flex-row flex-col flex gap-8 border-brown-800">
                <div className='xl:w-6/12'>
                    <h1 className='text-xl xl:mb-2 mb-4 xl:text-left text-center text-white font-semibold'>
                        {gameState.isPlaceOver ? "Betting Closed" : "Place Your Bets"}
                    </h1>

                    <RouletteBetting gameState={gameState} betAmount={betAmount} />
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
                            onPlaceBet={() => console.log('place bet')}
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

type RouletteBettingProps = {
    gameState: CurrentGameState;
    betAmount: number;
};

const RouletteBetting = ({ gameState, betAmount }: RouletteBettingProps) => {
    const boardRef = useRef<HTMLDivElement>(null);

    const {
        chips,
        setChips,
        hoveredCell,
        setHoveredCell,
        getBetTypeFromClick
    } = useRouletteBetting();

    const handleBoardClick = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        if (!bet) return;
        console.log(bet);
    };

    const handleBoardHover = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        setHoveredCell(bet);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Main betting board and side buttons */}
            <div className="flex w-full">
                {/* Main betting grid */}
                <div
                    ref={boardRef}
                    onClick={true ? handleBoardClick : undefined}
                    onMouseMove={true ? handleBoardHover : undefined}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`relative flex-1 mx-auto 
            ${false ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair'}`}
                >
                    <RouletteBettingGrid
                        hoveredCell={hoveredCell as unknown as Bet}
                        chips={chips as unknown as Chip[]}
                    />
                    <BettingChips chips={chips} />
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
    );
};

