import MarketItem, { SchedulerType } from "./market-item";

export class JackpotPair {
    id?: number;
    type?: SchedulerType;
    active?: boolean;
    marketItems?: MarketItem[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<JackpotPair> = {}) {
        this.id = params.id;
        this.type = params.type;
        this.active = params.active;    
        this.marketItems = params.marketItems;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}

export default JackpotPair;