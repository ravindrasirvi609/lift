import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    profilePicture: String
    dateOfBirth: String!
    gender: String
    isVerified: Boolean!
    isAdmin: Boolean!
    verifyToken: String
    verifyTokenExpiry: String
    forgotPasswordToken: String
    forgotPasswordTokenExpiry: String
    totalRidesAsTakenPassenger: Int!
    totalDistanceTraveled: Float!
    reviewsGiven: [Review!]!
    reviewsReceived: [Review!]!
    isDriver: Boolean!
    driverVerificationStatus: String!
    driverLicense: DriverLicense
    vehicleInfo: VehicleInfo
    totalRidesAsDriver: Int!
    driverAvailabilityStatus: String!
    passengerRating: Float
    driverRating: Float
    earnings: Float!
    bankAccountInfo: BankAccountInfo
    preferredLanguage: String!
    notificationPreferences: NotificationPreferences
    ridePreferences: RidePreferences
    emergencyContact: EmergencyContact
    safetyRating: Float!
    verifiedBadges: [String!]!
    loyaltyPoints: Int!
    membershipTier: String!
    currentLocation: Location!
    activeRideId: ID
    createdAt: String!
    updatedAt: String!
    lastLoginAt: String
    fullName: String!
  }

  type DriverLicense {
    requestId: String
    number: String
    expirationDate: String
    state: String
    documentUrl: String
  }

  type VehicleInfo {
    make: String
    model: String
    year: Int
    color: String
    licensePlate: String
    verificationResult: String
    capacity: Int
    features: [String!]
  }

  type BankAccountInfo {
    accountNumber: String
    bankName: String
    accountHolderName: String
    ifscCode: String
  }

  type NotificationPreferences {
    email: Boolean!
    sms: Boolean!
    push: Boolean!
  }

  type RidePreferences {
    musicPreference: String
    temperaturePreference: Float
    chatPreference: String
  }

  type EmergencyContact {
    name: String
    relationship: String
    phoneNumber: String
  }

  type Location {
    type: String!
    coordinates: [Float!]!
    address: String
  }

  type Ride {
    id: ID!
    driver: User!
    vehicle: Vehicle
    startLocation: Location!
    endLocation: Location!
    waypoints: [Waypoint!]
    departureTime: String!
    estimatedArrivalTime: String
    actualDepartureTime: String
    actualArrivalTime: String
    totalSeats: Int!
    availableSeats: Int!
    price: Float!
    pricePerSeat: Float
    status: String!
    distance: Float
    duration: Float
    route: String
    allowedLuggage: String
    amenities: [String!]
    bookings: [Booking!]!
    totalEarnings: Float!
    cancellationReason: String
    notes: String
    currentLocation: Location!
    messages: [Message!]
    createdAt: String!
    updatedAt: String!
  }

  type Vehicle {
    type: String
    make: String
    model: String
    year: Int
    color: String
    licensePlate: String
  }

  type Waypoint {
    type: String!
    coordinates: [Float!]
    address: String
  }

  type Message {
    sender: User!
    content: String!
    timestamp: String!
  }

  type Booking {
    id: ID!
    ride: Ride!
    passenger: User!
    numberOfSeats: Int!
    status: String!
    price: Float!
    pickupLocation: Location!
    dropoffLocation: Location!
  }

  type Review {
    id: ID!
    reviewer: User!
    reviewed: User!
    ride: Ride!
    rating: Int!
    driverRating: Int
    vehicleRating: Int
    punctualityRating: Int
    comment: String
    reviewerRole: String!
    status: String!
    isEdited: Boolean!
    lastEditedAt: String
    helpfulVotes: Int!
    createdAt: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    ride(id: ID!): Ride
    booking(id: ID!): Booking
    bookings: [Booking!]!
    review(id: ID!): Review
    reviews(userId: ID!): [Review!]!
    rides(userId: ID): [Ride!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createRide(input: CreateRideInput!): Ride!
    createBooking(input: CreateBookingInput!): Booking!
    createReview(input: CreateReviewInput!): Review!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phoneNumber: String!
    dateOfBirth: String!
  }

  input CreateRideInput {
    driverId: ID!
    vehicle: VehicleInput!
    startLocation: LocationInput!
    endLocation: LocationInput!
    waypoints: [WaypointInput!]
    departureTime: String!
    totalSeats: Int!
    price: Float!
    pricePerSeat: Float
    allowedLuggage: String
    amenities: [String!]
  }

  input VehicleInput {
    type: String
    make: String
    model: String
    year: Int
    color: String
    licensePlate: String
  }

  input WaypointInput {
    type: String!
    coordinates: [Float!]!
    address: String
  }

  input CreateBookingInput {
    rideId: ID!
    passengerId: ID!
    numberOfSeats: Int!
    pickupLocation: LocationInput!
    dropoffLocation: LocationInput!
  }

  input CreateReviewInput {
    reviewerId: ID!
    reviewedId: ID!
    rideId: ID!
    rating: Int!
    driverRating: Int
    vehicleRating: Int
    punctualityRating: Int
    comment: String
    reviewerRole: String!
  }

  input LocationInput {
    type: String!
    coordinates: [Float!]!
    address: String
  }
`;
