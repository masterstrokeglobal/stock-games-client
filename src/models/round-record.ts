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
    DICE = "dice",
    RED_BLACK = "red_black",
}

export const WHEEL_COLOR_SEQUENCE = [
    WheelColor.COLOR5, // GOLDEN - Segment 0 (top)
    WheelColor.COLOR1, // RED - Segment 1
    WheelColor.COLOR2, // GREEN - Segment 2
    WheelColor.COLOR3, // BLUE - Segment 3
    WheelColor.COLOR1, // RED - Segment 4
    WheelColor.COLOR2, // GREEN - Segment 5
    WheelColor.COLOR4, // PURPLE - Segment 6
    WheelColor.COLOR1, // RED - Segment 7
    WheelColor.COLOR2, // GREEN - Segment 8
    WheelColor.COLOR3, // BLUE - Segment 9
    WheelColor.COLOR1, // RED - Segment 10
    WheelColor.COLOR2, // GREEN - Segment 11
    WheelColor.COLOR4, // PURPLE - Segment 12
    WheelColor.COLOR1, // RED - Segment 13
    WheelColor.COLOR2, // GREEN - Segment 14
    WheelColor.COLOR3, // BLUE - Segment 15
    WheelColor.COLOR1, // RED - Segment 16
    WheelColor.COLOR2, // GREEN - Segment 17
    WheelColor.COLOR4, // PURPLE - Segment 18
    WheelColor.COLOR1, // RED - Segment 19
    WheelColor.COLOR3  // BLUE - Segment 20
];


export const WHEEL_COLOR_BANDS = [
    { color: WheelColor.COLOR1, indices: [0, 3, 6, 9, 12, 15, 18] }, // 7 items
    { color: WheelColor.COLOR2, indices: [1, 4, 7, 10, 13, 16] }, // 6 items
    { color: WheelColor.COLOR3, indices: [2, 8, 14, 19] }, // 4 items
    { color: WheelColor.COLOR4, indices: [5, 11, 17] }, // 3 items
    { color: WheelColor.COLOR5, indices: [20] }, // 1 item
];

export const IndexwithColorBands = [
    { color: WheelColor.COLOR5, index: 20 },
    { color: WheelColor.COLOR1, index: 0 },
    { color: WheelColor.COLOR2, index: 1 },
    { color: WheelColor.COLOR3, index: 2 },
    { color: WheelColor.COLOR1, index: 3 },
    { color: WheelColor.COLOR2, index: 4 },
    { color: WheelColor.COLOR4, index: 5 },
    { color: WheelColor.COLOR1, index: 6 },
    { color: WheelColor.COLOR2, index: 7 },
    { color: WheelColor.COLOR3, index: 8 },
    { color: WheelColor.COLOR1, index: 9 },
    { color: WheelColor.COLOR2, index: 10 },
    { color: WheelColor.COLOR4, index: 11 },
    { color: WheelColor.COLOR1, index: 12 },
    { color: WheelColor.COLOR2, index: 13 },
    { color: WheelColor.COLOR3, index: 14 },
    { color: WheelColor.COLOR1, index: 15 },
    { color: WheelColor.COLOR2, index: 16 },
    { color: WheelColor.COLOR4, index: 17 },
    { color: WheelColor.COLOR1, index: 18 },
];




export const WHEEL_COLOR_CONFIG: Record<WheelColor, ColorConfig> = {
    [WheelColor.COLOR1]: {
        name: 'RED',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        borderColor: 'border-red-600',
        shadowColor: 'shadow-red-500/50',
        actualColor: '#F44336', // Vibrant red (most frequent - 7 items)
        multiplier: 2
    },
    [WheelColor.COLOR2]: {
        name: 'GREEN',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        borderColor: 'border-green-600',
        shadowColor: 'shadow-green-500/50',
        actualColor: '#4CAF50', // Vibrant green (6 items)
        multiplier: 2
    },
    [WheelColor.COLOR3]: {
        name: 'BLUE',
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        borderColor: 'border-blue-600',
        shadowColor: 'shadow-blue-500/50',
        actualColor: '#2196F3', // Bright blue (4 items)
        multiplier: 2
    },
    [WheelColor.COLOR4]: {
        name: 'PURPLE',
        bgColor: 'bg-fuchsia-600',
        textColor: 'text-white',
        borderColor: 'border-fuchsia-700',
        shadowColor: 'shadow-fuchsia-500/50',
        actualColor: '#E91E63', // Bright magenta-pink (3 items)
        multiplier: 2
    },
    [WheelColor.COLOR5]: {
        name: 'GOLDEN',
        bgColor: 'bg-yellow-400',
        textColor: 'text-yellow-900',
        borderColor: 'border-yellow-500',
        shadowColor: 'shadow-yellow-400/50',
        actualColor: '#FFD700', // Golden yellow (1 item - rarest)
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
    winningMarkets: MarketItem[];
    winningId?: number[];
    coinTossPair?: CoinTossPair;
    todayCount?: number;
    createdAt: Date;
    winningMarket?: MarketItem;
    updatedAt: Date;
    slotValues: { [code: string]: { upperValue: number; lowerValue: number } } | null;
    deletedAt?: Date;
    initialValues: Record<string, number> | null;
    finalDifferences: Record<string, number> | null;
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
        this.winningMarkets = data.winningMarkets?.map((item: any) => new MarketItem(item)) || [];
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : undefined;
        this.initialValues = data.initialValues || null;
        this.finalDifferences = data.finalDifferences || null;
        this.coinTossPair = data.coinTossPair ? new CoinTossPair(data.coinTossPair) : undefined;
        this.winningSide = data.winningSide || undefined;
        this.marketColors = data.marketColors || [];
        this.todayCount = data.todayCount || -1;
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

    get sequenceMarketItems(): MarketItem[] {
        const marketItems = IndexwithColorBands.map(item => this.market[item.index]);
        return marketItems.filter(item => item !== undefined) as MarketItem[];
    }


    get gameDuration(): number {
        // in seconds 
        return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000);
    }

    get placementDuration(): number {
        // in seconds 
        return Math.floor((this.placementEndTime.getTime() - this.placementStartTime.getTime()) / 1000);
    }

    changePercentage(marketId: number): number {
        const market = this.market.find(item => item.id === marketId);
        if (!market) return 0;
        const initialPrice = this.getInitialPrice(market.code || "");
        const finalPrice = this.finalDifferences?.[market.code || ""] || 0;
        if (initialPrice === 0) return 0;
        return parseFloat((((finalPrice - initialPrice) / initialPrice) * 100).toFixed(2));
    }

    get finalPricesPresent(): boolean {
        return Object.keys(this.finalDifferences || {}).length > 0;
    }

    get winnersNames(): string[] {
        const names = this.market.filter(item => this.winningId?.includes(item.id || 0)).map(item => item.name);
        return names.filter(item => item !== undefined) as string[];
    }
}