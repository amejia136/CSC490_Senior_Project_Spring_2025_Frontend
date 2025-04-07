import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import Aos from 'aos';
import 'aos/dist/aos.css';

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    const handleJoinNowClick = () => {
        navigate('/login', { state: { showRegister: true } });
    };

    return (
        <div className="about">
            <section className="hero" data-aos="fade-up">
                <h1>Making Travel Planning Easier</h1>
                <p>We believe travel planning should be simple, personalized, and stress-free. Our mission is to help you explore the world, one journey at a time.</p>
            </section>

            <section className="mission" data-aos="fade-up">
                <div className="mission-image"></div>
                <div className="mission-text">
                    <h2>Helping Every Traveler Find Their Path</h2>
                    <p>We started Travel Itinerary Planner because planning trips was overwhelming and scattered. We knew it could be better. So we set out to create a place where everything - activities, hotels, restaurants - could be beautifully organized into one easy itinerary.</p>
                </div>
            </section>

            <section className="comparison" data-aos="fade-up">
                <h2>Travel Planning: Old Way vs. Our Way</h2>
                <div className="comparison-cards">
                    <div className="card old-way">
                        <h3>Old Travel Planning</h3>
                        <ul>
                            <li>Tabs everywhere</li>
                            <li>Manual search</li>
                            <li>No real organization</li>
                        </ul>
                    </div>
                    <div className="card new-way">
                        <h3>Travel Itinerary Planner</h3>
                        <ul>
                            <li>All-in-one planner</li>
                            <li>Curated suggestions</li>
                            <li>Personalized to you</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="features" data-aos="fade-up">
                <div className="features-text">
                    <h2>Features Built for Explorers</h2>
                    <ul>
                        <li>Smart Planning: Add activities, hotels, and restaurants easily</li>
                        <li>Printable Itineraries: Create travel plans you can print and share</li>
                        <li>Personalized Recommendations: Find hidden gems based on your interests</li>
                        <li>Offline Access: View your plans even without Wi-Fi</li>
                    </ul>
                </div>
                <div className="features-image"></div>
            </section>

            <section className="feature-highlights" data-aos="fade-up">
                <div className="feature-card">
                    <h3>Discover Top Destinations</h3>
                    <p>Explore curated recommendations for must-visit places around the world, tailored to your interests and travel style.</p>
                </div>
                <div className="feature-card">
                    <h3>Plan Every Detail with Ease</h3>
                    <p>Build your custom trip day by day with activities, accommodations, and experiences, all organized seamlessly in one itinerary.</p>
                </div>
            </section>

            <section className="values" data-aos="fade-up">
                <h2>Our Values</h2>
                <div className="values-grid">
                    <div className="value-card">Traveler First</div>
                    <div className="value-card">Helpful</div>
                    <div className="value-card">Transparent</div>
                    <div className="value-card">Persistent</div>
                    <div className="value-card">Better Together</div>
                </div>
            </section>

            <section className="join" data-aos="fade-up">
                <h2>Join the Adventure</h2>
                <p>Help us shape the future of travel planning. Join our community today!</p>
                <button className="join-btn" onClick={handleJoinNowClick}>Join Now</button>
            </section>
        </div>
    );
};

export default About;
