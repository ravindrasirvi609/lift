import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("join-ride", (rideId: string) => {
        socket.join(rideId);
        console.log(`Client joined ride: ${rideId}`);
      });

      socket.on("update-location", ({ rideId, location }) => {
        io.to(rideId).emit("location-updated", { rideId, location });
      });

      socket.on("send-message", ({ rideId, message }) => {
        io.to(rideId).emit("new-message", { rideId, message });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  res.end();
};

export default SocketHandler;
