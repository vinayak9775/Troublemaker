import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../../HCM/ProfessionalAllocation/Map.css';

// Custom icon for current location
const currentLocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});

const MapComponent = () => {

    console.log('fetching Map Componenet');

    const [geoJsonData, setGeoJsonData] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [drawnPolygons, setDrawnPolygons] = useState([]);
    const [intersectedZones, setIntersectedZones] = useState([]);

    console.log(intersectedZones, 'Intersected Zone Fetching');
    const featureGroupRef = useRef(null);

    const handleDrawCreated = (e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            setDrawnPolygons([...drawnPolygons, layer]);
        }
    };

    // Trigger intersection calculations when geoJsonData changes
    useEffect(() => {
        if (drawnPolygons.length > 0 && geoJsonData) {
            // Perform intersection calculations
            const intersectedZones = checkIntersections(drawnPolygons[drawnPolygons.length - 1]);
            setIntersectedZones(intersectedZones);
            console.log("Intersected Zones:", intersectedZones);
        }
    }, [drawnPolygons, geoJsonData]);


    const checkIntersections = (drawnLayer) => {
        if (!geoJsonData) return [];

        const drawnPolygon = drawnLayer.toGeoJSON().geometry.coordinates[0];
        const zones = [];

        geoJsonData.features.forEach(feature => {
            const zonePolygon = feature.geometry.coordinates[0];
            // Check if any vertex of the drawn polygon falls within the zone
            const isIntersected = drawnPolygon.some(drawnVertex =>
                isPointInsidePolygon(drawnVertex, zonePolygon)
            );
            if (isIntersected) {
                zones.push(feature.properties.NAME_3);
            }
        });

        console.log('Intersected zones:', zones);
        return zones;
    };

    const isPointInsidePolygon = (point, polygon) => {
        const x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    const doPolygonsIntersect = (polygon1, polygon2) => {
        const poly1 = L.polygon(polygon1);
        const poly2 = L.polygon(polygon2);
        return poly1.getBounds().intersects(poly2.getBounds());
    };

    const labelPositions = [
        { lat: 18.213459, lng: 74.457335 },
        { lat: 18.162697, lng: 73.781568 },
        { lat: 18.451405, lng: 74.462094 },
        { lat: 19.057375, lng: 73.857711 },
        { lat: 18.110349, lng: 74.895156 },
        { lat: 19.217592, lng: 73.943372 },
        { lat: 18.348295, lng: 73.68639 },
        { lat: 18.506926, lng: 73.535691 },
        { lat: 18.87019, lng: 73.843434 },
        { lat: 18.288016, lng: 74.117865 },
        { lat: 18.759149, lng: 74.243184 },
        { lat: 18.765494, lng: 73.557899 },
        { lat: 18.643547, lng: 73.788707 },
        { lat: 18.567404, lng: 73.911011 },
        { lat: 18.538216, lng: 73.777127 },
        { lat: 18.508727, lng: 73.872797 },
        { lat: 18.50866, lng: 73.818188 },
        { lat: 18.46234, lng: 73.859115 },
        { lat: 18.471858, lng: 73.818188 },
        { lat: 18.492507, lng: 73.924775 }
    ];

    useEffect(() => {
        fetch('/GeojsonData/Pune_Zone_Boundaries_V1.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGeoJsonData(data);
            })
            .catch(error => console.error('Error loading GeoJSON data:', error));
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
                console.error("Error getting current position:", error);
            }
        );
    }, []);

    const highlightStyle = {
        color: 'blue',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: 'Yellow'
    };

    const defaultStyle = {
        color: 'blue',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: '#bbdffb'
    };

    const styleFunction = (feature) => {
        if (currentPosition && feature.geometry.type === 'Polygon') {
            const polygonCoordinates = feature.geometry.coordinates[0];
            const markerPosition = [currentPosition[1], currentPosition[0]];
            if (isMarkerInsidePolygon(markerPosition, polygonCoordinates)) {
                return highlightStyle;
            }
        }
        return defaultStyle;
    };

    const isMarkerInsidePolygon = (markerPosition, polygonCoordinates) => {
        const [markerLat, markerLng] = markerPosition;
        let isInside = false;
        for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
            const [vertex1Lat, vertex1Lng] = polygonCoordinates[i];
            const [vertex2Lat, vertex2Lng] = polygonCoordinates[j];
            const lat1 = Array.isArray(vertex1Lng) ? vertex1Lng[1] : vertex1Lat;
            const lng1 = Array.isArray(vertex1Lng) ? vertex1Lng[0] : vertex1Lng;
            const lat2 = Array.isArray(vertex2Lng) ? vertex2Lng[1] : vertex2Lat;
            const lng2 = Array.isArray(vertex2Lng) ? vertex2Lng[0] : vertex2Lng;
            if (((lat1 > markerLat) !== (lat2 > markerLat)) &&
                (markerLng < (lng2 - lng1) * (markerLat - lat1) / (lat2 - lat1) + lng1)) {
                isInside = !isInside;
            }
        }
        return isInside;
    };

    return (
        <MapContainer center={[18.5204, 73.8567]} zoom={8} style={{ height: '23.8rem', width: '42.5rem', borderRadius: '0.7em' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoJsonData && <GeoJSON data={geoJsonData} style={styleFunction} />}
            {geoJsonData && geoJsonData.features.map((feature, index) => (
                <Marker
                    key={index}
                    position={[labelPositions[index]?.lat, labelPositions[index]?.lng]}
                    icon={L.divIcon({
                        className: 'leaflet-div-icon',
                        html: `<div class="polygon-label">${feature.properties.NAME_3}</div>`,
                    })}
                />
            ))}
            {/* Current position marker */}
            {currentPosition && (
                <Marker position={currentPosition} icon={currentLocationIcon}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
            <FeatureGroup ref={featureGroupRef}>
                {/* Display drawn polygons */}
                {drawnPolygons.map((polygon, index) => (
                    <GeoJSON key={index} data={polygon.toGeoJSON()} />
                ))}
                {/* Edit control for drawing */}
                <EditControl
                    position="topright"
                    onCreated={handleDrawCreated}
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                    }}
                    edit={{
                        featureGroup: featureGroupRef.current, // Pass the FeatureGroup
                    }}
                />
            </FeatureGroup>
            {/* Display intersected zones */}
            {/* <div className="zone-info">
                {intersectedZones.length > 0 && (
                    <ul>
                        {intersectedZones.map((zone, index) => (
                            <li key={index}>{zone}</li>
                        ))}
                    </ul>
                )}
            </div> */}
        </MapContainer>
    );
};

export default MapComponent;
