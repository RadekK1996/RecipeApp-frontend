import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios, {AxiosResponse} from "axios";
import Modal from "react-modal";
import {useGetUserID} from "../../hooks/useGetUserID";
import {User} from "../../types/user";

import './user-profile.css';



export const UserProfile = () => {
    const [userName, setUserName] = useState<string>("");
    const [cookies, setCookies] = useCookies(["access_token"]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const userID = useGetUserID();
    const maskedPassword = "**********";

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response: AxiosResponse<User> = await axios.get(
                `http://localhost:3001/api/recipes/users/${userID}`
            );
            setUserName(response.data.username);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        }
    };

    const deleteUserAccount = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/auth/${userID}`, {
                headers: {
                    'Authorization': `${cookies.access_token}`
                }
            });
            if (response.status === 200) {
                logoutUser();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const logoutUser = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate('/register');
    };

    const handleDeleteAccount = () => {
        deleteUserAccount();
        closeModal();
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };


    return (
        <div className="user-profile-container">
            <h1>Login: {userName}</h1>
            <h2>Password: {maskedPassword}</h2>
            <button className="deleted-button" onClick={openModal}>
                Delete account
            </button>
            <Modal
                className="delete-modal"
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Modal">
                <h2>Are you sure you want to delete account?</h2>
                <button onClick={handleDeleteAccount}>Yes</button>
                <button onClick={closeModal}>No</button>
            </Modal>
        </div>
    );
};



