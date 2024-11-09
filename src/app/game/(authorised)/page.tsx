"use client";
import React, { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

interface SpinResult {
  number: number;
  won: boolean;
  winAmount?: number;
}

const RouletteGame: React.FC = () => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [message, setMessage] = useState<string>('');
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

  const getMultiplier = (betType: Bet['type']): number => {
    switch (betType) {
      case 'single': return 15;
      case 'split': return 7;
      case 'street': return 3;
      case 'corner': return 3;
      case 'column': return 3;
      case 'color': return 1;
      case 'even_odd': return 1;
      case 'high_low': return 1;
      default: return 1;
    }
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

  const clearBets = () => {
    setChips([]);
    setResult(null);
    setMessage('');
  };

  const spin = () => {
    if (chips.length === 0) {
      setMessage('Please place at least one bet!');
      return;
    }

    const winningNumber = Math.floor(Math.random() * 16) + 1;
    let totalWin = 0;
    let won = false;

    chips.forEach(chip => {
      if (chip.numbers.includes(winningNumber)) {
        totalWin += chip.amount * getMultiplier(chip.type);
        won = true;
      }
    });

    setResult({
      number: winningNumber,
      won,
      winAmount: totalWin
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant={result.won ? "default" : "destructive"}>
            <AlertTitle>
              {result.won ? `You won $${result.winAmount}!` : 'Better luck next time!'}
            </AlertTitle>
            <AlertDescription>
              Ball landed on: {result.number}
            </AlertDescription>
          </Alert>
        )}

        <div className="relative bg-green-800 rounded-xl shadow-2xl p-8 border-8 border-brown-800">
          {/* Chip Selection */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              {[5, 10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`
                    w-12 h-12 rounded-full border-4 flex items-center justify-center
                    text-white font-bold shadow-lg transform transition-all
                    ${chipColors[amount.toString()]}
                    ${betAmount === amount ? 'scale-110 ring-4 ring-white' : 'hover:scale-105'}
                  `}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearBets}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-all"
              >
                Clear Bets
              </button>
              <button
                onClick={spin}
                className="px-8 py-2 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transform hover:scale-105 transition-all shadow-lg"
              >
                SPIN
              </button>
            </div>
          </div>

          {/* Roulette Board */}
          <div
            ref={boardRef}
            onClick={handleBoardClick}
            onMouseMove={handleBoardHover}
            onMouseLeave={handleBoardLeave}
            className="relative max-w-2xl mx-auto cursor-crosshair"
          >
            {/* Numbers Grid */}
            <div className="grid grid-cols-4 gap-px bg-yellow-700 p-px">
              {numbers.map(({ number, color }) => (
                <div
                  key={number}
                  className={`
                    aspect-square relative group
                    ${color === 'red' ? 'bg-red-600' : 'bg-black'}
                    ${hoveredCell && hoveredCell.numbers.includes(number) ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}
                    ${chips.some(chip => chip.numbers.includes(number)) ? 'ring-2 ring-blue-500' : ''}
                    transition-all duration-150
                  `}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                    {number}
                  </span>
                </div>
              ))}
            </div>

            {/* Special Bets Section */}
            <div className="grid grid-cols-5 gap-px mt-4">
              <button className="bg-red-600 text-white p-2 font-bold hover:bg-red-500">RED</button>
              <button className="bg-black text-white p-2 font-bold hover:bg-gray-800">BLACK</button>
              <button className="bg-gray-600 text-white p-2 font-bold hover:bg-gray-500">EVEN</button>
              <button className="bg-gray-600 text-white p-2 font-bold hover:bg-gray-500">ODD</button>
              <button className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500">1-8</button>
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
      </div>
    </div>
  );
};

export default RouletteGame;