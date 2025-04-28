import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './itinerary.css';
import { UserContext } from '../../UserContext';

const ItineraryPage = () => {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [formData, setFormData] = useState({
        tripName: '',
        tripCost: '',
        tripType: '',
        tripDuration: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [currentItineraryId, setCurrentItineraryId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const { user } = useContext(UserContext);
    const userId = user?.uid;

    // Fetch itineraries when userId changes
    useEffect(() => {
        if (userId) {
            fetchItineraries();
        }
    }, [userId]);

    // Show toast message for errors
    useEffect(() => {
        if (error) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchItineraries = async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/itinerary/get/itineraries/${userId}`
            );
            setItineraries(response.data.data || []);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to fetch itineraries.");
            console.error("Error fetching itineraries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError("You must be logged in to save an itinerary.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const submissionData = {
            TripName: formData.tripName,
            TripCost: parseFloat(formData.tripCost),
            TripType: formData.tripType,
            TripDuration: parseInt(formData.tripDuration)
        };

        try {
            if (editMode) {
                await axios.put(
                    `http://127.0.0.1:5000/itinerary/update/itinerary/${userId}/${currentItineraryId}`,
                    submissionData
                );
                setItineraries(prevItineraries =>
                    prevItineraries.map(itinerary =>
                        itinerary.id === currentItineraryId
                            ? { ...itinerary, ...submissionData }
                            : itinerary
                    )
                );
                setEditMode(false);
            } else {
                await axios.post(
                    `http://127.0.0.1:5000/itinerary/add/itinerary/${userId}`,
                    submissionData
                );
                fetchItineraries();
            }
            resetForm();
        } catch (error) {
            setError(
                error.response?.data?.error ||
                (editMode ? "Failed to update itinerary." : "Failed to add itinerary.")
            );
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (e, itinerary) => {
        e.stopPropagation();
        setEditMode(true);
        setCurrentItineraryId(itinerary.id);
        setFormData({
            tripName: itinerary.TripName,
            tripCost: itinerary.TripCost.toString(),
            tripType: itinerary.TripType,
            tripDuration: itinerary.TripDuration.toString()
        });
    };

    const handleDeleteItinerary = async (e, itineraryId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this itinerary?")) return;
        if (!userId) return;

        setIsLoading(true);
        try {
            await axios.delete(
                `http://127.0.0.1:5000/itinerary/delete/itinerary/${userId}/${itineraryId}`
            );
            setItineraries(prev => prev.filter(itinerary => itinerary.id !== itineraryId));
        } catch (error) {
            setError(error.response?.data?.error || "Failed to delete itinerary.");
            console.error("Error deleting itinerary:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            tripCost: '',
            tripType: '',
            tripDuration: '',
            tripName: ''
        });
        setCurrentItineraryId(null);
        setEditMode(false);
    };

    const handleCancel = () => {
        resetForm();
    };

    return (
        <div className="itinerary-page">
            <div className="app-container">
                <h2>Itinerary List</h2>

                {/* Toast Notification */}
                {showToast && (
                    <div className="toast-notification">
                        {error}
                        <button onClick={() => setShowToast(false)} className="toast-close">
                            ×
                        </button>
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                {/* Itinerary Table */}
                <table className="itinerary-table">
                    <thead>
                    <tr>
                        <th>Trip Name</th>
                        <th>Trip Cost ($)</th>
                        <th>Trip Type</th>
                        <th>Trip Duration (Days)</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itineraries.length > 0 ? (
                        itineraries.map((itinerary) => (
                            <tr
                                key={itinerary.id}
                                onClick={() => !isLoading && navigate(`/itinerary/${itinerary.id}`)}
                                className={isLoading ? 'disabled-row' : ''}
                            >
                                <td>{itinerary.TripName}</td>
                                <td>${itinerary.TripCost}</td>
                                <td>{itinerary.TripType}</td>
                                <td>{itinerary.TripDuration}</td>
                                <td className="actions" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => handleEditClick(e, itinerary)}
                                        disabled={isLoading}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteItinerary(e, itinerary.id)}
                                        disabled={isLoading}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-itineraries">
                                {isLoading ? "Loading..." : "No itineraries found."}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Add/Edit Form */}
                <h2>{editMode ? "Edit Itinerary" : "Add New Itinerary"}</h2>
                <form onSubmit={handleSubmit} className="itinerary-form">
                    <input
                        type="text"
                        name="tripName"
                        placeholder="Trip Name"
                        value={formData.tripName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="number"
                        name="tripCost"
                        placeholder="Trip Cost ($)"
                        value={formData.tripCost}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                    />
                    <input
                        type="text"
                        name="tripType"
                        placeholder="Trip Type"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="number"
                        name="tripDuration"
                        placeholder="Trip Duration (Days)"
                        value={formData.tripDuration}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        min="1"
                    />
                    <div className="form-actions">
                        <button type="submit" disabled={isLoading}>
                            {editMode ? "Update Itinerary" : "Add Itinerary"}
                        </button>
                        {editMode && (
                            <button type="button" onClick={handleCancel} disabled={isLoading} className="cancel-btn">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItineraryPage;
