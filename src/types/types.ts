// Location interface
export interface Location {
  coordinates: [number, number];
  city: string;
  region: string;
  locationId: string;
  address: string;
}

// SearchParams interface
export interface SearchParams {
  departure: Location;
  destination: Location;
  date: string;
  passengerCount: number;
}

// Driver interface
export interface Driver {
  _id: string;
  name: string;
  image: string;
  isVerified: boolean;
  rating: number;
}

// Ride interface

// AutocompleteInputProps interface
export interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (value: Location) => void;
}

// RideSearchProps interface
export interface RideSearchProps {
  onSearch: (params: SearchParams) => void;
}

// RidesProps interface
export interface RidesProps {
  rides: Ride[];
  loading: boolean;
  error: string | null;
}

// types.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  dateOfBirth: Date;
  gender: string;
  isVerified: boolean;
  isAdmin: boolean;
  isDriver: boolean;
  totalRidesAsTakenPassenger: number;
  totalDistanceTraveled: number;
  driverVerificationStatus: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  totalRidesAsDriver: number;
  driverAvailabilityStatus: string;
  passengerRating: number;
  driverRating: number;
  earnings: number;
  bankAccountInfo: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    ifscCode: string;
  };
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  [key: string]: any;
}

export interface Review {
  _id: string;
  reviewer: User;
  reviewed: User;
  ride: Ride;
  rating: number;
  driverRating?: number;
  vehicleRating?: number;
  punctualityRating?: number;
  comment: string;
  reviewerRole: "passenger" | "driver";
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface Ride {
  _id: string;
  driver: User;
  vehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  startLocation: {
    coordinates: [number, number];
    city: string;
    address: string;
  };
  endLocation: {
    coordinates: [number, number];
    city: string;
    address: string;
  };
  departureTime: Date;
  actualArrivalTime?: Date;
  price: number;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  distance: number;
  duration: number;
}
