// src/components/Map.tsx
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), { ssr: false });

interface MapProps {
  currentLocation: [number, number];
  destination: [number, number];
}

const Map: React.FC<MapProps> = ({ currentLocation, destination }) => {
  return (
    <DynamicMap currentLocation={currentLocation} destination={destination} />
  );
};

export default Map;
