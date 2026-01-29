import React, { useState, useEffect, createContext, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGraduationCap, FaThLarge, FaColumns, 
  FaTimes, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import { CircularProgress } from "@mui/material";

// --- MAIN COMPONENT ---
export default function EventDetail({ sidebarOpen }) {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isSingleColumn, setIsSingleColumn] = useState(false);
  const { card } = location.state || {};

  const closeImage = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images?folder=${eventId}`);
        const data = await response.json();
        if (data.success) setImages(data.images);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchImages();
    window.scrollTo(0, 0);
  }, [eventId]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#030303] flex items-center justify-center">
        <CircularProgress sx={{ color: 'white' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white relative overflow-x-hidden font-mono flex flex-col">
      
      {/* --- 1. BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <h1 className="text-[25vw] font-black text-white/[0.02] select-none tracking-tighter uppercase">
          VAULT
        </h1>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 contrast-150 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className={`flex-1 transition-all duration-700 z-10 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        
        <main className="p-4 lg:p-12 w-full">
          
          {/* Header Section */}
          <header className="relative mb-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 px-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="p-5 bg-white shadow-[0_0_40px_rgba(255,255,255,0.15)] rounded-full text-black">
                  <FaGraduationCap size={35} />
                </div>
                <div className="h-[2px] w-24 bg-gradient-to-r from-white to-transparent" />
              </div>

              <h1 className="text-5xl lg:text-[90px] font-black tracking-tighter leading-none uppercase whitespace-nowrap">
                {card?.name || eventId} <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>EVENT.</span>
              </h1>
            </motion.div>

            {/* Layout Controls (Sound button removed) */}
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-2 rounded-2xl backdrop-blur-md mb-2">
              <button 
                onClick={() => setIsSingleColumn(false)}
                className={`p-3 rounded-xl transition-all ${!isSingleColumn ? 'bg-white text-black shadow-xl' : 'text-gray-400 hover:text-white'}`}
              >
                <FaThLarge size={18} />
              </button>
              <button 
                onClick={() => setIsSingleColumn(true)}
                className={`p-3 rounded-xl transition-all ${isSingleColumn ? 'bg-white text-black shadow-xl' : 'text-gray-400 hover:text-white'}`}
              >
                <FaColumns size={18} />
              </button>
            </div>
          </header>

          {/* Gallery Section */}
          <div className="relative w-full">
            <FaGraduationCap size={600} className="fixed -bottom-40 -right-20 text-white/[0.01] -rotate-12 pointer-events-none" />

            <div className={`grid gap-4 w-full ${isSingleColumn ? 'max-w-3xl mx-auto grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={image.url}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative group aspect-[4/5] overflow-hidden bg-white/[0.02] border border-white/5 rounded-sm cursor-pointer"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      document.body.style.overflow = 'hidden';
                    }}
                  >
                    {isVideo(image) ? (
                      <video 
                        src={image.url} 
                        muted // Videos in grid are now always muted by default
                        autoPlay 
                        loop 
                        playsInline
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                      />
                    ) : (
                      <img 
                        src={image.url} 
                        alt="Media"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                        loading="lazy"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                       <span className="text-[9px] font-black tracking-[0.4em] uppercase text-white border-l-2 border-cyan-500 pl-3">Expand Media</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* --- 3. FULLSCREEN OVERLAY --- */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center"
          >
            <button onClick={closeImage} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-50">
              <FaTimes size={24} />
            </button>
            
            <button onClick={() => navigateImage('prev')} className="absolute left-4 lg:left-10 text-white/20 hover:text-white transition-colors z-50">
              <FaChevronLeft size={30} />
            </button>

            <div className="w-full h-full flex flex-col items-center justify-center p-4 lg:p-12">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-full max-h-full flex items-center justify-center"
              >
                {isVideo(images[selectedImageIndex]) ? (
                  <video src={images[selectedImageIndex]?.url} controls autoPlay className="max-w-full max-h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.5)]" />
                ) : (
                  <img src={images[selectedImageIndex]?.url} alt="Full view" className="max-w-full max-h-[85vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]" />
                )}
              </motion.div>
              
              <div className="absolute bottom-10 text-[10px] font-black tracking-[1.5em] text-white/20 uppercase">
                {selectedImageIndex + 1} <span className="text-cyan-500/50">//</span> {images.length}
              </div>
            </div>

            <button onClick={() => navigateImage('next')} className="absolute right-4 lg:right-10 text-white/20 hover:text-white transition-colors z-50">
              <FaChevronRight size={30} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
      `}} />
    </div>
  );
}

const isVideo = (image) => {
  const url = image?.url || '';
  if (image?.mime?.startsWith('video')) return true;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
};