import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: 39.8283, // Default center (USA)
    lng: -98.5795,
};

const GoogleMapComponent = ({ onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [map, setMap] = useState(null);
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (map && selectedLocation) {
            map.panTo({ lat: selectedLocation.latitude, lng: selectedLocation.longitude });
        }
    }, [selectedLocation, map]);

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded.");
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                const place = results[0];
                const locationData = {
                    name: place.formatted_address,
                    latitude: lat,
                    longitude: lng,
                    place_id: place.place_id,
                };

                setSelectedLocation(locationData);
                onLocationSelect(locationData);
            } else {
                console.error("Geocoder failed due to:", status);
            }
        });
    };

    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setSelectedLocation({
                    name: place.formatted_address,
                    latitude: lat,
                    longitude: lng,
                    place_id: place.place_id,
                });
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
            <div className="search-container">
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceSelect}
                >
                    <input
                        type="text"
                        placeholder="Search location..."
                        ref={inputRef}
                        className="search-input"
                    />
                </Autocomplete>
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude } : defaultCenter}
                zoom={selectedLocation ? 12 : 4}
                onClick={handleMapClick}
                onLoad={(map) => setMap(map)}
            >
                {selectedLocation && (
                    <Marker position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }} />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;