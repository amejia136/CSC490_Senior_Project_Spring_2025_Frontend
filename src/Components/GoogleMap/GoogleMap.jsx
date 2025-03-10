import React, { useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: 39.8283, // Default center (USA)
    lng: -98.5795,
};

const GoogleMapComponent = ({ onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Ensure Google API is loaded before calling geocoder
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

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={4}
            onClick={handleMapClick}
        >
            {selectedLocation && (
                <Marker position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }} />
            )}
        </GoogleMap>
    );
};

export default GoogleMapComponent;