import Agent from "./agent";
import Company from "./company";
import User from "./user";

export enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    PLACEMENT = "placement",
    WINNING = "winning",
    PLACEMENT_RETURNS = "placement_returns",
    LOBBY_PLACEMENT = "lobby_placement",
    LOBBY_WINNING = "lobby_winning",
    LOBBY_REFUND = "lobby_refund",
    ADMIN_DEPOSIT = "admin_deposit",
    ADMIN_WITHDRAWAL = "admin_withdrawal",
    AGENT_DEPOSIT = "agent_deposit",
    AGENT_WITHDRAWAL = "agent_withdrawal",
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
    amount!: number;
    status!: TransactionStatus;
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
    }


}

