import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';


const About = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();


    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    const handleJoinNowClick = () => {
        navigate('/login', { state: { showRegister: true } });
    };

    return (
        <div className="about">
            <section className="hero" data-aos="fade-up">
                <h1>{t('Making Travel Planning Easier')}</h1>
                <p>{t('Hero Paragraph')}</p>
            </section>

            <section className="mission" data-aos="fade-up">
                <div className="mission-image"></div>
                <div className="mission-text">
                    <h2>{t('Helping Every Traveler Find Their Path')}</h2>
                    <p>{t('Mission Paragraph')}</p>
                </div>
            </section>

            <section className="comparison" data-aos="fade-up">
                <h2>{t('Travel Planning: Old Way vs. Our Way')}</h2>
                <div className="comparison-cards">
                    <div className="card old-way">
                        <h3>{t('Old Travel Planning')}</h3>
                        <ul>
                            <li>{t('Tabs everywhere')}</li>
                            <li>{t('Manual search')}</li>
                            <li>{t('No real organization')}</li>
                        </ul>
                    </div>
                    <div className="card new-way">
                        <h3>{t('Travel Itinerary Planner')}</h3>
                        <ul>
                            <li>{t('All-in-one planner')}</li>
                            <li>{t('Curated suggestions')}</li>
                            <li>{t('Personalized to you')}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="features" data-aos="fade-up">
                <div className="features-text">
                    <h2>{t('Features Built for Explorers')}</h2>
                    <ul>
                        <li>{t('Smart Planning: Add activities, hotels, and restaurants easily')}</li>
                        <li>{t('Printable Itineraries: Create travel plans you can print and share')}</li>
                        <li>{t('Personalized Recommendations: Find hidden gems based on your interests')}</li>
                        <li>{t('Offline Access: View your plans even without Wi-Fi')}</li>
                    </ul>
                </div>
                <div className="features-image"></div>
            </section>

            <section className="feature-highlights" data-aos="fade-up">
                <div className="feature-card">
                    <h3>{t('Discover Top Destinations')}</h3>
                    <p>{t('Explore curated recommendations for must-visit places around the world, tailored to your interests and travel style.')}</p>
                </div>
                <div className="feature-card">
                    <h3>{t('Plan Every Detail with Ease')}</h3>
                    <p>{t('Build your custom trip day by day with activities, accommodations, and experiences, all organized seamlessly in one itinerary.')}</p>
                </div>
            </section>

            <section className="values" data-aos="fade-up">
                <h2>{t('Our Values')}</h2>
                <div className="values-grid">
                    <div className="value-card">{t('Traveler First')}</div>
                    <div className="value-card">{t('Helpful')}</div>
                    <div className="value-card">{t('Transparent')}</div>
                    <div className="value-card">{t('Persistent')}</div>
                    <div className="value-card">{t('Better Together')}</div>
                </div>
            </section>

            <section className="join" data-aos="fade-up">
                <h2>{t('Join the Adventure')}</h2>
                <p>{t('Help us shape the future of travel planning. Join our community today!')}</p>
                <button className="join-btn" onClick={handleJoinNowClick}>{t('Join Now')}</button>
            </section>
        </div>
    );
};

export default About;
