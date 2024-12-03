import { PlacementType } from '@/models/game-record';
import { RefObject, useCallback, useState } from 'react';

interface Bet {
    type: PlacementType;
    numbers: number[];
}

interface Position {
    x: number;
    y: number;
}

interface ChipPosition extends Position {
    transform?: string;
}

interface Chip extends Bet {
    amount: number;
    position: ChipPosition;
}

// Grid constants
const CELL_HEIGHT = 40;
const GAP = 8;
const BORDER_THRESHOLD = 6;

type Props = {
    container: RefObject<HTMLDivElement>;
};

export const useRouletteBetting = ({ container }: Props) => {
    const [hoveredCell, setHoveredCell] = useState<Bet | null>(null);
    const [chips, setChips] = useState<Chip[]>([]);

    const getBetPosition = (bet: Bet): ChipPosition => {
        const gridWidth = container.current?.getBoundingClientRect().width || 0;
        const CELL_WIDTH = (gridWidth - GAP * 3) / 4;
        const getNumberPosition = (number: number): Position => {
            const row = Math.floor((number - 1) / 4);
            const col = (number - 1) % 4;
            return {
                x: col * (CELL_WIDTH + GAP),
                y: row * (CELL_HEIGHT + GAP)
            };
        };

        switch (bet.type) {
            case PlacementType.SINGLE: {
                const pos = getNumberPosition(bet.numbers[0]);
                return {
                    x: pos.x + CELL_WIDTH / 2,
                    y: pos.y + CELL_HEIGHT / 2,
                    transform: 'translate(-50%, -50%)'
                };
            }

            case PlacementType.SPLIT: {
                const pos1 = getNumberPosition(bet.numbers[0]);
                const pos2 = getNumberPosition(bet.numbers[1]);

                // Horizontal split
                if (Math.abs(bet.numbers[0] - bet.numbers[1]) === 1) {
                    return {
                        x: Math.min(pos1.x, pos2.x) + CELL_WIDTH,
                        y: pos1.y + CELL_HEIGHT / 2,
                        transform: 'translate(-50%, -50%)'
                    };
                }
                // Vertical split
                else {
                    return {
                        x: pos1.x + CELL_WIDTH / 2,
                        y: Math.min(pos1.y, pos2.y) + CELL_HEIGHT,
                        transform: 'translate(-50%, -50%)'
                    };
                }
            }

            case PlacementType.STREET: {
                console.log(bet.numbers);
                // Determine if it's a horizontal or vertical street
                const isHorizontalStreet = bet.numbers[1] - bet.numbers[0] === 1;
                const firstNumberPos = getNumberPosition(bet.numbers[0]);

                if (isHorizontalStreet) {
                    return {
                        x: firstNumberPos.x,  // Positioned at the full left side
                        y: firstNumberPos.y + CELL_HEIGHT / 2,
                        transform: 'translate(-50%, -50%)'
                    };
                } else {
                    return {
                        x: firstNumberPos.x + CELL_WIDTH / 2,
                        y: firstNumberPos.y + CELL_HEIGHT,  // Move to align with the line
                        transform: 'translate(-50%, -50%)'
                    };
                }
            }


            default:
                return { x: 0, y: 0 };
        }
    };

    const getBetTypeFromClick = useCallback((event: React.MouseEvent, boardRef: React.RefObject<HTMLElement>): Bet | null => {
        if (!boardRef.current) return null;

        const position = { x: event.clientX, y: event.clientY };
        const rect = boardRef.current.getBoundingClientRect();
        const gridWidth = rect.width;

        const relativeX = position.x - rect.left;
        const relativeY = position.y - rect.top;

        const cellWidth = (gridWidth - GAP * 3) / 4;

        const colIndex = Math.floor(relativeX / (cellWidth + GAP));
        const rowIndex = Math.floor(relativeY / (CELL_HEIGHT + GAP));

        if (colIndex < 0 || colIndex >= 4 || rowIndex < 0 || rowIndex >= 4) {
            return null;
        }

        const cellX = relativeX - colIndex * (cellWidth + GAP);
        const cellY = relativeY - rowIndex * (CELL_HEIGHT + GAP);
        const currentNumber = rowIndex * 4 + colIndex + 1;

        // Single bet
        if (cellX >= BORDER_THRESHOLD &&
            cellX <= cellWidth - BORDER_THRESHOLD &&
            cellY >= BORDER_THRESHOLD &&
            cellY <= CELL_HEIGHT - BORDER_THRESHOLD) {
            return {
                type: PlacementType.SINGLE,
                numbers: [currentNumber]
            };
        }

        // Vertical split
        if (rowIndex < 3 &&
            Math.abs(currentNumber - (currentNumber + 4)) === 4 &&
            cellX >= BORDER_THRESHOLD &&
            cellX <= cellWidth - BORDER_THRESHOLD) {
            return {
                type: PlacementType.SPLIT,
                numbers: [currentNumber, currentNumber + 4]
            };
        }

        // Vertical Street bet (bottom edge)
        if (cellY > CELL_HEIGHT - BORDER_THRESHOLD) {
            const streetStartNumber = 13 + colIndex;
            console.log(streetStartNumber);
            return {
                type: PlacementType.STREET,
                numbers: [streetStartNumber, streetStartNumber - 4, streetStartNumber - 8, streetStartNumber - 12]
            };
        }


        // Horizontal Street bet (left edge)
        if (cellX < BORDER_THRESHOLD) {
            const streetStartNumber = (rowIndex * 4) + 1;
            return {
                type: PlacementType.STREET,
                numbers: [streetStartNumber, streetStartNumber + 1, streetStartNumber + 2, streetStartNumber + 3]
            };
        }
        // Horizontal split
        if (colIndex < 3 && Math.abs(currentNumber - (currentNumber + 1)) === 1) {
            return {
                type: PlacementType.SPLIT,
                numbers: [currentNumber, currentNumber + 1]
            };
        }

        // Street bet

        return null;
    }, []);




    const placeBet = useCallback((bet: Bet, amount: number) => {
        const chipPosition = getBetPosition(bet);
        const newChip: Chip = {
            ...bet,
            amount,
            position: chipPosition
        };

        setChips(prevChips => [...prevChips, newChip]);
    }, []);

    return {
        hoveredCell,
        setHoveredCell,
        chips,
        setChips,
        getBetTypeFromClick,
        placeBet,
        getBetPosition
    };
};