import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api";
import stateLocations from "./StateLocations";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.8283, // Default center (USA)
    lng: -98.5795,
};

const GoogleMapComponent = ({ selectedState, onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(6);

    const autocompleteRef = useRef(null);

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
            { placeId: locationData.place_id, fields: ["name", "price_level", "types"] },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                    locationData.name = place.name || locationData.name;
                    locationData.price_level = place.price_level !== undefined ? place.price_level : "N/A";
                    locationData.rating = place.rating !== undefined ? place.rating : "N/A";
                    locationData.types = place.types ? place.types.join(", ") : "Unknown";
                }
                updateSelectedLocation(locationData);
            }
        );
    };

    const updateSelectedLocation = (locationData) => {
        setSelectedLocation(locationData);
        onLocationSelect(locationData);
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
            <div className="search-container">
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={() => {
                        if (autocompleteRef.current) {
                            const place = autocompleteRef.current.getPlace();
                            if (place.geometry) {
                                const lat = place.geometry.location.lat();
                                const lng = place.geometry.location.lng();

                                let locationData = {
                                    name: place.formatted_address, // Default to address
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
                            }
                        }
                    }}
                >
                    <input type="text" placeholder="Search location..." className="search-input" />
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
                            text: selectedLocation.name.length > 15 ? selectedLocation.name.substring(0, 15) + "..." : selectedLocation.name, // ✅ Show business name on the map
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;