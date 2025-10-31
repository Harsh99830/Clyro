import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useAuth } from '@clerk/clerk-react';
import Sidebar from "../components/Sidebar";
import FolderGrid from "../components/FolderGrid";
import NewFolderModal from "../components/NewFolderModal";
import { useNavigate } from "react-router-dom";

const Home = ({ sidebarOpen, toggleSidebar, onCardClick }) => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFolder = async (folderName) => {
    try {
      setIsCreating(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/folders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: folderName })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create folder');
      }
      
      // Refresh the folder list by calling the parent component's onFolderCreated if it exists
      if (onCardClick && typeof onCardClick === 'function') {
        onCardClick(data.data);
      }
      
      // Show success message
      // If you have a toast notification system, uncomment this:
      // toast.success(data.message || 'Gallery created successfully!');
      
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      // If you have a toast notification system, uncomment this:
      // toast.error(error.message || 'Failed to create gallery');
      
      // Re-throw the error to be handled by the NewFolderModal component
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

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
      if (toggleSidebar && typeof toggleSidebar === 'function') {
        if (window.innerWidth > 768) {
          toggleSidebar(true);
        } else {
          toggleSidebar(false);
        }
      }
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
      
      {/* New Folder Modal */}
      <AnimatePresence>
        <NewFolderModal 
          isOpen={isModalOpen}
          onClose={() => !isCreating && setIsModalOpen(false)}
          onCreate={handleCreateFolder}
        />
      </AnimatePresence>

      

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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Event Galleries</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New
                  </button>
                </div>
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
