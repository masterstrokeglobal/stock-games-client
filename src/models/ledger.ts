import Company from "./company";


export enum LedgerEntryType {
    PAID = "paid",
    RECEIVED = "received",
}



class Ledger {
    id: number;
    amount: number;
    entryType: LedgerEntryType;
    createdAt: Date;
    updatedAt: Date;
    company: Company | null;

    constructor(params: Ledger) {
        this.id = params.id;
        this.amount = params.amount;
        this.entryType = params.entryType;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.company = params.company ? new Company(params.company) : null;
    }
}

export default Ledger;
