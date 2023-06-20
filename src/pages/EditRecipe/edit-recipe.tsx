import axios from "axios";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useParams} from "react-router-dom";

export const RecipeEditForm = ({recipe, onSave}) => {
    const {id} = useParams();
    const [editedRecipe, setEditedRecipe] = useState(null);
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [cookies, _] = useCookies(["access_token"]);


    useEffect(() => {
        const getRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/recipes/${id}`);
                setEditedRecipe(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        getRecipe();
    }, [id]);

    useEffect(() => {
        setEditedRecipe(recipe);
    }, [recipe]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditedRecipe({...editedRecipe, [name]: value});
    };

    const handleIngredientChange = (e, index) => {
        const {value} = e.target;
        const ingredients = editedRecipe.ingredients;
        ingredients[index] = value;
        setEditedRecipe({...editedRecipe, ingredients});
    };

    const addIngredient = () => {
        setEditedRecipe({...editedRecipe, ingredients: [...editedRecipe.ingredients, ""]});
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(`http://localhost:3001/api/recipes/${editedRecipe._id}`, editedRecipe, {
                headers: {authorization: cookies.access_token},
            });
            setSuccessMessage('Changes saved successfully');
            onSave();

        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const responseErrors = [];
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
