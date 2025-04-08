import React from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';


const Contact = () => {
    const { t } = useTranslation();

    return (
        <div className="contact-page">
            <h1>{t('Contact Us')}</h1>
            <p className="subtitle">{t('We are here to help! Reach out to us for any questions, feedback, or support.')}</p>

            <div className="contact-section">
                <h2>{t('E-Mail Us')}</h2>
                <p>{t('Please email us at')} <a href="mailto:JourneyHub@yahoo.com" className="email-link">JourneyHub@yahoo.com</a> {t('and our team will get back to you within 1-2 business days.')}</p>

                <div className="business-hours">
                    <h2>{t('Business Hours')}</h2>
                    <p>{t('Monday - Friday: 9:00 AM – 5:00 PM EST')}</p>
                    <p>{t('Saturday - Sunday: Closed')}</p>
                </div>

                <div className="socials">
                    <h2>{t('Follow Us')}</h2>
                    <p>{t('Instagram | Facebook | Twitter (Coming Soon!)')}</p>
                </div>

                <div className="location">
                    <h2>{t('Our Location')}</h2>
                    <p>{t('Based in New York, NY')}</p>
                </div>

            </div>
        </div>
    );
};

export default Contact;
