
export class Tier {
    id: string;
    name: string;
    minPoints: number;
    imageUrl: string;
    redeemablePoints: number;
    gamesRequired: number;
    loginPoints: number;
    firstGamePoints: number;
    pointsPerHundredRupees: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(params: Tier) {
        this.id = params.id;
        this.name = params.name;
        this.imageUrl = params.imageUrl;
        this.minPoints = params.minPoints;
        this.redeemablePoints = params.redeemablePoints;
        this.gamesRequired = params.gamesRequired;
        this.loginPoints = params.loginPoints;
        this.firstGamePoints = params.firstGamePoints;
        this.pointsPerHundredRupees = params.pointsPerHundredRupees;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}

