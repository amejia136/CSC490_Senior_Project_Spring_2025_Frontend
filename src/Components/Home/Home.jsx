import React, { useEffect, useState } from "react";
import "./home.css";
import video from '../../Assets/video.mp4'
import { GrLocation } from "react-icons/gr";
import { HiFilter } from "react-icons/hi";
import { FiFacebook } from "react-icons/fi";
import { FaTripadvisor } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { BsListTask } from "react-icons/bs";
import { TbApps } from "react-icons/tb";
import GoogleMapComponent from "../GoogleMap/GoogleMap";
import Aos from 'aos'
import 'aos/dist/aos.css'

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
    const [selectedLocation, setSelectedLocation] = useState(null); //added this

    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    const handleLocationButtonClick = () => {
        setShowMap(true);
    };
    // making changes
    const handleStateChange = (event) => {
        const newState = event.target.value;
        setSelectedState(newState);
        setSelectedLocation(null);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    }

    return (
        <section className="home">
            <div className="overlay"></div>
            <video src={video} muted autoPlay loop type="video/mp4"></video>

            <div className="homeContent container">
                <div className="textDiv">
                    <span data-aos="fade-up" className="smallText">
                        Our Packages
                    </span>

                    <h1 data-aos="fade-up" className="homeTitle">
                        Search your Holiday
                    </h1>
                </div>

                <div data-aos="fade-up" className="cardDiv grid">
                    {/* Destination Input with Location Button */}
                    <div className="destinationInput">
                        <label htmlFor="state">Select State:</label>
                        <div className="input flex">
                            <select id="state" value={selectedState} onChange={handleStateChange} className="dropdown">
                                <option value="" disabled>Select State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                            <GrLocation className="icon" onClick={handleLocationButtonClick} style={{ cursor: "pointer" }} />
                        </div>
                    </div>

                    <div className="dateInput">
                        <label htmlFor="date">Select your date:</label>
                        <div className="input flex">
                            <input type="date"/>
                        </div>
                    </div>

                    <div className="priceInput">
                        <div className="label_total flex">
                            <label htmlFor="price">Max price:</label>
                            <h3 className="total">$5000</h3>
                        </div>
                        <div className="input flex">
                            <input type="range" max="5000" min="1000" />
                        </div>
                    </div>

                    {selectedLocation && (
                        <div className="locationDetails" style={{color: "#333"}}>
                            <h3>Selected Location</h3>
                            <p><strong>Address:</strong> {selectedLocation.name}</p>
                            <p><strong>Latitude:</strong> {selectedLocation.latitude}</p>
                            <p><strong>Longitude:</strong> {selectedLocation.longitude}</p>

                        </div>
                    )}



                    <div className="searchOptions flex">
                        <HiFilter className="icon" />
                        <span> MORE FILTERS</span>
                    </div>
                </div>

                {/* Show Google Map only when the button is clicked */}
                {showMap && (
                    <div className="map-container">
                        <GoogleMapComponent selectedState={selectedState} selectedLocation = {selectedLocation} onLocationSelect={handleLocationSelect} />
                    </div>
                )}

                <div data-aos="fade-up" className="homeFooterIcons flex">
                    <div className="rightIcons">
                        <FiFacebook className="icon" />
                        <FaInstagram className="icon" />
                        <FaTripadvisor className="icon" />
                    </div>

                    <div className="leftIcons">
                        <BsListTask className="icon" />
                        <TbApps className="icon" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;