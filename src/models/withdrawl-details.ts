export class WithdrawDetailsRecord {
    id?: number;
    userId?: number; // Reference to User
    accountName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    upiId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<WithdrawDetailsRecord> = {}) {
        this.id = params.id;
        this.userId = params.userId;
        this.accountName = params.accountName;
        this.accountNumber = params.accountNumber;
        this.ifscCode = params.ifscCode;
        this.upiId = params.upiId;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    // Getter for isUpi property
    get isUpi(): boolean {
        return !!this.upiId; // Returns true if upiId is not null or undefined
    }
}

export default WithdrawDetailsRecord;
