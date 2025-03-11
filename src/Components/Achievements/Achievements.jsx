import React, { useEffect } from 'react';
import './Achievements.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import niagaraFalls from '../../Assets/niagaraFalls.jpg';
import miami from '../../Assets/miami.jpg';
import NYC from '../../Assets/NYC.jpg';
import vegasPicture from '../../Assets/vegasPicture.jpg';

const AchievementsPage = () => {
    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    const visitedPlaces = [
        {
            image: niagaraFalls,
            name: 'Niagara Falls',
            location: 'New York, USA',
            description: 'You traveled to Niagara Falls last year.'
        },
        {
            image: miami,
            name: 'South Beach',
            location: 'Miami, Florida',
            description: 'You traveled to Miami in 2022.'
        },

    ];

    const plannedPlaces = [
        {
            image: NYC,
            name: 'Times Square',
            location: 'New York City, New York',
            description: 'You plan on going to New York City next year.'
        },
        {
            image: vegasPicture,
            name: 'Las Vegas Strip',
            location: 'Las Vegas, Nevada',
            description: 'You plan on visiting Las Vegas soon.'
        },
        // Add more  places
    ];

    return (
        <section className="achievements">
            <div className="overlay"></div>


            <div className="achievementsContent container">
                <h1 data-aos="fade-up" className="achievementsTitle">
                    Your Travel Achievements
                </h1>

                <div data-aos="fade-up" className="visitedPlaces">
                    <h2>Your Achievements!</h2>
                    <div className="placesList">
                        {visitedPlaces.map((place, index) => (
                            <div key={index} className="placeCard">
                                <img src={place.image} alt={place.name} />
                                <div className="placeDetails">
                                    <h3>{place.name}</h3>
                                    <p className="location">{place.location}</p>
                                    <p className="description">{place.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div data-aos="fade-up" className="plannedPlaces">
                    <h2>Places You Plan On Going</h2>
                    <div className="placesList">
                        {plannedPlaces.map((place, index) => (
                            <div key={index} className="placeCard">
                                <img src={place.image} alt={place.name} />
                                <div className="placeDetails">
                                    <h3>{place.name}</h3>
                                    <p className="location">{place.location}</p>
                                    <p className="description">{place.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AchievementsPage;