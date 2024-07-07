import React from "react";
import AvailableRides from "@/components/AvailableRides";

const rides = [
  {
    id: "1",
    driver: {
      id: "d1",
      name: "John Doe",
      image: "https://example.com/driver1.jpg",
      isVerified: true,
      rating: 4.7,
    },
    travelTime: "2 hours 30 minutes",
    price: 250,
    departureTime: "Today at 5:00 PM",
    availableSeats: 3,
  },
];

const Rides = () => {
  return (
    <div>
      {" "}
      <AvailableRides rides={rides} />
    </div>
  );
};

export default Rides;
