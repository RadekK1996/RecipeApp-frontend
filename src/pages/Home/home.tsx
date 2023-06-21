import {ChangeEvent, useEffect, useState} from "react";
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {useGetUserID} from "../../hooks/useGetUserID";
import {useCookies} from "react-cookie";
import {AiOutlineSearch} from "react-icons/ai";
import {Link, useNavigate} from "react-router-dom";
import moment from "moment";
import {debounce} from "lodash";
import Modal from "react-modal";
import {RecipeEditForm} from "../EditRecipe/edit-recipe";
import {Recipe} from "../../types/recipe";
import {Cookies} from "../../types/cookies";
import {User} from "../../types/user";

import './home.css';



export const Home = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
    const [cookies, _]: [Cookies, any] = useCookies(["access_token"]);
    const [userName, setUserName] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
    const navigate = useNavigate()
    const userID = useGetUserID();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response: AxiosResponse<User> = await axios.get(`http://localhost:3001/api/recipes/users/${userID}`);
                setUserName(response.data.username);
            } catch (err: AxiosError) {
                console.log(err);
            }
        };

        const fetchAdminStatus = async () => {
            try {
                const response: AxiosResponse<User> = await axios.get(`http://localhost:3001/api/recipes/adminStatus/${userID}`, {
                    headers: {authorization: cookies.access_token},
                } as AxiosRequestConfig);
                setIsAdmin(response.data.isAdmin);
            } catch (err) {
                console.log(err);
            }
        };

        if (userID) fetchUserName();
        if (cookies.access_token) fetchAdminStatus();
    }, [userID, cookies.access_token]);



    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response: AxiosResponse<Recipe[]> = await axios.get('http://localhost:3001/api/recipes');
                setRecipes(response.data);

            } catch (err: AxiosError) {
                console.log(err);
            }
        };

        const fetchSavedRecipe = async () => {
            try {
                const response: AxiosResponse<User> = await axios.get(`http://localhost:3001/api/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(response.data.savedRecipes);

            } catch (err: AxiosError) {
                console.log(err);
            }
        };

        fetchRecipe();

        if (cookies.access_token) fetchSavedRecipe();

    }, []);

    const debouncedSearch = debounce(async (searchTerm: string) => {
        if (searchTerm) {
            try {
                const response: AxiosResponse<Recipe[]> = await axios.get(`http://localhost:3001/api/recipes/search?name=${searchTerm}`);
                setRecipes(response.data);
            } catch (err) {
                console.log(err);
            }
        } else {

            const response: AxiosResponse<Recipe[]> = await axios.get('http://localhost:3001/api/recipes');
            setRecipes(response.data);
        }
    }, 300);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    const saveRecipe = async (recipeID: string | undefined) => {
        try {
            const response = await axios.put('http://localhost:3001/api/recipes', {
                recipeID,
                userID,
            }, {headers: {authorization: cookies.access_token},} as AxiosRequestConfig);
            setSavedRecipes(response.data.savedRecipes);

        } catch (err) {
            console.log(err);
        }

    };

    const isRecipeSaved = (id: string | undefined) => id ? savedRecipes.includes(id): false;

    const deleteRecipeByAdmin = async (recipeID: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/recipes/${recipeID}`, {
                headers: {authorization: cookies.access_token},
            } as AxiosRequestConfig);
            setRecipes(recipes.filter((recipe) => recipe._id !== recipeID));
        } catch (err) {
            console.log(err);
        }
    };

    const openModal = (recipeID: string | undefined) => {
        if(recipeID) {
            setRecipeToDelete(recipeID);
            setModalIsOpen(true);
        }

    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const deleteRecipe = () => {
        if(recipeToDelete) {
            deleteRecipeByAdmin(recipeToDelete);
            closeModal();
        }
    };

    const onSaveEdit = () => {
        setEditing(false);
        setEditedRecipe(null);

    };

    return (
        <div className='page-container'>
            <div className='welcome'>
                <h2>Welcome, {userName}!</h2>
                <p>Here you can browse and save recipes or create your own recipes to share with others!</p>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Search recipes...'
                />
                <AiOutlineSearch style={{marginLeft: '10px', color: '#606060', fontSize: '35px'}}/>
            </div>

            <h1>Recipes</h1>
            <div className="recipe-list">
                <ul>
                    {recipes.map((recipe, index) => (
                        <li key={recipe._id || index}>
                            <div>
                                <h2>{recipe.name}</h2>
                                {cookies.access_token ? (
                                    <button
                                        onClick={() => saveRecipe(recipe._id)}
                                        disabled={isRecipeSaved(recipe._id)}
                                    >
                                        {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                                    </button>
                                ) : (
                                    <></>
                                )}
                                <Link to={`/recipe/${recipe._id}`}>
                                    <button>Show details</button>
                                </Link>
                                {isAdmin && (
                                    <>
                                        <button className='deleteByAdmin-button'
                                                onClick={() => openModal(recipe._id)}>Delete
                                        </button>
                                        <button
                                            className='edit-button'
                                            onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
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
                            <img src={recipe.imgUrl} alt={recipe.name}/>
                            <div className="recipe-info">
                                <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
                                <p>Category: {recipe.category}</p>
                                <p>CreatedAt: {moment(recipe.createdAt).format("LL")}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {editing && editedRecipe && (
                <RecipeEditForm
                    recipe={editedRecipe}
                    onSave={onSaveEdit}
                />
            )}
        </div>
    );
};
