import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './itineraryDetail.css';

const ItineraryDetailsPage = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();

    const [itinerary, setItinerary] = useState(null);
    const [locations, setLocations] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);

    // Load itinerary info from localStorage and listen for changes
    useEffect(() => {
        const loadItinerary = () => {
            const allItineraries = JSON.parse(localStorage.getItem('all-itineraries')) || [];
            const current = allItineraries.find(i => String(i.id) === itineraryId);
            setItinerary(current || null);
        };

        loadItinerary();
        window.addEventListener('storage', loadItinerary);
        window.addEventListener('focus', loadItinerary);

        return () => {
            window.removeEventListener('storage', loadItinerary);
            window.removeEventListener('focus', loadItinerary);
        };
    }, [itineraryId]);

    // Load locations and stay in sync
    useEffect(() => {
        const updateLocations = () => {
            const stored = JSON.parse(localStorage.getItem(`itinerary-${itineraryId}`)) || [];
            setLocations(stored);
        };

        updateLocations();
        window.addEventListener('storage', updateLocations);
        window.addEventListener('focus', updateLocations);

        return () => {
            window.removeEventListener('storage', updateLocations);
            window.removeEventListener('focus', updateLocations);
        };
    }, [itineraryId]);

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
        localStorage.setItem(`itinerary-${itineraryId}`, JSON.stringify(locations));
    };

    const handleDeleteLocation = (locationId) => {
        if (window.confirm("Are you sure you want to delete this location?")) {
            const updated = locations.filter(location => location.id !== locationId);
            setLocations(updated);
            localStorage.setItem(`itinerary-${itineraryId}`, JSON.stringify(updated));
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
                                key={location.id}
                                className={`location-card ${draggedItem === location ? 'dragging' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="location-order">{index + 1}</div>
                                <div className="location-info">
                                    <h3>{location.name}</h3>
                                    <p>{location.address}</p>
                                    <div className="price-level">
                                        {'$'.repeat(Number(location.priceLevel) || 0)}
                                    </div>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteLocation(location.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="add-location-button" onClick={() => navigate('/map')}>
                        + Add Location
                    </button>
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
