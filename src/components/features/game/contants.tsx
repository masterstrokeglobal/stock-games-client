// types.ts
export interface RouletteNumber {
    number: number;
    color: 'red' | 'black';
}

export interface Position {
    x: number;
    y: number;
}

export interface Bet {
    type: 'single' | 'split' | 'street' | 'corner' | 'column' | 'color' | 'even_odd' | 'high_low' | 'row' | 'full_column';
    numbers: number[];
    position: Position;
    display?: string;
}

export interface Chip extends Bet {
    amount: number;
    x: number;
    y: number;
}

export interface FormattedTime {
    minutes: number;
    seconds: number;
    formatted: string;
}

export interface CurrentGameState {
    placeTimeLeft: FormattedTime;
    gameTimeLeft: FormattedTime;
    isPlaceOver: boolean;
    isGameOver: boolean;
}

// constants.ts
export const ROULETTE_NUMBERS: RouletteNumber[] = [
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

export const CHIP_COLORS: Record<string, string> = {
    '5': 'bg-red-500 border-red-600',
    '10': 'bg-blue-500 border-blue-600',
    '25': 'bg-green-500 border-green-600',
    '50': 'bg-purple-500 border-purple-600',
    '100': 'bg-yellow-500 border-yellow-600'
};