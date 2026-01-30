import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaHome, FaPhotoVideo, FaSearch, 
  FaCog, FaShieldAlt, FaHistory, FaGraduationCap 
} from "react-icons/fa";
import { useUser, SignOutButton } from "@clerk/clerk-react";

// Reuse NavItem for the Mobile Dock
function NavItem({ icon, label, active = false, mobile = false, onClick }) {
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

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  const stats = [
    { label: "Uploads", value: "124" },
    { label: "Vaults", value: "12" },
    { label: "Rank", value: "Elite" },
  ];

  return (
    <div className="h-screen w-full bg-[#030303] text-white relative overflow-hidden font-mono flex flex-col">
      
      {/* --- BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 lg:p-20 relative z-10 custom-scrollbar pb-32">
        <div className="max-w-4xl mx-auto">
          
          {/* --- PROFILE HEADER --- */}
          <header className="mb-12 flex flex-col items-center lg:items-start gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-cyan-500/30 p-2 relative">
                <img 
                  src={user?.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-20 pointer-events-none"></div>
              </div>
              <div className="absolute -bottom-2 right-2 bg-cyan-500 text-black p-2 rounded-full shadow-[0_0_20px_#22d3ee]">
                <FaShieldAlt size={12} />
              </div>
            </motion.div>

            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-6xl font-black uppercase tracking-tighter">
                {user?.fullName || "Agent_Unknown"}
              </h1>
              <p className="text-cyan-500 text-[10px] font-black tracking-[0.4em] uppercase mt-2">
                ID: {user?.id.slice(-8) || "00000000"} // System_Authorized
              </p>
            </div>
          </header>

          {/* --- STATS GRID --- */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-center">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[8px] uppercase tracking-widest text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* --- SETTINGS AREA --- */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-6">System Control</h2>
            
            {[
              { icon: <FaCog />, label: "Account Settings", desc: "Manage your vault credentials" },
              { icon: <FaHistory />, label: "Access History", desc: "View recent login attempts" },
              { icon: <FaGraduationCap />, label: "Campus Verify", desc: "Status: Verified Student" }
            ].map((item, i) => (
              <motion.div 
                whileHover={{ x: 10 }}
                key={i} 
                className="flex items-center gap-6 p-6 bg-white/[0.01] border border-white/5 rounded-2xl cursor-pointer group hover:border-cyan-500/30 transition-all"
              >
                <div className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black uppercase tracking-widest">{item.label}</div>
                  <div className="text-[10px] text-gray-600 mt-1">{item.desc}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-cyan-500 transition-all"></div>
              </motion.div>
            ))}

            <div className="pt-8">
               <SignOutButton redirectUrl="/">
                  <button className="w-full py-4 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-red-500/10 transition-all">
                    Terminate Session
                  </button>
               </SignOutButton>
            </div>
          </section>

        </div>
      </main>

      {/* --- MOBILE NAVIGATION DOCK --- */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl z-[60] flex items-center justify-around px-2 shadow-2xl">
         <NavItem icon={<FaHome />} label="Home" active={false} mobile={true} onClick={() => navigate("/")} />
         <NavItem icon={<FaPhotoVideo />} label="Gallery" active={false} mobile={true} onClick={() => navigate("/gallery")} />
         <NavItem icon={<FaSearch />} label="Search" active={false} mobile={true} onClick={() => navigate("/gallery")} />
         <NavItem icon={<FaUser />} label="Profile" active={true} mobile={true} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        body { overflow: hidden; position: fixed; width: 100%; }
      `}} />
    </div>
  );
}