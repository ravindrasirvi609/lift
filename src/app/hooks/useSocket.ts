// src/app/hooks/useSocket.ts
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const socketInstance = io("", {
        path: "/api/socket",
        addTrailingSlash: false,
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  return { socket, isConnected };
};
