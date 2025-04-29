

export enum SchedulerType {
    NSE = "nse",
    CRYPTO = "crypto",
    USA_MARKET = "usa_market",
  }
export class MarketItem {
    id?: number;
    type?: SchedulerType;
    active?: boolean;
    name?: string;
    oddsMultiplier?: number;
    code?: string;
    createdAt?: Date;
    placementAllowed?: boolean;
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
        this.placementAllowed = params.placementAllowed;
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

    get currency() {    
        switch(this.type) {
            case SchedulerType.NSE:
                return "Rs.";
            case SchedulerType.CRYPTO:
                return "USDT";
            case SchedulerType.USA_MARKET:
                return "$";
        }
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