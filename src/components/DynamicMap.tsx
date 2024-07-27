// src/components/DynamicMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface DynamicMapProps {
  currentLocation: [number, number];
  destination: [number, number];
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  currentLocation,
  destination,
}) => {
  return (
    <MapContainer
      center={currentLocation}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={currentLocation}>
        <Popup>Current Location</Popup>
      </Marker>
      <Marker position={destination}>
        <Popup>Destination</Popup>
      </Marker>
    </MapContainer>
  );
};

export default DynamicMap;
