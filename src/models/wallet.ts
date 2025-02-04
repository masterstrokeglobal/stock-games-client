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


    get withdrawableBalance(): number {
        // main - by 4 percent of main 
        return (this.mainBalance || 0) - (this.mainBalance || 0) * 0.04;
    }

    // Getter for total balance
    get totalBalance(): number {
        return (Number(this.mainBalance) || 0) + (Number(this.bonusBalance) || 0);
    }
}

export default Wallet;
