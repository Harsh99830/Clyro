import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <div className="relative flex justify-center items-center h-screen bg-[#020202] overflow-hidden">
      
      {/* --- BACKGROUND DECORATION (Matches Landing) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      {/* --- CLERK SIGN IN CARD --- */}
      <div className="relative z-10 scale-110">
        <SignIn 
          path="/sign-in" 
          routing="path" 
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#06b6d4", // The Cyan-500 color
              colorBackground: "#0a0a0a",
              colorText: "white",
              colorInputBackground: "#171717",
              colorInputText: "white",
              borderRadius: "1rem",
            },
            elements: {
              card: "border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
              headerTitle: "font-black tracking-tighter uppercase text-2xl italic",
              headerSubtitle: "text-[10px] tracking-[0.3em] uppercase opacity-50",
              socialButtonsBlockButton: "border-white/10 hover:bg-white/5 transition-all",
              formButtonPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-xs",
              footerActionLink: "text-cyan-500 hover:text-cyan-400",
              dividerLine: "bg-white/10",
              dividerText: "text-[8px] uppercase tracking-widest opacity-30"
            }
          }}
        />
      </div>

      {/* --- HUD DECORATION --- */}
      <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
        <p className="text-[10px] font-black tracking-[0.5em] uppercase">Auth_Gateway_v3</p>
      </div>
    </div>
  );
}