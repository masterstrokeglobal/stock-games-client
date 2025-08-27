
import Agent from "./agent";
import Company from "./company";
import User from "./user";
import CompanyQR from "./company-qr";
import OperatorWallet from "./operator-wallet";

export enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    PLACEMENT = "placement",
    WINNING = "winning",
    WINNING_RETURNS = "winning_returns",
    PLACEMENT_RETURNS = "placement_returns",
    LOBBY_PLACEMENT = "lobby_placement",
    LOBBY_WINNING = "lobby_winning",
    LOBBY_REFUND = "lobby_refund",
    ADMIN_DEPOSIT = "admin_deposit",
    ADMIN_WITHDRAWAL = "admin_withdrawal",
    AGENT_DEPOSIT = "agent_deposit",
    AGENT_WITHDRAWAL = "agent_withdrawal",
    POINTS_EARNED = "points_earned",
    POINTS_REDEEMED = "points_redeemed",
  }
  

export enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
}
export class Transaction {
    id!: number;
    pgId?: string;
    type!: TransactionType;
    confirmationImageUrl?: string;
    amount!: number;
    status!: TransactionStatus;
    creditorOperatorWallet?: OperatorWallet;
    depositorOperatorWallet ?: OperatorWallet;
    companyQR?: CompanyQR;
    bonusPercentage!: number;
    walletId!: number; // Foreign key
    companyId!: number; // Foreign key
    companyWalletId!: number; // Foreign key
    company?: Company;
    agent?:Agent;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;
    wallet: any;
    user?: User; 


    constructor(data: Partial<Transaction|any>) {
        Object.assign(this, data);
        this.user = data?.wallet?.user ? new User(data?.wallet?.user) : undefined;
        this.agent = data?.agentWallet?.agent ? new Agent(data?.agentWallet?.agent) : undefined
        this.company = data?.company ? new Company(data.company) : undefined;
        this.companyQR = data?.companyQR ? new CompanyQR(data.companyQR) : undefined;
        this.creditorOperatorWallet = data?.creditorOperatorWallet ? new OperatorWallet(data.creditorOperatorWallet) : undefined;
        this.depositorOperatorWallet = data?.depositorOperatorWallet ? new OperatorWallet(data.depositorOperatorWallet) : undefined;
    }


}

