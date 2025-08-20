import { Company } from "./company";

export enum CompanyQRType {
    UPI = "upi",
    BANK = "bank",
}
export class CompanyQR {
  id?: number;
  qr?: string;
  company?: Company;
  type?: CompanyQRType;
  bankName?: string;
  accountNumber?: string;
  upiId?: string;
  accountHolderName?: string;
  ifscCode?: string;
  maxLimit?: number;
  limitUsed?: number;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(params: Partial<CompanyQR> = {}) {
    this.id = params.id;
    this.qr = params.qr;
    this.company = params.company;
    this.bankName = params.bankName;
    this.accountNumber = params.accountNumber;
    this.accountHolderName = params.accountHolderName;
    this.ifscCode = params.ifscCode;
    this.type = params.type;
    this.maxLimit = params.maxLimit;
    this.limitUsed = params.limitUsed ?? 0;
    this.upiId = params.upiId;
    this.active = params.active ?? true;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}

export default CompanyQR;
