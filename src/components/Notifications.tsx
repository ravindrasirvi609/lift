"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useSocket } from "@/app/hooks/useSocket";
import React, { useState, useEffect, useCallback } from "react";
import {
  FaBell,
  FaTimes,
  FaCheck,
  FaCar,
  FaUser,
  FaExclamationCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

interface Notification {
  _id: string;
  type:
    | "ride_request"
    | "ride_accepted"
    | "ride_cancelled"
    | "payment_received"
    | "system_alert";
  message: string;
  time: string;
  read: boolean;
  bookingId?: string;
}

const NotificationIcon: React.FC<{ type: Notification["type"] }> = ({
  type,
}) => {
  const iconMap = {
    ride_request: <FaCar className="text-blue-500" />,
    ride_accepted: <FaCheck className="text-green-500" />,
    ride_cancelled: <FaTimes className="text-red-500" />,
    payment_received: <FaUser className="text-purple-500" />,
    system_alert: <FaExclamationCircle className="text-yellow-500" />,
  };
  return iconMap[type] || null;
};

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { socket, isConnected } = useSocket(user?.id || "");

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/notifications/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data.notifications);
      updateUnreadCount(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    }
  }, [user?.id]);

  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (socket && user) {
      const handleNewNotification = (newNotification: Notification) => {
        setNotifications((prev) => {
          const updatedNotifications = [newNotification, ...prev];
          updateUnreadCount(updatedNotifications);
          return updatedNotifications;
        });
        toast.success(newNotification.message);
      };

      socket.on("new-notification", handleNewNotification);

      return () => {
        socket.off("new-notification", handleNewNotification);
      };
    }
  }, [socket, user]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });

      if (!response.ok) throw new Error("Failed to mark notification as read");
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        );
        updateUnreadCount(updatedNotifications);
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
      const response = await fetch(`/api/notifications/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });
      if (!response.ok)
        throw new Error("Failed to mark all notifications as read");
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((n) => ({
          ...n,
          read: true,
        }));
        updateUnreadCount(updatedNotifications);
        return updatedNotifications;
      });
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-[#F96167] transition duration-300"
        aria-label="Notifications"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform  -translate-y-1/2 bg-[#F96167] rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#F96167] hover:text-[#F96167]/80 transition duration-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b last:border-b-0 ${
                    notification.read ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition duration-300 ease-in-out`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="ml-3 flex-1">
                      <p
                        className={`text-sm ${
                          notification.read
                            ? "text-gray-600"
                            : "text-gray-900 font-medium"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="ml-2 text-xs text-[#F96167] hover:text-[#F96167]/80 transition duration-300"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t bg-gray-50">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-[#F9D423] text-[#F96167] rounded-lg hover:bg-[#F9D423]/80 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
