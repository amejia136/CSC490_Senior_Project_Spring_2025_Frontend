import React, {useState, useEffect, useContext, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './itinerary.css';
import { UserContext } from '../../UserContext';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebaseConfig';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

const ItineraryPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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

    const fetchItineraries = useCallback(async () => {
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
    }, [userId]);


    useEffect(() => {
        fetchItineraries();
    }, [fetchItineraries]);

    const toggleCompleteStatus = async (itineraryId, currentStatus) => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const newStatus = !currentStatus;
            await axios.put(
                `http://127.0.0.1:5000/itinerary/update/itinerary/${userId}/${itineraryId}`,
                { isCompleted: newStatus }
            );

            // Update Firestore
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                isCompleted: newStatus
            });

            // Update local state
            const updated = itineraries.map(i =>
                i.id === itineraryId ? { ...i, isCompleted: newStatus } : i
            );
            setItineraries(updated);
            localStorage.setItem('all-itineraries', JSON.stringify(updated));

        } catch (error) {
            setError(error.response?.data?.error || "Failed to update status");
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
            TripDuration: parseInt(formData.tripDuration),
            isCompleted: false, // Default to not completed
            timestamp: Date.now()
        };

        try {
            if (editMode) {
                await axios.put(
                    `http://127.0.0.1:5000/itinerary/update/itinerary/${userId}/${currentItineraryId}`,
                    submissionData
                );

                window.dispatchEvent(new Event("itinerary-updated"));

                const updated = itineraries.map(itinerary =>
                    itinerary.id === currentItineraryId
                        ? { ...itinerary, ...submissionData }
                        : itinerary
                );
                setItineraries(updated);
                localStorage.setItem('all-itineraries', JSON.stringify(updated));
                setEditMode(false);
            } else {
                await axios.post(
                    `http://127.0.0.1:5000/itinerary/add/itinerary/${userId}`,
                    submissionData
                );

                try {
                    await addDoc(collection(db, "Users", userId, "Itineraries"), submissionData);
                } catch (firestoreError) {
                    console.error("Failed to sync itinerary to Firestore:", firestoreError);
                }

                window.dispatchEvent(new Event("itinerary-updated"));

                const refreshed = await axios.get(
                    `http://127.0.0.1:5000/itinerary/get/itineraries/${userId}`
                );
                const newItineraries = refreshed.data.data || [];
                setItineraries(newItineraries);
                localStorage.setItem('all-itineraries', JSON.stringify(newItineraries));
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
        if (itinerary.isCompleted) return;

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
            const updated = itineraries.filter(itinerary => itinerary.id !== itineraryId);
            setItineraries(updated);
            localStorage.setItem('all-itineraries', JSON.stringify(updated));
            localStorage.removeItem(`itinerary-${itineraryId}`);
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
            <h2>{t('Itinerary List')}</h2>

            {showToast && (
                <div className="toast-notification">
                    {error}
                    <button onClick={() => setShowToast(false)} className="toast-close">
                        ×
                    </button>
                </div>
            )}

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            <table className="itinerary-table">
                <thead>
                <tr>
                    <th>{t('Trip Name')}</th>
                    <th>{t('Trip Budget ($)')}</th>
                    <th>{t('Trip Type')}</th>
                    <th>{t('Trip Duration (Days)')}</th>
                    <th>{t('Status')}</th>
                    <th>{t('Actions')}</th>
                </tr>
                </thead>
                <tbody>
                {itineraries.length > 0 ? (
                    itineraries.map((itinerary) => (
                        <tr
                            key={itinerary.id}
                            onClick={() => !isLoading && navigate(`/itinerary/${itinerary.id}`)}
                            className={`${isLoading ? 'disabled-row' : ''} ${itinerary.isCompleted ? 'completed-row' : ''}`}
                        >
                            <td>{itinerary.TripName}</td>
                            <td>${itinerary.TripCost}</td>
                            <td>{itinerary.TripType}</td>
                            <td>{itinerary.TripDuration}</td>
                            <td>
                                {itinerary.isCompleted ? (
                                    <span className="status-badge completed">{t('Completed')}</span>
                                ) : (
                                    <span className="status-badge active">{t('Active')}</span>
                                )}
                            </td>
                            <td className="actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={(e) => handleEditClick(e, itinerary)}
                                    disabled={isLoading || itinerary.isCompleted}
                                    className="edit-btn"
                                >
                                    {t('Edit')}
                                </button>
                                <button
                                    onClick={(e) => handleDeleteItinerary(e, itinerary.id)}
                                    disabled={isLoading}
                                    className="delete-btn"
                                >
                                    {t('Delete')}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCompleteStatus(itinerary.id, itinerary.isCompleted);
                                    }}
                                    disabled={isLoading}
                                    className={`complete-btn ${itinerary.isCompleted ? 'completed' : ''}`}
                                >
                                    {itinerary.isCompleted ? t('✓ Completed') : t('Mark Complete')}
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="no-itineraries">
                            {isLoading ? t('Loading...') : t('No itineraries found.')}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <h2>{editMode ? t('Edit Itinerary') : t('Add New Itinerary')}</h2>
            <form onSubmit={handleSubmit} className="itinerary-form">
                <input
                    type="text"
                    name="tripName"
                    placeholder={t('Trip Name')}
                    value={formData.tripName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <input
                    type="number"
                    name="tripCost"
                    placeholder={t('Trip Budget ($)')}
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
                    placeholder={t('Trip Type')}
                    value={formData.tripType}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                />
                <input
                    type="number"
                    name="tripDuration"
                    placeholder={t('Trip Duration (Days)')}
                    value={formData.tripDuration}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    min="1"
                />
                <div className="form-actions">
                    <button type="submit" disabled={isLoading}>
                        {editMode ? t('Update Itinerary') : t('Add Itinerary')}
                    </button>
                    {editMode && (
                        <button type="button" onClick={handleCancel} disabled={isLoading} className="cancel-btn">
                            {t('Cancel')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ItineraryPage;