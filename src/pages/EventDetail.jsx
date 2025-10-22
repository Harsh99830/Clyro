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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30"></div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>
      <div className="fixed top-16 left-0 bottom-0 z-40">
        <Sidebar isOpen={sidebarOpen} />
      </div>
      
      <div className={`pt-16 transition-all duration-300 relative z-10 ${
        sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
      }`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <svg
              className="w-5 h-5 text-white transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium text-white">Back to Events</span>
          </button>

          <div className="rounded-xl shadow-sm p-6 md:p-8 mb-8 ">
            <h1 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">
              {card.name}
            </h1>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5,6,7,8,9,10].map((i) => (
                <div
                  key={i}
                  className="group relative w-full h-56 bg-gray-700/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-700/50"
                >
                  <img
                    src={card.image}
                    alt={`${card.name}-${i}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}