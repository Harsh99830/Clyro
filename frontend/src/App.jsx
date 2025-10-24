import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useAuth } from "@clerk/clerk-react";
import Home from "./pages/Home.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import AdminSignIn from "./Admin/AdminSignIn.jsx";
import AdminHome from "./Admin/Home.jsx";
import AdminProtectedRoute from "./Admin/AdminProtectedRoute.jsx";
import { motion, AnimatePresence } from "framer-motion";

// Admin Layout Component
const AdminLayout = () => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Protected Route Component for regular users
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
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all",
      formFieldInput: "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
    },
  };

  const handleCardClick = (card) => {
    navigate(`/event/${card.name}`, { state: { card } });
  };

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gray-900">
          <Routes>
            {/* Admin Routes - Accessible without general sign in */}
            <Route path="/admin/login" element={<AdminSignIn />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/home" replace />} />
              <Route path="home" element={<AdminHome />} />
              {/* Add more admin routes here */}
            </Route>

            {/* Regular User Routes */}
            <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignIn routing="path" path="/sign-up" />} />
            
            <Route element={
              <>
                <SignedIn>
                  <Outlet />
                </SignedIn>
                <SignedOut>
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center justify-center min-h-screen"
                  >
                    <div className="flex items-center justify-center min-h-screen px-4">
                      <div className="w-full max-w-md">
                        <SignIn
                          appearance={clerkTheme}
                          afterSignInUrl="/"
                          signUpUrl="/sign-up"
                        />
                      </div>
                    </div>
                  </motion.div>
                </SignedOut>
              </>
            }>
              <Route
                path="/"
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
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
    </AnimatePresence>
  );
}

export default AppWrapper;
