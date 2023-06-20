import React, { useEffect, useState } from 'react';
import {AiFillFacebook, AiFillInstagram, AiFillTwitterCircle, AiFillYoutube} from "react-icons/ai";
import './Footer.css';

export const Footer = () => {
    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.innerHeight + window.scrollY;
            const height = document.body.offsetHeight;

            setShowFooter(position >= height);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className={`footer ${showFooter ? 'visible' : ''}`}>

            <p>© 2023 My Recipe App <AiFillFacebook/> <AiFillTwitterCircle/> <AiFillYoutube/> <AiFillInstagram/></p>
        </footer>
    );
};

