import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './itineraryDetail.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { UserContext } from '../../UserContext';
import {
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import axios from "axios";


const ItineraryDetailsPage = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const userId = user?.uid;

    const [itinerary, setItinerary] = useState(null);
    const [locations, setLocations] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchItinerary = async () => {
            if (!userId || !itineraryId) return;

            setIsLoading(true);
            try {
                const itineraryRef = doc(db, "Users", userId, "Itineraries", itineraryId);
                const docSnap = await getDoc(itineraryRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setItinerary({ id: docSnap.id, ...data });
                    setLocations(data.mapLocations || []);
                } else {
                    setItinerary(null);
                }
            } catch (error) {
                console.error("Error fetching itinerary:", error);
                setItinerary(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItinerary();
    }, [userId, itineraryId]);

    const handleDragStart = (e, index) => {
        if (itinerary?.isCompleted) return;
        setDraggedItem(locations[index]);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        if (itinerary?.isCompleted) return;
        e.preventDefault();
        const draggedOverItem = locations[index];
        if (draggedItem === draggedOverItem) return;

        const newItems = locations.filter(item => item !== draggedItem);
        newItems.splice(index, 0, draggedItem);
        setLocations(newItems);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleSaveOrderToFirestore = async () => {
        if (!userId || !itineraryId || itinerary?.isCompleted) return;

        setIsLoading(true);
        try {
            const validLocations = locations.filter(loc => loc && loc.name);
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                mapLocations: validLocations
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLocation = async (locationIndex) => {
        if (itinerary?.isCompleted || !window.confirm("Are you sure you want to delete this location?")) return;

        setIsLoading(true);
        try {
            const updated = locations.filter((_, i) => i !== locationIndex);
            setLocations(updated);
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                mapLocations: updated
            });
        } catch (err) {
            console.error("Error deleting location:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCompleteStatus = async () => {
        if (!user) {
            alert("Please sign in to complete trips");
            return;
        }

        if (!itineraryId || itinerary?.isCompleted) return;

        const confirmComplete = window.confirm(
            "Marking this trip as complete is permanent. Continue?"
        );
        if (!confirmComplete) return;

        setIsLoading(true);

        try {
            // Call your Flask backend endpoint
            const response = await axios.post(
                `http://127.0.0.1:5000/itinerary/complete-itinerary/${userId}/${itineraryId}`
            );

            if (response.data.success) {
                // Update local state
                setItinerary(prev => ({
                    ...prev,
                    isCompleted: true,
                    completedAt: new Date() // You might want to update this from response if available
                }));

                // Show unlocked achievements if any
                if (response.data.unlocked_achievements?.length > 0) {
                    alert(`Unlocked achievements:\n${response.data.unlocked_achievements.join("\n")}`);
                }
            } else {
                throw new Error(response.data.error || "Failed to complete itinerary");
            }
        } catch (error) {
            console.error("Completion failed:", error);
            alert(`Action failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getPackingRecommendations = () => {
        const recommendations = {
            beach: [
                'Sunscreen', 'Swimsuit', 'Beach towel', 'Sunglasses', 'Flip flops',
                'Hat', 'Beach bag', 'Waterproof phone case', 'Aloe vera', 'Beach umbrella',
                'Sand toys (if with kids)', 'Cooler', 'Beach chair', 'Snorkel gear'
            ],
            hiking: [
                'Hiking boots', 'Water bottle', 'Backpack', 'First aid kit', 'Map',
                'Compass', 'Hiking poles', 'Energy snacks', 'Bug spray', 'Sun hat',
                'Multi-tool', 'Headlamp', 'Rain jacket', 'Emergency blanket'
            ],
            city: [
                'Comfortable shoes', 'City map', 'Umbrella', 'Camera', 'Portable charger',
                'Guidebook', 'Crossbody bag', 'Travel adapter', 'Reusable water bottle',
                'Sunglasses', 'Light jacket', 'Tote bag', 'Travel-sized toiletries'
            ],
            winter: [
                'Winter jacket', 'Gloves', 'Thermal wear', 'Ski goggles', 'Hand warmers',
                'Scarf', 'Warm socks', 'Lip balm', 'Moisturizer', 'Snow boots',
                'Ski pants', 'Hot water bottle', 'Thermal flask', 'Traction cleats'
            ],
            business: [
                'Business attire', 'Laptop', 'Notebook', 'Travel adapter', 'Business cards',
                'Portfolio', 'Dress shoes', 'Blazer', 'Travel steamer', 'Grooming kit',
                'Tablet', 'Presentation materials', 'Expense tracker', 'Travel-sized iron'
            ],
            family: [
                'Diapers/wipes', 'Baby carrier', 'Snacks', 'First aid kit', 'Entertainment',
                'Stroller', 'Car seat', 'Baby monitor', 'Favorite toys', 'Child medications',
                'Night light', 'Portable crib', 'Bottle warmer', 'Kid-sized utensils'
            ],
            adventure: [
                'Quick-dry clothes', 'Water shoes', 'Dry bag', 'Binoculars', 'Waterproof watch',
                'Adventure camera', 'Paracord bracelet', 'Survival kit', 'Multi-tool', 'Trekking poles',
                'Hydration pack', 'GPS device', 'Solar charger', 'Emergency whistle'
            ],
            cruise: [
                'Cruise documents', 'Lanyard', 'Formal wear', 'Sea sickness pills', 'Waterproof phone case',
                'Magnetic hooks', 'Over-door organizer', 'Travel mug', 'Highlighter (for daily schedules)',
                'Small bills for tips', 'Luggage tags', 'Wrinkle release spray', 'Power strip (cruise-approved)'
            ],
            camping: [
                'Tent', 'Sleeping bag', 'Camping stove', 'Lantern', 'Cooler',
                'Camping chairs', 'Fire starter', 'Cooking utensils', 'Water filter',
                'Bear spray (if applicable)', 'Air mattress', 'Pillow', 'Camping shower'
            ],
            roadtrip: [
                'Road atlas', 'Car charger', 'Cooler', 'Travel pillow', 'Car organizer',
                'Emergency car kit', 'Audiobooks/podcasts', 'Snacks', 'Window shades',
                'Car trash can', 'Seat cushion', 'Travel mug', 'Car air freshener'
            ]
        };
        return itinerary?.TripType ? recommendations[itinerary.TripType] || [] : [];
    };

    if (!user) {
        return (
            <div className="itinerary-details-container">
                <p>⏳ Waiting for user authentication...</p>
            </div>
        );
    }

    if (!itinerary) {
        return (
            <div className="itinerary-details-container">
                <button onClick={() => navigate(-1)} className="back-button">← Back</button>
                <p>Itinerary not found.</p>
            </div>
        );
    }

    return (
        <div className={`itinerary-details-container ${itinerary.isCompleted ? 'completed-trip' : ''}`}>
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Itineraries
            </button>

            <div className="itinerary-header">
                <h1>{itinerary.TripName}</h1>
                <div className="trip-meta">
                    <span><strong>Type:</strong> {itinerary.TripType}</span>
                    <span><strong>Duration:</strong> {itinerary.TripDuration} days</span>
                    <span><strong>Budget:</strong> ${itinerary.TripCost}</span>
                    {itinerary.isCompleted && <span className="completed-badge">✓ Completed</span>}
                </div>
            </div>

            <div className="details-content">
                <div className="locations-section">
                    <div className="locations-list">
                        {locations.map((location, index) => (
                            <div
                                key={index}
                                className={`location-card ${draggedItem === location ? 'dragging' : ''}`}
                                draggable={!itinerary.isCompleted}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="location-order">{index + 1}</div>
                                <div className="location-info">
                                    <h3>{location.name}</h3>
                                    <p>{location.address}</p>
                                    <div className="price-level">
                                        {'$'.repeat(Number(location.pricelevel || 0))}
                                    </div>
                                </div>
                                {!itinerary.isCompleted && (
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLocation(index);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {!itinerary.isCompleted && (
                        <>
                            <button
                                className="save-order-button"
                                onClick={handleSaveOrderToFirestore}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Order'}
                            </button>
                            {saveSuccess && (
                                <div className="save-confirmation">
                                    ✓ Changes saved successfully!
                                </div>
                            )}
                            <button
                                className="add-location-button"
                                onClick={() => navigate('/map')}
                                disabled={isLoading}
                            >
                                + Add Location
                            </button>
                        </>
                    )}

                    <button
                        onClick={toggleCompleteStatus}
                        disabled={itinerary.isCompleted || isLoading}
                        className={`complete-button ${itinerary.isCompleted ? 'permanent-complete' : ''}`}
                    >
                        {itinerary.isCompleted ? '✓ Permanently Completed' : 'Mark as Complete'}
                    </button>
                </div>

                <div className="packing-section">
                    <h2>Packing List</h2>
                    <div className="packing-items">
                        {getPackingRecommendations().map((item, index) => (
                            <div key={index} className="packing-item">
                                <input
                                    type="checkbox"
                                    id={`item-${index}`}
                                    disabled={itinerary.isCompleted}
                                />
                                <label htmlFor={`item-${index}`}>{item}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryDetailsPage;