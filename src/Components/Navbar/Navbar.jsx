import React, {useContext, useEffect, useState} from "react";
import {UserContext} from '../../UserContext';
import './navbar.css'
import {MdOutlineTravelExplore} from 'react-icons/md';
import {IoMdCloseCircle} from "react-icons/io";
import {TbGridDots} from "react-icons/tb";
import {AiFillCloseCircle} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import i18n from '../../Translations/i18n';
import {useDarkMode} from '../DarkMode/DarkMode';
import {FiSun, FiMoon} from 'react-icons/fi';
import logo from '../../Assets/logo.png';
import logoDark from '../../Assets/logo-dark.png';


const Navbar = () => {
    const [active, setActive] = useState('navBar');

    const navigate = useNavigate();

    const {user, setUser} = useContext(UserContext);

    const {darkMode, toggleDarkMode} = useDarkMode();

    const {t} = useTranslation();

    const [spinning, setSpinning] = useState(false);



    const handleToggleDarkMode = () => {
        setSpinning(true);

        setTimeout(() => {
            toggleDarkMode(); // change the mode AFTER animation
            setSpinning(false);
        }, 1200); // match the animation time
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || sessionStorage.getItem('appLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

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
        if (user) {
            navigate('/profile'); // ***** Navigate to profile page *****
        } else {
            navigate('/login'); // ***** Navigate to login page *****
        }
    };
    const handleHome = () => {
        navigate('/'); // ***** Navigate to login page *****
    };

    const handleAchievements = () => {
        navigate('/achievements'); // ***** Navigate to login page *****
    };

    const handleItinerary = () => {
        navigate('/itinerary'); // ***** Navigate to login page *****
    };

    const handleAbout = () => {
        navigate('/about'); // ***** Navigate to login page *****
    };

    const handleContact = () => {
        navigate('/contact'); // ***** Navigate to login page *****
    };

    const handleDetails = () => {
        navigate('/details');
    };

    const handleLogout = () => {

        setUser(null);

        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        i18n.changeLanguage('en');
        localStorage.setItem('appLanguage', 'en');
        sessionStorage.setItem('appLanguage', 'en');

        navigate('/');
    };

    return (
        <section className='navBarSection'>
            <header className="header flex">

                <div className="logoDiv">
                    <a href="#" className="logo flex">
                        <img
                            src={darkMode ? logoDark : logo}
                            alt="Travel Logo"
                            className="customLogo"
                        />

                    </a>
                </div>

                <div className={active}>
                    <ul className="navLists flex">
                        <li className="navItem" onClick={handleHome}>
                            <a href="#" className="navLink">{t('Home')}</a>
                        </li>

                        <li className="navItem" onClick={handleAbout}>
                            <a href="#" className="navLink">{t('About')}</a>
                        </li>

                        <li className="navItem" onClick={handleProfile}>
                            <a href="#" className="navLink">{t('Profile')}</a>
                        </li>

                        <li className="navItem" onClick={handleDetails}>
                            <a href="#" className="navLink">{t('Details')}</a>
                        </li>


                        <li className="navItem" onClick={handleAchievements}>
                            <a href="#" className="navLink">{t('Achievements')}</a>
                        </li>

                        <li className="navItem" onClick={handleItinerary}>
                            <a href="#" className="navLink">{t('Itinerary')}</a>
                        </li>

                        <li className="navItem" onClick={handleContact}>
                            <a href="#" className="navLink">{t('Contact')}</a>
                        </li>

                        <button className="darkModeToggle" onClick={handleToggleDarkMode}>
                            <span className={`iconWrapper ${spinning ? 'reelSpin' : ''}`}>
                                {darkMode ? (
                                <FiSun size={22} color="#FDB813" />  /* Yellow sun */
                                ) : (
                                 <FiMoon size={22} color="#000000" />
                                )}
                            </span>
                        </button>



                        {user ? (
                            <button className='btn' onClick={handleLogout}>
                                <a href="#">{t('SIGNOUT')}</a>
                            </button>
                        ) : (
                            <button className='btn' onClick={handleLogin}>
                                <a href="#">{t('LOGIN')}</a>
                            </button>
                        )}
                    </ul>

                    <div onClick={removeNavbar} className="closeNavbar">
                        <AiFillCloseCircle className="icon"/>
                    </div>

                </div>


                <div onClick={showNav} className="toggleNavbar">
                    <TbGridDots className="icon"/>
                </div>


            </header>
        </section>
    )
}


export default Navbar;
