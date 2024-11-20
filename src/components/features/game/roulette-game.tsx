import { SchedulerType } from "@/models/market-item";
import { useRef, useState } from "react";
import { CurrentGameState } from "./contants";
import { useRouletteBetting } from "@/hooks/use-roulette-betting";
import { RouletteBettingGrid } from "./roulette-grid";
import { BettingChips } from "./betting-chip";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameHeader } from "./roulette-header";
import { BettingControls } from "./roulette-chips";
import { useCurrentGame, useGameState } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import { RoundRecord } from "@/models/round-record";

type Props = {
    roundRecord: RoundRecord;
};

const RouletteGame = ({roundRecord}:Props) => {
    const [betAmount, setBetAmount] = useState<number>(10);
    const boardRef = useRef<HTMLDivElement>(null);
    const [tab, setTab] = useGameType();

    const gameState = useGameState(roundRecord);
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

        const newChip = {
            ...bet,
            amount: betAmount,
            x: bet.position.x,
            y: bet.position.y
        };

        setChips([...chips, newChip]);
    };

    const handleBoardHover = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e, boardRef);
        setHoveredCell(bet);
    };

    return (
        <div className="max-w-4xl mx-auto xl:p-4 p-2 space-y-8">
            <div className="relative rounded-xl xl:flex-row flex-col flex gap-8 border-brown-800">
                <div className='xl:w-6/12'>
                    <h1 className='text-xl xl:mb-2 mb-4 xl:text-left text-center text-white font-semibold'>
                        {gameState.isPlaceOver ? "Betting Closed" : "Place Your Bets"}
                    </h1>

                    <div
                        ref={boardRef}
                        onClick={gameState.isPlaceOver ? undefined : handleBoardClick}
                        onMouseMove={gameState.isPlaceOver ? undefined : handleBoardHover}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`relative max-w-2xl flex-1 mx-auto ${gameState.isPlaceOver ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair'}`}
                    >
                        <RouletteBettingGrid
                            hoveredCell={hoveredCell}
                            chips={chips}
                        />
                        <BettingChips chips={chips} />
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