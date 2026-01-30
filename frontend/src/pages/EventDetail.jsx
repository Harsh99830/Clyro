import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGraduationCap, FaThLarge, FaColumns, 
  FaTimes, FaChevronLeft, FaChevronRight,
  FaHome, FaPhotoVideo, FaUser, FaArrowLeft
} from "react-icons/fa";
import { CircularProgress } from "@mui/material";

// --- SUB-COMPONENT: NavItem (Mobile Dock) ---
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${active ? 'text-cyan-400' : 'text-gray-500'}`}
    >
      <span className={`${active ? 'scale-110' : ''}`}>
        {React.cloneElement(icon, { size: 18 })}
      </span>
      <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
      {active && <div className="w-1 h-1 bg-cyan-500 rounded-full mt-0.5 shadow-[0_0_10px_#22d3ee]" />}
    </div>
  );
}

export default function EventDetail({ sidebarOpen }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
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
    <div className="min-h-screen w-full bg-[#030303] text-white relative overflow-x-hidden font-mono flex flex-col">
      
      {/* --- 1. MODERN BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div id="stars" />
            <div id="stars2" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
             <h1 className="text-[20vw] lg:text-[12vw] font-black text-white/[0.02] select-none tracking-[0.2em] uppercase whitespace-nowrap">
                VAULT
             </h1>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80" />
      </div>

      {/* --- 2. MAIN CONTENT --- */}
      <div className={`flex-1 transition-all duration-700 z-10 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        
        <main className="p-6 lg:p-16 w-full max-w-[1800px] mx-auto pb-32 lg:pb-16">
          
          {/* Back Button (Mobile Only) */}
          

          {/* Professional Header Section */}
          <header className="relative mb-12 lg:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3 text-cyan-500">
                <FaGraduationCap size={18} />
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Archive Collection</span>
              </div>

              <h1 className="text-3xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
                {card?.name || eventId} <span className="text-white/10">/</span>
              </h1>
            </motion.div>

            {/* Layout Controls - Hidden on very small screens to save space if needed, or kept for UX */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 self-end md:self-auto">
              <button 
                onClick={() => setIsSingleColumn(false)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-md transition-all text-[9px] lg:text-[10px] font-bold tracking-widest ${!isSingleColumn ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <FaThLarge size={10} /> GRID
              </button>
              <button 
                onClick={() => setIsSingleColumn(true)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-md transition-all text-[9px] lg:text-[10px] font-bold tracking-widest ${isSingleColumn ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <FaColumns size={10} /> LIST
              </button>
            </div>
          </header>

          {/* Gallery Grid - 2 columns on mobile by default */}
          <div className="relative">
            <div className={`grid gap-3 lg:gap-6 w-full ${isSingleColumn ? 'max-w-2xl mx-auto grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={image.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-white/[0.03] border border-white/5 group cursor-pointer"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      document.body.style.overflow = 'hidden';
                    }}
                  >
                    {isVideo(image) ? (
                      <video 
                        src={image.url} 
                        muted autoPlay loop playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={image.url} 
                        alt="Media"
                        className="w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Hover Overlay - Only shows label on desktop, simple glow on mobile */}
                    <div className="absolute inset-0 bg-black/40 lg:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-[8px] lg:text-[10px] font-black tracking-[0.4em] uppercase border-b border-cyan-500 pb-1">Open</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* --- 3. MOBILE NAVIGATION DOCK --- */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl z-[60] flex items-center justify-around px-2 shadow-2xl">
         <NavItem icon={<FaHome />} label="Home" active={false} onClick={() => navigate("/home")} />
         <NavItem icon={<FaPhotoVideo />} label="Gallery" active={true} onClick={() => navigate("/home")} />
         <NavItem icon={<FaUser />} label="Profile" active={false} onClick={() => navigate("/profile")} />
      </div>

      {/* --- 4. MODERN OVERLAY --- */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center"
          >
            {/* Overlay Controls */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div className="text-[10px] font-black tracking-widest text-cyan-500 uppercase">Asset_Preview</div>
                <button onClick={closeImage} className="p-3 bg-white/5 rounded-full text-white">
                  <FaTimes size={18} />
                </button>
            </div>
            
            <button onClick={() => navigateImage('prev')} className="absolute left-4 lg:left-10 text-white/20 hover:text-cyan-400 transition-all z-50">
              <FaChevronLeft size={24} />
            </button>

            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <motion.div 
                layoutId={`img-${selectedImageIndex}`}
                className="relative max-w-full max-h-[70vh] lg:max-h-[80vh]"
              >
                {isVideo(images[selectedImageIndex]) ? (
                  <video src={images[selectedImageIndex]?.url} controls autoPlay className="max-w-full max-h-[70vh] lg:max-h-[80vh] shadow-2xl" />
                ) : (
                  <img src={images[selectedImageIndex]?.url} alt="Full view" className="max-w-full max-h-[70vh] lg:max-h-[80vh] object-contain shadow-2xl" />
                )}
              </motion.div>
              
              <div className="mt-8 text-[9px] font-black tracking-[1em] text-white/20 uppercase">
                {selectedImageIndex + 1} <span className="text-cyan-500">/</span> {images.length}
              </div>
            </div>

            <button onClick={() => navigateImage('next')} className="absolute right-4 lg:right-10 text-white/20 hover:text-cyan-400 transition-all z-50">
              <FaChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 5. GLOBAL STYLES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        
        #stars, #stars2 {
          position: absolute; width: 2px; height: 2px;
          background: transparent; box-shadow: ${generateStars(400)};
          animation: animStar 150s linear infinite;
        }
        #stars2 {
          width: 1px; height: 1px;
          box-shadow: ${generateStars(200)};
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

function generateStars(n) {
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #fff`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #ffffff20`;
  }
  return value;
}

const isVideo = (image) => {
  const url = image?.url || '';
  if (image?.mime?.startsWith('video')) return true;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
};