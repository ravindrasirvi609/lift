import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGO_URI!);
      const connection = mongoose.connection;

      connection.on("connected", () => {
        isConnected = true;
        console.log("MongoDB connected successfully");
      });

      connection.on("error", (err) => {
        console.log(
          "MongoDB connection error. Please make sure MongoDB is running. " +
            err
        );
        process.exit();
      });
    } else {
      // Improved: Return a resolved promise for already connected case
      return Promise.resolve();
    }
  } catch (error) {
    console.log("Something goes wrong!");
    console.log(error);
  }
}
