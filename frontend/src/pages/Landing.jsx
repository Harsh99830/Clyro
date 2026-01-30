import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaCompass } from "react-icons/fa";

export default function Landing() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tracking ONLY for the subtle background text parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const shards = [
    { id: 1, img: "https://picsum.photos/400/600?random=11", label: "TRENDING_NOW" },
    { id: 2, img: "https://picsum.photos/400/600?random=12", label: "CREATOR_FEED" },
    { id: 3, img: "https://picsum.photos/400/600?random=13", label: "SOCIAL_VIBE" },
    { id: 4, img: "https://picsum.photos/400/600?random=14", label: "GLOBAL_LINK" },
  ];

  return (
    <div className="fixed inset-0 h-screen w-full bg-[#030303] text-white overflow-hidden font-sans select-none overscroll-none">
      
      {/* --- 1. BACKGROUND ENGINE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06)_0%,transparent_70%)] animate-pulse" />
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.1" />
        </svg>
      </div>

      {/* --- 2. TOP NAVIGATION BAR --- */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-50">
        {/* TOP LEFT BRANDING */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black italic tracking-tighter uppercase leading-none"
          >
            CLYRO<span className="text-cyan-500">.</span>
          </motion.h1>
          <p className="text-[7px] tracking-[0.5em] text-white/30 uppercase mt-1">Social_Archive_v3</p>
        </div>

        {/* TOP RIGHT AUTH BUTTON (Join Now Only) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            Join Now
          </button>
        </motion.div>
      </div>

      {/* --- 3. KINETIC BACKGROUND TEXT --- */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.h1 
          animate={{ x: mousePos.x * -1, y: mousePos.y * -1 }}
          className="text-[25vw] font-black tracking-tighter leading-none italic text-transparent opacity-5"
          style={{ WebkitTextStroke: '1px white' }}
        >
          NETWORK
        </motion.h1>
      </div>

      {/* --- 4. THE INTERACTION CORE (LEFT) --- */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[45%] z-30 flex flex-col justify-center p-12 lg:p-24">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              SOCIAL<br/><span className="text-cyan-500 font-light italic">EVOLUTION.</span>
            </h2>
            <p className="max-w-xs text-[10px] tracking-[0.4em] uppercase text-white/40 leading-relaxed mt-6">
              A curated space for elite visual storytelling and digital influence.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="mt-12 flex items-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-full border border-cyan-500/50 flex items-center justify-center group-hover:bg-cyan-500 transition-all duration-500 relative shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <FaCompass size={24} className="group-hover:text-black group-hover:rotate-45 transition-all duration-500 text-cyan-500" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] font-black tracking-[0.5em] uppercase">Explore Feed</span>
              <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Enter Gallery</span>
            </div>
          </motion.button>
        </div>

        {/* SOCIAL LINKS (TIGHTLY GROUPED) */}
        <div className="mt-12 flex gap-2 items-center">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="group">
                <div className="w-11 h-11 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <FaInstagram size={18} />
                </div>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="group">
                <div className="w-11 h-11 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <FaLinkedinIn size={16} />
                </div>
            </a>
            <div className="h-[1px] w-8 bg-white/10 mx-2" />
            <span className="text-[8px] font-bold tracking-[0.4em] text-white/30 uppercase">Connect</span>
        </div>
      </div>

      {/* --- 5. FLOATING SOCIAL SHARDS (STATIC POSITIONS) --- */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[55%] z-20 pointer-events-none lg:pointer-events-auto">
        <div className="relative w-full h-full">
          {shards.map((shard, i) => (
            <motion.div
              key={shard.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
              className={`absolute overflow-hidden rounded-2xl border border-white/10 group cursor-pointer bg-[#0a0a0a] shadow-2xl transition-transform duration-500`}
              style={{
                width: 220 + i * 15,
                height: 300 + i * 15,
                top: `${18 + i * 12}%`,
                left: `${12 + i * 10}%`,
                transform: `rotate(${i * 4 - 8}deg)`,
              }}
            >
              <img 
                src={shard.img} 
                className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                alt={shard.label}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-[9px] font-black tracking-[0.4em] text-cyan-500 mb-1">{shard.label}</p>
                <div className="w-0 group-hover:w-full h-[1px] bg-cyan-500/50 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- 6. DATA OVERLAY --- */}
      <div className="absolute bottom-8 right-8 text-right hidden lg:block opacity-10">
        <p className="text-[8px] font-bold tracking-[0.5em] uppercase">Status: 200_OK</p>
        <p className="text-[8px] font-bold tracking-[0.5em] uppercase mt-1">Clyro_Network_Established</p>
      </div>
    </div>
  );
}