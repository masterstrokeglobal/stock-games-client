import MarketItem from "./market-item";

export class CoinTossPair {
  id: number;
  type: string;
  active: boolean;
  head: MarketItem;
  tail: MarketItem;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(params: CoinTossPair) {
    this.id = params.id;
    this.type = params.type;
    this.active = params.active;
    this.head = params.head;
    this.tail = params.tail;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}