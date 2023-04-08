import {useState} from "react";
import {BiHide, BiShow} from 'react-icons/bi';
import './FormAuth.css';

export const Form = ({username, setUsername, password, setPassword, label, onSubmit}) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return (
        <div className="auth-container">
            <form onSubmit={onSubmit}>
                <h2>{label}</h2>
                <div className="form-group">
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        value={username}
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="password-icon" onClick={handleShowPassword}>
                        {showPassword ? <BiHide/> : <BiShow/>}
                    </div>


                </div>
                <button type="submit">{label}</button>
            </form>
        </div>
    )

}
