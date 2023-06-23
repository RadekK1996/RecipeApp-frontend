import {useEffect, useState} from "react";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {useGetUserID} from "../../hooks/useGetUserID";
import {useCookies} from "react-cookie";
import Modal from 'react-modal';
import {Cookies} from "../../types/cookies";
import {Recipe} from "../../types/recipe";


import './saved-recipes.css';


export const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [cookies]: [Cookies, any] = useCookies(["access_token"]);
    const userID = useGetUserID();
    const [isRecipeDeleted, setIsRecipeDeleted] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/recipes/savedRecipes/${userID}`);
                setSavedRecipes(response.data.savedRecipes);

            } catch (err: AxiosError) {
                console.log(err);
            }
        };

         fetchSavedRecipe();

    }, [userID, isRecipeDeleted]);

    const handleDeleteRecipe = async (recipeID: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/recipes/${userID}/savedRecipes/${recipeID}`,
                {headers: {authorization: cookies.access_token}} as AxiosRequestConfig)
            setIsRecipeDeleted(true);

            setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeID));

        } catch (err: AxiosError) {
            console.log(err);
        }
    };

    const handleGoBack = () => {
        setIsRecipeDeleted(false);
    };

    const openModal = (recipeID: string | undefined) => {
        if(recipeID)
        setRecipeToDelete(recipeID);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const deleteRecipe = () => {
        if(recipeToDelete)
        handleDeleteRecipe(recipeToDelete);
        closeModal();
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
                            {savedRecipes.map((recipe, index) => (
                                <li key={recipe._id || index}>
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
                                                onClick={() => openModal(recipe._id)}>
                                            Delete
                                        </button>
                                        <Modal
                                            className="delete-modal"
                                            isOpen={modalIsOpen}
                                            onRequestClose={closeModal}
                                            contentLabel="Delete Modal">
                                            <h2>Are you sure you want to delete this recipe?</h2>
                                            <button onClick={deleteRecipe}>Yes</button>
                                            <button onClick={closeModal}>No</button>
                                        </Modal>
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
