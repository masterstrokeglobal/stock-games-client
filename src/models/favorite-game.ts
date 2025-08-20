import CasinoGames from "./casino-games";
import { RoundRecordGameType } from "./round-record";
import User from "./user";


export class FavoriteGame {
    id: number;
    user?: User;
    userId: number;
    game?: CasinoGames;
    gameId?: number;
    gameType?: RoundRecordGameType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: FavoriteGame) {
        this.id = params.id;
        this.user = params.user;
        this.userId = params.userId;
        this.game = params.game ? new CasinoGames(params.game) : undefined;
        this.gameId = params.gameId;
        this.gameType = params.gameType;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get isStockGame() {
        return this.gameType != undefined;
    }
}