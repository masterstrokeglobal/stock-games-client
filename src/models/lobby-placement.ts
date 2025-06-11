import { LobbyGameType } from "./lobby";
import LobbyRound from "./lobby-round";
import MarketItem from "./market-item";
import User from "./user";


interface LobbyPlacementParams {
    id?: number;
    lobbyRound?: LobbyRound;
    user?: User;
    marketItem?: MarketItem;
    isWinner?: boolean;
    gameType?: LobbyGameType;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class LobbyPlacement {
    id?: number;
    lobbyRound?: LobbyRound;
    user?: User;
    marketItem?: MarketItem;
    isWinner: boolean;
    gameType?: LobbyGameType;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: LobbyPlacementParams = {}) {
        this.id = params.id;
        this.isWinner = params.isWinner || false;
        this.gameType = params.gameType;

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
        if (this.gameType && !Object.values(LobbyGameType).includes(this.gameType)) {
            throw new Error("Please select valid game type");
        }
    }
}

export default LobbyPlacement;
