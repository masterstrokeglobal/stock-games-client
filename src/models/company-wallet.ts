class CompanyWallet {
    id?: number;
    companyId?: number;
    balance: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<CompanyWallet> = {}) {
        this.id = params.id;
        this.companyId = params.companyId;
        this.balance = params.balance ?? 0;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();
        this.deletedAt = params.deletedAt;
    }
}

export default CompanyWallet;
