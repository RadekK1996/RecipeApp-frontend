import React, {ChangeEvent, useState} from "react";
import axios, {AxiosRequestConfig} from 'axios';
import {useGetUserID} from "../../hooks/useGetUserID";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {Recipe, RequiredFields} from "../../types/recipe";


import './create-recipe.css';


export const CreateRecipe = () => {
    const userID = useGetUserID();
    const [recipe, setRecipe] = useState<Recipe>({
        name: "",
        ingredients: [],
        instructions: "",
        imgUrl: "",
        cookingTime: 0,
        category: "",
        createdAt: new Date(),
        userOwner: userID,
    });

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [cookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setRecipe({...recipe, [name]: value});
    };

    const handleIngredientChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => {
        const {value} = e.target;
        const ingredients = [...recipe.ingredients];
        ingredients[index] = value;
        setRecipe({...recipe, ingredients});

    };

    const addIngredient = () => {
        setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]});
    };


    const handleAddAnotherRecipe = () => {
        setIsFormSubmitted(false);
        setRecipe({
            name: "",
            ingredients: [],
            instructions: "",
            imgUrl: "",
            cookingTime: 0,
            category: "",
            createdAt: new Date(),
            userOwner: userID,
        })
        navigate('/create-recipe');
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = [];

        const requiredFields: RequiredFields[] = [
            {field: 'name', message: 'Name is required'},
            {field: 'instructions', message: 'Instructions are required'},
            {field: 'imgUrl', message: 'Image URL is required'},
            {field: 'cookingTime', message: 'Cooking time is required'},
            {field: 'category', message: 'Category is required'}
        ];

        requiredFields.forEach(({field, message}) => {
            if (!recipe[field]) {
                errors.push(message);
            }
        });

        if (recipe.ingredients.length === 0) {
            errors.push('Ingredients are required');
        } else if (recipe.ingredients.some((ingredient) => !ingredient)) {
            errors.push('Ingredients are required');
        }
        if (errors.length === 0) {
            try {
                const config = {
                    headers: { authorization: cookies.access_token }
                } as AxiosRequestConfig;

                await axios.post<Recipe>("http://localhost:3001/api/recipes", recipe, config);
                setIsFormSubmitted(true);
                setErrors([]);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        const responseErrors = [];
                        for (let errorName in err.response.data.errors) {
                            responseErrors.push(err.response.data.errors[errorName].message);
                        }
                        setErrors(responseErrors);
                    }
                } else {
                    console.log(err);
                }
            }
        } else {
            setErrors(errors);
        }
    };


    return (
        <div className="create-recipe">
            {isFormSubmitted ? (
                <div>
                    <p>Recipe created successfully!</p>
                    <button onClick={handleAddAnotherRecipe}>Add Another Recipe</button>
                    <button onClick={() => navigate("/")}>Go to homepage</button>
                </div>
            ) : (
                <div>
                    <h2>Create Recipe</h2>
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
                            onChange={handleChange}
                        />

                        <label htmlFor="ingredients">Ingredients</label>
                        {recipe.ingredients.map((ingredient, index) => (
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
                            onChange={handleChange}
                        ></textarea>
                        <label htmlFor="imgUrl">Image URL</label>
                        <input
                            type="text"
                            id="imgUrl"
                            name="imgUrl"
                            onChange={handleChange}
                        />
                        <label htmlFor="cookingTime">Cooking time (minutes)</label>
                        <input
                            type="number"
                            id="cookingTime"
                            name="cookingTime"
                            onChange={handleChange}
                        />
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            id="category"
                            onChange={handleChange}>
                            <option value="">--Select a category--</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                        </select>
                        <button className='created-button' type="submit">Create Recipe</button>
                    </form>

                </div>
            )}
            {isFormSubmitted && <p className='success'>Recipe created successfully!</p>}
        </div>
    )
};

