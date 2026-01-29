import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaBars, FaSearch, FaHome, FaPhotoVideo, 
  FaCog, FaUser, FaSpinner, FaSignOutAlt,
  FaGraduationCap
} from "react-icons/fa";
import { SignOutButton, useClerk } from "@clerk/clerk-react";
import FolderGrid from '../components/FolderGrid';

// --- SUB-COMPONENT: NavItem ---
function NavItem({ icon, label, active = false }) {
  return (
    <li className={`group relative flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-500 ${
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

export default function Home({ sidebarOpen, toggleSidebar, onCardClick }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useClerk();

  return (
    <div className="h-screen w-full bg-[#030303] text-white relative overflow-hidden font-mono flex">
      
      {/* --- 1. THE "GHOST" BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <h1 className="text-[25vw] font-black text-white/[0.02] select-none tracking-tighter uppercase">
          CLYRO
        </h1>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* --- 2. PERMANENT SIDEBAR --- */}
      <aside
        className={`fixed lg:static left-0 top-0 h-full transition-all duration-700 cubic-bezier(0.85, 0, 0.15, 1) z-40 border-r border-white/5 flex flex-col bg-black/80 lg:bg-transparent backdrop-blur-3xl lg:backdrop-blur-0 ${
          sidebarOpen ? 'w-72' : 'w-0 lg:w-72 overflow-hidden lg:overflow-visible'
        }`}
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="h-32 flex items-center px-10">
             <div className="text-2xl font-black tracking-tighter uppercase">CLYRO</div>
          </div>

          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              <NavItem icon={<FaHome />} label="Home" active />
              <NavItem icon={<FaPhotoVideo />} label="Gallery" />
              <NavItem icon={<FaUser />} label="Profile" />
            </ul>
          </nav>

          <div className="p-8">
             <SignOutButton redirectUrl="/">
               <div className="flex items-center gap-4 text-gray-700 hover:text-red-500 cursor-pointer transition-colors group">
                  <FaSignOutAlt size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
               </div>
             </SignOutButton>
          </div>
        </div>
      </aside>

      {/* --- 3. MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        <nav className="h-24 w-full border-b border-white/5 px-6 lg:px-12 flex items-center justify-between bg-[#030303]/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <div className="lg:hidden cursor-pointer text-white hover:text-cyan-400 transition-colors" onClick={toggleSidebar}>
              <FaBars size={18} />
            </div>
            <div className="text-xl font-black tracking-tighter uppercase">CLYRO</div>
          </div>

          <div className="flex-1 max-w-xl mx-8 relative group hidden md:block">
            <div className="absolute inset-0 bg-white/[0.01] -skew-x-12 border border-white/5 group-focus-within:border-cyan-500/30 transition-all duration-500"></div>
            <div className="relative flex items-center px-6 py-2.5">
              <FaSearch className="text-gray-700 mr-4" size={12} />
              <input
                type="text"
                placeholder="SEARCH..."
                className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest text-white w-full placeholder:text-gray-800"
              />
            </div>
          </div>

          <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center bg-white/5 hover:border-cyan-500/50 transition-all cursor-pointer">
            <FaUser size={14} className="text-gray-500" />
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-8 lg:p-20 custom-scrollbar">
          <div className="max-w-[1400px] relative">
            
            {/* Header Unit - Unified Single Line */}
            <header className="relative mb-24 flex items-end justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8 }}
                className="flex flex-col items-start gap-8"
              >
                <div className="flex items-center gap-6 text-white">
                  <div className="p-5 bg-white shadow-[0_0_40px_rgba(255,255,255,0.15)] rounded-full text-black">
                    <FaGraduationCap size={45} />
                  </div>
                  <div className="h-[2px] w-32 bg-gradient-to-r from-white to-transparent" />
                </div>

                {/* Single line header */}
                <h1 className="text-5xl lg:text-[100px] font-black tracking-[0.02em] leading-none uppercase whitespace-nowrap">
                  VISUAL <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>VAULT.</span>
                </h1>
              </motion.div>

              {/* Right Side Massive Hat */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden xl:flex flex-col items-end gap-4 pb-4"
              >
                <div className="p-8 border border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-md">
                   <FaGraduationCap size={80} className="text-white opacity-90 shadow-2xl" />
                </div>
                <span className="text-[10px] font-black tracking-[0.8em] text-white/20 uppercase mr-4">Academic_</span>
              </motion.div>
            </header>

            {/* Folder Grid Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white/[0.01] border border-white/5 p-8 lg:p-14 rounded-sm backdrop-blur-[2px] relative z-10 overflow-hidden">
                <FaGraduationCap size={400} className="absolute -bottom-20 -right-20 text-white/[0.01] -rotate-12 pointer-events-none" />
                
                <div className="flex items-center justify-between mb-12 relative z-10">
                   <div className="flex items-center gap-4">
                     <div className="w-1.5 h-6 bg-cyan-500 shadow-[0_0_15px_#22d3ee]" />
                     <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Clyro_Media</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                   </div>
                </div>
                <div className="relative z-10">
                  <FolderGrid onCardClick={onCardClick} />
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
      `}} />
    </div>
  );
}