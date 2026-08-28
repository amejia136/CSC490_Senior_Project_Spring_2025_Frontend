import React, {useContext, useEffect} from "react";
import './main.css'
import { useNavigate } from 'react-router-dom';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuClipboardCheck } from "react-icons/lu";


import img from '../../Assets/img.jpg'
import img2 from '../../Assets/img2.jpg'
import img3 from '../../Assets/img3.jpg'
import img4 from '../../Assets/img4.jpg'
import img5 from '../../Assets/img5.jpg'
import img6 from '../../Assets/img6.jpg'
import img7 from '../../Assets/img7.jpg'
import img8 from '../../Assets/img8.jpg'
import img9 from '../../Assets/img9.jpg'

import Aos from 'aos'
import 'aos/dist/aos.css'
import { useTranslation } from "react-i18next";
import i18n from "../../Translations/i18n";
import {LanguageContext} from "../../LanguageContext";


const Main = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || sessionStorage.getItem('appLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [language]);

    const Data = [
        {
            id: 1,
            imgSrc: img,
            destTitle: "Yellowstone National Park",
            location: "Wyoming, USA",
            grade: "CULTURAL RELAX",
            description: "Home to geysers, hot springs, and diverse wildlife, Yellowstone is the first national park in the world and a paradise for nature lovers.",
        },
        {
            id: 2,
            imgSrc: img2,
            destTitle: "Niagara Falls",
            location: "New York, USA",
            grade: "CULTURAL RELAX",
            description: "A breathtaking natural wonder, Niagara Falls attracts millions of visitors each year with its powerful waterfalls and stunning views.",
        },
        {
            id: 3,
            imgSrc: img3,
            destTitle: "Everglades National Park",
            location: "Florida, USA",
            grade: "CULTURAL RELAX",
            description: "The Everglades is a unique subtropical ecosystem, home to alligators, manatees, and thrilling airboat rides through the wetlands.",
        },
        {
            id: 4,
            imgSrc: img4,
            destTitle: "American Museum of Natural History",
            location: "New York, USA",
            grade: "CULTURAL RELAX",
            description: "One of the largest museums in the world, featuring exhibits on dinosaurs, space, human history, and much more.",
        },
        {
            id: 5,
            imgSrc: img5,
            destTitle: "Mount Rushmore National Memorial",
            location: "South Dakota, USA",
            grade: "CULTURAL RELAX",
            description: "An iconic monument featuring the carved faces of four U.S. presidents, symbolizing the nation’s history and democracy.",
        },
        {
            id: 6,
            imgSrc: img6,
            destTitle: "Disney World",
            location: "Florida, USA",
            grade: "CULTURAL RELAX",
            description: "A world-famous theme park offering magical experiences, thrilling rides, and entertainment for visitors of all ages.",
        },
        {
            id: 7,
            imgSrc: img7,
            destTitle: "Universal Studios Hollywood",
            location: "California, USA",
            grade: "CULTURAL RELAX",
            description: "A must-visit destination for movie lovers, featuring thrilling rides, studio tours, and immersive entertainment experiences.",
        },
        {
            id: 8,
            imgSrc: img8,
            destTitle: "Times Square",
            location: "New York, USA",
            grade: "CULTURAL RELAX",
            description: "A bustling hub of lights, theaters, shopping, and entertainment, Times Square is the vibrant heart of New York City.",
        },
        {
            id: 9,
            imgSrc: img9,
            destTitle: "Las Vegas Strip",
            location: "Nevada, USA",
            grade: "CULTURAL RELAX",
            description: "Famous for its luxury hotels, casinos, and world-class entertainment, the Las Vegas Strip offers an unforgettable nightlife experience.",
        },
    ];

    const handleDetailsClick = () => {
        navigate('/details');
    };


    return (
        <section className="main container section">
            <div className="secTitle">
                <h3 data-aos="fade-right" className="title">
                    {t("Most Visited Destinations")}
                </h3>
            </div>

            <div className="secContent grid">
                {Data.map(({ id, imgSrc, destTitle, location, grade, description }) => {
                    return (
                        <div key={id} data-aos="fade-up" className="singleDestination">
                            <div className="imageDiv">
                                <img src={imgSrc} alt={t(destTitle)} />
                            </div>

                            <div className="cardInfo">
                                <h4 className="destTitle">{t(destTitle)}</h4>

                                <span className="continent flex">
                  <HiOutlineLocationMarker className="icon" />
                  <span className="name">{t(location)}</span>
                </span>

                                <div className="fees flex">
                                    <div className="grade">
                    <span>
                      {t(grade)}
                        <small>+1</small>
                    </span>
                                    </div>
                                </div>

                                <div className="desc">
                                    <p>{t(description)}</p>
                                </div>

                                <button className="btn flex" onClick={handleDetailsClick}>
                                    {t("DETAILS")} <LuClipboardCheck className="icon"/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Main;