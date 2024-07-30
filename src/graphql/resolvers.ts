import User from "../Models/userModel";
import Ride from "../Models/rideModel";
import Booking from "../Models/bookingModel";
import Review from "../Models/reviewModel";

export const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }) => await User.findById(id),
    users: async () => await User.find(),
    ride: async (_: any, { id }: { id: string }) => await Ride.findById(id),
    rides: async (_: any, { userId }: { userId?: string }) => {
      if (userId) {
        const user = await User.findById(userId);
        if (user.isDriver) {
          return await Ride.find({ driver: userId });
        } else {
          const bookings = await Booking.find({ passenger: userId });
          const rideIds = bookings.map((booking) => booking.ride);
          return await Ride.find({ _id: { $in: rideIds } });
        }
      }
      return await Ride.find();
    },
    booking: async (_: any, { id }: { id: string }) =>
      await Booking.findById(id),
    bookings: async () => await Booking.find(),
    review: async (_: any, { id }: { id: string }) => await Review.findById(id),
    reviews: async (_: any, { userId }: { userId: string }) =>
      await Review.find({ reviewed: userId }).populate("reviewer"),
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: any }) => {
      const user = new User(input);
      await user.save();
      return user;
    },
    createRide: async (_: any, { input }: { input: any }) => {
      const ride = new Ride(input);
      await ride.save();
      return ride;
    },
    createBooking: async (_: any, { input }: { input: any }) => {
      const booking = new Booking(input);
      await booking.save();
      return booking;
    },

    createReview: async (_: any, { input }: { input: any }) => {
      const review = new Review(input);
      await review.save();
      return review;
    },
  },
  Ride: {
    id: (parent: { _id: any }) => parent._id,
    driver: async (parent: { driver: any }) =>
      await User.findById(parent.driver),
  },
  Booking: {
    id: (parent: { _id: any }) => parent._id,
    ride: async (parent: { ride: any }) => await Ride.findById(parent.ride),
    passenger: async (parent: { passenger: any }) =>
      await User.findById(parent.passenger),
  },
  Review: {
    id: (parent: { _id: any }) => parent._id,
    reviewer: async (parent: { reviewer: any }) =>
      await User.findById(parent.reviewer),
    reviewed: async (parent: { reviewed: any }) =>
      await User.findById(parent.reviewed),
    ride: async (parent: { ride: any }) => await Ride.findById(parent.ride),
  },
  User: {
    id: (parent: { _id: any }) => parent._id,
  },
};
