"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  currentLocation: [number, number];
  destination: [number, number];
}

function ChangeView({
  center,
  currentLocation,
  destination,
}: {
  center: [number, number];
  currentLocation: [number, number];
  destination: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
    map.fitBounds([currentLocation, destination], { padding: [50, 50] });
  }, [center, currentLocation, destination, map]);
  return null;
}

const Map: React.FC<MapProps> = ({ currentLocation, destination }) => {
  const center = currentLocation;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-lg"
    >
      <ChangeView
        center={center}
        currentLocation={currentLocation}
        destination={destination}
      />
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

export default Map;
