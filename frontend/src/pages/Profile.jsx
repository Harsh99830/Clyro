import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaHome, FaPhotoVideo, FaSearch, 
  FaShieldAlt, FaSignOutAlt, FaSignInAlt
} from "react-icons/fa";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";

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

export default function Profile() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#030303] text-white relative flex flex-col lg:flex-row font-mono overflow-hidden">
      
      {/* --- 1. GHOST BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <h1 className="text-[35vw] lg:text-[25vw] font-black text-white/[0.02] select-none tracking-tighter uppercase">
          CLYRO
        </h1>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] lg:bg-[size:80px_80px]"></div>
      </div>

      {/* --- 2. DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-72 h-full border-r border-white/5 flex-col bg-transparent z-40">
        <div className="h-32 flex items-center px-10">
          <div className="text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => navigate("/")}>CLYRO</div>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <NavItem icon={<FaHome />} label="Landing" active={false} onClick={() => navigate("/")} />
            <NavItem icon={<FaPhotoVideo />} label="Gallery" active={false} onClick={() => navigate("/home")} />
            
            <NavItem 
              icon={isSignedIn ? <FaUser /> : <FaSignInAlt className="text-cyan-500"/>} 
              label={isSignedIn ? "Profile" : "Join Now"} 
              active={true} 
              onClick={() => navigate(isSignedIn ? "/profile" : "/sign-in")} 
            />
          </ul>
        </nav>
        <div className="p-8">
          {isSignedIn && (
            <SignOutButton redirectUrl="/">
              <div className="flex items-center gap-4 text-gray-700 hover:text-red-500 cursor-pointer transition-colors">
                <FaSignOutAlt size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
              </div>
            </SignOutButton>
          )}
        </div>
      </aside>

      {/* --- 3. MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20 relative z-10 custom-scrollbar pb-32 lg:pb-0">
        <div className="max-w-md w-full text-center">
          
          <header className="mb-12 flex flex-col items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-cyan-500/30 p-2 relative">
                <img 
                  src={user?.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-2 right-2 bg-cyan-500 text-black p-2 rounded-full shadow-[0_0_20px_#22d3ee]">
                <FaShieldAlt size={12} />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                {user?.fullName || "Agent_Unknown"}
              </h1>
              <div className="h-[1px] w-12 bg-cyan-500 mx-auto opacity-50" />
            </div>
          </header>

          <section className="mt-8">
            <SignOutButton redirectUrl="/">
              <button className="px-12 py-4 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:border-red-500/50 hover:text-red-500 transition-all">
                Terminate Session
              </button>
            </SignOutButton>
          </section>
        </div>
      </main>

      {/* --- 4. MOBILE NAVIGATION DOCK --- */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl z-[60] flex items-center justify-around px-2 shadow-2xl">
         <NavItem icon={<FaHome />} label="Home" active={false} mobile={true} onClick={() => navigate("/")} />
         <NavItem icon={<FaPhotoVideo />} label="Gallery" active={false} mobile={true} onClick={() => navigate("/home")} />
         <NavItem icon={<FaSearch />} label="Search" active={false} mobile={true} onClick={() => navigate("/home")} />
         <NavItem icon={<FaUser />} label="Profile" active={true} mobile={true} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        body { overflow: hidden; position: fixed; width: 100%; }
        main { -webkit-overflow-scrolling: touch; }
      `}} />
    </div>
  );
}