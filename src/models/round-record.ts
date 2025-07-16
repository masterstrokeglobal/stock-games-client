import { RankedMarketItem } from "@/hooks/use-leadboard";
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
            backgroundGradient: 'linear-gradient(90.33deg, rgba(175, 2, 45, 0.85) 1.64%, rgba(84, 0, 6, 0.85) 115.74%)',
            borderColor: '#FF0909',
            shadowColor: 'shadow-red-500/50',
            shadow: "0px 0px 30px 0px rgba(244, 67, 54, 1)",
            actualColor: '#F44336', 
            chipColor: '#910024',// Vibrant red (most frequent - 7 items)
            multiplier: 3
        },
        [WheelColor.COLOR2]: {
            name: 'GREEN',
            bgColor: 'bg-green-500',
            textColor: 'text-white',
            backgroundGradient: 'linear-gradient(90.33deg, rgba(10, 155, 0, 0.85) 1.64%, rgba(15, 90, 30, 0.85) 115.74%)',
            borderColor: '#0ED700',
            shadowColor: 'shadow-green-500/50',
            shadow: "0px 0px 30px 0px rgba(76, 175, 80, 1)",
            actualColor: '#4CAF50',
            chipColor: '#0E6D24', // Vibrant green (6 items)
            multiplier: 3
        },
        [WheelColor.COLOR3]: {
            name: 'BLUE',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            shadow: "0px 0px 30px 0px rgba(33, 150, 243, 1)",
            backgroundGradient: 'linear-gradient(93.91deg, #0B58B9 -1.06%, #052753 139.66%)',
            borderColor: '#0076FF',
            chipColor: '#0A57B4',
            shadowColor: 'shadow-blue-500/50',
            actualColor: '#2196F3', // Bright blue (4 items)
            multiplier: 5
        },
        [WheelColor.COLOR4]: {
            name: 'PURPLE',
            bgColor: 'bg-[#6C2784]', // Custom purple from image
            textColor: 'text-[#B9A9D0]', // Muted light gray from image
            backgroundGradient: 'linear-gradient(93.91deg, #6C2784 -1.06%, #4B1760 139.66%)',
            borderColor: '#CD71FF',
            shadowColor: 'shadow-[#6C2784]/50',
            shadow: "0px 0px 30px 0px #6C2784",
            chipColor: '#4B1760',
            actualColor: '#6C2784', // Main purple
            multiplier: 7
        },
        [WheelColor.COLOR5]: {
            name: 'GOLDEN',
            bgColor: 'bg-yellow-400',
            textColor: 'text-yellow-900',
            backgroundGradient: 'linear-gradient(93.91deg, #BE6401 -1.06%, #5B3307 139.66%)',
            borderColor: '#FFC857',   
            shadowColor: 'shadow-yellow-400/50',
            shadow: "0px 0px 30px 0px rgba(255, 215, 0, 1)",
            chipColor: '#8F571B',
            actualColor: '#FFD700', // Golden yellow (1 item - rarest)
            multiplier: 21
        },
        [WheelColor.COLOR6]: {
            name: 'WHITE',
            backgroundGradient: 'linear-gradient(90.33deg, rgba(175, 2, 45, 0.85) 1.64%, rgba(84, 0, 6, 0.85) 115.74%)',
            bgColor: 'bg-white',
            textColor: 'text-black',
            borderColor: 'border-white',
            chipColor: '#FFFFFF',
            shadowColor: 'shadow-yellow-400/50',
            shadow: "0px 0px 30px 0px rgba(255, 255, 255, 1)",
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
    bonusSymbol?: string;
bonusMultiplier?: number;

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
        this.bonusSymbol = data.bonusSymbol;
        this.bonusMultiplier = data.bonusMultiplier;
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
        return parseFloat((((finalPrice - initialPrice) / initialPrice) * 100).toFixed(6));
    }

    get finalPricesPresent(): boolean {
        return Object.keys(this.finalDifferences || {}).length > 0;
    }

    get sortedMarketItems(): RankedMarketItem[] | null {
        if (!this.initialValues || !this.finalDifferences) return null;

        const initialPrices = this.initialValues;
        const finalPrices = this.finalDifferences;
        const sortedMarketItems: RankedMarketItem[] = this.market.sort((a, b) => {
            const initialPriceA = initialPrices?.[a.code || ""] || 0;
            const initialPriceB = initialPrices?.[b.code || ""] || 0;
            const finalPriceA = finalPrices?.[a.code || ""] || 0;
            const finalPriceB = finalPrices?.[b.code || ""] || 0;
            const changePercentageA = ((finalPriceA - initialPriceA) / initialPriceA) * 100;
            const changePercentageB = ((finalPriceB - initialPriceB) / initialPriceB) * 100;
            return changePercentageB - changePercentageA;
        }).map((item, index) => {

            const change_percent = ((finalPrices?.[item.code || ""] || 0) - (initialPrices?.[item.code || ""] || 0)) / (initialPrices?.[item.code || ""] || 0) * 100;

            return ({
                ...item,
                change_percent: change_percent,
                rank: index + 1,
                price: finalPrices?.[item.code || ""] || 0,
                codeName: item.codeName || "",
                stream: item.stream || "",
                bitcode: item.code || "",
                id: item.id || 0,
                type: item.type || SchedulerType.NSE,
                active: item.active || true,
                horse: item.horse || 0,
                name: item.name || "",
                currency: item.currency || "",
            } as unknown as RankedMarketItem);
        });
        return sortedMarketItems;
    }

    get winnersNames(): string[] {
        const names = this.market.filter(item => this.winningId?.includes(item.id || 0)).map(item => item.name);
        return names.filter(item => item !== undefined) as string[];
    }

    getColorByMarketId(marketId: number): WheelColor | undefined {
        return this.marketColors.find(item => item.marketId === marketId)?.color || undefined;
    }
}