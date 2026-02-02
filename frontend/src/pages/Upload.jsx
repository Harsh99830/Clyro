import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHome, FaPhotoVideo, FaUser, FaCloudUploadAlt, 
  FaSignInAlt, FaSignOutAlt, FaTimes, FaFileImport, FaFolderOpen, FaArrowLeft
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
        <span className={`${active ? 'scale-110' : ''}`}>{React.cloneElement(icon, { size: 18 })}</span>
        <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
        {active && <motion.div layoutId="activeTab" className="w-1 h-1 bg-cyan-500 rounded-full mt-0.5 shadow-[0_0_10px_#22d3ee]" />}
      </div>
    );
  }
  return (
    <li onClick={onClick} className={`group relative flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-500 ${active ? 'text-white' : 'text-gray-600 hover:text-cyan-400'}`}>
      <div className={`absolute left-0 w-1 h-0 bg-cyan-500 transition-all duration-500 ${active ? 'h-6' : 'group-hover:h-4 opacity-50'}`} />
      <span className="transition-transform duration-500 group-hover:scale-110">{React.cloneElement(icon, { size: 14 })}</span>
      <span className="text-[10px] font-black tracking-[0.3em] uppercase">{label}</span>
      {active && <div className="ml-auto w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_#22d3ee]" />}
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
  
  // Get folder name from URL params
  const { eventId } = useParams();
  const folderName = eventId || 'default';

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // --- DIRECT UPLOAD TO FOLDER ---
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('folder', folderName);
      
      files.forEach(file => {
        formData.append('file', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload files');
      }

      // Simulate progress for UI
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setFiles([]);
            setUploadProgress(0);
            alert(`ASSETS DEPLOYED TO [${folderName.toUpperCase()}] IN CLOUDFLARE`);
          }, 500);
        }
      }, 100);

    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`UPLOAD FAILED: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="h-screen w-full bg-[#030303] text-white relative flex flex-col lg:flex-row font-mono overflow-hidden">
      
      {/* BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 h-full border-r border-white/5 flex-col bg-transparent z-40">
        <div className="h-32 flex items-center px-10">
          <div className="text-2xl font-black tracking-tighter uppercase cursor-pointer" onClick={() => navigate("/")}>CLYRO</div>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <NavItem icon={<FaHome />} label="Landing" onClick={() => navigate("/")} />
            <NavItem icon={<FaPhotoVideo />} label="Gallery" onClick={() => navigate("/home")} />
            <NavItem icon={<FaCloudUploadAlt />} label="Upload" active={true} />
            <NavItem icon={isSignedIn ? <FaUser /> : <FaSignInAlt />} label={isSignedIn ? "Profile" : "Join Now"} onClick={() => navigate(isSignedIn ? "/profile" : "/sign-in")} />
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col z-10 relative h-full">
        <div className="flex-1 overflow-y-auto p-6 lg:p-20 custom-scrollbar pb-32">
          <div className="max-w-4xl mx-auto">
            
            <header className="mb-12">
              <div>
                <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                  UPLOAD TO{" "}
                  <span className="text-cyan-500">{folderName.toUpperCase()}</span>
                </h1>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">
                  // Status: Ready for Input | Files: {files.length}
                </p>
              </div>
            </header>

            <div className="space-y-12">
              <div className="relative group">
                <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 lg:p-24 flex flex-col items-center justify-center gap-6 bg-white/[0.01] group-hover:bg-cyan-500/[0.02] group-hover:border-cyan-500/30 transition-all duration-500">
                  <FaFileImport size={32} className="text-cyan-500" />
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest">Select Media Files</p>
                    <p className="text-[10px] text-gray-600 uppercase mt-1 tracking-widest">Total Selection: {files.length}</p>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                        <span className="text-[10px] font-bold truncate text-gray-400 uppercase">{file.name}</span>
                        <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-white"><FaTimes size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.5em] text-xs rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'UPLOADING...' : 'UPLOAD TO CLOUDFLARE'}
                  </button>
                </div>
              )}

              {isUploading && (
                <div className="p-10 bg-white/5 border border-white/5 rounded-3xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee]" 
                        initial={{ width: 0 }} 
                        animate={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 animate-pulse">
                      STREAMING TO CLOUDFLARE: {folderName.toUpperCase()}... {uploadProgress}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE NAV */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl z-[60] flex items-center justify-around px-2 shadow-2xl">
        <NavItem icon={<FaHome />} label="Home" onClick={() => navigate("/")} mobile />
        <NavItem icon={<FaPhotoVideo />} label="Gallery" onClick={() => navigate("/home")} mobile />
        <NavItem icon={<FaCloudUploadAlt />} label="Upload" active={true} mobile />
        <NavItem icon={isSignedIn ? <FaUser /> : <FaSignInAlt />} label="Join" onClick={() => navigate(isSignedIn ? "/profile" : "/sign-in")} mobile />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        body { overflow: hidden; position: fixed; width: 100%; }
      `}} />
    </div>
  );
}