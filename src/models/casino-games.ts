export enum GameCategory {
    LIVE = "live",
    OTHERS = "others",
    VIRTUAL = "virtual",
    VIRTUAL_CASINO = "virtual_casino",
    LIVE_POPULAR = "live_popular",
    MINI_GAMES = "mini_games",
    CRASH_GAMES = "crash_games",
    SLOT_GAMES = "slot_games",
    LOBBY = "lobby",
    TABLE_GAMES = "table_games",
    FREE_BETS = "free_bets",
    SLOT = "slot",
    CASUAL_GAMES = "casual_games",
    SPORTS = "sports",
    FISH_SHOOTING = "fish_shooting",
    VIDEO_SLOTS = "video_slots",
    TABLE = "table",
    ARCADE_GAME = "arcade_game",
    BINGO_GAME = "bingo_game",
}

export const GameCategories = Object.values(GameCategory).map((category) => ({
    label: category.replace(/_/g, " ").charAt(0).toUpperCase() + category.replace(/_/g, " ").slice(1),
    value: category
}))

export enum GameStatus {
    ACTIVE = "active",
    IN_ACTIVE = "in_active",
}


class CasinoGames {
    id!: number;
    name!: string;
    imageUrl!: string;
    providerName!: string;
    subProviderName!: string;
    category!: GameCategory;
    status!: GameStatus;
    code!: string;
    gameId!: number;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;

    constructor(params: CasinoGames) {
        this.id = params.id;
        this.name = params.name;
        this.imageUrl = params.imageUrl;
        this.providerName = params.providerName;
        this.subProviderName = params.subProviderName;
        this.category = params.category;
        this.status = params.status;
        this.code = params.code;
        this.gameId = params.gameId;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get statusLabel() {
        return this.status === GameStatus.ACTIVE ? "Active" : "Inactive";
    }
}


export default CasinoGames;
