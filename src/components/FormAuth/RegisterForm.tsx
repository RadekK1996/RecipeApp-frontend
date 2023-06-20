import {useState} from "react";
import axios from "axios";
import {Form} from "./FormAuth.tsx";
import {Link, useNavigate} from "react-router-dom";
import './FormAuth.css';

export const RegisterForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/api/auth/register", {
                username,
                password,
            });
            setError('');
            navigate('/login?registered=success');
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <div>
            {error ? <div className="error">{error}</div> : <></>}
            <Form
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                label="Register"
                onSubmit={onSubmit}
            />
            <p className='register-link'>Already have an account? <Link to="/login">Log in</Link></p>
            <div className="pass-info">
                <ul>
                    <h2>Password must contain:</h2>
                    <li>minimum 5 characters,</li>
                    <li>one lowercase letter,</li>
                    <li>one uppercase letter,</li>
                    <li>one digit</li>
                </ul>
            </div>
        </div>
    );
};
