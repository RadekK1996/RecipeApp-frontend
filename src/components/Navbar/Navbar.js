import {Link, useNavigate} from 'react-router-dom';
import {useCookies} from "react-cookie";
import {BiHome} from "react-icons/bi";
import {IoMdCreate} from "react-icons/io";
import {AiFillSave} from "react-icons/ai";
import './Navbar.css';



export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate('/');
    }

    return (
    <div className="navbar">
        <Link to="/">Home <BiHome/></Link>

        {!cookies.access_token ? (
            <div>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
            ) : (
            <>

                <Link to="/create-recipe">Create Recipe <IoMdCreate/></Link>
            <Link to="/saved-recipes">Saved Recipes <AiFillSave/></Link>
            <button className="logout-button" onClick={logout}>Logout</button>
            </>
        )}
    </div>

    );

};
