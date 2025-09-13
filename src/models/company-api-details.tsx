import { Company } from "./company";

export enum GameApiName {
    ALL = "all",
    DERBY = "derby",
    MINI_MUTUAL_FUND = "mini_mutual_fund",
    GUESS_FIRST_FOUR = "guess_first_four",
    GUESS_LAST_FOUR = "guess_last_four",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    STOCK_SLOTS = "stock_slots",
    STOCK_JACKPOT = "stock_jackpot",
    SEVEN_UP_DOWN = "seven_up_down",
    HEAD_TAIL = "head_tail",
    WHEEL_OF_FORTUNE = "wheel_of_fortune",
    AVIATOR = "aviator",
    DICE = "dice",
    RED_BLACK = "red_black",
}

export class CompanyApiDetails {
    id?: number;
    company?: Company;
    apiKey!: string;
    baseUrl!: string;
    allowedIps!: string[];
    allowedGames!: GameApiName[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<CompanyApiDetails> = {}) {
        this.id = params.id;
        this.company = params.company;
        this.apiKey = params.apiKey || '';
        this.baseUrl = params.baseUrl || '';
        this.allowedIps = params.allowedIps || [];
        this.allowedGames = params.allowedGames || [GameApiName.ALL];
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}

export default CompanyApiDetails;