import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './itineraryDetail.css';

const ItineraryDetailsPage = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();

    // Mock data
    const mockItinerary = {
        id: itineraryId,
        TripName: `Trip ${itineraryId}`,
        TripCost: 1200,
        TripType: 'beach',
        TripDuration: 5,
        locations: [
            {
                id: 'loc1',
                name: 'Sunset Beach',
                address: '123 Coastal Highway',
                priceLevel: 2
            },
            {
                id: 'loc2',
                name: 'Marina Restaurant',
                address: '456 Harbor Way',
                priceLevel: 3
            }
        ]
    };

    const [locations, setLocations] = useState(mockItinerary.locations);
    const [draggedItem, setDraggedItem] = useState(null);

    // Native drag and drop implementation
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

    // Delete location
    const handleDeleteLocation = (locationId) => {
        if (window.confirm("Are you sure you want to delete this location?")) {
            setLocations(locations.filter(location => location.id !== locationId));
        }
    };

    // Packing recommendations
    const getPackingRecommendations = () => {
        const recommendations = {
            beach: ['Sunscreen', 'Swimsuit', 'Beach towel', 'Sunglasses', 'Flip flops'],
            hiking: ['Hiking boots', 'Water bottle', 'Backpack', 'First aid kit', 'Map'],
            city: ['Comfortable shoes', 'City map', 'Umbrella', 'Camera', 'Portable charger'],
            winter: ['Winter jacket', 'Gloves', 'Thermal wear', 'Ski goggles', 'Hand warmers'],
            business: ['Business attire', 'Laptop', 'Notebook', 'Travel adapter', 'Business cards']
        };
        return recommendations[mockItinerary.TripType] || [];
    };

    return (
        <div className="itinerary-details-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Itineraries
            </button>

            <div className="itinerary-header">
                <h1>{mockItinerary.TripName}</h1>
                <div className="trip-meta">
                    <span><strong>Type:</strong> {mockItinerary.TripType}</span>
                    <span><strong>Duration:</strong> {mockItinerary.TripDuration} days</span>
                    <span><strong>Budget:</strong> ${mockItinerary.TripCost}</span>
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
                                        {'$'.repeat(location.priceLevel)}
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

                    <button className="add-location-button">
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