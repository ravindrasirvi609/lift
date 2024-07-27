import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface DynamicMapProps {
  currentLocation: [number, number];
  destination: [number, number];
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  currentLocation,
  destination,
}) => {
  const [mapCenter, setMapCenter] = useState(currentLocation);

  const currentLocationIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const destinationIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "500px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={currentLocation} icon={currentLocationIcon}>
          <Popup>Current Location</Popup>
        </Marker>
        <Marker position={destination} icon={destinationIcon}>
          <Popup>Destination</Popup>
        </Marker>
        <Polyline positions={[currentLocation, destination]} color="blue" />
      </MapContainer>
      <div className="map-controls">
        <button onClick={() => setMapCenter(currentLocation)}>
          Current Location
        </button>
        <button onClick={() => setMapCenter(destination)}>Destination</button>
      </div>
    </div>
  );
};

export default DynamicMap;
