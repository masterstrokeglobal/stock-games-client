import { useCallback, useState } from 'react';

export enum PlacementType {
    SINGLE = "single",
    SPLIT = "split",
    STREET = "street",
    DOUBLE_STREET = "double_street"
}

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
const CELL_WIDTH = 80;
const CELL_HEIGHT = 40;
const GAP = 8;
const BORDER_THRESHOLD = 6;


export const getBetPosition = (bet: Bet): ChipPosition => {
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
            const rowStart = Math.min(...bet.numbers);
            const pos = getNumberPosition(rowStart);
            return {
                x: pos.x + CELL_WIDTH * 4 + GAP * 3,
                y: pos.y + CELL_HEIGHT / 2,
                transform: 'translate(-50%, -50%)'
            };
        }

        case PlacementType.DOUBLE_STREET: {
            const upperRowStart = Math.min(...bet.numbers);
            const pos = getNumberPosition(upperRowStart);
            return {
                x: pos.x + CELL_WIDTH * 4 + GAP * 3,
                y: pos.y + CELL_HEIGHT,
                transform: 'translate(-50%, -50%)'
            };
        }

        default:
            return { x: 0, y: 0 };
    }
};
export const useRouletteBetting = () => {
    const [hoveredCell, setHoveredCell] = useState<Bet | null>(null);
    const [chips, setChips] = useState<Chip[]>([]);


    const getBetTypeFromClick = useCallback((
        event: React.MouseEvent,
        boardRef: React.RefObject<HTMLElement>
    ): Bet | null => {
        if (!boardRef.current) return null;

        const position = {
            x: event.clientX,
            y: event.clientY
        };

        const rect = boardRef.current.getBoundingClientRect();
        const gridWidth = rect.width;
        const relativeX = position.x - rect.left;
        const relativeY = position.y - rect.top;


        const CELL_WIDTH = (gridWidth - GAP * 3) / 4;

        const colIndex = Math.floor(relativeX / (CELL_WIDTH + GAP));
        const rowIndex = Math.floor(relativeY / (CELL_HEIGHT + GAP));

        if (colIndex < 0 || colIndex >= 4 || rowIndex < 0 || rowIndex >= 4) {
            return null;
        }

        const cellX = relativeX - colIndex * (CELL_WIDTH + GAP);
        const cellY = relativeY - rowIndex * (CELL_HEIGHT + GAP);

        const currentNumber = rowIndex * 4 + colIndex + 1;

        // Single bet
        if (cellX >= BORDER_THRESHOLD &&
            cellX <= CELL_WIDTH - BORDER_THRESHOLD &&
            cellY >= BORDER_THRESHOLD &&
            cellY <= CELL_HEIGHT - BORDER_THRESHOLD) {
            return {
                type: PlacementType.SINGLE,
                numbers: [currentNumber]
            };
        }

        console.log( cellX,BORDER_THRESHOLD);
        // Split bet (horizontal)
        if (cellX <= BORDER_THRESHOLD && colIndex > 0) {
            return {
                type: PlacementType.SPLIT,
                numbers: [currentNumber - 1, currentNumber]
            };
        }

        // Split bet (vertical)
        if (cellY <= BORDER_THRESHOLD && rowIndex > 0) {
            return {
                type: PlacementType.SPLIT,
                numbers: [currentNumber - 4, currentNumber]
            };
        }

        // Street bet
        if (cellX >= CELL_WIDTH - BORDER_THRESHOLD &&
            cellX <= CELL_WIDTH + GAP &&
            colIndex === 3) {
            const rowStart = Math.floor((currentNumber - 1) / 4) * 4 + 1;
            return {
                type: PlacementType.STREET,
                numbers: [rowStart, rowStart + 1, rowStart + 2, rowStart + 3]
            };
        }

        // Double street bet
        if (cellY <= BORDER_THRESHOLD &&
            cellX >= CELL_WIDTH - BORDER_THRESHOLD &&
            cellX <= CELL_WIDTH + GAP &&
            colIndex === 3 &&
            rowIndex > 0) {
            const upperRowStart = Math.floor((currentNumber - 5) / 4) * 4 + 1;
            const lowerRowStart = Math.floor((currentNumber - 1) / 4) * 4 + 1;
            return {
                type: PlacementType.DOUBLE_STREET,
                numbers: [
                    upperRowStart, upperRowStart + 1, upperRowStart + 2, upperRowStart + 3,
                    lowerRowStart, lowerRowStart + 1, lowerRowStart + 2, lowerRowStart + 3
                ]
            };
        }

        return null;
    }, []);

    return {
        hoveredCell,
        setHoveredCell,
        chips,
        setChips,
        getBetTypeFromClick,
        getBetPosition
    };
};