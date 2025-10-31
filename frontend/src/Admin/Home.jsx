import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, useAuth } from '@clerk/clerk-react';
import Sidebar from "../components/Sidebar";
import FolderGrid from "../components/FolderGrid";
import { useNavigate } from "react-router-dom";

const Home = ({ sidebarOpen, toggleSidebar, onCardClick }) => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) toggleSidebar();
      else if (window.innerWidth >= 1024 && !sidebarOpen) toggleSidebar();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, toggleSidebar]);

  // 🔒 Scroll lock for mobile & small screens
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30"></div>
      </div>

      

      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} />

        <div className={`flex-1 transition-all duration-500 sm:p-8 ${sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
          {/* Admin Header */}
          <div className="bg-white shadow-sm mb-8 rounded-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleSignOut}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="">
                <h2 className="text-2xl font-bold text-white mb-6 text-left">Your Event Galleries</h2>
                <FolderGrid onCardClick={onCardClick} isAdmin={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
