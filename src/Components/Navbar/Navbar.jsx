import React, {useState} from "react";
import './navbar.css'
import { MdOutlineTravelExplore } from 'react-icons/md';
import { IoMdCloseCircle } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import {AiFillCloseCircle} from "react-icons/ai";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const[active,setActive] = useState('navBar');

    const navigate = useNavigate();

    //function to toggle navBar
    const showNav = () => {
        setActive('navBar activeNavbar');
    }
    //function to remove navBar

    const removeNavbar = () => {
        setActive('navBar');
    }

    const handleLogin = () => {
        navigate('/login'); // ***** Navigate to login page *****
    };

    const handleProfile = () => {
        navigate('/profile'); // ***** Navigate to login page *****
    };

    const handleHome = () => {
        navigate('/'); // ***** Navigate to login page *****
    };

    const handleAchievements = () => {
        navigate('/achievements'); // ***** Navigate to login page *****
    };

    return (
        <section className= 'navBarSection'>
            <header className="header flex">

            <div className="logoDiv">
                <a href="#" className="logo flex">
                    <h1><MdOutlineTravelExplore className ="icon"/>Travel.</h1>
                </a>
            </div>

                <div className={active}>
                    <ul className="navLists flex">
                        <li className="navItem" onClick={handleHome}>
                            <a href="#" className="navLink">Home</a>
                        </li>

                        <li className="navItem">
                            <a href="#" className="navLink">About</a>
                        </li>

                        <li className="navItem" onClick={handleProfile}>
                            <a href="#" className="navLink">Profile</a>
                        </li>

                        <li className="navItem">
                            <a href="#" className="navLink">Reviews</a>
                        </li>

                        <li className="navItem" onClick={handleAchievements}>
                            <a href="#" className="navLink">Achievements</a>
                        </li>

                        <li className="navItem">
                            <a href="#" className="navLink">News</a>
                        </li>

                        <li className="navItem">
                            <a href="#" className="navLink">Contact</a>
                        </li>

                        <button className = 'btn' onClick={handleLogin}>
                            <a href="#">LOGIN</a>
                        </button>
                    </ul>

                    <div onClick={removeNavbar} className = "closeNavbar">
                        <AiFillCloseCircle className="icon"/>
                    </div>

                </div>


                <div onClick ={showNav} className = "toggleNavbar">
                    <TbGridDots className = "icon"/>
                </div>






            </header>
        </section>
    )
}


export default Navbar;
