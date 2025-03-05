import { LobbyGameType } from "./lobby";
import LobbyRound from "./lobby-round";
import MarketItem from "./market-item";
import User from "./user";

interface MiniMutualFundPlacementParams {
  id?: number;
  lobbyRound?: LobbyRound;
  user?: User;
  marketItem?: MarketItem;
  isWinner?: boolean;
  amount?: number;
  gameType?: LobbyGameType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class MiniMutualFundPlacement {
  id?: number;
  lobbyRound?: LobbyRound;
  user?: User;
  marketItem?: MarketItem;
  isWinner: boolean;
  amount?: number;
  gameType?: LobbyGameType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(params: MiniMutualFundPlacementParams = {}) {
    this.id = params.id;
    this.isWinner = params.isWinner || false;
    this.gameType = params.gameType;
    this.amount = params.amount;

    // Handle relationship objects
    this.lobbyRound = params.lobbyRound ? new LobbyRound(params.lobbyRound) : undefined;
    this.user = params.user ? new User(params.user) : undefined;
    this.marketItem = params.marketItem ? new MarketItem(params.marketItem) : undefined;

    // Handle dates
    this.createdAt = params.createdAt ? new Date(params.createdAt) : undefined;
    this.updatedAt = params.updatedAt ? new Date(params.updatedAt) : undefined;
    this.deletedAt = params.deletedAt ? new Date(params.deletedAt) : undefined;
  }

  validate(): void {
    // Validation logic for Mini Mutual Fund Placement
    if (this.gameType && !Object.values(LobbyGameType).includes(this.gameType)) {
      throw new Error("Please select valid game type");
    }

    if (this.amount !== undefined && this.amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
  }
}

export default MiniMutualFundPlacement;