import React, {useEffect} from 'react';
import "./footer.css";
import video2 from '../../Assets/video (2).mp4'
import { FiSend } from "react-icons/fi";
import {MdOutlineTravelExplore} from "react-icons/md";
import {FaInstagram, FaTwitter} from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTripadvisor } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";


import Aos from 'aos'
import 'aos/dist/aos.css'
import {useTranslation} from "react-i18next";




const Footer = () => {

    const { t } = useTranslation();

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
                        <small>{t('KEEP IN TOUCH')}</small>
                        <h2>{t('Travel with us')}</h2>

                    </div>

                    <div className="inputDiv flex">
                        <input data-aos ="fade-up" type="text" placeholder={t('Enter Email Address')}/>
                        <button data-aos ="fade-up" className='btn flex type' type='submit'>
                            {t('SEND')} <FiSend className = "icon" />

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
                            {t('TravelParagraph')}
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
                                {t('OUR AGENCY')}
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Services')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Insurance')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Agency')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Tourism')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Payment')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Services')}
                            </li>

                        </div>

                        {/*Group Two */}
                        <div data-aos ="fade-up"
                             data-aos-duration="4000"
                             className="linkGroup">
                            <span className="groupTitle">
                                {t('PARTNERS')}
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Bookings')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Rentcars')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('HostelWorld')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Trivago')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('TripAdvisor')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Services')}
                            </li>

                        </div>

                        {/*Group Three */}
                        <div data-aos ="fade-up"
                             data-aos-duration="5000"
                             className="linkGroup">
                            <span className="groupTitle">
                                {t('LAST MINUTE')}
                            </span>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Oregon')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('California')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Washington')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Arizona')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Michigan')}
                            </li>

                            <li className="footerList flex">
                                <FiChevronRight className="icon" />
                                {t('Illinois')}
                            </li>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Footer;
