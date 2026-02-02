import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, FaHome, FaPhotoVideo, 
  FaUser, FaSignOutAlt, FaGraduationCap, FaTimes, FaSignInAlt,
  FaCloudUploadAlt 
} from "react-icons/fa";
import { SignOutButton, useAuth, useUser } from "@clerk/clerk-react"; 
import FolderGrid from '../components/FolderGrid';

// --- SUB-COMPONENT: NavItem ---
function NavItem({ icon, label, active = false, mobile = false, onClick }) {
  if (mobile) {
    return (
      <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${active ? 'text-cyan-400' : 'text-gray-500'}`}
      >
        <span className={`${active ? 'scale-110' : ''}`}>
          {React.cloneElement(icon, { size: 18 })}
        </span>
        <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
        {active && <motion.div layoutId="activeTab" className="w-1 h-1 bg-cyan-500 rounded-full mt-0.5 shadow-[0_0_10px_#22d3ee]" />}
      </div>
    );
  }

  return (
    <li 
      onClick={onClick}
      className={`group relative flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-500 ${
      active ? 'text-white' : 'text-gray-600 hover:text-cyan-400'
    }`}>
      <div className={`absolute left-0 w-1 h-0 bg-cyan-500 transition-all duration-500 ${active ? 'h-6' : 'group-hover:h-4 opacity-50'}`} />
      <span className="transition-transform duration-500 group-hover:scale-110">
        {React.cloneElement(icon, { size: 14 })}
      </span>
      <span className="text-[10px] font-black tracking-[0.3em] uppercase">{label}</span>
      {active && (
        <div className="ml-auto w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee]" />
      )}
    </li>
  );
}

export default function Home({ onCardClick }) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth(); 
  const { user } = useUser(); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#030303] text-white relative flex flex-col lg:flex-row font-mono">
      
      {/* --- 1. MOBILE SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-8 flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-[10px] font-black tracking-[0.5em] text-cyan-500">SYSTEM_SEARCH</span>
              <button onClick={() => setIsSearchOpen(false)} className="p-4 bg-white/5 rounded-full">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-500" />
              <input 
                autoFocus
                type="text" 
                placeholder="TYPE TO SEARCH VAULT..."
                className="w-full bg-transparent border-b border-white/10 py-4 pl-10 outline-none text-xl font-black tracking-tighter placeholder:text-white/10 focus:border-cyan-500 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. GHOST BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <h1 className="text-[35vw] lg:text-[25vw] font-black text-white/[0.02] select-none tracking-tighter uppercase">
          CLYRO
        </h1>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] lg:bg-[size:80px_80px]"></div>
      </div>

      {/* --- 3. DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-72 h-full border-r border-white/5 flex-col bg-transparent z-40">
        <div className="h-32 flex items-center px-10">
          <div className="text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => navigate("/")}>CLYRO</div>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <NavItem icon={<FaHome />} label="Landing" active={false} onClick={() => navigate("/")} />
            <NavItem icon={<FaPhotoVideo />} label="Gallery" active={true} onClick={() => navigate("/home")} />
            
            {/* Desktop Upload Button Integrated */}
            <NavItem 
              icon={<FaCloudUploadAlt />} 
              label="Upload" 
              active={false} 
              onClick={() => navigate(isSignedIn ? "/upload" : "/sign-in")} 
            />

            <NavItem 
              icon={isSignedIn ? <FaUser /> : <FaSignInAlt className="text-cyan-500"/>} 
              label={isSignedIn ? "Profile" : "Join Now"} 
              active={false} 
              onClick={() => navigate(isSignedIn ? "/profile" : "/sign-in")} 
            />
          </ul>
        </nav>
        <div className="p-8">
          {isSignedIn ? (
            <SignOutButton redirectUrl="/">
              <div className="flex items-center gap-4 text-gray-700 hover:text-red-500 cursor-pointer transition-colors">
                <FaSignOutAlt size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
              </div>
            </SignOutButton>
          ) : (
            <div 
              onClick={() => navigate("/sign-in")}
              className="flex items-center gap-4 text-cyan-500 hover:text-white cursor-pointer transition-colors"
            >
              <FaSignInAlt size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
            </div>
          )}
        </div>
      </aside>

      {/* --- 4. MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative h-full">
        {/* Navbar */}
        <nav className="h-20 lg:h-24 w-full border-b border-white/5 px-6 lg:px-12 flex items-center justify-between bg-[#030303]/40 backdrop-blur-md shrink-0">
          <div className="text-xl font-black tracking-tighter uppercase lg:hidden" onClick={() => navigate("/")}>CLYRO</div>

          <div className="flex-1 max-w-xl mx-8 relative group hidden lg:block">
            <div className="absolute inset-0 bg-white/[0.01] -skew-x-12 border border-white/5 group-focus-within:border-cyan-500/30 transition-all duration-500"></div>
            <div className="relative flex items-center px-6 py-2.5">
              <FaSearch className="text-gray-700 mr-4" size={12} />
              <input 
                type="text" 
                placeholder="SEARCH VAULT..." 
                className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest text-white w-full placeholder:text-gray-800" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <button 
                onClick={() => navigate("/profile")}
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center bg-white/5 overflow-hidden hover:border-cyan-500/50 transition-colors"
              >
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                ) : (
                  <FaUser size={14} className="text-gray-500" />
                )}
              </button>
            ) : (
              <button 
                onClick={() => navigate("/sign-in")}
                className="px-5 py-2 border-l-2 border-cyan-500 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all"
              >
                Join Now
              </button>
            )}
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-20 custom-scrollbar pb-32 lg:pb-20 touch-pan-y">
          <div className="max-w-[1400px] mx-auto relative">
            <header className="relative mb-12 lg:mb-24">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="p-3 bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-full text-black">
                    <FaGraduationCap size={24} />
                  </div>
                  <div className="h-[1px] w-20 bg-gradient-to-r from-white to-transparent" />
                </div>
                <h1 className="text-4xl lg:text-[100px] font-black tracking-tight leading-none uppercase">
                  VISUAL <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>VAULT.</span>
                </h1>
              </motion.div>
            </header>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="bg-white/[0.01] border border-white/5 p-4 lg:p-14 rounded-2xl backdrop-blur-[2px] relative overflow-hidden">
                <div className="relative z-10">
                  <FolderGrid onCardClick={onCardClick} />
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* --- MOBILE NAVIGATION DOCK --- */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl z-[60] flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <NavItem icon={<FaHome />} label="Home" active={false} mobile={true} onClick={() => navigate("/")} />
           <NavItem icon={<FaPhotoVideo />} label="Gallery" active={true} mobile={true} onClick={() => navigate("/home")} />
           
           {/* Mobile Upload Button Integrated */}
           <NavItem 
             icon={<FaCloudUploadAlt />} 
             label="Upload" 
             active={false} 
             mobile={true} 
             onClick={() => navigate(isSignedIn ? "/upload" : "/sign-in")} 
           />

           <NavItem icon={<FaSearch />} label="Search" active={false} mobile={true} onClick={() => setIsSearchOpen(true)} />
           
           <NavItem 
              icon={isSignedIn ? <FaUser /> : <FaSignInAlt className="text-cyan-500"/>} 
              label={isSignedIn ? "Profile" : "Join"} 
              active={false} 
              mobile={true} 
              onClick={() => navigate(isSignedIn ? "/profile" : "/sign-in")} 
            />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        body { overflow: hidden; position: fixed; width: 100%; }
        main { -webkit-overflow-scrolling: touch; }
      `}} />
    </div>
  );
}