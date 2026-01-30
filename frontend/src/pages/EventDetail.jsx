import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGraduationCap, FaThLarge, FaColumns, 
  FaTimes, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import { CircularProgress } from "@mui/material";

export default function EventDetail({ sidebarOpen }) {
  const { eventId } = useParams();
  const location = useLocation();
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
        <CircularProgress sx={{ color: '#22d3ee' }} size={30} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white relative overflow-x-hidden font-sans flex flex-col">
      
      {/* --- 1. MODERN BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Stars Layer */}
        <div className="absolute inset-0 z-0">
            <div id="stars" />
            <div id="stars2" />
        </div>

        {/* Professional Watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             <h1 className="text-[12vw] font-black text-white/[0.02] select-none tracking-[0.2em] uppercase whitespace-nowrap">
                CLYRO GALLERY
             </h1>
        </div>

        {/* Clean Vignette & Grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150" />
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className={`flex-1 transition-all duration-700 z-10 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        
        <main className="p-6 lg:p-16 w-full max-w-[1800px] mx-auto">
          
          {/* Professional Header Section */}
          <header className="relative mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 text-cyan-500">
                <FaGraduationCap size={20} />
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Archive Collection</span>
              </div>

              <h1 className="text-4xl lg:text-7xl font-light tracking-tight uppercase">
                {card?.name || eventId} <span className="font-black text-white/20">/01</span>
              </h1>
            </motion.div>

            {/* Layout Controls */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setIsSingleColumn(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-[10px] font-bold tracking-widest ${!isSingleColumn ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <FaThLarge size={12} /> GRID
              </button>
              <button 
                onClick={() => setIsSingleColumn(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-[10px] font-bold tracking-widest ${isSingleColumn ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <FaColumns size={12} /> LIST
              </button>
            </div>
          </header>

          {/* Gallery Grid */}
          <div className="relative">
            <div className={`grid gap-6 w-full ${isSingleColumn ? 'max-w-4xl mx-auto grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={image.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-[4/5] overflow-hidden bg-white/[0.03] border border-white/5 group cursor-pointer"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      document.body.style.overflow = 'hidden';
                    }}
                  >
                    {isVideo(image) ? (
                      <video 
                        src={image.url} 
                        muted autoPlay loop playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img 
                        src={image.url} 
                        alt="Media"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                       <div className="text-[10px] font-bold tracking-[0.4em] uppercase border-b border-cyan-500 pb-1">View Asset</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* --- 3. MODERN OVERLAY --- */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <button onClick={closeImage} className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors z-50">
              <FaTimes size={20} />
            </button>
            
            <button onClick={() => navigateImage('prev')} className="absolute left-6 text-white/20 hover:text-white transition-all">
              <FaChevronLeft size={24} />
            </button>

            <div className="w-full h-full flex flex-col items-center justify-center gap-8">
              <motion.div 
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-full max-h-[80vh] shadow-2xl"
              >
                {isVideo(images[selectedImageIndex]) ? (
                  <video src={images[selectedImageIndex]?.url} controls autoPlay className="max-w-full max-h-[80vh] border border-white/10" />
                ) : (
                  <img src={images[selectedImageIndex]?.url} alt="Full view" className="max-w-full max-h-[80vh] object-contain border border-white/10" />
                )}
              </motion.div>
              
              <div className="text-[10px] font-bold tracking-[1em] text-white/30 uppercase">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            <button onClick={() => navigateImage('next')} className="absolute right-6 text-white/20 hover:text-white transition-all">
              <FaChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 4. GLOBAL STYLES (STARS & SCROLLBAR) --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #22d3ee; }

        /* Pure CSS Star Animation */
        #stars, #stars2 {
          position: absolute; width: 2px; height: 2px;
          background: transparent; box-shadow: ${generateStars(700)};
          animation: animStar 150s linear infinite;
        }
        #stars2 {
          width: 1px; height: 1px;
          box-shadow: ${generateStars(500)};
          animation: animStar 100s linear infinite;
        }
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
      `}} />
    </div>
  );
}

// Helper to generate CSS Star Shadow
function generateStars(n) {
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #fff`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #fff`;
  }
  return value;
}

const isVideo = (image) => {
  const url = image?.url || '';
  if (image?.mime?.startsWith('video')) return true;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
};