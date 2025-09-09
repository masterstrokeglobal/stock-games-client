import Operator from "./operator";

class OperatorWallet {
    id?: number;
    operator?: Operator;
    balance!: number;
    maxBalance!: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<OperatorWallet> = {}) {
        this.id = params.id;
        this.balance = params.balance ?? 0;
        this.maxBalance = params.maxBalance ?? 0;

        if (params.operator) {
            this.operator = new Operator(params.operator);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get hasBalance() {
        return this.balance > 0;
    }

    get isAtMaxBalance() {
        return this.balance >= this.maxBalance;
    }

    get availableBalance() {
        return Math.max(0, this.maxBalance - this.balance);
    }

    canWithdraw(amount: number): boolean {
        return amount > 0 && amount <= this.balance;
    }

    canDeposit(amount: number): boolean {
        return amount > 0 && (this.balance + amount) <= this.maxBalance;
    }

    isValidBalance(balance: number): boolean {
        return balance >= 0 && balance <= this.maxBalance;
    }

    isValidMaxBalance(maxBalance: number): boolean {
        return maxBalance >= 0 && maxBalance >= this.balance;
    }
}

export default OperatorWallet;