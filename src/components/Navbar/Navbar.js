import {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useCookies} from "react-cookie";
import {BiHome} from "react-icons/bi";
import {IoMdCreate} from "react-icons/io";
import {AiFillSave} from "react-icons/ai";
import Modal from 'react-modal';

import './Navbar.css';


export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        setModalIsOpen(false);
        navigate('/');
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

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
                    <button className="logout-button" onClick={openModal}>Logout</button>
                    <Modal
                        className = "logout-modal"
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Logout Modal">
                        <h2>Are you sure want to logout </h2>
                        <button onClick={logout}>Yes</button>
                        <button onClick={closeModal}>No</button>
                    </Modal>
                </>
            )}
        </div>

    );
};

