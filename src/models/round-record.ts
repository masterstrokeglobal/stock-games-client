import MarketItem, { SchedulerType } from "./market-item";


export enum RoundRecordGameType {
    DERBY = "derby",
    LOBBY = "lobby",
    MINI_MUTUAL_FUND = "mini_mutual_fund",
    GUESS_FIRST_FOUR = "guess_first_four",
    GUESS_LAST_FOUR = "guess_last_four",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    STOCK_SLOTS = "stock_slots",
  }
  
export class RoundRecord {
    id: number;
    startTime: Date;
    companyId: number;
    endTime: Date;
    placementStartTime: Date;
    placementEndTime: Date;
    market: MarketItem[];
    type: SchedulerType;
    winningId?: number;
    createdAt: Date;
    roundRecordGameType: RoundRecordGameType;
    winningMarket?: MarketItem;
    updatedAt: Date;
    slotValues:  { [code: string]: { upperValue: number; lowerValue: number } } | null;
    deletedAt?: Date;
    initialValues: any | null;

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
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : undefined;
        this.initialValues = data.initialValues || null;
    }

    getSlotValues(code: string): { upperValue: number; lowerValue: number } {
        return this.slotValues?.[code] || { upperValue: 0, lowerValue: 0 };
    }


    get winnerName(): string {
        return this.market.find(item => item.id === this.winningId)?.name || "-";
    }

    get winnerHorse(): number {
        return this.market.find(item => item.id === this.winningId)?.horse || 0;
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
}