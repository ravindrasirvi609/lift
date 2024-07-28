import { User } from "@/types/types";
import React from "react";
import { FaCar, FaStar, FaRoute, FaMoneyBillWave } from "react-icons/fa";

interface DriverInfoProps {
  user: User;
}

const DriverInfo: React.FC<DriverInfoProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Driver Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem
          icon={<FaCar className="text-2xl text-[#F96167]" />}
          label="Vehicle"
          value={`${user.vehicleInfo.make} ${user.vehicleInfo.model} (${user.vehicleInfo.year})`}
        />
        <InfoItem
          icon={<FaStar className="text-2xl text-[#F96167]" />}
          label="Driver Rating"
          value={`${user.driverRating.toFixed(1)} / 5`}
        />
        <InfoItem
          icon={<FaRoute className="text-2xl text-[#F96167]" />}
          label="Total Rides"
          value={user.totalRidesAsDriver.toString()}
        />
        <InfoItem
          icon={<FaMoneyBillWave className="text-2xl text-[#F96167]" />}
          label="Total Earnings"
          value={`$${user.earnings.toFixed(2)}`}
        />
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span className="font-medium">Availability Status:</span>
        <ToggleSwitch
          checked={user.driverAvailabilityStatus === "Available"}
          onChange={() => {
            /* Implement status change logic */
          }}
        />
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon}
    <div className="ml-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? "bg-green-400" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <span className="ml-3 text-gray-700">
      {checked ? "Available" : "Unavailable"}
    </span>
  </label>
);

export default DriverInfo;
