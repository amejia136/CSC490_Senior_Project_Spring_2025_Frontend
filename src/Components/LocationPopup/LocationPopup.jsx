import React, { useEffect, useState, useContext } from 'react';
import './LocationPopup.css';
import ConfirmationPopup from './ConfirmationPopup';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../UserContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const LocationPopup = ({ location, onClose, onAddToItinerary }) => {
    const [popupState, setPopupState] = useState('initial');
    const { t } = useTranslation();
    const [itineraries, setItineraries] = useState([]);
    const { user } = useContext(UserContext);
    const userId = user?.uid;

    useEffect(() => {
        const updateItineraries = async () => {
            if (!userId) {
                console.log("[LocationPopup] userId is missing.");
                return;
            }

            try {
                console.log("[LocationPopup] Fetching itineraries for:", userId);
                const querySnapshot = await getDocs(collection(db, "Users", userId, "Itineraries"));

                const firestoreItineraries = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log("[doc.id]:", doc.id, "data:", data);
                    return { id: doc.id, ...data };
                })
                    .filter(itinerary => !itinerary.isCompleted);

                setItineraries(firestoreItineraries);
                console.log("[LocationPopup] Final itineraries set:", firestoreItineraries);
            } catch (error) {
                console.error("Error fetching itineraries from Firestore:", error);
            }
        };

        updateItineraries(); // Initial fetch

        const handleItineraryUpdate = () => {
            console.log("[LocationPopup] Detected 'itinerary-updated' event. Refetching...");
            updateItineraries();
        };

        window.addEventListener("itinerary-updated", handleItineraryUpdate);
        return () => window.removeEventListener("itinerary-updated", handleItineraryUpdate);
    }, [userId]);

    const handleYesClick = () => {
        setPopupState('itinerary');
    };

    const handleSelectItinerary = async (itineraryId) => {

        if (!userId || !location) {
            console.warn("🚫 Cannot add location - missing user or location.");
            return;
        }

        try {
            const itineraryRef = doc(db, "Users", userId, "Itineraries", itineraryId);
            await updateDoc(itineraryRef, {
                mapLocations: arrayUnion({
                    name: location.name,
                    address: location.address,
                    pricelevel: location.price_level !== "N/A" ? location.price_level : 0
                })
            });

            console.log("✅ Location added to Firestore");

            setPopupState('confirmation');
        } catch (error) {
            console.error("❌ Error adding location to itinerary:", error);
        }
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
                    <div className="itinerary-buttons">
                        {itineraries.length > 0 ? (
                            itineraries.map((itinerary) => {
                                console.log(" Rendering button for:", itinerary.TripName);
                                return (
                                    <button
                                        key={itinerary.id}
                                        onClick={() => handleSelectItinerary(itinerary.id)}
                                        className="select-itinerary-btn"
                                    >
                                        {itinerary.TripName}
                                    </button>
                                );
                            })
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