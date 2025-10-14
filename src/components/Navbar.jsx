import React from "react";
import { FaBars } from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-lg p-4 flex items-center">
      {/* Sidebar Toggle */}
      <div className="mr-4 cursor-pointer" onClick={toggleSidebar}>
        <FaBars size={24} className="text-white" />
      </div>

      {/* App Name / Logo */}
      <div className="text-3xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400">
        Clyro
      </div>

      {/* Search bar right corner */}
      <div className="ml-auto w-40 sm:w-56 md:w-72 lg:w-96 transition-all duration-300">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full border border-cyan-700 bg-gray-100 text-black rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition placeholder:text-gray-500"
        />
      </div>
    </nav>
  );
}
