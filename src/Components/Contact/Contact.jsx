import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <h1>Contact Us</h1>
            <p className="subtitle">We are here to help! Reach out to us for any questions, feedback, or support.</p>

            <div className="contact-section">
                <h2>E-Mail Us</h2>
                <p>Please email us at <a href="mailto:JourneyHub@yahoo.com" className="email-link">JourneyHub@yahoo.com</a> and our team will get back to you within 1-2 business days.</p>

                <div className="business-hours">
                    <h2>Business Hours</h2>
                    <p>Monday - Friday: 9:00 AM – 5:00 PM EST</p>
                    <p>Saturday - Sunday: Closed</p>
                </div>

                <div className="socials">
                    <h2>Follow Us</h2>
                    <p>Instagram | Facebook | Twitter (Coming Soon!)</p>
                </div>

                <div className="location">
                    <h2>Our Location</h2>
                    <p>Based in New York, NY</p>
                </div>

            </div>
        </div>
    );
};

export default Contact;
