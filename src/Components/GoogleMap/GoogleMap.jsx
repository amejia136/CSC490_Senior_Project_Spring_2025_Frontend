import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import stateLocations from "./StateLocations";
import LocationPopup from '../LocationPopup/LocationPopup';
import { MarkerClusterer } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "80vh",
    margin: "0 auto",
    borderRadius: "12px",
};

const defaultCenter = {
    lat: 39.8283,
    lng: -98.5795,
};

const GoogleMapComponent = ({ selectedState, onLocationSelect, activeFilters }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(6);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const autocompleteRef = useRef(null);

    const markerIcons = {
        restaurant: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        hotel: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        tourist_attraction: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    };

    useEffect(() => {
        if (map && selectedState) {
            const newCenter = stateLocations[selectedState] || defaultCenter;
            map.panTo(newCenter);
            setZoomLevel(6);
        }
    }, [selectedState, map]);

    useEffect(() => {
        if (!map || !window.google) return;

        const service = new window.google.maps.places.PlacesService(map);

        const fetchPlacesByType = (type) => {
            const request = {
                location: map.getCenter(),
                radius: 7000,
                type: type,
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    const newMarkers = results.map((place) => {
                        const rating = place.rating ? place.rating.toFixed(1) : "N/A";
                        const types = Array.isArray(place.types)
                            ? place.types.map(t => t.replace(/_/g, ' ')).join(", ")
                            : "Unknown";

                        return {
                            id: place.place_id,
                            name: place.name,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                            type: type,
                            rating,
                            types
                        };
                    });

                    setFilteredMarkers((prev) => [
                        ...prev.filter((m) => m.type !== type),
                        ...newMarkers,
                    ]);
                }
            });
        };

        setFilteredMarkers([]);
        activeFilters.forEach((type) => fetchPlacesByType(type));
    }, [activeFilters, map]);

    const handleMapClick = (event) => {
        if (!event.latLng) return;
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                const place = results[0];
                const locationData = {
                    name: place.formatted_address,
                    address: place.formatted_address,
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
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(
            {
                placeId: locationData.place_id,
                fields: ["name", "price_level", "types", "rating", "formatted_address"],
            },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                    locationData.name = place.name || locationData.name;
                    locationData.address = place.formatted_address || locationData.address;
                    locationData.price_level = place.price_level !== undefined ? place.price_level : "N/A";
                    locationData.rating = place.rating ? place.rating.toFixed(1) : "N/A";
                    locationData.types = place.types ? place.types.join(", ") : "Unknown";
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
        // location and itinerary database
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
                                alert("Please select a valid location from the dropdown.");
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
                        placeholder="Search location..."
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
                center={
                    selectedLocation
                        ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
                        : defaultCenter
                }
                zoom={zoomLevel}
                onClick={handleMapClick}
                onLoad={(map) => setMap(map)}
            >
                {selectedLocation && (
                    <Marker
                        position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                        label={{
                            text: selectedLocation.name.length > 15
                                ? selectedLocation.name.substring(0, 15) + "..."
                                : selectedLocation.name,
                            fontSize: "14px",
                            fontWeight: "bold",
                        }}
                    />
                )}

                <MarkerClusterer>
                    {(clusterer) =>
                        filteredMarkers.map((marker) => (
                            <Marker
                                key={marker.id}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                clusterer={clusterer}
                                icon={{ url: markerIcons[marker.type] }}
                                title={marker.name}
                                onClick={() => {
                                    if (map) {
                                        map.panTo({ lat: marker.lat, lng: marker.lng }); //  Center
                                        map.setZoom(17); //  Zoom in
                                    }
                                }}
                            />
                        ))
                    }
                </MarkerClusterer>

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