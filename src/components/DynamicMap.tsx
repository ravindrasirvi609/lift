import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaFlag, FaCrosshairs } from "react-icons/fa";

interface DynamicMapProps {
  rideId: string;
  initialLocation: [number, number];
  destination: [number, number];
  currentLocation: [number, number];
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  rideId,
  initialLocation,
  destination,
  currentLocation,
}) => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(initialLocation);
  const [zoomLevel, setZoomLevel] = useState(13);

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

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(mapCenter, zoomLevel);
    }, [mapCenter, zoomLevel]);
    return null;
  };

  return (
    <div className="map-container bg-white rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "500px", width: "100%" }}
        className="rounded-t-lg"
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
        <Polyline
          positions={[currentLocation, destination]}
          color="#F96167"
          weight={4}
        />
        <MapUpdater />
      </MapContainer>
      <div className="map-controls p-4 bg-gray-100 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setMapCenter(currentLocation);
              setZoomLevel(15);
            }}
            className="flex items-center px-4 py-2 bg-[#F9D423] text-gray-800 rounded-lg hover:bg-[#f7c800] transition duration-300"
          >
            <FaMapMarkerAlt className="mr-2" /> Current
          </button>
          <button
            onClick={() => {
              setMapCenter(destination);
              setZoomLevel(15);
            }}
            className="flex items-center px-4 py-2 bg-[#F96167] text-white rounded-lg hover:bg-[#f84b52] transition duration-300"
          >
            <FaFlag className="mr-2" /> Destination
          </button>
        </div>
        <button
          onClick={() => {
            const bounds = [currentLocation, destination];
            setMapCenter([
              (bounds[0][0] + bounds[1][0]) / 2,
              (bounds[0][1] + bounds[1][1]) / 2,
            ]);
            setZoomLevel(12);
          }}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
        >
          <FaCrosshairs className="mr-2" /> View All
        </button>
      </div>
    </div>
  );
};

export default DynamicMap;
