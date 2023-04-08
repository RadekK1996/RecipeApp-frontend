import {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from "../../hooks/useGetUserID";
import {useCookies} from "react-cookie";
import {Link} from "react-router-dom";
import moment from "moment";
import './home.css';


export const Home = () => {

    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [cookies, _] = useCookies(["access_token"]);
    const [userName, setUserName] = useState('');
    const userID = useGetUserID();


    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/recipes/users/${userID}`);
                setUserName(response.data.username);
            } catch (err) {
                console.log(err);
            }
        };

        if (userID) fetchUserName();
    }, [userID]);


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/recipes');
                setRecipes(response.data);

            } catch (err) {
                console.log(err);
            }
        };

        const fetchSavedRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/recipes/savedRecipes/ids/${userID}`);
                setSavedRecipes(response.data.savedRecipes);

            } catch (err) {
                console.log(err);
            }
        };

        fetchRecipe();

        if (cookies.access_token) fetchSavedRecipe();

    }, []);


    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put('http://localhost:3001/api/recipes', {
                recipeID,
                userID,
            }, {headers: {authorization: cookies.access_token}});
            setSavedRecipes(response.data.savedRecipes);

        } catch (err) {
            console.log(err);
        }

    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);


    return (
        <div className='page-container'>
            <div className='welcome'>
                <h2>Welcome, {userName}!</h2>
                <p>Here you can browse and save recipes or create your own recipes to share with others!</p>
            </div>
            <h1>Recipes</h1>
            <div className="recipe-list">
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
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

        </div>
    )
};
