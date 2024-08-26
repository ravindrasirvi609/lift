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
    coordinates[1] >= -90 &&
    coordinates[1] <= 90 &&
    coordinates[0] >= -180 &&
    coordinates[0] <= 180
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

    // Calculate the bounding box for both start and end locations
    const [startLon, startLat] = startLocation.coordinates;
    const [endLon, endLat] = endLocation.coordinates;
    const minLon = Math.min(startLon, endLon);
    const maxLon = Math.max(startLon, endLon);
    const minLat = Math.min(startLat, endLat);
    const maxLat = Math.max(startLat, endLat);

    // Extend the bounding box by MAX_DISTANCE_KM
    const extendedMinLon = minLon - MAX_DISTANCE_KM / 111.32;
    const extendedMaxLon = maxLon + MAX_DISTANCE_KM / 111.32;
    const extendedMinLat =
      minLat - MAX_DISTANCE_KM / (111.32 * Math.cos(toRadians(minLat)));
    const extendedMaxLat =
      maxLat + MAX_DISTANCE_KM / (111.32 * Math.cos(toRadians(maxLat)));

    const query = {
      departureTime: { $gte: searchDate },
      availableSeats: { $gte: availableSeats },
      status: "Scheduled",
      $or: [
        {
          "startLocation.coordinates": {
            $geoWithin: {
              $box: [
                [extendedMinLon, extendedMinLat],
                [extendedMaxLon, extendedMaxLat],
              ],
            },
          },
        },
        {
          "endLocation.coordinates": {
            $geoWithin: {
              $box: [
                [extendedMinLon, extendedMinLat],
                [extendedMaxLon, extendedMaxLat],
              ],
            },
          },
        },
        {
          "intermediateStops.coordinates": {
            $geoWithin: {
              $box: [
                [extendedMinLon, extendedMinLat],
                [extendedMaxLon, extendedMaxLat],
              ],
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

    const filteredRides = rides.filter((ride) => {
      const startDistance = calculateDistance(
        startLat,
        startLon,
        ride.startLocation.coordinates[1],
        ride.startLocation.coordinates[0]
      );
      const endDistance = calculateDistance(
        endLat,
        endLon,
        ride.endLocation.coordinates[1],
        ride.endLocation.coordinates[0]
      );
      return startDistance <= MAX_DISTANCE_KM || endDistance <= MAX_DISTANCE_KM;
    });

    const updatedRides = await Promise.all(
      filteredRides.map(async (ride) => {
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
