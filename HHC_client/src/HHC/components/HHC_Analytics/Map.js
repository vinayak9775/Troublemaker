import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css"; // Customize styles for legends and tooltips here
import { useAuth } from '../Context/ContextAPI';
import leafletPip from 'leaflet-pip';

const position = [18.5204, 73.8567]; // Initial center of the map

const createIcon = (cancel_type) => {
  const color = cancel_type === 'Service Cancel' ? '#F0FF42' : '#5E1675'; // Use 'blue' for 'Service Cancellation' and 'red' for other types
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
    iconSize: [10, 10],
  });
};

// Custom Legend component
const LegendControl = ({ counts, onZoneClick }) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "topright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");

      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); width: 270px; max-height: 450px; overflow-y: auto; overflow-x: hidden;">
          <h6 style="margin-bottom: 10px; text-align: center;"><b>Zone-wise Cancellation Count</b></h6>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr>
                <th style="padding: 4px; text-align: left; border-bottom: 1px solid #ddd;">Zone</th>
                <th style="padding: 4px; text-align: right; border-bottom: 1px solid #ddd;">Enquiry Cancellation</th>
                <th style="padding: 4px; text-align: right; border-bottom: 1px solid #ddd;">Service Cancellation</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(counts).map(zone => `
                <tr style="cursor: pointer;" onclick="document.dispatchEvent(new CustomEvent('zoneClick', { detail: '${zone}' }))">
                  <td style="padding: 4px; border-bottom: 1px solid #ddd;">${zone}</td>
                  <td style="padding: 4px; text-align: right; border-bottom: 1px solid #ddd;">${counts[zone]["Enquiry Cancellation"] || 0}</td>
                  <td style="padding: 4px; text-align: right; border-bottom: 1px solid #ddd;">${counts[zone]["Service Cancellation"] || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      return div;
    };
    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [map, counts]);

  useEffect(() => {
    // Event listener for custom zoneClick events
    const handleZoneClick = (e) => {
      onZoneClick(e.detail);
    };
    document.addEventListener("zoneClick", handleZoneClick);

    return () => {
      document.removeEventListener("zoneClick", handleZoneClick);
    };
  }, [onZoneClick]);

  return null;
};

// ServiceTypeDetails Component
const ServiceTypeDetails = ({ serviceCounts, selectedZone, onClose }) => {
  if (!selectedZone || !serviceCounts[selectedZone]) return null;

  return (
    <div style={{ 
        marginTop: "168px", 
        padding: "10px", 
        border: "1px solid #ccc", 
        borderRadius: "8px", 
        background: "#f9f9f9", 
        position: "absolute", 
        top: "10px", 
        right: "300px", 
        zIndex: 1000 
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h6><b>{selectedZone} Service Wise Cancellation Count</b></h6>
        <button 
          onClick={onClose} 
          style={{ 
            background: "transparent", 
            border: "none", 
            cursor: "pointer", 
            fontSize: "16px", 
            color: "#ff0000" 
          }}>
          &times; {/ Close symbol /}
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "4px", borderBottom: "1px solid #ddd" }}>Service Type</th>
            <th style={{ textAlign: "right", padding: "4px", borderBottom: "1px solid #ddd" }}>Enquiry Cancellation</th>
            <th style={{ textAlign: "right", padding: "4px", borderBottom: "1px solid #ddd" }}>Service Cancellation</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(serviceCounts[selectedZone]).map(serviceType => (
            <tr key={serviceType}>
              <td style={{ padding: "4px", borderBottom: "1px solid #ddd" }}>{serviceType}</td>
              <td style={{ padding: "4px", textAlign: "right", borderBottom: "1px solid #ddd" }}>{serviceCounts[selectedZone][serviceType]["Enquiry Cancellation"] || 0}</td>
              <td style={{ padding: "4px", textAlign: "right", borderBottom: "1px solid #ddd" }}>{serviceCounts[selectedZone][serviceType]["Service Cancellation"] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeafletMap() {
  const [markers, setMarkers] = useState([]);
  const [counts, setCounts] = useState({});
  const [serviceCounts, setServiceCounts] = useState({});
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const { cancellationData } = useAuth();

  const handleCloseServiceDetails = () => {
    setSelectedZone(null);
  };

  useEffect(() => {
    if (cancellationData && cancellationData.Enquiry_and_Service_Can_Data && geojsonData) {
      console.log("cancellationData",cancellationData)
      const defaultLat = 18.501931383099997;
      const defaultLng = 73.83273015224083;
      const markerData = cancellationData.Enquiry_and_Service_Can_Data.map((data) => {
        const lat = data.pt_lattitude ? parseFloat(data.pt_lattitude) : defaultLat;
        const lng = data.pt_langitude ? parseFloat(data.pt_langitude) : defaultLng;
        const event_code = data.event_code;
        const srv_start_date = data.srv_start_date;
        const srv_end_date = data.srv_end_date;
        const session_count = data.session_count;
        const Patient_name = data.Patient_name;
        const pt_phone_no = data.pt_phone_no;
        const service_title = data.service_title;
        const sub_service_title = data.sub_service_title;
        const cancel_type = data.cancel_type;
        const cancel_by = data.cancel_by;
        const cancel_reson = data.cancel_reson;
        const cancellation_date = data.cancellation_date;
  
        if (!isNaN(lat) && !isNaN(lng)) {
          const markerLatLng = L.latLng(lat, lng);
          let zoneName = null;

          const zones = leafletPip.pointInLayer(markerLatLng, L.geoJSON(geojsonData));
          if (zones.length > 0) {
            const matchedZone = zones[0].feature;
            zoneName = matchedZone.properties.NAME_3;
          }

          if (zoneName) {
            return {
              lat,
              lng,
              zone: zoneName,
              cancellationType: data.cancel_type,
              serviceType: data.service_title,
              event_code,
              srv_start_date,
              srv_end_date,
              session_count,
              Patient_name,
              pt_phone_no,
              service_title,
              sub_service_title,
              cancel_type,
              cancel_by,
              cancel_reson,
              cancellation_date,
            };
          } else {
            console.error("Marker not inside any zone: ", data);
            return null;
          }
        } else {
          console.error("Invalid coordinates in row: ", data.name);
          return null;
        }
      }).filter(marker => marker !== null);

      setMarkers(markerData);

      const zoneCounts = {};
      const zoneServiceCounts = {};

      markerData.forEach(marker => {
        const { zone, cancellationType, serviceType } = marker;
      
        // Initialize zone-level cancellation counts if not present
        if (!zoneCounts[zone]) {
          zoneCounts[zone] = { "Enquiry Cancellation": 0, "Service Cancellation": 0 };
        }
      
        // Increment zone-level cancellation counts
        if (cancellationType === "Enquiry Cancel") {
          zoneCounts[zone]["Enquiry Cancellation"] += 1;
        } else if (cancellationType === "Service Cancel") {
          zoneCounts[zone]["Service Cancellation"] += 1;
        }
      
        // Initialize service-level cancellation counts if not present
        if (!zoneServiceCounts[zone]) {
          zoneServiceCounts[zone] = {};
        }
        if (!zoneServiceCounts[zone][serviceType]) {
          zoneServiceCounts[zone][serviceType] = { "Enquiry Cancellation": 0, "Service Cancellation": 0 };
        }
      
        // Increment service-level cancellation counts within the zone
        if (cancellationType === "Enquiry Cancel") {
          zoneServiceCounts[zone][serviceType]["Enquiry Cancellation"] += 1;
        } else if (cancellationType === "Service Cancel") {
          zoneServiceCounts[zone][serviceType]["Service Cancellation"] += 1;
        }
      });

      setCounts(zoneCounts);
      setServiceCounts(zoneServiceCounts);
    }

    else if (cancellationData && cancellationData.Enquiry_Can_Data && geojsonData) {
      console.log("cancellationData",cancellationData)
      const defaultLat = 18.501931383099997;
      const defaultLng = 73.83273015224083;
      const markerData = cancellationData.Enquiry_Can_Data.map((data) => {
        const lat = data.pt_lattitude ? parseFloat(data.pt_lattitude) : defaultLat;
        const lng = data.pt_langitude ? parseFloat(data.pt_langitude) : defaultLng;
        const event_code = data.event_code;
        const srv_start_date = data.srv_start_date;
        const srv_end_date = data.srv_end_date;
        const session_count = data.session_count;
        const Patient_name = data.Patient_name;
        const pt_phone_no = data.pt_phone_no;
        const service_title = data.service_title;
        const sub_service_title = data.sub_service_title;
        const cancel_type = data.cancel_type;
        const cancel_by = data.cancel_by;
        const cancel_reson = data.cancel_reson;
        const cancellation_date = data.cancellation_date;

        if (!isNaN(lat) && !isNaN(lng)) {
          const markerLatLng = L.latLng(lat, lng);
          let zoneName = null;

          const zones = leafletPip.pointInLayer(markerLatLng, L.geoJSON(geojsonData));
          if (zones.length > 0) {
            const matchedZone = zones[0].feature;
            zoneName = matchedZone.properties.NAME_3;
          }

          if (zoneName) {
            return {
              lat,
              lng,
              zone: zoneName,
              cancellationType: data.cancel_type,
              serviceType: data.service_title,
              event_code,
              srv_start_date,
              srv_end_date,
              session_count,
              Patient_name,
              pt_phone_no,
              service_title,
              sub_service_title,
              cancel_type,
              cancel_by,
              cancel_reson,
              cancellation_date
            };
          } else {
            console.error("Marker not inside any zone: ", data);
            return null;
          }
        } else {
          console.error("Invalid coordinates in row: ", data.name);
          return null;
        }
      }).filter(marker => marker !== null);

      setMarkers(markerData);

      const zoneCounts = {};
      const zoneServiceCounts = {};

      markerData.forEach(marker => {
        const { zone, cancellationType, serviceType } = marker;
      
        // Initialize zone-level cancellation counts if not present
        if (!zoneCounts[zone]) {
          zoneCounts[zone] = { "Enquiry Cancellation": 0, "Service Cancellation": 0 };
        }
      
        // Increment zone-level cancellation counts
        if (cancellationType === "Enquiry Cancel") {
          zoneCounts[zone]["Enquiry Cancellation"] += 1;
        } else if (cancellationType === "Service Cancel") {
          zoneCounts[zone]["Service Cancellation"] += 1;
        }
      
        // Initialize service-level cancellation counts if not present
        if (!zoneServiceCounts[zone]) {
          zoneServiceCounts[zone] = {};
        }
        if (!zoneServiceCounts[zone][serviceType]) {
          zoneServiceCounts[zone][serviceType] = { "Enquiry Cancellation": 0, "Service Cancellation": 0 };
        }
      
        // Increment service-level cancellation counts within the zone
        if (cancellationType === "Enquiry Cancel") {
          zoneServiceCounts[zone][serviceType]["Enquiry Cancellation"] += 1;
        } else if (cancellationType === "Service Cancel") {
          zoneServiceCounts[zone][serviceType]["Service Cancellation"] += 1;
        }
      });

      setCounts(zoneCounts);
      setServiceCounts(zoneServiceCounts);
    }

    else if (cancellationData && cancellationData.Service_Can_Data && geojsonData) {
      console.log("cancellationData",cancellationData)
      const defaultLat = 18.501931383099997;
      const defaultLng = 73.83273015224083;
      const markerData = cancellationData.Service_Can_Data.map((data) => {
        const lat = data.pt_lattitude ? parseFloat(data.pt_lattitude) : defaultLat;
        const lng = data.pt_langitude ? parseFloat(data.pt_langitude) : defaultLng;
        const event_code = data.event_code;
        const srv_start_date = data.srv_start_date;
        const srv_end_date = data.srv_end_date;
        const session_count = data.session_count;
        const Patient_name = data.Patient_name;
        const pt_phone_no = data.pt_phone_no;
        const service_title = data.service_title;
        const sub_service_title = data.sub_service_title;
        const cancel_type = data.cancel_type;
        const cancel_by = data.cancel_by;
        const cancel_reson = data.cancel_reson;
        const cancellation_date = data.cancellation_date;
  
        if (!isNaN(lat) && !isNaN(lng)) {
          const markerLatLng = L.latLng(lat, lng);
          let zoneName = null;

          const zones = leafletPip.pointInLayer(markerLatLng, L.geoJSON(geojsonData));
          if (zones.length > 0) {
            const matchedZone = zones[0].feature;
            zoneName = matchedZone.properties.NAME_3;
          }

          if (zoneName) {
            return {
              lat,
              lng,
              zone: zoneName,
              cancellationType: data.cancel_type,
              serviceType: data.service_title,
              event_code,
              srv_start_date,
              srv_end_date,
              session_count,
              Patient_name,
              pt_phone_no,
              service_title,
              sub_service_title,
              cancel_type,
              cancel_by,
              cancel_reson,
              cancellation_date,
            };
          } else {
            console.error("Marker not inside any zone: ", data);
            return null;
          }
        } else {
          console.error("Invalid coordinates in row: ", data.name);
          return null;
        }
      }).filter(marker => marker !== null);

      setMarkers(markerData);

      const zoneCounts = {};
      const zoneServiceCounts = {};

      markerData.forEach(marker => {
        const { zone, cancellationType, serviceType } = marker;
      
        // Initialize zone-level cancellation counts if not present
        if (!zoneCounts[zone]) {
          zoneCounts[zone] = { "Enquiry Cancellation": 0, "Service Cancellation": 0 };
        }
      
        // Increment zone-level cancellation counts
        if (cancellationType === "Enquiry Cancel") {
          zoneCounts[zone]["Enquiry Cancellation"] += 1;
        } else if (cancellationType === "Service Cancel") {
          zoneCounts[zone]["Service Cancellation"] += 1;
        }
      
        // Initialize service-level cancellation counts if not present
        if (!zoneServiceCounts[zone]) {
          zoneServiceCounts[zone] = {};
        }
        if (!zoneServiceCounts[zone][serviceType]) {
          zoneServiceCounts[zone][serviceType] = { "Enquiry Cancellation": 0, "Service Cancellation": 0 };
        }
      
        // Increment service-level cancellation counts within the zone
        if (cancellationType === "Enquiry Cancel") {
          zoneServiceCounts[zone][serviceType]["Enquiry Cancellation"] += 1;
        } else if (cancellationType === "Service Cancel") {
          zoneServiceCounts[zone][serviceType]["Service Cancellation"] += 1;
        }
      });

      setCounts(zoneCounts);
      setServiceCounts(zoneServiceCounts);
    }
  }, [cancellationData, geojsonData]); 

  useEffect(() => {
    fetch('/GeojsonData/Pune_Zone_Boundaries_V1.geojson')
      .then(response => response.json())
      .then(data => {
        setGeojsonData(data);
      })
      .catch(error => {
        console.error("Error loading GeoJSON file:", error);
      });
  }, []);

  const style = (feature) => ({
    color: feature.properties.color || "#ff7800",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.1,
  });

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.NAME_3) {
      layer.bindPopup(feature.properties.NAME_3);
      layer.bindTooltip(feature.properties.NAME_3, { 
        permanent: true,
        direction: "center",
        className: "geojson-tooltip"
      });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{ height: "75vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geojsonData && <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} />}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={createIcon(marker.cancel_type)}>
            <Popup>
            <div>
              <strong>Zone:</strong> {marker.zone}<br/>
              <strong>Event Code:</strong> {marker.event_code}<br/>
              <strong>Service Start Date:</strong> {marker.srv_start_date}<br/>
              <strong>Service End Date:</strong> {marker.srv_end_date}<br/>
              <strong>Session Count:</strong> {marker.session_count}<br/>
              <strong>Patient Name:</strong> {marker.Patient_name}<br/>
              <strong>Phone No:</strong> {marker.pt_phone_no}<br/>
              <strong>Service Title:</strong> {marker.service_title}<br/>
              <strong>Sub Service Title:</strong> {marker.sub_service_title}<br/>
              <strong>Cancellation Type:</strong> {marker.cancel_type}<br/>
              <strong>Cancelled By:</strong> {marker.cancel_by}<br/>
              <strong>Cancellation Reason:</strong> {marker.cancel_reson}<br/>
              <strong>Cancellation Date:</strong> {marker.cancellation_date}<br/>
            </div>
    </Popup>
          </Marker>
        ))}
        <LegendControl counts={counts} onZoneClick={(zone) => setSelectedZone(zone)} />
      </MapContainer>
      <ServiceTypeDetails
        serviceCounts={serviceCounts}
        selectedZone={selectedZone}
        onClose={handleCloseServiceDetails}
      />
    </div>
  );
}

export default LeafletMap;