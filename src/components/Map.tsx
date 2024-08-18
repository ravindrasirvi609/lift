"use client";

import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaSearchLocation, FaRoute } from "react-icons/fa";

if (typeof window !== "undefined" && !mapboxgl.accessToken) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

interface LocationAddress {
  coordinates: [number, number];
  address: string;
  dateTime?: string;
}

interface MapProps {
  tripInfo: {
    startLocation: LocationAddress;
    endLocation: LocationAddress;
    intermediateStops: LocationAddress[];
  };
  onLocationSelect: (
    field: "startLocation" | "endLocation" | "intermediateStops",
    value: LocationAddress,
    index?: number
  ) => void;
}

const Map: React.FC<MapProps> = ({ tripInfo, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 2,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      console.log("Map loaded");
    });

    map.current.on("click", handleMapClick);

    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick);
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    updateRoute();
  }, [mapLoaded, tripInfo]);

  const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
    if (!selectedLocation || !map.current) return;

    const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    const address = await reverseGeocode(coordinates);

    const locationData: LocationAddress = { coordinates, address };

    if (selectedLocation === "intermediateStop") {
      onLocationSelect(
        "intermediateStops",
        locationData,
        tripInfo.intermediateStops.length
      );
    } else {
      onLocationSelect(
        selectedLocation as "startLocation" | "endLocation",
        locationData
      );
    }

    setSelectedLocation(null);
    updateRoute();
  };

  const reverseGeocode = async (
    coordinates: [number, number]
  ): Promise<string> => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.features[0].place_name;
  };

  const updateRoute = async () => {
    if (!map.current) return;

    // Clear previous layers and sources
    if (map.current.getLayer("route")) map.current.removeLayer("route");
    if (map.current.getSource("route")) map.current.removeSource("route");

    const { startLocation, endLocation, intermediateStops } = tripInfo;

    // Prepare waypoints
    const waypoints = intermediateStops.map((stop) =>
      stop.coordinates.join(",")
    );
    const waypointsString =
      waypoints.length > 0 ? `;${waypoints.join(";")}` : "";

    // Fetch route
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLocation.coordinates.join(
      ","
    )}${waypointsString};${endLocation.coordinates.join(
      ","
    )}?geometries=geojson&overview=full&steps=true&access_token=${
      mapboxgl.accessToken
    }`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;

        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#4a90e2",
            "line-width": 4,
            "line-opacity": 0.75,
          },
        });

        // Fit map to the route
        const coordinates = route.coordinates as [number, number][];
        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord as mapboxgl.LngLatLike),
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.current.fitBounds(bounds, { padding: 50 });

        // Add markers
        addMarker(startLocation.coordinates, "start");
        addMarker(endLocation.coordinates, "end");
        intermediateStops.forEach((stop, index) =>
          addMarker(stop.coordinates, `stop-${index}`)
        );
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const addMarker = (coordinates: [number, number], type: string) => {
    if (!map.current) return;

    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = `url(/${type}-marker.png)`; // Ensure you have these images in your public folder
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.backgroundSize = "cover";

    new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map.current);
  };

  const fitMapToRoute = () => {
    if (!map.current) return;
    updateRoute();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <div ref={mapContainer} className="h-[400px] w-full rounded-t-lg" />

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={fitMapToRoute}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Fit map to route"
        >
          <FaRoute className="text-gray-700" size={20} />
        </button>
      </div>
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <FaSearchLocation className="inline mr-2" />
          {tripInfo.startLocation.address} to {tripInfo.endLocation.address}
        </div>
        <div className="text-sm text-gray-600">
          {tripInfo.intermediateStops.length} stops
        </div>
      </div>
    </div>
  );
};

export default Map;
