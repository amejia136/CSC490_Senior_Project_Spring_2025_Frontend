import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './itineraryDetail.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth'; // 🔐 Import for debug
import { UserContext } from '../../UserContext';
import Itinerary from "../Itinerary/Itinerary";

const ItineraryDetailsPage = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const userId = user?.uid;

    const [itinerary, setItinerary] = useState(null);
    const [locations, setLocations] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);



    useEffect(() => {
        const fetchItinerary = async () => {
            console.log("📌 Firestore fetch triggered...");
            console.log("🧑‍💻 UserContext user object:", user);
            console.log("👤 userId:", userId);
            console.log("🧾 itineraryId:", itineraryId);

            const auth = getAuth(); // 🧪 Add auth debug
            console.log("👀 Firebase Auth currentUser:", auth.currentUser);

            if (!userId || !itineraryId) {
                console.warn("⚠️ Missing userId or itineraryId — skipping fetch.");
                return;
            }

            try {
                const itineraryRefPath = `Users/${userId}/Itineraries/${itineraryId}`;
                console.log("📂 Firestore doc path:", itineraryRefPath);

                const itineraryRef = doc(db, "Users", userId, "Itineraries", itineraryId);
                const docSnap = await getDoc(itineraryRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("✅ Firestore document found:", data);

                    setItinerary({ id: docSnap.id, ...data });

                    const mappedLocations = data.mapLocations || [];
                    console.log("📍 Locations loaded:", mappedLocations);

                    setLocations(mappedLocations);
                } else {
                    console.error("❌ Document does not exist:", itineraryRefPath);
                    setItinerary(null);
                }
            } catch (error) {
                console.error("❌ Firestore fetch error:", error.message);
                console.error("📛 Full error object:", error);
                setItinerary(null);
            }
        };

        fetchItinerary();
    }, [userId, itineraryId, user]);



    const handleDragStart = (e, index) => {
        setDraggedItem(locations[index]);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
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

    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSaveOrderToFirestore = async () => {
        if (!userId || !itineraryId) return;
        try {
            const validLocations = locations.filter(loc => loc && loc.name);
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                mapLocations: validLocations
            });
            console.log("✅ Order saved to Firestore:", validLocations);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3 seconds
        } catch (error) {
            console.error("❌ Error saving order to Firestore:", error);
        }
    };

    const handleDeleteLocation = async (locationIndex) => {
        if (!window.confirm("Are you sure you want to delete this location?")) return;
        const updated = locations.filter((_, i) => i !== locationIndex);
        setLocations(updated);
        try {
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                mapLocations: updated
            });
            console.log("🗑️ Location deleted and updated in Firestore.");
        } catch (err) {
            console.error("❌ Error deleting location:", err);
        }
    };

    const toggleCompleteStatus = async () => {
        if (!userId || !itineraryId) return;

        try {
            const newStatus = !itinerary.isCompleted;
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                isCompleted: newStatus
            });
            setItinerary(prev => ({ ...prev, isCompleted: newStatus }));
            console.log(`✅ Itinerary marked as ${newStatus ? 'complete' : 'incomplete'}`);
        } catch (error) {
            console.error("❌ Error updating completion status:", error);
        }
    };

    const getPackingRecommendations = () => {
        const recommendations = {
            beach: ['Sunscreen', 'Swimsuit', 'Beach towel', 'Sunglasses', 'Flip flops'],
            hiking: ['Hiking boots', 'Water bottle', 'Backpack', 'First aid kit', 'Map'],
            city: ['Comfortable shoes', 'City map', 'Umbrella', 'Camera', 'Portable charger'],
            winter: ['Winter jacket', 'Gloves', 'Thermal wear', 'Ski goggles', 'Hand warmers'],
            business: ['Business attire', 'Laptop', 'Notebook', 'Travel adapter', 'Business cards']
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
        <div className="itinerary-details-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Itineraries
            </button>

            <div className="itinerary-header">
                <h1>{itinerary.TripName}</h1>
                <div className="trip-meta">
                    <span><strong>Type:</strong> {itinerary.TripType}</span>
                    <span><strong>Duration:</strong> {itinerary.TripDuration} days</span>
                    <span><strong>Budget:</strong> ${itinerary.TripCost}</span>
                </div>
            </div>

            <div className="details-content">
                <div className="locations-section">
                    <div className="locations-list">
                        {locations.map((location, index) => (
                            <div
                                key={index}
                                className={`location-card ${draggedItem === location ? 'dragging' : ''}`}
                                draggable={true}
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
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!itinerary.isCompleted) {
                                            handleDeleteLocation(index);
                                        }
                                    }}
                                    disabled={itinerary.isCompleted}
                                    style={itinerary.isCompleted ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        className="save-order-button"
                        onClick={handleSaveOrderToFirestore}
                        disabled={itinerary.isCompleted}
                        style={itinerary.isCompleted ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                        Save Order
                    </button>

                    {saveSuccess && (
                        <div className="save-confirmation">
                            ✓ Changes saved successfully!
                        </div>
                    )}

                    <button
                        className="add-location-button"
                        onClick={() => navigate('/')}
                        disabled={itinerary.isCompleted}
                        style={itinerary.isCompleted ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                        + Add Location
                    </button>

                    <button
                        onClick={toggleCompleteStatus}
                        disabled={itinerary.isCompleted}
                        className={`complete-button ${itinerary.isCompleted ? 'completed' : ''}`}
                    >
                        {itinerary.isCompleted ? '✓ Completed' : 'Mark as Complete'}
                    </button>

                    {itinerary.isCompleted && (
                        <div style={{ marginTop: '10px', color: 'green' }}>
                            This itinerary is completed. Editing is disabled.
                        </div>
                    )}

                </div>

                <div className="packing-section">
                    <h2>Packing List</h2>
                    <div className="packing-items">
                        {getPackingRecommendations().map((item, index) => (
                            <div key={index} className="packing-item">
                                <input type="checkbox" id={`item-${index}`} />
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