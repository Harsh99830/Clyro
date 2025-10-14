import React from "react";
import { FaHome, FaPhotoVideo, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ isOpen }) {
  return (
    <div
      className={`bg-gray-900 text-gray-200 h-screen transition-all duration-300 ${
        isOpen ? "w-64 p-5 pt-8" : "w-0 p-0 overflow-hidden"
      }`}
    >
      {isOpen && (
        <ul className="space-y-6">
          <li className="flex items-center gap-4 hover:bg-gray-800 rounded-md p-3 cursor-pointer transition">
            <FaHome size={24} />
            <span className="font-medium text-lg">Home</span>
          </li>
          <li className="flex items-center gap-4 hover:bg-gray-800 rounded-md p-3 cursor-pointer transition">
            <FaPhotoVideo size={24} />
            <span className="font-medium text-lg">Gallery</span>
          </li>
          <li className="flex items-center gap-4 hover:bg-gray-800 rounded-md p-3 cursor-pointer transition">
            <FaCog size={24} />
            <span className="font-medium text-lg">Settings</span>
          </li>
          <li className="flex items-center gap-4 hover:bg-gray-800 rounded-md p-3 cursor-pointer transition">
            <FaUser size={24} />
            <span className="font-medium text-lg">Profile</span>
          </li>
          <li className="flex items-center gap-4 hover:bg-gray-800 rounded-md p-3 cursor-pointer transition">
            <FaSignOutAlt size={24} />
            <span className="font-medium text-lg">Logout</span>
          </li>
        </ul>
      )}
    </div>
  );
}
