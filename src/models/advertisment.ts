export class Advertisement {
    id!: number;
    name!: string;
    description!: string;
    image!: string;
    link!: string;
    active!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;
    constructor(params: Advertisement) {
        this.id = params.id;
        this.name = params.name;
        this.description = params.description;
        this.image = params.image;
        this.link = params.link;
        this.createdAt = params.createdAt;
        this.active = params.active;
        this.updatedAt = params.updatedAt;
    }

}   
