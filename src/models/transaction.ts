
import Agent from "./agent";
import Company from "./company";
import User from "./user";
import CompanyQR from "./company-qr";

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

export enum PaymentMethod {
    // Main Categories
    CRYPTOCURRENCY = "CRYPTOCURRENCY",
    CRYPTO = "CRYPTO",
    BANK_TRANSFER = "BANK_TRANSFER",

    // Specific Bank Transfer Methods
    NEFT = "NEFT",
    RTGS = "RTGS",
    UPI = "UPI",

    // Internal/Admin
    AGENT_WALLET = "AGENT_WALLET",
    ADMIN_CREDIT = "ADMIN_CREDIT",
    COMPANY_WALLET = "COMPANY_WALLET",

    // Other
    OTHER = "OTHER",
    UNKNOWN = "UNKNOWN"
}


export enum PaymentMethodCategory {
    CRYPTOCURRENCY = "CRYPTOCURRENCY",
    BANK_TRANSFER = "BANK_TRANSFER",
    OTHER = "OTHER"
}

export const PAYMENT_METHOD_CATEGORIES: Record<PaymentMethod, PaymentMethodCategory> = {
    [PaymentMethod.CRYPTOCURRENCY]: PaymentMethodCategory.CRYPTOCURRENCY,
    [PaymentMethod.CRYPTO]: PaymentMethodCategory.CRYPTOCURRENCY, // CRYPTO maps to CRYPTOCURRENCY category
    [PaymentMethod.BANK_TRANSFER]: PaymentMethodCategory.BANK_TRANSFER,

    // Specific bank transfer methods map to BANK_TRANSFER category
    [PaymentMethod.NEFT]: PaymentMethodCategory.BANK_TRANSFER,
    [PaymentMethod.RTGS]: PaymentMethodCategory.BANK_TRANSFER,
    [PaymentMethod.UPI]: PaymentMethodCategory.BANK_TRANSFER,

    // Internal transactions map to OTHER category
    [PaymentMethod.AGENT_WALLET]: PaymentMethodCategory.OTHER,
    [PaymentMethod.ADMIN_CREDIT]: PaymentMethodCategory.OTHER,
    [PaymentMethod.COMPANY_WALLET]: PaymentMethodCategory.OTHER,

    [PaymentMethod.OTHER]: PaymentMethodCategory.OTHER,
    [PaymentMethod.UNKNOWN]: PaymentMethodCategory.OTHER
};

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
    companyQR?: CompanyQR;
    bonusPercentage!: number;
    walletId!: number; // Foreign key
    companyId!: number; // Foreign key
    companyWalletId!: number; // Foreign key
    company?: Company;
    agent?: Agent;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;
    wallet: any;
    user?: User;


    constructor(data: Partial<Transaction | any>) {
        Object.assign(this, data);
        this.user = data?.wallet?.user ? new User(data?.wallet?.user) : undefined;
        this.agent = data?.agentWallet?.agent ? new Agent(data?.agentWallet?.agent) : undefined
        this.company = data?.company ? new Company(data.company) : undefined;
        this.companyQR = data?.companyQR ? new CompanyQR(data.companyQR) : undefined;
    }


}

