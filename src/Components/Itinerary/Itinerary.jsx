import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './itinerary.css';
import { UserContext } from '../../UserContext'; // ***** Added this import *****

const ItineraryPage = () => {
    // State for itineraries and form fields
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

    // ✅ Get userId from UserContext (REMOVED auth.onAuthStateChanged)
    const { user } = useContext(UserContext);
    const userId = user?.uid; // ***** Replaced direct auth reference with userContext *****

    // ✅ Fetch itineraries when userId changes
    useEffect(() => {
        if (userId) {
            fetchItineraries(); // ***** Trigger when userId is available *****
        }
    }, [userId]);

    // ✅ Fetch itineraries from backend
    const fetchItineraries = async () => {
        if (!userId) return; // ***** Stop if no userId available *****
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://127.0.0.1:5000/itinerary/get/itineraries/${userId}` // ***** Updated endpoint *****
            );
            setItineraries(response.data.data || []);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to fetch itineraries.");
            console.error("Error fetching itineraries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Handle form submission (Add/Edit)
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
                // ✅ Update existing itinerary
                await axios.put(
                    `http://127.0.0.1:5000/itinerary/update/itinerary/${userId}/${currentItineraryId}`, // ***** Updated endpoint *****
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
                // ✅ Add new itinerary
                await axios.post(
                    `http://127.0.0.1:5000/itinerary/add/itinerary/${userId}`, // ***** Updated endpoint *****
                    submissionData
                );
                fetchItineraries(); // ***** Refresh after adding *****
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

    // ✅ Edit an itinerary
    const handleEditClick = (itinerary) => {
        setEditMode(true);
        setCurrentItineraryId(itinerary.id);
        setFormData({
            tripName: itinerary.TripName,
            tripCost: itinerary.TripCost.toString(),
            tripType: itinerary.TripType,
            tripDuration: itinerary.TripDuration.toString()
        });
    };

    // ✅ Delete an itinerary
    const handleDeleteItinerary = async (itineraryId) => {
        if (!window.confirm("Are you sure you want to delete this itinerary?")) return;
        if (!userId) return; // ***** Stop if no userId available *****

        setIsLoading(true);
        try {
            await axios.delete(
                `http://127.0.0.1:5000/itinerary/delete/itinerary/${userId}/${itineraryId}` // ***** Updated endpoint *****
            );
            setItineraries(prev => prev.filter(itinerary => itinerary.id !== itineraryId));
        } catch (error) {
            setError(error.response?.data?.error || "Failed to delete itinerary.");
            console.error("Error deleting itinerary:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Reset form fields
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

    // ✅ Cancel edit mode
    const handleCancel = () => {
        resetForm();
    };

    return (
        <div className="itinerary-page">
            <div className="app-container">
                <h2>Itinerary List</h2>

                {/* ✅ Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* ✅ Loading Spinner */}
                {isLoading && <div className="loading-spinner">Loading...</div>}

                {/* ✅ Itinerary Table */}
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
                            <tr key={itinerary.id}>
                                <td>{itinerary.TripName}</td>
                                <td>${itinerary.TripCost}</td>
                                <td>{itinerary.TripType}</td>
                                <td>{itinerary.TripDuration}</td>
                                <td className="actions">
                                    <button onClick={() => handleEditClick(itinerary)} disabled={isLoading}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteItinerary(itinerary.id)} disabled={isLoading} className="delete-btn">
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

                {/* ✅ Add/Edit Form */}
                <h2>{editMode ? "Edit Itinerary" : "Add New Itinerary"}</h2>
                <form onSubmit={handleSubmit} className="itinerary-form">
                    <input
                        type="text"
                        name="tripName"
                        placeholder="Trip Name"
                        value={formData.tripName}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="tripCost"
                        placeholder="Trip Cost ($)"
                        value={formData.tripCost}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="tripType"
                        placeholder="Trip Type"
                        value={formData.tripType}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="tripDuration"
                        placeholder="Trip Duration (Days)"
                        value={formData.tripDuration}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">{editMode ? "Update Itinerary" : "Add Itinerary"}</button>
                </form>
            </div>
        </div>
    );
};

export default ItineraryPage;
