import { User } from "@/types/types";
import React from "react";
import { motion } from "framer-motion";
import {
  FaLanguage,
  FaBell,
  FaEnvelope,
  FaSms,
  FaMobileAlt,
} from "react-icons/fa";

interface PreferencesProps {
  user: User;
}

const Preferences: React.FC<PreferencesProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#F96167] border-b-2 border-yellow-400 pb-4 flex items-center">
        <FaBell className="mr-3" /> Preferences
      </h2>
      <div className="space-y-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <FaLanguage className="mr-2 text-[#F96167]" /> Preferred Language
          </h3>
          <span className="text-lg text-gray-700">
            {user.preferredLanguage}
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <FaBell className="mr-2 text-[#F96167]" /> Notification Preferences
          </h3>
          <div className="space-y-4">
            <NotificationToggle
              icon={<FaEnvelope />}
              label="Email"
              checked={user.notificationPreferences.email}
            />
            <NotificationToggle
              icon={<FaSms />}
              label="SMS"
              checked={user.notificationPreferences.sms}
            />
            <NotificationToggle
              icon={<FaMobileAlt />}
              label="Push Notifications"
              checked={user.notificationPreferences.push}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const NotificationToggle: React.FC<{
  icon: React.ReactNode;
  label: string;
  checked: boolean;
}> = ({ icon, label, checked }) => (
  <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center">
      <span className="text-[#F96167] mr-3">{icon}</span>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} readOnly />
      <div
        className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
          checked ? "bg-[#F96167]" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
  </label>
);

export default Preferences;
