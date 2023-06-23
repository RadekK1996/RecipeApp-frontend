import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useParams} from "react-router-dom";
import {Cookies} from "../../types/cookies";
import {Recipe, RecipeEditFormProps} from "../../types/recipe";

export const RecipeEditForm: React.FC<RecipeEditFormProps> = ({recipe, onSave}) => {
    const {id} = useParams<{ id: string }>();
    const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [cookies]: [Cookies, any] = useCookies(["access_token"]);

    useEffect(() => {
        const getRecipe = async () => {
            try {
                const response: AxiosResponse<Recipe> = await axios.get(`http://localhost:3001/api/recipes/${id}`);
                setEditedRecipe(response.data);
            } catch (err: AxiosError) {
                console.log(err);
            }
        };

        getRecipe();
    }, [id]);

    useEffect(() => {
        setEditedRecipe(recipe);
    }, [recipe]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (editedRecipe) {
            setEditedRecipe({...editedRecipe, [name]: value});
        }

    };

    const handleIngredientChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => {
        const {value} = e.target;
        if (editedRecipe) {
            const ingredients = editedRecipe.ingredients;
            ingredients[index] = value;
            setEditedRecipe({...editedRecipe, ingredients});
        }

    };

    const addIngredient = () => {
        if (editedRecipe) {
            setEditedRecipe({...editedRecipe, ingredients: [...editedRecipe.ingredients, ""]});
        }

    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editedRecipe) {
                await axios.patch(`http://localhost:3001/api/recipes/${editedRecipe._id}`, editedRecipe, {
                    headers: {authorization: cookies.access_token},
                } as AxiosRequestConfig);
            }

            setSuccessMessage('Changes saved successfully');
            onSave();

        } catch (err: AxiosError) {
            if (err.response && err.response.data && err.response.data.errors) {
                const responseErrors: string[] = [];
                for (let errorName in err.response.data.errors) {
                    responseErrors.push(err.response.data.errors[errorName].message);
                }
                setErrors(responseErrors);
            } else {
                console.error('Error occurred while updating recipe', err);
            }
        }
    };

    return (
        <div className="create-recipe">
            {editedRecipe ? (
                <>
                    <h2>Edit recipe</h2>
                    {successMessage && (
                        <div className='success'>{successMessage}</div>
                    )}

                    {errors?.map((error) => (
                        <div key={error} className="error">
                            {error}
                        </div>
                    ))}
                    <form onSubmit={onSubmit}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={editedRecipe.name}
                            onChange={handleChange}
                        />

                        <label htmlFor="ingredients">Ingredients</label>
                        {editedRecipe.ingredients.map((ingredient, index) => (
                            <input
                                type="text"
                                key={index}
                                name="ingredients"
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(e, index)}
                            />
                        ))}

                        <button type="button" onClick={addIngredient}>Add Ingredient</button>

                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            name="instructions"
                            id="instructions"
                            value={editedRecipe.instructions}
                            onChange={handleChange}
                        ></textarea>

                        <label htmlFor="imgUrl">Image URL</label>
                        <input
                            type="text"
                            id="imgUrl"
                            name="imgUrl"
                            value={editedRecipe.imgUrl}
                            onChange={handleChange}
                        />

                        <label htmlFor="cookingTime">Cooking time (minutes)</label>
                        <input
                            type="number"
                            id="cookingTime"
                            name="cookingTime"
                            value={editedRecipe.cookingTime}
                            onChange={handleChange}
                        />

                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            id="category"
                            value={editedRecipe.category}
                            onChange={handleChange}
                        >
                            <option value="">--Select a category--</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>

                        <button className='created-button' type="submit">Save Changes</button>
                    </form>

                </>

            ) : (
                <p>Loading...</p>
            )}

        </div>
    )
};
