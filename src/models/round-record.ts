import { CoinTossPair } from "./coin-toss-pair";
import { HeadTailPlacementType } from "./head-tail";
import MarketItem, { SchedulerType } from "./market-item";
import { WheelColor, ColorConfig } from "./wheel-of-fortune-placement";

export enum RoundRecordGameType {
    DERBY = "derby",
    LOBBY = "lobby",
    MINI_MUTUAL_FUND = "mini_mutual_fund",
    GUESS_FIRST_FOUR = "guess_first_four",
    GUESS_LAST_FOUR = "guess_last_four",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    STOCK_SLOTS = "stock_slots",
    STOCK_JACKPOT = "stock_jackpot",
    SEVEN_UP_DOWN = "seven_up_down",
    HEAD_TAIL = "head_tail",
    WHEEL_OF_FORTUNE = "wheel_of_fortune",
    AVIATOR = "aviator",
    DICE = "dice"    
}

export const WHEEL_COLOR_SEQUENCE = [
    WheelColor.COLOR1, // GOLDEN - Segment 1 (top)
    WheelColor.COLOR2, // RED - Segment 2
    WheelColor.COLOR4, // GREEN - Segment 3
    WheelColor.COLOR3, // BLUE - Segment 4
    WheelColor.COLOR2, // RED - Segment 5
    WheelColor.COLOR5, // PURPLE - Segment 6
    WheelColor.COLOR4, // GREEN - Segment 7
    WheelColor.COLOR2, // RED - Segment 8
    WheelColor.COLOR3, // BLUE - Segment 9
    WheelColor.COLOR4, // GREEN - Segment 10
    WheelColor.COLOR2, // RED - Segment 11
    WheelColor.COLOR5, // PURPLE - Segment 12
    WheelColor.COLOR4, // GREEN - Segment 13
    WheelColor.COLOR3, // BLUE - Segment 14
    WheelColor.COLOR2, // RED - Segment 15
    WheelColor.COLOR4, // GREEN - Segment 16
    WheelColor.COLOR3, // BLUE - Segment 17
    WheelColor.COLOR5, // PURPLE - Segment 18
    WheelColor.COLOR4, // GREEN - Segment 19
    WheelColor.COLOR3, // BLUE - Segment 20
];


export const WHEEL_COLOR_CONFIG: Record<WheelColor, ColorConfig> = {
    [WheelColor.COLOR1]: {
        name: 'GOLDEN',
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-900',
        borderColor: 'border-yellow-600',
        shadowColor: 'shadow-yellow-500/50',
        actualColor: '#FFD700',
        multiplier: 2
    },
    [WheelColor.COLOR2]: {
        name: 'RED',
        bgColor: 'bg-red-600',
        textColor: 'text-red-900',
        borderColor: 'border-red-600',
        shadowColor: 'shadow-red-500/50',
        actualColor: '#DC2626',
        multiplier: 2
    },
    [WheelColor.COLOR3]: {
        name: 'BLUE',
        bgColor: 'bg-blue-600',
        textColor: 'text-blue-900',
        borderColor: 'border-blue-600',
        shadowColor: 'shadow-blue-500/50',
        actualColor: '#2563EB',
        multiplier: 2
    },
    [WheelColor.COLOR4]: {
        name: 'GREEN',
        bgColor: 'bg-green-600',
        textColor: 'text-green-900',
        borderColor: 'border-green-600',
        shadowColor: 'shadow-green-500/50',
        actualColor: '#16A34A',
        multiplier: 2
    },
    [WheelColor.COLOR5]: {
        name: 'PURPLE',
        bgColor: 'bg-purple-600',
        textColor: 'text-purple-900',
        borderColor: 'border-purple-600',
        shadowColor: 'shadow-purple-500/50',
        actualColor: '#7C3AED',
        multiplier: 2
    }
};


export class RoundRecord {
    id: number;
    startTime: Date;
    companyId: number;
    endTime: Date;
    placementStartTime: Date;
    placementEndTime: Date;
    market: MarketItem[];
    gameType: RoundRecordGameType;
    type: SchedulerType;
    roundRecordGameType: RoundRecordGameType;
    winningId?: number[];
    coinTossPair?: CoinTossPair;
    createdAt: Date;
    winningMarket?: MarketItem;
    updatedAt: Date;
    slotValues: { [code: string]: { upperValue: number; lowerValue: number } } | null;
    deletedAt?: Date;
    initialValues: Record<string, number> | null;
    winningSide?: HeadTailPlacementType;
    marketColors: {
        color: WheelColor;
        marketId: number;
    }[];

    constructor(data: Partial<RoundRecord>) {
        this.id = data.id || 0;
        this.slotValues = data.slotValues || null;
        this.startTime = data.startTime ? new Date(data.startTime) : new Date();
        this.companyId = data.companyId || 0;
        this.endTime = data.endTime ? new Date(data.endTime) : new Date();
        this.placementStartTime = data.placementStartTime ? new Date(data.placementStartTime) : new Date();
        this.placementEndTime = data.placementEndTime ? new Date(data.placementEndTime) : new Date();
        this.market = data.market?.map((item: any, index) => new MarketItem({ ...item, horse: index + 1, slotValues: this.getSlotValues(item.code) })) || [];
        this.type = data.type || SchedulerType.NSE;
        this.winningMarket = data.winningMarket;
        this.winningId = data.winningId;
        this.roundRecordGameType = data.roundRecordGameType || RoundRecordGameType.DERBY;
        this.gameType = data.gameType || RoundRecordGameType.DERBY;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : undefined;
        this.initialValues = data.initialValues || null;
        this.coinTossPair = data.coinTossPair ? new CoinTossPair(data.coinTossPair) : undefined;
        this.winningSide = data.winningSide || undefined;
        this.marketColors = data.marketColors || [];
    }

    getSlotValues(code: string): { upperValue: number; lowerValue: number } {
        return this.slotValues?.[code] || { upperValue: 0, lowerValue: 0 };
    }
    marketColor(marketId: number): WheelColor | undefined {
        return this.marketColors.find(item => item.marketId === marketId)?.color || undefined;
    }

    getMarketsByColor(color: WheelColor): MarketItem[] {
        return this.marketColors.filter(item => item.color === color).map(item => this.market.find(market => market.id === item.marketId)).filter(item => item !== undefined) as MarketItem[];
    }   
    marketColorConfig(marketId: number): ColorConfig | undefined {
        const color = this.marketColor(marketId);
        if (!color) return undefined;
        return WHEEL_COLOR_CONFIG[color];
    }


    get winnerName(): string {
        return this.market.find(item => item.id === this.winningId?.[0])?.name || "-";
    }

    get winnerHorse(): number {
        return this.market.find(item => item.id === this.winningId?.[0])?.horse || 0;
    }

    // find market number by id 
    getMarketNumberById(id: number): number {
        return this.market.find(item => item.id === id)?.horse || 0;
    }

    // Helper method to serialize the instance to a plain object
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            startTime: this.startTime.toISOString(),
            companyId: this.companyId,
            endTime: this.endTime.toISOString(),
            placementStartTime: this.placementStartTime.toISOString(),
            placementEndTime: this.placementEndTime.toISOString(),
            market: this.market,
            type: this.type,
            winningId: this.winningId,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            deletedAt: this.deletedAt?.toISOString()
        };
    }



    // Static method to create instance from API response
    static fromAPI(data: any): RoundRecord {
        return new RoundRecord(data);
    }

    getMarketByHorseNumber(horseNumber: number): MarketItem | undefined {
        return this.market.find(item => item.horse === horseNumber);
    }

    isHorseWinning(horseNumber: number): boolean {
        const market = this.getMarketByHorseNumber(horseNumber);
        const marketId = market?.id;
        if (!marketId) return false;
        const isWinning = this.winningId?.includes(marketId);
        return isWinning || false;
    }

    get roundGameName(): string {
        return this.roundRecordGameType === RoundRecordGameType.GUESS_FIRST_FOUR ? "Guess First Four" :
            this.roundRecordGameType === RoundRecordGameType.GUESS_LAST_FOUR ? "Guess Last Four" :
                this.roundRecordGameType === RoundRecordGameType.GUESS_FIRST_EIGHT ? "Guess First Eight" :
                    this.roundRecordGameType === RoundRecordGameType.GUESS_LAST_EIGHT ? "Guess Last Eight" :
                        this.roundRecordGameType === RoundRecordGameType.MINI_MUTUAL_FUND ? "Mini Mutual Fund" : "";
    }
    getInitialPrice(bitcode: string): number {
        // case insensitive both ways 
        const codeLower = bitcode.toLowerCase();
        const codeUpper = bitcode.toUpperCase();
        const initialPrice = this.initialValues?.[codeLower] || this.initialValues?.[codeUpper] || 0;
        return initialPrice;
    }

    get colorSequenceMarket(): MarketItem[] {
        const sequenceMarkets: MarketItem[] = [];
        
        WHEEL_COLOR_SEQUENCE.forEach((color, segmentIndex) => {
            // Get all markets for this color
            const marketsForColor = this.getMarketsByColor(color);
            
            if (marketsForColor.length > 0) {
                // For each segment, we need to determine which specific market from this color group
                // You can use different strategies here:
                
                // Strategy 1: Distribute markets evenly across segments of the same color
                const colorSegmentIndex = WHEEL_COLOR_SEQUENCE.slice(0, segmentIndex + 1).filter(c => c === color).length - 1;
                const marketIndex = colorSegmentIndex % marketsForColor.length;
                sequenceMarkets.push(marketsForColor[marketIndex]);
                
                // Strategy 2: Round-robin assignment (alternative)
                // const marketIndex = segmentIndex % marketsForColor.length;
                // sequenceMarkets.push(marketsForColor[marketIndex]);
                
                // Strategy 3: First market for each color (simplest)
                // sequenceMarkets.push(marketsForColor[0]);
            }
        });
        
        return sequenceMarkets;
    }
    
}