import React, { useState } from 'react';
import './LocationPopup.css';
import ConfirmationPopup from './ConfirmationPopup';

const mockItineraries = [
    { id: 'spring-vacation', name: 'Spring Vacations' },
    { id: 'summer-weekend', name: 'Summer Weekend' },
    // Add more itineraries as needed
];

const LocationPopup = ({ location, onClose, onAddToItinerary }) => {
    const [popupState, setPopupState] = useState('initial');

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
                    <p>Want to add this location to your itinerary?</p>
                    <button onClick={handleYesClick}>Yes</button>
                    <button onClick={onClose}>Cancel</button>
                </>
            )}

            {popupState === 'itinerary' && (
                <>
                    <h2>Which itinerary?</h2>
                    {mockItineraries.map((itinerary) => (
                        <button key={itinerary.id} onClick={() => handleSelectItinerary(itinerary.id)}>
                            {itinerary.name}
                        </button>
                    ))}
                </>
            )}

            {popupState === 'confirmation' && (
                <>
                    {console.log('confimation popup rendered')}
                    <ConfirmationPopup onClose={onClose} />
                </>
            )}
        </div>
    );
};

export default LocationPopup;