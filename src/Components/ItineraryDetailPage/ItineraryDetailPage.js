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

import {
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import axios from "axios";
import {t} from "i18next";


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
                    console.log("✅ Firestore document found:", data);

                    setItinerary({id: docSnap.id, ...data});

                    const mappedLocations = data.mapLocations || [];
                    console.log("📍 Locations loaded:", mappedLocations);

                    setLocations(mappedLocations);
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
    }, [userId, itineraryId, user]); // ✅ this is the correct closing line


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
            const newStatus = !itinerary.isCompleted;
            await updateDoc(doc(db, "Users", userId, "Itineraries", itineraryId), {
                isCompleted: newStatus
            });
            setItinerary(prev => ({...prev, isCompleted: newStatus}));
            console.log(`✅ Itinerary marked as ${newStatus ? 'complete' : 'incomplete'}`);
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
        <div className="itinerary-details-container" ref={pdfRef}>
            <div className={`itinerary-details-container ${itinerary.isCompleted ? 'completed-trip' : ''}`}>
                <button onClick={() => navigate(-1)} className="back-button">
                    ← {t('Back to Itineraries')}
                </button>

                <div className="itinerary-header">
                    <h1 className="trip-title">{itinerary.TripName}</h1>

                    <div className="trip-meta">
                        <span><strong>{t('Type')}:</strong> {t(itinerary.TripType)}</span>
                        <span><strong>{t('Duration')}:</strong> {itinerary.TripDuration} {t('days')}</span>
                        <span><strong>{t('Budget')}:</strong> ${itinerary.TripCost}</span>
                        <span><strong>{t('Current Cost')}:</strong> ${currentCost}</span>
                        {itinerary.isCompleted && <span className="completed-badge">✓ {t('Completed')}</span>}
                    </div>

                    {currentCost > itinerary?.TripCost && (
                        <div className="budget-warning">
                            ⚠️ {t('Warning: Over budget!')}
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
                                            disabled={itinerary.isCompleted}
                                            style={itinerary.isCompleted ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
                                        >
                                            {t('Delete')}
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
                                    {isLoading ? t('Saving...') : t('Save Order')}
                                </button>
                                {saveSuccess && (
                                    <div className="save-confirmation">
                                        ✓ {t('Changes saved successfully!')}
                                    </div>
                                )}
                                <button
                                    className="add-location-button"
                                    onClick={() => navigate('/')}
                                    disabled={isLoading}
                                >
                                    + {t('Add Location')}
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleDownloadPDF}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                marginBottom: '0.5rem'
                            }}
                        >
                            {t('Download PDF')}
                        </button>


                        <button
                            onClick={toggleCompleteStatus}
                            disabled={itinerary.isCompleted || isLoading}
                            className={`complete-button ${itinerary.isCompleted ? 'permanent-complete' : ''}`}
                        >
                            {itinerary.isCompleted ? `✓ ${t('Permanently Completed')}` : t('Mark as Complete')}
                        </button>

                        {itinerary.isCompleted && (
                            <div style={{marginTop: '10px', color: 'green'}}>
                                {t('This itinerary is completed. Editing is disabled.')}
                            </div>
                        )}
                    </div>

                    <div className="packing-section">
                        <h2>{t('Packing List')}</h2>
                        <div className="packing-items">
                            {getPackingRecommendations().map((item, index) => (
                                <div key={index} className="packing-item">
                                    <input
                                        type="checkbox"
                                        id={`item-${index}`}
                                        disabled={itinerary.isCompleted}
                                    />
                                    <label htmlFor={`item-${index}`}>{t(item)}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

    export default ItineraryDetailsPage;