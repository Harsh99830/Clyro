import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useAuth } from "@clerk/clerk-react";
import Home from "./pages/Home.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import AdminSignIn from "./Admin/AdminSignIn.jsx";
import AdminHome from "./Admin/Home.jsx";
import AdminProtectedRoute from "./Admin/AdminProtectedRoute.jsx";
import FolderView from "./Admin/FolderView.jsx";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing.jsx";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
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
    layout: { pageBackground: "#1f2937" },
    elements: {
      formButtonPrimary: "bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-all",
      formFieldInput: "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500",
    },
  };

  const handleCardClick = (card) => {
    navigate(`/event/${card.name}`, { state: { card } });
  };

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gray-900">
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
            <div className="flex items-center justify-center min-h-screen bg-[#020202]">
               <SignIn routing="path" path="/sign-in" appearance={clerkTheme} afterSignInUrl="/home" signUpUrl="/sign-up" />
            </div>
          } />
          <Route path="/sign-up/*" element={
            <div className="flex items-center justify-center min-h-screen bg-[#020202]">
               <SignIn routing="path" path="/sign-up" appearance={clerkTheme} afterSignInUrl="/home" />
            </div>
          } />

          {/* 4. PUBLIC FEED ROUTES (Accessible without login as requested) */}
          <Route
            path="/home"
            element={
              <Home
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                onCardClick={handleCardClick}
              />
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <EventDetail
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
              />
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