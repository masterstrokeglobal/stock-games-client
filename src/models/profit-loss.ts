import Company from "./company";

export class ProfitLoss {
    id!: number;
    company!: Company;
    stockProfitLoss!: number;
    otherProfitLoss!: number;
    stockSettlementAmount!: number;
    otherSettlementAmount!: number;
    date!: Date;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;
    stockTotalPlaced!: number;
    casinoTotalPlaced!: number;
    stockTotalWinning!: number;
    casinoTotalWinning!: number;
    totalBonus!: number;
    netProfitOrLoss!: number;
  

    constructor(params: ProfitLoss) {
        this.id = params.id;
        this.company = params.company;
        this.stockProfitLoss = params.stockProfitLoss;
        this.otherProfitLoss = params.otherProfitLoss;
        this.stockSettlementAmount = params.stockSettlementAmount;
        this.otherSettlementAmount = params.otherSettlementAmount;
        this.date = params.date;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
        this.stockTotalPlaced = params.stockTotalPlaced;
        this.casinoTotalPlaced = params.casinoTotalPlaced;
        this.stockTotalWinning = params.stockTotalWinning;
        this.casinoTotalWinning = params.casinoTotalWinning;
        this.totalBonus = params.totalBonus;
        this.netProfitOrLoss = params.netProfitOrLoss;
    }
}
