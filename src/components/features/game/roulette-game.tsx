"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface RouletteNumber {
    number: number;
    color: 'red' | 'black';
}

interface Position {
    x: number;
    y: number;
}

interface Bet {
    type: 'single' | 'split' | 'street' | 'corner' | 'column' | 'color' | 'even_odd' | 'high_low' | 'row' | 'full_column';
    numbers: number[];
    position: Position;
    display?: string;
}


interface Chip extends Bet {
    amount: number;
    x: number;
    y: number;
}


const RouletteGame: React.FC = () => {
    const [betAmount, setBetAmount] = useState<number>(10);
    const [chips, setChips] = useState<Chip[]>([]);
    const [hoveredCell, setHoveredCell] = useState<Bet | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const numbers: RouletteNumber[] = [
        { number: 1, color: 'red' },
        { number: 2, color: 'black' },
        { number: 3, color: 'red' },
        { number: 4, color: 'black' },
        { number: 5, color: 'red' },
        { number: 6, color: 'black' },
        { number: 7, color: 'red' },
        { number: 8, color: 'black' },
        { number: 9, color: 'red' },
        { number: 10, color: 'black' },
        { number: 11, color: 'red' },
        { number: 12, color: 'black' },
        { number: 13, color: 'red' },
        { number: 14, color: 'black' },
        { number: 15, color: 'red' },
        { number: 16, color: 'black' }
    ];

    const chipColors: Record<string, string> = {
        '5': 'bg-red-500 border-red-600',
        '10': 'bg-blue-500 border-blue-600',
        '25': 'bg-green-500 border-green-600',
        '50': 'bg-purple-500 border-purple-600',
        '100': 'bg-yellow-500 border-yellow-600'
    };

    const getBetTypeFromClick = (e: React.MouseEvent): Bet | null => {
        if (!boardRef.current) return null;

        const rect = boardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cellWidth = rect.width / 4;
        const cellHeight = rect.height / 4;
        const bottomSectionHeight = 60;
        const borderThreshold = 15;

        // Handle special bets section at the bottom
        if (y > rect.height) {
            const totalWidth = rect.width;
            const specialBetWidth = totalWidth / 5;
            const section = Math.floor(x / specialBetWidth);

            if (y <= rect.height + bottomSectionHeight) {
                switch (section) {
                    case 0: return { type: 'color', numbers: numbers.filter(n => n.color === 'red').map(n => n.number), position: { x, y }, display: 'RED' };
                    case 1: return { type: 'color', numbers: numbers.filter(n => n.color === 'black').map(n => n.number), position: { x, y }, display: 'BLACK' };
                    case 2: return { type: 'even_odd', numbers: numbers.filter(n => n.number % 2 === 0).map(n => n.number), position: { x, y }, display: 'EVEN' };
                    case 3: return { type: 'even_odd', numbers: numbers.filter(n => n.number % 2 === 1).map(n => n.number), position: { x, y }, display: 'ODD' };
                    case 4: return { type: 'high_low', numbers: numbers.filter(n => n.number <= 8).map(n => n.number), position: { x, y }, display: '1-8' };
                }
            }
            return null;
        }

        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);
        const number = row * 4 + col + 1;

        const xRemainder = x % cellWidth;
        const yRemainder = y % cellHeight;

        // Single number bet
        if (xRemainder > borderThreshold && xRemainder < cellWidth - borderThreshold &&
            yRemainder > borderThreshold && yRemainder < cellHeight - borderThreshold) {
            return {
                type: 'single',
                numbers: [number],
                position: { x: col * cellWidth + cellWidth / 2, y: row * cellHeight + cellHeight / 2 }
            };
        }

        // Split bet (between two numbers)
        if (xRemainder <= borderThreshold && yRemainder > borderThreshold && yRemainder < cellHeight - borderThreshold) {
            const leftNumber = number - 1;
            if (col > 0) {
                return {
                    type: 'split',
                    numbers: [leftNumber, number],
                    position: { x: col * cellWidth, y: row * cellHeight + cellHeight / 2 }
                };
            }
        }

        // Street bet (4 numbers in a row)
        if (yRemainder <= borderThreshold) {
            const rowNumbers = [1, 2, 3, 4].map(n => row * 4 + n);
            return {
                type: 'street',
                numbers: rowNumbers,
                position: { x: col * cellWidth + cellWidth / 2, y: row * cellHeight }
            };
        }

        // Corner bet (4 numbers in a square)
        if (xRemainder <= borderThreshold && yRemainder <= borderThreshold) {
            if (col > 0 && row > 0) {
                const cornerNumbers = [
                    (row - 1) * 4 + (col - 1) + 1,
                    (row - 1) * 4 + col + 1,
                    row * 4 + (col - 1) + 1,
                    row * 4 + col + 1
                ];
                return {
                    type: 'corner',
                    numbers: cornerNumbers,
                    position: { x: col * cellWidth, y: row * cellHeight }
                };
            }
        }

        // Column bet (4 numbers in a column)
        if (xRemainder > borderThreshold && xRemainder < cellWidth - borderThreshold &&
            yRemainder <= borderThreshold) {
            const columnNumbers = [0, 1, 2, 3].map(n => n * 4 + col + 1);
            return {
                type: 'column',
                numbers: columnNumbers,
                position: { x: col * cellWidth + cellWidth / 2, y: 0 }
            };
        }

        return null;
    };

    const handleBoardClick = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e);
        if (!bet) return;

        const newChip: Chip = {
            ...bet,
            amount: betAmount,
            x: bet.position.x,
            y: bet.position.y
        };

        setChips([...chips, newChip]);
    };

    const handleBoardHover = (e: React.MouseEvent) => {
        const bet = getBetTypeFromClick(e);
        setHoveredCell(bet);
    };

    const handleBoardLeave = () => {
        setHoveredCell(null);
    };


    return (
        <div className="max-w-4xl mx-auto xl:p-4 p-2 space-y-8">
            <div className="relative  rounded-xl xl:flex-row flex-col  flex  gap-8  border-brown-800">
                <div className='xl:w-6/12'>
                    <h1 className='text-xl xl:mb-2 mb-4 xl:text-left text-center  text-white font-semibold'>Place Your Bets</h1>

                    {/* Roulette Board */}
                    <div
                        ref={boardRef}
                        onClick={handleBoardClick}
                        onMouseMove={handleBoardHover}
                        onMouseLeave={handleBoardLeave}
                        className="relative max-w-2xl flex-1 mx-auto cursor-crosshair"
                    >
                        {/* Numbers Grid */}
                        <div className='flex w-full'>


                            <div className="grid grid-cols-4 flex-1 gap-2  p-px">
                                {numbers.map(({ number, color }) => (
                                    <div
                                        key={number}
                                        className={`
                    h-10 relative group rounded-sm
                    ${color === 'red' ? 'routelette-piece-red' : 'routelette-piece-black '}
                    ${hoveredCell && hoveredCell.numbers.includes(number) ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}
                    ${chips.some(chip => chip.numbers.includes(number)) ? 'ring-2 ring-blue-500' : ''}
                    transition-all duration-150 
                  `}
                                    >
                                        <span className="absolute inset-0 mx-4 flex items-center justify-end  text-white text-2xl font-bold">
                                            {number}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-row-2 gap-2 ml-2">
                                <Button variant="game-secondary" className="col-span-1 flex items-center h-full w-10 justify-center">
                                    <span className="rotate-text">1st 8</span>
                                </Button>
                                <Button variant="game-secondary" className="col-span-1 flex items-center h-full w-10 justify-center">
                                    <span className="rotate-text">2nd 8</span>
                                </Button>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 flex-1 gap-2 mt-4'>
                            <Button variant="game-secondary" className='col-span-1 justify-center'>1st 8</Button>
                            <Button variant="game-secondary" className='col-span-1 justify-center'>2nd 8</Button>
                        </div>

                        {/* Special Bets Section */}
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            <Button variant="game-secondary" className="col-span-1">EVEN</Button>
                            <Button variant="game-secondary" className="col-span-1 roulette-piece-black-select"></Button>
                            <Button variant="game-secondary" className="col-span-1 roulette-piece-red-select"></Button>
                            <Button variant="game-secondary" className="col-span-1">ODD</Button>
                        </div>

                        {/* Betting Chips */}
                        {chips.map((chip, index) => (
                            <div
                                key={index}
                                className={`
                  absolute w-12 h-12 -mt-6 -ml-6 rounded-full border-4
                  flex items-center justify-center text-white font-bold text-sm
                  transform hover:scale-110 transition-all shadow-lg
                  ${chipColors[chip.amount.toString()] || 'bg-blue-500 border-blue-600'}
                `}
                                style={{
                                    left: chip.x,
                                    top: chip.y,
                                    zIndex: 10 + index,
                                }}
                            >
                                ${chip.amount}
                                {chip.display && <span className="text-xs">{chip.display}</span>}
                            </div>
                        ))}

                        {/* Hover Preview */}
                        {hoveredCell && (
                            <div
                                className={`
                  absolute w-12 h-12 -mt-6 -ml-6 rounded-full border-4 opacity-50
                  flex items-center justify-center text-white font-bold
                  ${chipColors[betAmount.toString()] || 'bg-blue-500 border-blue-600'}
                `}
                                style={{
                                    left: hoveredCell.position.x,
                                    top: hoveredCell.position.y,
                                    zIndex: 20,
                                }}
                            >
                                ${betAmount}
                            </div>
                        )}
                    </div>
                </div>
                <div className='xl:w-6/12 flex justify-between flex-col h-full'>
                    <Tabs
                        defaultValue="nse"
                        className="w-full relative z-10"
                    >
                        <TabsList className="w-full hidden xl:flex h-10 p-1 bg-[#0F214F]">
                            <TabsTrigger className="flex-1 h-8" value="nse">
                                NSE
                            </TabsTrigger>
                            <TabsTrigger className="flex-1 h-8" value="crypto">
                                Crypto
                            </TabsTrigger>
                        </TabsList>

                        <header className='text-center hidden xl:block my-2 text-white'>
                            <h2>Round Starts in</h2>
                            <p className='text-7xl jersey leading-[5rem]'>1:00</p>
                        </header>
                        <main>
                            <div className="max-w-4xl mx-auto bg-[#1A2D58] p-4 rounded-2xl ">
                                {/* Bet Amount Input Field Above Buttons */}
                                <div className="flex justify-center relative mb-2">
                                    <div className="mr-2 absolute left-2 top-3 bottom-2 rounded-full" >
                                        <img src="/coin.svg" className='shadow-custom-glow  rounded-full' alt="coin" />
                                    </div>
                                    <Input
                                        placeholder="Enter bet amount"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(Number(e.target.value))}
                                        className="bg-[#101F44] p-2 text-white rounded-2xl pl-14  h-14 text-xl"
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-2">
                                    {/* Bet Amount Buttons */}
                                    <div className="flex justify-between gap-1 w-full xl:flex-nowrap flex-wrap">
                                        {[100, 500, 1000, 2000, 3000].map((amount) => (
                                            <Button
                                                className='flex-1'
                                                variant="game-secondary"
                                                key={amount}
                                                onClick={() => setBetAmount(amount)}
                                            >
                                                ${amount}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <button className='bet-button w-full'>
                                    BET
                                </button>
                            </div>
                        </main>
                    </Tabs>

                </div>
            </div>
        </div>
    );
};

export default RouletteGame;