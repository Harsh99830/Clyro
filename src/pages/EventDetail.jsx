import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function EventDetail({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state || {};

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll lock for mobile/small screens
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [sidebarOpen]);

  if (!card) {
    return <p className="text-center mt-20">No Event Selected</p>;
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-50 to-cyan-200 relative overflow-x-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          // ✅ Mobile width same as Home page
          className={`transition-all duration-300 ${
            window.innerWidth < 1024 ? "w-[200px]" : "w-[300px]"
          }`}
        />

        {/* Main Content */}
        <div
          className={`flex-1 p-6 sm:p-8 transition-all duration-300 ${
            sidebarOpen ? "ml-0 lg:ml-0" : "ml-0"
          }`}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            style={{ marginLeft: "10px" }}
          >
            Back
          </button>

          {/* Event Name */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-wide">
            {card.name}
          </h1>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden"
              >
                <img
                  src={card.image}
                  alt={`${card.name}-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}