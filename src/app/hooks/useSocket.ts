import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface Notification {
  id?: string;
  message: string;
  type?:
    | "ride_request"
    | "ride_accepted"
    | "ride_cancelled"
    | "payment_received"
    | "system_alert";
  bookingId?: string;
  rideId?: string;
  timestamp?: string;
}

export const useSocket = (userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        path: "/api/socket",
        transports: ["websocket", "polling"],
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      if (userId) socketInstance.emit("join-user", userId);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketInstance.on("new-notification", (notification: Notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [...prev, notification]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  const sendNotification = useCallback(
    (targetUserId: string, notification: Notification) => {
      if (socket) {
        socket.emit("send-notification", {
          userId: targetUserId,
          notification,
        });
      }
    },
    [socket]
  );

  const joinRide = useCallback(
    (bookingId: string) => {
      if (socket) {
        socket.emit("join-ride", bookingId);
      }
    },
    [socket]
  );

  const leaveRide = useCallback(
    (bookingId: string) => {
      if (socket) {
        socket.emit("leave-ride", bookingId);
      }
    },
    [socket]
  );

  const updateLocation = useCallback(
    (bookingId: string, location: { lat: number; lng: number }) => {
      if (socket) {
        socket.emit("update-location", { bookingId, location });
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (bookingId: string, message: string) => {
      if (socket) {
        socket.emit("send-message", { bookingId, message });
      }
    },
    [socket]
  );

  const performBookingAction = useCallback(
    (bookingId: string, action: string, passengerId: string) => {
      if (socket) {
        socket.emit("booking-action", { bookingId, action, passengerId });
      }
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    notifications,
    sendNotification,
    joinRide,
    leaveRide,
    updateLocation,
    sendMessage,
    performBookingAction,
  };
};
