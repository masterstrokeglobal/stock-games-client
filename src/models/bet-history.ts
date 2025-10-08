export interface BetHistoryParams {
    id?: number;
    gameType?: string;
    gameName?: string;
    userId?: number;
    username?: string;
    companyId?: number;
    companyName?: string;
    amount?: number;
    isWinner?: boolean;
    winAmount?: number;
    placement?: string;
    roundId?: number;
    createdAt?: string;
}

export class BetHistory {
    id?: number;
    gameType?: string;
    gameName?: string;
    userId?: number;
    username?: string;
    companyId?: number;
    companyName?: string;
    amount?: number;
    isWinner?: boolean;
    winAmount?: number;
    placement?: string;
    roundId?: number;
    createdAt?: string;

    constructor(params: BetHistoryParams = {}) {
        this.id = params.id;
        this.gameType = params.gameType;
        this.gameName = params.gameName;
        this.userId = params.userId;
        this.username = params.username;
        this.companyId = params.companyId;
        this.companyName = params.companyName;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.winAmount = params.winAmount;
        this.placement = params.placement;
        this.roundId = params.roundId;
        this.createdAt = params.createdAt;
    }

    get formattedDate(): string {
        if (!this.createdAt) return "";
        return new Date(this.createdAt).toLocaleString();
    }

    get resultStatus(): "Win" | "Loss" {
        return this.isWinner ? "Win" : "Loss";
    }

    get resultColor(): string {
        return this.isWinner ? "text-green-600" : "text-red-600";
    }
}

export interface GameTypeStats {
    count: number;
    totalWagered: number;
    wins: number;
    losses: number;
}

export interface BetStatisticsParams {
    totalBets?: number;
    totalWagered?: number;
    totalWins?: number;
    totalLosses?: number;
    winRate?: string;
    betsByGameType?: Record<string, GameTypeStats>;
}

export class BetStatistics {
    totalBets: number;
    totalWagered: number;
    totalWins: number;
    totalLosses: number;
    winRate: string;
    betsByGameType: Record<string, GameTypeStats>;

    constructor(params: BetStatisticsParams = {}) {
        this.totalBets = params.totalBets ?? 0;
        this.totalWagered = params.totalWagered ?? 0;
        this.totalWins = params.totalWins ?? 0;
        this.totalLosses = params.totalLosses ?? 0;
        this.winRate = params.winRate ?? "0.00%";
        this.betsByGameType = params.betsByGameType ?? {};
    }

    get winRatePercentage(): number {
        return parseFloat(this.winRate.replace('%', ''));
    }
}


