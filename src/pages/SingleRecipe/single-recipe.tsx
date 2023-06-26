import {useState, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {useNavigate, useParams} from "react-router-dom";
import'./single-recipe.css';
import {Recipe, RouteParams} from "../../types/recipe";

export const SingleRecipe = () => {

    const [recipe, setRecipe] = useState<Recipe>({
        name: "",
        ingredients: [],
        instructions: "",
        imgUrl: "",
        cookingTime: 0,
        category: "",
        createdAt: new Date(),
        userOwner: "",
    } as Recipe);

    const {id} = useParams<RouteParams>();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response: AxiosResponse<Recipe> = await axios.get(`http://localhost:3001/api/recipes/${id}`);
                setRecipe(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRecipe();
    }, [id]);

    return (
        <div className="page-container">
        <div className="single-recipe-container">
            <h1 className="recipe-name">{recipe.name}</h1>
            <img className='recipe-image' src={recipe.imgUrl} alt={recipe.name}/>
            <div className="ingredients">
                <div className="details">
                    <h3>Ingredients:</h3>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="instructions">
                    <h3>Instructions:</h3>
                    <p>{recipe.instructions}</p>
                    <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
                </div>
                <p>Category: {recipe.category}</p>
                <button onClick={() => navigate("/")}>Go to homepage</button>
            </div>
        </div>
        </div>
    );
};
