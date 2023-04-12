import {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from "../../hooks/useGetUserID";
import {useCookies} from "react-cookie";
import './saved-recipes.css';

export const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [cookies, _] = useCookies(["access_token"]);
    const userID = useGetUserID();
    const [isRecipeDeleted, setIsRecipeDeleted] = useState(false);

    useEffect(() => {
        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/recipes/savedRecipes/${userID}`);
                setSavedRecipes(response.data.savedRecipes);

            } catch (err) {
                console.log(err);
            }
        };

        fetchSavedRecipe();

    }, [userID, isRecipeDeleted]);

    const handleDeleteRecipe = async (recipeID) => {
        try {
            await axios.delete(`http://localhost:3001/api/recipes/${userID}/savedRecipes/${recipeID}`,
                {headers: {authorization: cookies.access_token}})
            setIsRecipeDeleted(true);

            setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeID));

        } catch (err) {
            console.log(err);
        }
    };

    const handleGoBack = () => {
        setIsRecipeDeleted(false);
    };

    return (
        <div className='page-container'>
            <div>
                {isRecipeDeleted ? (
                    <div className="deleted-message">
                        <h2>The recipe has been successfully deleted.</h2>
                        <button className="go-back-button" onClick={handleGoBack}>Go back to saved recipes</button>
                    </div>
                ) : (
                    <div>
                        <h1 className='saved-recipes-title'>Saved Recipes</h1>
                        <ul>
                            {savedRecipes.map((recipe) => (
                                <li key={recipe._id}>
                                    <div>
                                        <h2 className="recipe-name">{recipe.name}</h2>
                                        <img className='recipe-image' src={recipe.imgUrl} alt={recipe.name}/>

                                    </div>
                                    <div className="instructions">
                                        <h3>Instructions:</h3>
                                        <p>{recipe.instructions}</p>
                                    </div>
                                    <div className="details">
                                        <h3>Ingredients:</h3>
                                        <ul>
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <li key={index}>{ingredient}</li>
                                            ))}
                                        </ul>
                                        <p>Cooking Time: {recipe.cookingTime} (minutes)</p>

                                        <p>Category: {recipe.category}</p>
                                        <button className="deleted-button"
                                                onClick={() => handleDeleteRecipe(recipe._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
