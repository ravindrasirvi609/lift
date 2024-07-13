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
export interface Ride {
  _id: string;
  driver: Driver;
  vehicle: string;
  startLocation: Location;
  endLocation: Location;
  startAddress: string;
  endAddress: string;
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number;
  price: number;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

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

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  dateOfBirth: Date;
  gender: string;
  isVerified: boolean;
  isAdmin: boolean;
  passengerRating: number;
  totalRidesAsTakenPassenger: number;
  isDriver: boolean;
  driverVerificationStatus: string;
  driverLicense: string;
  vehicleInfo: string;
  driverRating: number;
  totalRidesAsDriver: number;
  driverAvailabilityStatus: string;
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
}
