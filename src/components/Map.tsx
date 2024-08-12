"use client";

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  FaMapMarkerAlt,
  FaFlag,
  FaCrosshairs,
  FaRoute,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

if (typeof window !== "undefined" && !mapboxgl.accessToken) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

interface MapProps {
  isDriver: boolean;
  initialLocation?: [number, number];
  onRouteSelect?: (start: [number, number], end: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({
  isDriver,
  initialLocation = [0, 0],
  onRouteSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const directionsRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = async () => {
      if (!mapboxgl.accessToken) {
        console.error("Mapbox access token is missing");
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [initialLocation[1], initialLocation[0]],
        zoom: 13,
      });

      map.current.on("load", () => {
        setMapLoaded(true);
        console.log("Map loaded successfully");

        directionsRef.current = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: "metric",
          profile: "mapbox/driving",
          alternatives: true,
          geometries: "geojson",
          controls: { instructions: true, profileSwitcher: false },
          flyTo: false,
        });

        map.current!.addControl(directionsRef.current, "top-left");

        if (!isDriver) {
          directionsRef.current.interactive(false);
        }

        directionsRef.current.on("route", (e: any) => {
          if (onRouteSelect && isDriver) {
            const start =
              directionsRef.current.getOrigin().geometry.coordinates;
            const end =
              directionsRef.current.getDestination().geometry.coordinates;
            onRouteSelect(start, end);
          }
        });
      });

      map.current.on("error", (e) => {
        console.error("Mapbox GL Error:", e);
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLocation, isDriver, onRouteSelect]);

  const fitMapToBounds = () => {
    if (!map.current || !directionsRef.current) return;

    const bounds = new mapboxgl.LngLatBounds()
      .extend(directionsRef.current.getOrigin().geometry.coordinates)
      .extend(directionsRef.current.getDestination().geometry.coordinates);

    map.current.fitBounds(bounds, { padding: 50 });
  };

  const centerOnStart = () => {
    if (!map.current || !directionsRef.current) return;
    const origin = directionsRef.current.getOrigin().geometry.coordinates;
    map.current.flyTo({ center: origin, zoom: 15 });
  };

  const centerOnDestination = () => {
    if (!map.current || !directionsRef.current) return;
    const destination =
      directionsRef.current.getDestination().geometry.coordinates;
    map.current.flyTo({ center: destination, zoom: 15 });
  };

  const toggleEditing = () => {
    if (!directionsRef.current) return;
    setIsEditing(!isEditing);
    directionsRef.current.interactive(!isEditing);
  };

  return (
    <div className="map-container bg-white rounded-lg shadow-lg overflow-hidden">
      <div
        ref={mapContainer}
        style={{ height: "500px", width: "100%" }}
        className="rounded-t-lg"
      />
      <div className="map-controls p-4 bg-gray-100 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={centerOnStart}
            className="flex items-center px-4 py-2 bg-[#F9D423] text-gray-800 rounded-lg hover:bg-[#f7c800] transition duration-300"
          >
            <FaMapMarkerAlt className="mr-2" /> Start
          </button>
          <button
            onClick={centerOnDestination}
            className="flex items-center px-4 py-2 bg-[#F96167] text-white rounded-lg hover:bg-[#f84b52] transition duration-300"
          >
            <FaFlag className="mr-2" /> Destination
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fitMapToBounds}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          >
            <FaCrosshairs className="mr-2" /> View All
          </button>
          {isDriver && (
            <button
              onClick={toggleEditing}
              className={`flex items-center px-4 py-2 ${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg transition duration-300`}
            >
              {isEditing ? (
                <>
                  <FaCheck className="mr-2" /> Done
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" /> Edit Route
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
