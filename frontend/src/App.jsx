import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, useAuth, useUser } from "@clerk/clerk-react";
import Home from "./pages/Home.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Profile from "./pages/Profile.jsx";
import AdminSignIn from "./Admin/AdminSignIn.jsx";
import AdminHome from "./Admin/Home.jsx";
import AdminProtectedRoute from "./Admin/AdminProtectedRoute.jsx";
import FolderView from "./Admin/FolderView.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing.jsx";
import { saveUserToRealtimeDB } from "./utils/firebase.js";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  return children;
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      saveUserToRealtimeDB(user);
    }
  }, [isSignedIn, user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) setSidebarOpen(false);
      else if (window.innerWidth >= 1024 && !sidebarOpen) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // --- UPDATED CLERK THEME FOR WHITE BG / BLACK TEXT ---
  const clerkTheme = {
    variables: {
      colorBackground: "#ffffff", // White background for the card
      colorText: "#000000",       // Black text for the main body
      colorInputBackground: "#f4f4f5", // Light grey inputs
      colorInputText: "#000000",
      colorPrimary: "#000000",    // Primary buttons in black
    },
    elements: {
      card: "bg-white border border-black/10 shadow-xl rounded-none",
      headerTitle: "text-black uppercase tracking-tighter font-black",
      headerSubtitle: "text-gray-600",
      formButtonPrimary: "bg-black hover:bg-gray-800 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-none transition-all",
      formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-black mb-1",
      formFieldInput: "bg-white border border-black/20 text-black rounded-none h-12 px-4 focus:ring-1 focus:ring-black focus:border-black transition-all",
      footerActionText: "text-gray-600",
      footerActionLink: "text-black hover:underline font-black",
      dividerLine: "bg-black/10",
      dividerText: "text-black text-[10px] uppercase font-bold",
      socialButtonsBlockButton: "bg-white border border-black/10 hover:bg-gray-50 transition-all",
      socialButtonsBlockButtonText: "text-black font-bold",
    },
  };

  const handleCardClick = (card) => {
    navigate(`/event/${card.name}`, { state: { card } });
  };

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-[#030303]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminSignIn />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/home" replace />} />
            <Route path="home" element={<AdminHome />} />
            <Route path=":folderName" element={<FolderView />} />
          </Route>

          {/* 3. AUTH ROUTES (PAGE BACKGROUND SET TO WHITE) */}
          <Route path="/sign-in/*" element={
            <div className="flex items-center justify-center min-h-screen bg-white">
               <SignIn routing="path" path="/sign-in" appearance={clerkTheme} afterSignInUrl="/home" signUpUrl="/sign-up" />
            </div>
          } />
          <Route path="/sign-up/*" element={
            <div className="flex items-center justify-center min-h-screen bg-white">
               <SignUp routing="path" path="/sign-up" appearance={clerkTheme} afterSignUpUrl="/home" signInUrl="/sign-in" />
            </div>
          } />

          <Route path="/home" element={
            <ProtectedRoute>
              <Home sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} onCardClick={handleCardClick} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/event/:eventId" element={
            <ProtectedRoute>
              <EventDetail sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default AppWrapper;