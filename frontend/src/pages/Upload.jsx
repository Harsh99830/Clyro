import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHome, FaPhotoVideo, FaUser, FaCloudUploadAlt, 
  FaSignInAlt, FaSignOutAlt, FaTimes, FaFileImport, FaCheckCircle 
} from "react-icons/fa";
import { SignOutButton, useAuth, useUser } from "@clerk/clerk-react";

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

export default function Upload() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const simulateUpload = () => {
    if (files.length === 0) return;
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setFiles([]);
          setUploadProgress(0);
          alert("ASSETS DEPLOYED SUCCESSFULLY TO VAULT");
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="h-screen w-full bg-[#030303] text-white relative flex flex-col lg:flex-row font-mono overflow-hidden">
      
      {/* --- BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-72 h-full border-r border-white/5 flex-col bg-transparent z-40">
        <div className="h-32 flex items-center px-10">
          <div className="text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => navigate("/")}>CLYRO</div>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <NavItem icon={<FaHome />} label="Landing" active={false} onClick={() => navigate("/")} />
            <NavItem icon={<FaPhotoVideo />} label="Gallery" active={false} onClick={() => navigate("/home")} />
            <NavItem icon={<FaCloudUploadAlt />} label="Upload" active={true} />
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
            <div onClick={() => navigate("/sign-in")} className="flex items-center gap-4 text-cyan-500 hover:text-white cursor-pointer">
              <FaSignInAlt size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col z-10 relative h-full">
        <div className="flex-1 overflow-y-auto p-6 lg:p-20 custom-scrollbar pb-32">
          <div className="max-w-4xl mx-auto">
            
            <header className="mb-12">
              <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                INITIALIZE <span className="text-cyan-500">UPLOAD_</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">System Status: Authorized // Ready for Input</p>
            </header>

            {/* DROPZONE */}
            <div className="relative group">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 lg:p-24 flex flex-col items-center justify-center gap-6 bg-white/[0.01] group-hover:bg-cyan-500/[0.02] group-hover:border-cyan-500/30 transition-all duration-500">
                <div className="p-6 bg-white/5 rounded-full text-cyan-500 group-hover:scale-110 transition-transform">
                  <FaFileImport size={32} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest">Drag & Drop Assets</p>
                  <p className="text-[10px] text-gray-600 uppercase mt-1 tracking-widest">or click to browse local storage</p>
                </div>
              </div>
            </div>

            {/* FILE LIST */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 space-y-3"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Queue: {files.length} Items</span>
                    <button onClick={() => setFiles([])} className="text-[10px] font-black text-red-500 uppercase tracking-widest">Clear All</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {files.map((file, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl"
                      >
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-8 h-8 bg-cyan-500/10 rounded flex items-center justify-center text-cyan-500 text-[10px] font-bold">
                            {i + 1}
                          </div>
                          <span className="text-[10px] font-bold truncate text-gray-300 uppercase">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-white transition-colors">
                          <FaTimes size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="pt-8">
                    <button 
                      disabled={isUploading}
                      onClick={simulateUpload}
                      className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? `UPLOADING ${uploadProgress}%` : 'TRANSMIT TO VAULT'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* --- MOBILE NAVIGATION DOCK --- */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl z-[60] flex items-center justify-around px-2 shadow-2xl">
          <NavItem icon={<FaHome />} label="Home" active={false} mobile={true} onClick={() => navigate("/")} />
          <NavItem icon={<FaPhotoVideo />} label="Gallery" active={false} mobile={true} onClick={() => navigate("/home")} />
          <NavItem icon={<FaCloudUploadAlt />} label="Upload" active={true} mobile={true} />
          <NavItem 
            icon={isSignedIn ? <FaUser /> : <FaSignInAlt className="text-cyan-500"/>} 
            label={isSignedIn ? "Profile" : "Join"} 
            active={false} 
            mobile={true} 
            onClick={() => navigate(isSignedIn ? "/profile" : "/sign-in")} 
          />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        body { overflow: hidden; position: fixed; width: 100%; }
        main { -webkit-overflow-scrolling: touch; }
      `}} />
    </div>
  );
}