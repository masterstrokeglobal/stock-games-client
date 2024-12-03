
export enum SchedulerType {
    NSE = "nse",
    CRYPTO = "crypto",
}

export class MarketItem {
    id?: number;
    type?: SchedulerType;
    active?: boolean;
    name?: string;
    oddsMultiplier?: number;
    code?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    horse?: number;

    constructor(params: Partial<MarketItem> = {}) {
        this.id = params.id;
        this.type = params.type;
        this.active = params.active;
        this.name = params.name;
        this.oddsMultiplier = params.oddsMultiplier;
        this.code = params.code;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
        this.horse = params.horse;
    }

    get codeName() {
        return this.code?.startsWith("usdt")
            ? "USDT"
            : this.code?.replace(/usdt$/, "").toLocaleUpperCase();
    }

    get stream() {
        return `${this.code?.toLowerCase()}@trade`;
    }

    get bitcode() {
        return this.code?.toUpperCase()
    }
}

export default MarketItem;


export class NSEMarketItem {
    code: string;
    price: number;
    constructor(params: any[]) {
        const id = params[0].toString();
        this.code = id.split(" ")[0];
        this.price = params[3];
    }
}