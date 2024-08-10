"use client";

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt, FaFlag, FaCrosshairs, FaRoute } from "react-icons/fa";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

if (typeof window !== "undefined" && !mapboxgl.accessToken) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

interface DynamicMapProps {
  rideId: string;
  initialLocation: [number, number];
  destination: [number, number];
  currentLocation: [number, number];
  onRouteUpdate?: (route: any) => void;
}

const DynamicMap: React.FC<DynamicMapProps> = ({
  rideId,
  initialLocation,
  destination,
  currentLocation,
  onRouteUpdate,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const directionsRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

        // Initialize MapboxDirections
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

        // Set initial route
        directionsRef.current.setOrigin([
          currentLocation[1],
          currentLocation[0],
        ]);
        directionsRef.current.setDestination([destination[1], destination[0]]);

        // Listen for route updates
        directionsRef.current.on("route", (e: any) => {
          if (onRouteUpdate) {
            onRouteUpdate(e.route[0]);
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
  }, [initialLocation, destination, currentLocation]);

  const fitMapToBounds = () => {
    if (!map.current || !directionsRef.current) return;

    const bounds = new mapboxgl.LngLatBounds()
      .extend(directionsRef.current.getOrigin().geometry.coordinates)
      .extend(directionsRef.current.getDestination().geometry.coordinates);

    map.current.fitBounds(bounds, { padding: 50 });
  };

  const centerOnCurrentLocation = () => {
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

  const updateRoute = () => {
    if (!directionsRef.current) return;
    directionsRef.current.setOrigin([currentLocation[1], currentLocation[0]]);
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
            onClick={centerOnCurrentLocation}
            className="flex items-center px-4 py-2 bg-[#F9D423] text-gray-800 rounded-lg hover:bg-[#f7c800] transition duration-300"
          >
            <FaMapMarkerAlt className="mr-2" /> Current
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
          <button
            onClick={updateRoute}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            <FaRoute className="mr-2" /> Update Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicMap;
