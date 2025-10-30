import React, { useEffect } from "react";
import { motion } from "framer-motion";
import FolderGrid from '../components/FolderGrid';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home({ sidebarOpen, toggleSidebar, onCardClick }) {
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

      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex pt-20 relative z-10">
        <Sidebar isOpen={sidebarOpen} />

        <div className={`flex-1 transition-all duration-500 p-4 sm:p-8 ${sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Event Galleries
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
                Browse through our collection of event photos
              </p>
              <FolderGrid onCardClick={onCardClick} />
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  );
}