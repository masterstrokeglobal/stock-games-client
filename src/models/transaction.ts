export enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
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
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;

    constructor(data: Partial<Transaction>) {
        Object.assign(this, data);
    }
}
