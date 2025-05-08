import React, {useEffect, useState, useContext} from "react";
import "./home.css";
import video from "../../Assets/video.mp4";
import {GrLocation} from "react-icons/gr";
import {HiFilter} from "react-icons/hi";
import {FiFacebook} from "react-icons/fi";
import {FaTripadvisor} from "react-icons/fa";
import {FaInstagram} from "react-icons/fa";
import {BsListTask} from "react-icons/bs";
import {TbApps} from "react-icons/tb";
import GoogleMapComponent from "../GoogleMap/GoogleMap";
import Aos from "aos";
import "aos/dist/aos.css";
import {UserContext} from '../../UserContext';
import {useTranslation} from 'react-i18next';
import i18n from "../../Translations/i18n";
import {LanguageContext} from "../../LanguageContext";




const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const Home = () => {
    const [showMap, setShowMap] = useState(false);
    const [selectedState, setSelectedState] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);

    const {user} = useContext(UserContext);
    const { language } = useContext(LanguageContext);
    const {t} = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || sessionStorage.getItem('appLanguage');
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [language]);

    const [activeFilters, setActiveFilters] = useState([]);

    useEffect(() => {
        Aos.init({duration: 2000});
    }, []);

    const handleLocationButtonClick = () => {
        setShowMap(true);
    };

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setSelectedLocation(null);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    const toggleMap = () => {
        setShowMap((prevShowMap) => !prevShowMap);
    };

    const setFilterType = (type, enabled) => {
        setActiveFilters((prev) => {
            return enabled
                ? [...new Set([...prev, type])]
                : prev.filter((t) => t !== type);
        });
    };

    return (
        <section className="home">
            <div className="overlay"></div>
            <video src={video} muted autoPlay loop type="video/mp4"></video>

            <div className="homeContent container">
                <div className="textDiv">
                    <span data-aos="fade-up" className="smallText">{t('Our Packages')}</span>
                    <h1 data-aos="fade-up" className="homeTitle">{t('Search your Holiday')}</h1>
                </div>

                <div data-aos="fade-up" className="cardDiv grid">
                    {/* Destination Input with Location Button */}
                    <div className="destinationInput">
                        <label htmlFor="state">{t('Select State')}:</label>
                        <div className="input flex">
                            <select id="state" value={selectedState} onChange={handleStateChange} className="dropdown">
                                <option value="" disabled>{t('Select State')}</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                            <GrLocation className="icon" onClick={handleLocationButtonClick}
                                        style={{cursor: "pointer"}}/>
                        </div>
                    </div>

                    {/* Date Input */}
                    <div className="dateInput">
                        <label htmlFor="date">{t('Select your date')}:</label>
                        <div className="input flex">
                            <input type="date"/>
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="priceInput">
                        <div className="label_total flex">
                            <label htmlFor="price">{t('Max price')}:</label>
                            <h3 className="total">$5000</h3>
                        </div>
                        <div className="input flex">
                            <input type="range" max="5000" min="1000"/>
                        </div>
                    </div>

                    {selectedLocation && (
                        <div className="locationDetails" style={{color: "#333"}}>
                            <h3>{t('Selected Location')}</h3>
                            <p><strong>{t('Name')}:</strong> {selectedLocation.name}</p>
                            <p><strong>{t('Address')}:</strong> {selectedLocation.address}</p>
                            <p><strong>{t('Latitude')}:</strong> {selectedLocation.latitude}</p>
                            <p><strong>{t('Longitude')}:</strong> {selectedLocation.longitude}</p>
                            <p><strong>{t('Price Level')}:</strong> {selectedLocation.price_level}</p>
                            <p><strong>{t('Rating')}:</strong> {selectedLocation.rating}</p>
                            <p><strong>{t('Types')}:</strong> {selectedLocation.types}</p>
                        </div>
                    )}

                    {/* Search Filters */}
                    <div className="searchOptions flex">
                        <HiFilter className="icon"/>
                        <span>{t('MORE FILTERS')}</span>
                    </div>
                </div>



                {/*  Centered Filter Bar Wrapper */}
                {showMap && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            style={{
                                marginTop: '1rem',
                                marginBottom: '-40px',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3.0 rem',
                                color: 'white',
                            }}
                        >
                            <label style={{ fontSize: '1.2rem' }}>
                                <input
                                    type="checkbox"
                                    style={{ transform: 'scale(1.5)', marginRight: '8px' }}
                                    onChange={(e) => setFilterType("restaurant", e.target.checked)}
                                />
                                🍽️🔵 Restaurants ||
                            </label>
                            <label style={{ fontSize: '1.2rem' }}>
                                <input
                                    type="checkbox"
                                    style={{ transform: 'scale(1.5)', marginRight: '8px' }}
                                    onChange={(e) => setFilterType("hotel", e.target.checked)}
                                />
                                🏨🟡 Hotels ||
                            </label>
                            <label style={{ fontSize: '1.2rem' }}>
                                <input
                                    type="checkbox"
                                    style={{ transform: 'scale(1.5)', marginRight: '8px' }}
                                    onChange={(e) => setFilterType("tourist_attraction", e.target.checked)}
                                />
                                🗺️🟢 Attractions
                            </label>
                        </div>
                    </div>
                )}

                <div data-aos="fade-up">
                    {/* Google Map Load and Toggle */}
                    <button className ="showMapBtn" onClick={toggleMap} >
                        {showMap ? t('Hide Map') : t('Show Map')}
                    </button>

                    <div className="map-container" style={{display: showMap ? 'block' : 'none'}}>
                        <GoogleMapComponent
                            selectedState={selectedState}
                            onLocationSelect={handleLocationSelect}
                            activeFilters={activeFilters}
                        />
                    </div>

                    {/* Footer Icons */}
                    <div data-aos="fade-up" className="homeFooterIcons flex">
                        <div className="rightIcons">
                            <FiFacebook className="icon"/>
                            <FaInstagram className="icon"/>
                            <FaTripadvisor className="icon"/>
                        </div>

                        <div className="leftIcons">
                            <BsListTask className="icon"/>
                            <TbApps className="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;