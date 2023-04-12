import {useState} from "react";
import {useCookies} from "react-cookie";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {Form} from "./FormAuth.js";
import './FormAuth.css';

export const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    let isAfterRegistration = searchParams.get('registered');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/api/auth/login", {
                username,
                password,
            });

            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            navigate('/');
            setError('');

        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <div>
            {error ? <div className="error">{error}</div> : <></>}
            <p className="success">{isAfterRegistration ? 'Your account was created. Now you can login' : ''}</p>
            <Form
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                label="Login"
                onSubmit={onSubmit}
            />
            <p className='register-link'>You don't have an account yet? <Link to="/register">Register</Link></p>
        </div>
    );
};
