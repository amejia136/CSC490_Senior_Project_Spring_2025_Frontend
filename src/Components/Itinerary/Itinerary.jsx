import React, { useState, useEffect, Fragment } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './itinerary.css';

const ItineraryPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [tripCost, setTripCost] = useState('');
    const [tripType, setTripType] = useState('');
    const [tripDuration, setTripDuration] = useState('');
    const [tripName, setTripName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentItineraryId, setCurrentItineraryId] = useState(null);

    // Fetch itineraries from Firestore
    const fetchItineraries = async () => {
        const userId = "1UkmP8tHggTE5WrsRupHKrt1XoA3"; // Replace with actual userId
        const itinerariesRef = collection(db, "Users", userId, "Itineraries");
        const itinerariesSnapshot = await getDocs(itinerariesRef);
        const itinerariesList = itinerariesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setItineraries(itinerariesList);
        console.log('Updated itineraries:', itinerariesList);  // Debug log

    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editMode) {
            await handleEditItinerary(currentItineraryId, {
                TripCost: tripCost,
                TripType: tripType,
                TripDuration: tripDuration,
                TripName: tripName
            });
            setEditMode(false);
            setCurrentItineraryId(null);
        } else {
            await handleAddItinerary(tripCost, tripType, tripDuration, tripName);
        }

        // Reset form fields
        setTripCost('');
        setTripType('');
        setTripDuration('');
        setTripName('');

        // Re-fetch itineraries after submitting
        fetchItineraries();
    };

    // Add an itinerary to Firestore
    const handleAddItinerary = async (tripCost, tripType, tripDuration, tripName) => {
        const userId = "1UkmP8tHggTE5WrsRupHKrt1XoA3"; // Replace with actual userId
        const itinerariesRef = collection(db, "Users", userId, "Itineraries");
        await addDoc(itinerariesRef, {
            TripCost: tripCost,
            TripType: tripType,
            TripDuration: tripDuration,
            TripName: tripName
        });
    };

    // Edit an itinerary
    const handleEditItinerary = async (itineraryId, updatedData) => {
        const userId = "1UkmP8tHggTE5WrsRupHKrt1XoA3"; // Replace with actual userId
        const itineraryRef = doc(db, "Users", userId, "Itineraries", itineraryId);
        await updateDoc(itineraryRef, updatedData);
    };

    // Delete an itinerary
    const handleDeleteItinerary = async (itineraryId) => {
        const userId = "1UkmP8tHggTE5WrsRupHKrt1XoA3"; // Replace with actual userId
        const itineraryRef = doc(db, "Users", userId, "Itineraries", itineraryId);

        try {
            // Delete the itinerary from Firestore
            console.log(`Deleting itinerary with ID: ${itineraryId}`); // Debug log
            await deleteDoc(itineraryRef);

            // Log to confirm the deletion
            console.log(`Itinerary with ID: ${itineraryId} deleted successfully.`);

            // Re-fetch the updated itineraries list
            await fetchItineraries();
        } catch (error) {
            console.error("Error deleting itinerary: ", error);
        }
    };


    // Handle edit button click
    const handleEditClick = (itinerary) => {
        setEditMode(true);
        setCurrentItineraryId(itinerary.id);
        setTripCost(itinerary.TripCost);
        setTripType(itinerary.TripType);
        setTripDuration(itinerary.TripDuration);
        setTripName(itinerary.TripName);
    };

    // Handle cancel edit
    const handleCancelClick = (e) => {
        e.preventDefault(); // Prevent form submission
        setEditMode(false);
        setCurrentItineraryId(null);
        setTripCost('');
        setTripType('');
        setTripDuration('');
        setTripName('');
    };


    return (
        <div className="app-container">
            <h2>Itinerary List</h2>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                    <tr>
                        <th>Trip Name</th>
                        <th>Trip Cost</th>
                        <th>Trip Type</th>
                        <th>Trip Duration</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itineraries.map((itinerary) => (
                        <Fragment key={itinerary.id}>
                            {editMode && currentItineraryId === itinerary.id ? (
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            value={tripName}
                                            onChange={(e) => setTripName(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={tripCost}
                                            onChange={(e) => setTripCost(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={tripType}
                                            onChange={(e) => setTripType(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={tripDuration}
                                            onChange={(e) => setTripDuration(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={handleCancelClick}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td>{itinerary.TripName}</td>
                                    <td>{itinerary.TripCost}</td>
                                    <td>{itinerary.TripType}</td>
                                    <td>{itinerary.TripDuration}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(itinerary)}>Edit</button>
                                        <button onClick={() => handleDeleteItinerary(itinerary.id)}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    </tbody>
                </table>
            </form>

            <h2>{editMode ? "Edit Itinerary" : "Add a New Itinerary"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Trip Name"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Trip Cost"
                    value={tripCost}
                    onChange={(e) => setTripCost(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Trip Type"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Trip Duration"
                    value={tripDuration}
                    onChange={(e) => setTripDuration(e.target.value)}
                    required
                />
                <button type="submit">{editMode ? "Update Itinerary" : "Add Itinerary"}</button>
            </form>
        </div>
    );
};

export default ItineraryPage;
