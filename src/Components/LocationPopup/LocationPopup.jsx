import React, { useState } from 'react';
import './LocationPopup.css';
import ConfirmationPopup from './ConfirmationPopup';
import { useTranslation } from 'react-i18next';

const mockItineraries = [
    { id: 'spring-vacation', name: 'Spring Vacations' },
    { id: 'summer-weekend', name: 'Summer Weekend' },
    // Add more itineraries as needed
];

const LocationPopup = ({ location, onClose, onAddToItinerary }) => {
    const [popupState, setPopupState] = useState('initial');
    const { t } = useTranslation();

    const handleYesClick = () => {
        setPopupState('itinerary');
    };

    const handleSelectItinerary = (itineraryId) => {
        console.log("popupState before:", popupState);
        onAddToItinerary(location, itineraryId);
        setPopupState('confirmation');
        console.log("popupState after:", popupState);
    };

    return (
        <div className="location-popup">
            {popupState === 'initial' && (
                <>
                    <h2>{location.name}</h2>
                    <p>{t("Want to add this location to your itinerary?")}</p>
                    <button onClick={handleYesClick}>{t("Yes")}</button>
                    <button onClick={onClose}>{t("Cancel")}</button>
                </>
            )}

            {popupState === 'itinerary' && (
                <>
                    <h2>{t("Which itinerary?")}</h2>
                    {mockItineraries.map((itinerary) => (
                        <button key={itinerary.id} onClick={() => handleSelectItinerary(itinerary.id)}>
                            {itinerary.name}
                        </button>
                    ))}
                </>
            )}

            {popupState === 'confirmation' && (
                <>
                    {console.log('confirmation popup rendered')}
                    <ConfirmationPopup onClose={onClose} />
                </>
            )}
        </div>
    );
};

export default LocationPopup;
