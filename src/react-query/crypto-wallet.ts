/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */ 
export interface CryptoWallet {
    id: number;
    name: string;
    cryptoToken: {
        id: number;
        name: string;
        symbol: string;
    };
    walletId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */ 
export class CryptoWallet {
    id: number;
    name: string;
    cryptoToken: {
        id: number;
        name: string;
        symbol: string;
    };
    walletId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  constructor(params: CryptoWallet) {
    this.id = params.id;
    this.name = params.name;
    this.cryptoToken = params.cryptoToken;
    this.walletId = params.walletId;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.deletedAt = params.deletedAt;
  }
}