import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      socketInstance.emit("join-user", userId);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketInstance.on("new-notification", (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prev) => [...prev, notification]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  const sendNotification = useCallback(
    (targetUserId: string, notification: any) => {
      if (socket) {
        socket.emit("send-notification", {
          userId: targetUserId,
          notification,
        });
      }
    },
    [socket]
  );

  return { socket, isConnected, notifications, sendNotification };
};
