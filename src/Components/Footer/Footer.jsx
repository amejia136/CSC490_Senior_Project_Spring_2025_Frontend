import React, {useContext, useEffect} from 'react';
import "./footer.css";
import video2 from '../../Assets/video (2).mp4'
import {FiSend} from "react-icons/fi";
import {MdOutlineTravelExplore} from "react-icons/md";
import {FaInstagram, FaTwitter} from "react-icons/fa";
import {FaYoutube} from "react-icons/fa";
import {FaTripadvisor} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";


import Aos from 'aos'
import 'aos/dist/aos.css'
import {useTranslation} from "react-i18next";
import {LanguageContext} from "../../LanguageContext";
import i18n from "../../Translations/i18n";


const Footer = () => {

    const {t} = useTranslation();
    const {language} = useContext(LanguageContext);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || sessionStorage.getItem('appLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [language]);

    useEffect(() => {
        Aos.init({duration: 2000})
    }, [])

    return (

        <section className="footer">
            <div className="videoDiv">
                <video src={video2} loop autoPlay muted type="video/mp4"></video>
            </div>

            <div className="secContent container">
                <div className="contactDiv flex">
                    <div data-aos="fade-up" className="text">
                        <small>{t('KEEP IN TOUCH')}</small>
                        <h2>{t('Travel with us')}</h2>

                    </div>

                    <div className="inputDiv flex">
                        <input data-aos="fade-up" type="text" placeholder={t('Enter Email Address')}/>
                        <button data-aos="fade-up" className='btn flex type' type='submit'>
                            {t('SEND')} <FiSend className="icon"/>

                        </button>
                    </div>

                </div>

                <div className="footerCard flex">
                    <div className="footerIntro flex">
                        <div className="logoDiv">
                            <a href="#" className='logo flex'>
                                <MdOutlineTravelExplore className="icon"/>
                                Travel.
                            </a>
                        </div>

                        <div data-aos="fade-up" className="footerParagraph">
                            {t('TravelParagraph')}
                        </div>

                        <div data-aos="fade-up" className="footerSocials flex">
                            <FaTwitter className="icon"/>
                            <FaYoutube className="icon"/>
                            <FaInstagram className="icon"/>
                            <FaTripadvisor className="icon"/>


                        </div>
                    </div>

                    <div className="footerLinks grid">

                        {/*Group One */}
                        <div data-aos="fade-up"
                             data-aos-duration="3000"
                             className="linkGroup">
                            <span className="groupTitle">{t('LEARN MORE')}</span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                <a href="https://www.travel.state.gov/" target="_blank" rel="noopener noreferrer">
                                    {t('Travel Advisories')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                <a href="https://www.skyscanner.com/tips-and-inspiration" target="_blank" rel="noopener noreferrer">
                                    {t('Travel Tips')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                <a href="https://www.nomadicmatt.com/" target="_blank" rel="noopener noreferrer">
                                    {t('Budget Travel')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                <a href="https://www.cnn.com/travel" target="_blank" rel="noopener noreferrer">
                                    {t('Trending News')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                <a href="https://www.lonelyplanet.com/" target="_blank" rel="noopener noreferrer">
                                    {t('Guides & Inspiration')}
                                </a>
                            </li>
                        </div>

                        {/*Group Two */}
                        <div data-aos="fade-up"
                             data-aos-duration="4000"
                             className="linkGroup">
                                <span className="groupTitle">
                                    {t('BOOK WITH US')}
                                </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.trivago.com" target="_blank" rel="noopener noreferrer">
                                    {t('Trivago')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer">
                                    {t('Tripadvisor')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.hostelworld.com" target="_blank" rel="noopener noreferrer">
                                    {t('HostelWorld')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.airbnb.com" target="_blank" rel="noopener noreferrer">
                                    {t('Airbnb')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.expedia.com" target="_blank" rel="noopener noreferrer">
                                    {t('Expedia')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">
                                    {t('Booking.com')}
                                </a>
                            </li>
                        </div>


                        {/*Group Three */}
                        <div data-aos="fade-up"
                             data-aos-duration="5000"
                             className="linkGroup">
                            <span className="groupTitle">
                                 {t('EXPLORE')}
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://traveloregon.com" target="_blank" rel="noopener noreferrer">
                                    {t('Oregon')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.visitcalifornia.com" target="_blank" rel="noopener noreferrer">
                                    {t('California')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.experiencewa.com" target="_blank" rel="noopener noreferrer">
                                    {t('Washington')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.visitarizona.com" target="_blank" rel="noopener noreferrer">
                                    {t('Arizona')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.michigan.org" target="_blank" rel="noopener noreferrer">
                                    {t('Michigan')}
                                </a>
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon"/>
                                <a href="https://www.iloveny.com" target="_blank" rel="noopener noreferrer">
                                    {t('New York')}
                                </a>
                            </li>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}

export default Footer;
