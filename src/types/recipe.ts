export interface Recipe {
    _id?: string;
    name: string;
    ingredients: string[];
    instructions: string;
    imgUrl: string;
    cookingTime: number;
    category: string;
    createdAt: Date;
    userOwner: string | null;
}


export interface RecipeEditFormProps {
    recipe?: Recipe;
    onSave?: () => void;
}

export type RequiredFields = {
    field: keyof Recipe;
    message: string;
}

export interface RouteParams {
    id: string;
    [key: string]: string | undefined;
}
