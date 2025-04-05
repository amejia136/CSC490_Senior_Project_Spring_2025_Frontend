import React, {useEffect} from 'react';
import "./footer.css";
import video2 from '../../Assets/video (2).mp4'
import { FiSend } from "react-icons/fi";
import {MdOutlineTravelExplore} from "react-icons/md";
import {FaInstagram, FaTwitter} from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTripadvisor } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { useDarkMode } from '../DarkMode/DarkMode';


import Aos from 'aos'
import 'aos/dist/aos.css'




const Footer = () => {

    const { darkMode, toggleDarkMode } = useDarkMode();// dark mode

    useEffect(() => {
        Aos.init({duration: 2000})
    },[])

    return (

        <section className="footer">
            <div className="videoDiv">
                <video src={video2} loop autoPlay muted type="video/mp4"></video>
            </div>

            <div className="secContent container">
                <div className="contactDiv flex">
                    <div data-aos ="fade-up" className="text">
                        <small>KEEP IN TOUCH</small>
                        <h2>Travel with us</h2>

                    </div>

                    <div className="inputDiv flex">
                        <input data-aos ="fade-up" type="text" placeholder='Enter Email
                        Address'/>
                        <button data-aos ="fade-up" className='btn flex type' type='submit'>
                            SEND <FiSend className = "icon" />

                        </button>
                    </div>

                </div>

                <div className="footerCard flex">
                    <div className="footerIntro flex">
                        <div className="logoDiv">
                            <a href="#" className='logo flex'>
                                <MdOutlineTravelExplore className = "icon" />
                                Travel.
                            </a>
                        </div>

                        <div data-aos ="fade-up" className="footerParagraph">
                            Traveling allows you to step outside your daily routine and experience new cultures,
                            landscapes, and perspectives. It broadens your mind, enriches your understanding of the world,
                            and creates lasting memories. Whether it's for adventure, relaxation, or personal growth,
                            travel offers the opportunity to disconnect, recharge, and explore the beauty and diversity that our planet has to offer.
                            It’s not just about the destinations you visit, but the journey and the connections you make along the way.

                        </div>

                        <div data-aos ="fade-up" className="footerSocials flex">
                            <FaTwitter className="icon" />
                            <FaYoutube className="icon" />
                            <FaInstagram className="icon" />
                            <FaTripadvisor className="icon" />


                        </div>
                    </div>

                    <div className="footerLinks grid">

                        {/*Group One */}
                        <div data-aos ="fade-up"
                             data-aos-duration="3000"
                             className="linkGroup">
                            <span className="groupTitle">
                                OUR AGENCY
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Services
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Insurance
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Agency
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Tourism
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Payment
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Services
                            </li>

                        </div>

                        {/*Group Two */}
                        <div data-aos ="fade-up"
                             data-aos-duration="4000"
                             className="linkGroup">
                            <span className="groupTitle">
                                PARTNERS
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Bookings
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Rentcars
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                HostelWorld
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Trivago
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                TripAdvisor
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Services
                            </li>

                        </div>

                        {/*Group Three */}
                        <div data-aos ="fade-up"
                             data-aos-duration="5000"
                             className="linkGroup">
                            <span className="groupTitle">
                                LAST MINUTE
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Oregon
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                California
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Washington
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Arizona
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Michigan
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                Illinois
                            </li>

                        </div>
                    </div>


                    <div className="footerDiv flex">

                    </div>

                    <div className="footerDiv flex">
                        <button onClick={toggleDarkMode} className="themeToggleBtn">
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Footer;
