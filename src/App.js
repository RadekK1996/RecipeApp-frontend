import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home/home";
import {CreateRecipe} from "./pages/CreateRecipe/create-recipe";
import {SavedRecipes} from "./pages/SavedRecipes/saved-recipes";
import {Navbar} from "./components/Navbar/Navbar";
import {SingleRecipe} from "./pages/SingleRecipe/single-recipe";
import {Login} from "./pages/Login/login";
import {Register} from "./pages/Register/register";
import {Footer} from "./components/Footer/Footer";
import {LandingPage} from "./pages/LandingPage/landing-page";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";

import './App.css';


export const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cookies] = useCookies(['access_token']);

    useEffect(() => {
        setIsLoggedIn(!!cookies.access_token);
    }, [cookies.access_token]);

    return (
        <div className="App">
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Home/> : <LandingPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/create-recipe" element={<CreateRecipe/>}/>
                    <Route path="/saved-recipes" element={<SavedRecipes/>}/>
                    <Route path="/recipe/:id" element={<SingleRecipe/>}/>
                </Routes>
                <Footer/>
            </Router>
        </div>
    );
};


