"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RideTracker from "@/components/RideTracker";

interface DataType {
  _id: string;
  startLocation: {
    city: string;
    coordinates: [number, number];
  };
  endLocation: {
    city: string;
    coordinates: [number, number];
  };
  driver: {
    _id: string;
    fullName: string;
  };
  passenger: {
    _id: string;
    fullName: string;
  };
  status: string;
}

const RidePage = () => {
  const params = useParams();
  const id = params.id as string;
  const [rideData, setRideData] = useState<null | DataType>(null);

  useEffect(() => {
    if (id) {
      // Fetch ride data from your API
      fetch(`/api/ride/${id}`)
        .then((res) => res.json())
        .then((data) => setRideData(data));
    }
  }, [id]);

  if (!rideData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ride Details</h1>
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <p>
          <strong>From:</strong> {rideData.startLocation.city}
        </p>
        <p>
          <strong>To:</strong> {rideData.endLocation.city}
        </p>
        <p>
          <strong>Driver:</strong> {rideData.driver.fullName}
        </p>
        <p>
          <strong>Status:</strong> {rideData.status}
        </p>
      </div>
      <RideTracker
        rideId={id}
        userId={rideData.passenger._id}
        initialLocation={rideData.startLocation.coordinates}
        destination={rideData.endLocation.coordinates}
      />
    </div>
  );
};

export default RidePage;
