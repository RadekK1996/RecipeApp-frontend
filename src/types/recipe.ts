export interface Recipe {
    name: string;
    ingredients: string[];
    instructions: string;
    imgUrl: string;
    cookingTime: number;
    category: string;
    createdAt: Date;
    userOwner: string;
}


