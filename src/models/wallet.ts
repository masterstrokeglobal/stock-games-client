export class Wallet {
    id?: number;
    userId?: number;
    mainBalance?: number;
    bonusBalance?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    // Constructor accepts a partial wallet object, so all properties are optional
    constructor(params: Partial<Wallet> = {}) {
        this.id = params.id;
        this.userId = params.userId;
        this.mainBalance = params.mainBalance;
        this.bonusBalance = params.bonusBalance;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    // Getter for total balance
    get totalBalance(): number {
        return (this.mainBalance || 0) + (this.bonusBalance || 0);
    }
}

export default Wallet;
