import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        {/* Spinning Circle */}
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-300 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold mt-10 text-gray-200">Loading Clyro . . .</h1>
      </div>
    </div>
  );
}
