import { connect } from "@/dbConfig/dbConfig";
import Ride from "@/Models/rideModel";
import User from "@/Models/userModel";
import { NextResponse } from "next/server";

const MAX_DISTANCE_KM = 10; // Maximum distance in kilometers for nearby searches

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isValidCoordinate(coordinates: number[]): boolean {
  return (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number" &&
    !isNaN(coordinates[0]) &&
    !isNaN(coordinates[1]) &&
    coordinates[0] >= -180 &&
    coordinates[0] <= 180 &&
    coordinates[1] >= -90 &&
    coordinates[1] <= 90
  );
}

export async function POST(req: Request) {
  try {
    await connect();
    const { payload } = await req.json();
    const { startLocation, endLocation, departureTime, availableSeats } =
      payload;

    if (
      !startLocation ||
      !endLocation ||
      !departureTime ||
      availableSeats == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields in the payload" },
        { status: 400 }
      );
    }

    if (
      !isValidCoordinate(startLocation.coordinates) ||
      !isValidCoordinate(endLocation.coordinates)
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates provided" },
        { status: 400 }
      );
    }

    const searchDate = new Date(departureTime);
    searchDate.setHours(0, 0, 0, 0);

    const [startLon, startLat] = startLocation.coordinates;
    const [endLon, endLat] = endLocation.coordinates;

    const query = {
      departureTime: { $gte: searchDate },
      availableSeats: { $gte: availableSeats },
      status: "Scheduled",
      $or: [
        {
          "startLocation.coordinates": {
            $geoWithin: {
              $centerSphere: [[startLon, startLat], MAX_DISTANCE_KM / 6371],
            },
          },
        },
        {
          "endLocation.coordinates": {
            $geoWithin: {
              $centerSphere: [[endLon, endLat], MAX_DISTANCE_KM / 6371],
            },
          },
        },
        {
          "intermediateStops.coordinates": {
            $geoWithin: {
              $centerSphere: [[startLon, startLat], MAX_DISTANCE_KM / 6371],
            },
          },
        },
        {
          "intermediateStops.coordinates": {
            $geoWithin: {
              $centerSphere: [[endLon, endLat], MAX_DISTANCE_KM / 6371],
            },
          },
        },
      ],
    };

    const rides = await Ride.find(query)
      .select(
        "startLocation endLocation intermediateStops departureTime availableSeats status price vehicle"
      )
      .populate({
        path: "driver",
        model: User,
        select:
          "firstName lastName email profilePicture driverVerificationStatus driverRating",
      })
      .sort({ departureTime: 1 });

    const updatedRides = await Promise.all(
      rides.map(async (ride) => {
        const updatedDriver = await User.findById(ride.driver._id);
        await updatedDriver.updateRatings();
        ride.driver = updatedDriver;
        return {
          ...ride.toObject(),
          startDistance: calculateDistance(
            startLat,
            startLon,
            ride.startLocation.coordinates[1],
            ride.startLocation.coordinates[0]
          ),
          endDistance: calculateDistance(
            endLat,
            endLon,
            ride.endLocation.coordinates[1],
            ride.endLocation.coordinates[0]
          ),
        };
      })
    );

    if (updatedRides.length === 0) {
      return NextResponse.json(
        { rides: [], message: "No rides found matching the criteria" },
        { status: 200 }
      );
    }

    return NextResponse.json({ rides: updatedRides }, { status: 200 });
  } catch (error) {
    console.error("Error in ride search:", error);
    return NextResponse.json(
      { error: "Failed to search for rides" },
      { status: 500 }
    );
  }
}
