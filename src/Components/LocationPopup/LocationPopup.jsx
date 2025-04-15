import React, { useEffect, useState } from 'react';
import './LocationPopup.css';
import ConfirmationPopup from './ConfirmationPopup';

const LocationPopup = ({ location, onClose, onAddToItinerary }) => {
    const [popupState, setPopupState] = useState('initial');
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        const updateItineraries = () => {
            const stored = JSON.parse(localStorage.getItem('all-itineraries')) || [];
            setItineraries(stored);
        };

        updateItineraries();
        window.addEventListener('storage', updateItineraries);

        return () => window.removeEventListener('storage', updateItineraries);
    }, []);

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
                    <div className="itinerary-buttons">
                        {itineraries.length > 0 ? (
                            itineraries.map((itinerary) => (
                                <button
                                    key={itinerary.id}
                                    onClick={() => handleSelectItinerary(itinerary.id)}
                                    className="select-itinerary-btn"
                                >
                                    {itinerary.TripName}
                                </button>
                            ))
                        ) : (
                            <p>No itineraries found. Please add one first.</p>
                        )}
                    </div>
                    <button onClick={onClose} className="cancel-itinerary-popup-btn" style={{ marginTop: '10px' }}>
                        Cancel
                    </button>
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