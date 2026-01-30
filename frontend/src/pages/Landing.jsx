import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; 
import { FaInstagram, FaLinkedinIn, FaCompass, FaCircle } from "react-icons/fa";

export default function Landing() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth(); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    { id: 1, img: "https://img.freepik.com/premium-photo/group-cheerful-diverse-asian-college-students-are-enjoying-talking-after-classes-together_67155-41784.jpg", label: "TRENDING_NOW", stats: "Students_Dairy" },
    { id: 2, img: "https://lirp.cdn-website.com/c42d8f9a/dms3rep/multi/opt/SMoothMidnightMadness-640w.png", label: "CAMPUS_EVENTS", stats: "Campus_Events" },
    { id: 3, img: "https://willowschool.org/wp-content/uploads/2019/06/P1390915-1.jpg", label: "SOCIAL_VIBE", stats: "Student_Memories" },
    { id: 4, img: "https://miro.medium.com/1*J2BNtHa_OlBBvzh9tx6jjw.jpeg", label: "CAMPUS_MASTI", stats: "Campus_Masti" },
  ];

  return (
    <div className="fixed inset-0 h-screen w-full bg-[#020202] text-white overflow-hidden font-sans select-none overscroll-none">
      
      {/* --- 1. AMBIENT BACKGROUND ENGINE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]"
            style={{ top: `${20 * i}%`, left: `${30 * i}%` }}
          />
        ))}
        
        <motion.div 
          animate={{ y: ["0vh", "100vh"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10"
        />
      </div>

      {/* --- 2. MOBILE TOP BAR --- */}
      <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-cyan-500">Clyro_Live</span>
          </div>
          <span className="text-[8px] font-bold tracking-[0.2em] text-white/20 uppercase">Check it Out</span>
      </div>

      {/* --- 3. THE FRAME --- */}
      <div className="absolute inset-0 border-[10px] lg:border-[20px] border-white/[0.02] pointer-events-none z-50">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rotate-90 text-[7px] tracking-[1em] uppercase font-bold">
              Stream_ID_0{i+1}
            </div>
          ))}
        </div>
      </div>

      {/* --- 4. NAVIGATION --- */}
      <div className="absolute bottom-0 top-auto lg:top-0 lg:bottom-auto left-0 w-full p-6 lg:p-10 flex flex-row justify-between items-center lg:items-start z-50 bg-[#020202]/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-t border-white/10 lg:border-none">
        <div className="flex gap-16 items-start">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase leading-none"
            >
              CLYRO<span className="text-cyan-500">.</span>
            </motion.h1>
            <p className="text-[7px] tracking-[0.5em] text-white/30 uppercase mt-1">Campus_Feed</p>
          </div>
          <div className="hidden lg:block h-[1px] w-24 bg-white/10 mt-5" />
          <div className="hidden lg:block mt-2">
             <p className="text-[8px] tracking-[0.3em] text-white/20 uppercase font-bold">Clyro_Feed: Live</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <button 
            onClick={() => isSignedIn ? navigate("/home") : navigate("/sign-in")}
            className="px-8 lg:px-10 py-3 lg:py-3.5 bg-cyan-500/10 lg:bg-cyan-500/5 border border-cyan-500/20 rounded-full text-[9px] lg:text-[10px] font-black tracking-[0.4em] uppercase hover:bg-cyan-500 hover:text-black transition-all duration-500 group overflow-hidden relative"
          >
            <span className="relative z-10">
              {isSignedIn ? "Explore Feed" : "Join Now"}
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>

      {/* --- 5. KINETIC BACKGROUND TEXT --- */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.h1 
          animate={{ x: mousePos.x * -1, y: mousePos.y * -1 }}
          className="text-[25vw] font-black tracking-tighter leading-none italic text-transparent opacity-5"
          style={{ WebkitTextStroke: '1.5px white' }}
        >
          CLYRO
        </motion.h1>
      </div>

      {/* --- 6. THE CONTENT CORE --- */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[45%] z-30 flex flex-col justify-center p-10 lg:p-24 pb-36 lg:pb-24">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <FaCircle className="text-cyan-500 animate-pulse" size={6} />
              <span className="text-[9px] tracking-[0.6em] text-white/30 uppercase font-bold">Clyro Network</span>
            </div>
            <h2 className="text-6xl lg:text-[110px] font-black tracking-tighter uppercase leading-[0.8]">
              SOCIAL<br/><span className="text-cyan-500 font-light italic">EVOLUTION.</span>
            </h2>
            <p className="max-w-sm text-[10px] lg:text-[11px] tracking-[0.3em] uppercase text-white/40 leading-relaxed mt-8 border-l border-white/10 pl-6">
              A Place where students can share anything of an particular event which happening in their campus and connect with other students.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="mt-10 lg:mt-14 flex items-center gap-6 lg:gap-8 group"
          >
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500 transition-all duration-500 relative">
              <FaCompass size={24} className="lg:size-[28px] group-hover:text-cyan-500 group-hover:rotate-[360deg] transition-all duration-700 text-white/80" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] lg:text-[12px] font-black tracking-[0.6em] uppercase">Explore Feed</span>
              <span className="text-[8px] text-cyan-500/50 uppercase tracking-[0.2em] mt-1">See What's Going On...</span>
            </div>
          </motion.button>
        </div>

        <div className="mt-12 lg:mt-16 flex gap-4 items-center">
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500">
                <FaInstagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500">
                <FaLinkedinIn size={18} />
            </a>
            <div className="h-[1px] w-12 bg-white/10 ml-4" />
            <span className="text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">Core_Links</span>
        </div>
      </div>

      {/* --- 7. FLOATING SOCIAL SHARDS --- */}
      {/* Target: Reduced opacity on mobile (opacity-10) and placed behind content (z-0) */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[55%] z-0 lg:z-20 pointer-events-none lg:pointer-events-auto opacity-10 lg:opacity-100">
        <div className="relative w-full h-full">
          {shards.map((shard, i) => (
            <motion.div
              key={shard.id}
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 1, ease: "circOut" }}
              whileHover={{ scale: 1.08, zIndex: 60, rotate: 0 }}
              className={`absolute overflow-hidden rounded-3xl border border-white/10 group cursor-pointer bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700`}
              style={{
                width: 240 + i * 20,
                height: 320 + i * 20,
                top: `${15 + i * 14}%`,
                left: `${15 + i * 12}%`,
                transform: `rotate(${i * 6 - 12}deg)`,
              }}
            >
              <img 
                src={shard.img} 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                alt={shard.label}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-8 left-8">
                <p className="text-[10px] font-black tracking-[0.5em] text-cyan-500 mb-2 uppercase">{shard.label}</p>
                <div className="w-12 h-[2px] bg-white/20 group-hover:w-full group-hover:bg-cyan-500 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- 8. BOTTOM RIGHT STATUS --- */}
      <div className="absolute bottom-10 right-10 text-right hidden lg:block">
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-3">
             <span className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase">Clyro</span>
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          </div>
          <p className="text-[9px] font-bold tracking-[0.5em] text-cyan-500/40 uppercase">Media_Access</p>
          <p className="text-[9px] font-bold tracking-[0.5em] text-white/10 uppercase">Campus_Diary</p>
        </div>
      </div>
    </div>
  );
}