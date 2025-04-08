import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import stateLocations from "./StateLocations";
import LocationPopup from '../LocationPopup/LocationPopup';
import { useTranslation } from "react-i18next";



const mapContainerStyle = {
    width: "100%",
    height: "80vh",
    margin: "0 auto",
    borderRadius: "12px",
};

const defaultCenter = {
    lat: 39.8283, // Default center (USA)
    lng: -98.5795,
};

const GoogleMapComponent = ({ selectedState, onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(6);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const autocompleteRef = useRef(null);
    const { t } = useTranslation();


    useEffect(() => {
        if (map) {
            if (selectedState) {
                const newCenter = stateLocations[selectedState] || defaultCenter;
                map.panTo(newCenter);
                setZoomLevel(6);
            }
        }
    }, [selectedState, map]);

    const handleMapClick = (event) => {
        if (!event.latLng) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        if (!window.google || !window.google.maps) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                const place = results[0];

                let locationData = {
                    name: place.formatted_address,
                    address: place.formatted_address,
                    latitude: lat,
                    longitude: lng,
                    place_id: place.place_id || null,
                    price_level: "N/A",
                    rating: "N/A",
                    types: "Unknown",
                    address_components: place.address_components,
                };

                if (locationData.place_id) {
                    fetchPlaceDetails(locationData);
                } else {
                    updateSelectedLocation(locationData);
                }
            }
        });
    };

    const fetchPlaceDetails = (locationData) => {
        if (!locationData.place_id || !window.google || !window.google.maps || !map) {
            updateSelectedLocation(locationData);
            return;
        }

        const service = new window.google.maps.places.PlacesService(map);

        service.getDetails(
            { placeId: locationData.place_id, fields: ["name", "price_level", "types", "rating", "formatted_address","address_components"] },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                    locationData.name = place.name || locationData.name;
                    locationData.address = place.formatted_address || locationData.address;
                    locationData.price_level = place.price_level !== undefined ? place.price_level : "N/A";
                    locationData.rating = place.rating
                        ? place.rating.toFixed(1)
                        : "N/A";
                    locationData.types = place.types
                        ? place.types
                            .map(type => type.replace(/_/g, ' '))
                            .join(", ")
                        : "Unknown";
                }

                updateSelectedLocation(locationData);
            }
        );
    };

    const updateSelectedLocation = (locationData) => {
        setSelectedLocation({ ...locationData });
        onLocationSelect({ ...locationData });
        setIsPopupOpen(true);
    };
    const handleAddToItinerary = (location, itineraryId) => {
        console.log('Adding location:', location, 'to itinerary:', itineraryId);
        //  location and itinerary database
        setIsPopupOpen(false);
    };

    return (
        <>
            <div className="search-container">
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => {
                        setTimeout(() => {
                            const place = autocompleteRef.current?.getPlace();

                            if (!place || !place.geometry || !place.geometry.location) {
                                console.warn("No geometry returned for place:", place);
                                alert(t("Please select a valid location from the dropdown."));
                                return;
                            }

                            const lat = place.geometry.location.lat();
                            const lng = place.geometry.location.lng();

                            if (map) {
                                map.panTo({ lat, lng });
                                map.setZoom(15);
                            }

                            let locationData = {
                                name: place.formatted_address || place.name,
                                latitude: lat,
                                longitude: lng,
                                place_id: place.place_id || null,
                                price_level: "N/A",
                                rating: "N/A",
                                types: "Unknown",
                            };

                            if (locationData.place_id) {
                                fetchPlaceDetails(locationData);
                            } else {
                                updateSelectedLocation(locationData);
                            }
                        }, 100);
                    }}
                >
                    <input
                        type="text"
                        placeholder={t('Search location...')}
                        className="search-input"
                        style={{
                            width: '100%',
                            maxWidth: '90%',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: '1px solid #ccc'
                        }}
                    />
                </Autocomplete>
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude } : defaultCenter}
                zoom={zoomLevel}
                onClick={handleMapClick}
                onLoad={(map) => setMap(map)}
            >
                {selectedLocation && (
                    <Marker
                        position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                        label={{
                            text: selectedLocation.name.length > 15 ? selectedLocation.name.substring(0, 15) + "..." : selectedLocation.name,
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                    />
                )}
            </GoogleMap>
            {isPopupOpen && (
                <LocationPopup
                    location={selectedLocation}
                    onClose={() => setIsPopupOpen(false)}
                    onAddToItinerary={handleAddToItinerary}
                />
            )}
        </>
    );
};

export default GoogleMapComponent;