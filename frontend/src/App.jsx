import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, useAuth, useUser } from "@clerk/clerk-react";
import Home from "./pages/Home.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Profile from "./pages/Profile.jsx"; // Import your new Profile page
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

// Protected Route Component for User Vault
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) return null; // Wait for Clerk to load

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) setSidebarOpen(false);
      else if (window.innerWidth >= 1024 && !sidebarOpen) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const clerkTheme = {
    layout: { pageBackground: "#030303" },
    elements: {
      card: "bg-[#0a0a0a] border border-white/5 shadow-2xl",
      headerTitle: "text-white uppercase tracking-tighter font-black",
      headerSubtitle: "text-gray-500",
      formButtonPrimary: "bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase tracking-widest text-[10px] py-3 rounded-none transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]",
      formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-gray-400",
      formFieldInput: "bg-white/[0.03] border-white/10 text-white rounded-none focus:ring-cyan-500 focus:border-cyan-500",
      footerActionText: "text-gray-500",
      footerActionLink: "text-cyan-500 hover:text-cyan-400 font-bold",
      identityPreviewText: "text-white",
      identityPreviewEditButtonIcon: "text-cyan-500"
    },
  };

  const handleCardClick = (card) => {
    navigate(`/event/${card.name}`, { state: { card } });
  };

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-[#030303]">
        <Routes>
          {/* 1. PUBLIC LANDING PAGE */}
          <Route path="/" element={<Landing />} />

          {/* 2. ADMIN ROUTES */}
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

          {/* 3. AUTH ROUTES */}
          <Route path="/sign-in/*" element={
            <div className="flex items-center justify-center min-h-screen bg-[#030303]">
               <SignIn routing="path" path="/sign-in" appearance={clerkTheme} afterSignInUrl="/home" signUpUrl="/sign-up" />
            </div>
          } />
          <Route path="/sign-up/*" element={
            <div className="flex items-center justify-center min-h-screen bg-[#030303]">
               <SignUp routing="path" path="/sign-up" appearance={clerkTheme} afterSignUpUrl="/home" signInUrl="/sign-in" />
            </div>
          } />

          {/* 4. USER VAULT ROUTES (Now Protected) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onCardClick={handleCardClick}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <ProtectedRoute>
                <EventDetail
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
              </ProtectedRoute>
            }
          />

          {/* 5. WILDCARD REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default AppWrapper;