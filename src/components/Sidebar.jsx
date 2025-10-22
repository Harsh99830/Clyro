import React, { useState } from "react";
import {
  FaHome,
  FaPhotoVideo,
  FaCog,
  FaUser,
  FaArrowLeft,
  FaCamera,
  FaTimes
} from "react-icons/fa";
import { SignOutButton } from "@clerk/clerk-react";
import FaceRecognition from "./FaceRecognition";

export default function Sidebar({ isOpen }) {
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);

  return (
    <div
      className={`fixed h-screen bg-gray-800 text-gray-200 transition-all duration-300 z-20 shadow-2xl flex flex-col ${
        isOpen
          ? `${window.innerWidth < 1024 ? 'w-52' : 'w-64'}`
          : 'w-0 overflow-hidden'
      }`}
    >
      <div className="overflow-y-auto flex-1">
        <ul className="space-y-2 p-4">
          <li className="flex items-center gap-3 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer transition-colors duration-200">
            <FaHome className="text-gray-300" size={20} />
            <span className="font-medium text-gray-100">Home</span>
          </li>

          <li className="flex items-center gap-3 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer transition-colors duration-200">
            <FaPhotoVideo className="text-gray-300" size={20} />
            <span className="font-medium text-gray-100">Gallery</span>
          </li>

          <li className="flex items-center gap-3 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer transition-colors duration-200">
            <FaCog className="text-gray-300" size={20} />
            <span className="font-medium text-gray-100">Settings</span>
          </li>

          <li className="flex items-center gap-3 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer transition-colors duration-200">
            <FaUser className="text-gray-300" size={20} />
            <span className="font-medium text-gray-100">Profile</span>
          </li>

          <li className="border-t border-gray-700 my-2"></li>

          <li className="flex items-center gap-3 hover:bg-red-500/20 hover:text-red-400 rounded-lg p-3 cursor-pointer transition-colors duration-200 group">
            <SignOutButton redirectUrl="/">
              <span className="font-medium text-red-400 group-hover:text-red-300">Logout</span>
            </SignOutButton>
          </li>
        </ul>

        {/* Face Recognition Section */}
        <div className="mt-auto px-4 pb-4">
          <button
            onClick={() => setShowFaceRecognition(!showFaceRecognition)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors mb-3"
          >
            {showFaceRecognition ? (
              <>
                <FaTimes className="text-red-400" />
                <span>Hide Face Recognition</span>
              </>
            ) : (
              <>
                <FaCamera className="text-blue-400" />
                <span>Face Recognition</span>
              </>
            )}
          </button>
          
          {showFaceRecognition && <FaceRecognition />}
        </div>
      </div>
    </div>
  );
}
