import React, {useState, useEffect, useContext, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './itineraryDetail.css';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../../firebaseConfig';
import {getAuth} from 'firebase/auth'; // 🔐 Import for debug
import {UserContext} from '../../UserContext';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import Itinerary from "../Itinerary/Itinerary";

const ItineraryDetailsPage = () => {
    const {itineraryId} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const userId = user?.uid;

    const [itinerary, setItinerary] = useState(null);
    const [locations, setLocations] = useState([]);
    const [draggedItem, setDraggedItem] = useState(null);

    const pdfRef = useRef();
    const [currentCost, setCurrentCost] = useState(0);

    const calculateCurrentCost = (locations) => {
        const priceMap = {
            0: 0,
            1: 20,
            2: 50,
            3: 100,
            4: 200
        };

        let total = 0;
        for (const loc of locations) {
            total += priceMap[loc.pricelevel] || 0;
        }
        return total;
    };

    useEffect(() => {
        const total = calculateCurrentCost(locations);
        setCurrentCost(total);
    }, [locations]);


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

                    setItinerary({id: docSnap.id, ...data});

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
            setItinerary(prev => ({...prev, isCompleted: newStatus}));
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


    const handleDownloadPDF = async () => {
        if (!itinerary || !locations.length) return;

        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const blockWidth = 100;
        const startX = (pageWidth - blockWidth) / 2;
        let y = 25;
        let page = 1;

        const qrDataUrl = await QRCode.toDataURL('http://localhost:3000/#');

        const drawFooter = () => {
            const qrSize = 20;
            const qrX = pageWidth - qrSize - 4;
            const qrY = 4;

            // Draw QR Code
            pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

            // Footer text
            const footerY = pageHeight - 20;
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100);

            const line1 = "JourneyHub@yahoo.com   |   Mon–Fri, 9AM–5PM EST   |   New York, NY";
            const line2 = "Instagram: @JourneyHub   |   Twitter: @JourneyHub   |   Facebook: /JourneyHub";
            const line3 = "© 2025 JourneyHub. All rights reserved.";

            const line1X = (pageWidth - pdf.getTextWidth(line1)) / 2;
            const line2X = (pageWidth - pdf.getTextWidth(line2)) / 2;
            const line3X = (pageWidth - pdf.getTextWidth(line3)) / 2;

            pdf.text(line1, line1X, footerY);
            pdf.text(line2, line2X, footerY + 5);
            pdf.text(line3, line3X, footerY + 10);
        };


        const addPageCheck = () => {
            if (y > pageHeight - 40) {
                drawFooter();
                pdf.addPage();
                page++;
                y = 25;
            }
        };

        // 🟢 Title
        pdf.setFontSize(24);
        pdf.setFont("helvetica", "bold");
        const title = itinerary.TripName || "Itinerary";
        const titleX = (pageWidth - pdf.getTextWidth(title)) / 2;
        pdf.text(title, titleX, y);
        y += 13;

        // 🟡 Meta Info
        pdf.setFontSize(11);
        const labels = ["Type:", "Duration:", "Budget:", "Current Cost:"];
        const values = [
            itinerary.TripType,
            `${itinerary.TripDuration} days`,
            `$${itinerary.TripCost}`,
            `$${currentCost}`
        ];
        const spacing = 15;

        let metaLine = labels.map((label, i) => label + " " + values[i]).join(" ".repeat(spacing));
        const metaX = (pageWidth - pdf.getTextWidth(metaLine)) / 2;

        let currentX = metaX;
        for (let i = 0; i < labels.length; i++) {
            pdf.setFont("helvetica", "bold");
            pdf.text(labels[i], currentX, y);
            currentX += pdf.getTextWidth(labels[i] + " ");

            pdf.setFont("helvetica", "normal");
            pdf.text(values[i], currentX, y);
            currentX += pdf.getTextWidth(values[i] + " ".repeat(spacing));
        }

        y += 12;
        addPageCheck();

        // Over Budget Warning
        if (currentCost > itinerary.TripCost) {
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(255, 0, 0);
            const warning = "Warning: Over budget!";
            const warningX = (pageWidth - pdf.getTextWidth(warning)) / 2;
            pdf.text(warning, warningX, y);
            y += 10;
            pdf.setTextColor(0, 0, 0);
            pdf.setFont("helvetica", "normal");
            addPageCheck();
        }

        // Divider + Locations Header
        pdf.setDrawColor(200);
        pdf.line(startX, y, startX + blockWidth, y);
        y += 6;

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");
        const locationsHeader = "Locations";
        const locHeaderX = (pageWidth - pdf.getTextWidth(locationsHeader)) / 2;
        pdf.text(locationsHeader, locHeaderX, y);
        y += 3;
        pdf.line(startX, y, startX + blockWidth, y);
        y += 6;
        addPageCheck();

        // Locations List
        locations.forEach((location, index) => {
            const name = `${index + 1}. ${location.name}`;
            const address = location.address;
            const priceLevel = "$".repeat(Number(location.pricelevel || 0));

            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(name, startX, y);
            y += 6;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(address, startX, y);
            y += 5;

            pdf.text(`Price: ${priceLevel}`, startX, y);
            y += 10;
            addPageCheck();
        });

        // Divider + Packing List Header
        y += 4;
        pdf.line(startX, y, startX + blockWidth, y);
        y += 6;

        pdf.setFontSize(15);
        pdf.setFont("helvetica", "bold");
        const packHeader = "Packing List";
        const packHeaderX = (pageWidth - pdf.getTextWidth(packHeader)) / 2;
        pdf.text(packHeader, packHeaderX, y);
        y += 3;
        pdf.line(startX, y, startX + blockWidth, y);
        y += 6;
        addPageCheck();

        // Packing Items
        getPackingRecommendations().forEach(item => {
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(`• ${item}`, startX, y);
            y += 5;
            addPageCheck();
        });

        drawFooter();
        pdf.save(`${itinerary?.TripName || 'itinerary'}.pdf`);
    };


    return (
        <div
            className="itinerary-details-container"
            ref={pdfRef}
        >

            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Itineraries
            </button>

            <div className="itinerary-header">
                <h1 className="trip-title">{itinerary.TripName}</h1>

                <div className="trip-meta">
                    <span><strong>Type:</strong> {itinerary.TripType}</span>
                    <span><strong>Duration:</strong> {itinerary.TripDuration} days</span>
                    <span><strong>Budget:</strong> ${itinerary?.TripCost}</span>
                    <span><strong>Current Cost:</strong> ${currentCost}</span>
                </div>

                {currentCost > itinerary?.TripCost && (
                    <div className="budget-warning">
                        ⚠️ Warning: Over budget!
                    </div>
                )}
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
                                    style={itinerary.isCompleted ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
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
                        style={itinerary.isCompleted ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
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
                        style={itinerary.isCompleted ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
                    >
                        + Add Location
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginBottom: '1rem'
                        }}
                    >
                        Download PDF
                    </button>


                    <button
                        onClick={toggleCompleteStatus}
                        disabled={itinerary.isCompleted}
                        className={`complete-button ${itinerary.isCompleted ? 'completed' : ''}`}
                    >
                        {itinerary.isCompleted ? '✓ Completed' : 'Mark as Complete'}
                    </button>

                    {itinerary.isCompleted && (
                        <div style={{marginTop: '10px', color: 'green'}}>
                            This itinerary is completed. Editing is disabled.
                        </div>
                    )}

                </div>

                <div className="packing-section">
                    <h2>Packing List</h2>
                    <div className="packing-items">
                        {getPackingRecommendations().map((item, index) => (
                            <div key={index} className="packing-item">
                                <input type="checkbox" id={`item-${index}`}/>
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