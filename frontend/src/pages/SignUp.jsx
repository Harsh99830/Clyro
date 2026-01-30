import React from "react";
import { SignUp, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useNavigate } from "react-router-dom";
import { saveUserToRealtimeDB } from "../utils/firebase.js";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleAfterSignUp = async () => {
    if (user) {
      await saveUserToRealtimeDB(user);
      navigate('/home');
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-[#020202] overflow-hidden">
      
      {/* --- 1. AMBIENT BACKGROUND (Matches Landing/SignIn) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]" />
        
        {/* Subtle Scan Line */}
        <div className="w-full h-[1px] bg-cyan-500/10 absolute top-1/4 animate-pulse" />
      </div>

      {/* --- 2. CLERK SIGN UP CARD --- */}
      <div className="relative z-10 scale-100 lg:scale-110">
        <SignUp 
          path="/sign-up" 
          routing="path" 
          afterSignUpUrl="/home"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#06b6d4", // Clyro Cyan
              colorBackground: "#0a0a0a",
              colorText: "white",
              colorInputBackground: "#171717",
              colorInputText: "white",
              borderRadius: "1rem",
            },
            elements: {
              card: "border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a]",
              headerTitle: "font-black tracking-tighter uppercase text-2xl italic",
              headerSubtitle: "text-[10px] tracking-[0.3em] uppercase opacity-50",
              socialButtonsBlockButton: "border-white/10 hover:bg-white/5 transition-all",
              formButtonPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs py-3",
              footerActionLink: "text-cyan-500 hover:text-cyan-400",
              dividerLine: "bg-white/10",
              dividerText: "text-[8px] uppercase tracking-widest opacity-30",
              identityPreviewText: "text-white/70",
              formFieldLabel: "text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1"
            }
          }}
        />
      </div>

      {/* --- 3. HUD DECORATION --- */}
      <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
        <div className="flex flex-col items-end">
          <p className="text-[10px] font-black tracking-[0.5em] uppercase">Identity_Creation</p>
          <div className="w-12 h-[1px] bg-cyan-500/50 mt-1" />
        </div>
      </div>
    </div>
  );
}