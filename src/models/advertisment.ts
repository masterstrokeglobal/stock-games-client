export class Advertisment {
    id: number;
    name: string;
    description: string;
    image: string;
    link: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    constructor(params: Advertisment) {
        this.id = params.id;
        this.name = params.name;
        this.description = params.description;
        this.image = params.image;
        this.link = params.link;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}   
