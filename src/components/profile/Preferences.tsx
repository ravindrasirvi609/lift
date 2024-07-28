import { User } from "@/types/types";
import React from "react";

interface PreferencesProps {
  user: User;
}

const Preferences: React.FC<PreferencesProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
      <div className="space-y-4">
        <div>
          <span className="font-medium">Preferred Language:</span>
          <span className="ml-2">{user.preferredLanguage}</span>
        </div>
        <div>
          <span className="font-medium mb-2 block">
            Notification Preferences:
          </span>
          <div className="space-y-2">
            <NotificationToggle
              label="Email"
              checked={user.notificationPreferences.email}
            />
            <NotificationToggle
              label="SMS"
              checked={user.notificationPreferences.sms}
            />
            <NotificationToggle
              label="Push Notifications"
              checked={user.notificationPreferences.push}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationToggle: React.FC<{ label: string; checked: boolean }> = ({
  label,
  checked,
}) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} readOnly />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? "bg-[#F96167]" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <span className="ml-3 text-gray-700">{label}</span>
  </label>
);

export default Preferences;
