import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Loader from "./components/Loader.jsx";
import Home from "./pages/Home.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import { motion, AnimatePresence } from "framer-motion";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const navigate = useNavigate(); // ✅ navigation hook

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // ✅ Toggle function

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) setSidebarOpen(false);
      else if (window.innerWidth >= 1024 && !sidebarOpen) setSidebarOpen(true);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);  

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const clerkTheme = {
    layout: { pageBackground: "#1f2937" },
    elements: {
      formButtonPrimary:
        "bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all",
      formFieldInput:
        "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
    },
  };

  // ✅ Card click handler
  const handleCardClick = (card) => {
    navigate(`/event/${card.name}`, { state: { card } });
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center bg-gray-900"
        >
          <Loader />
        </motion.div>
      ) : (
        <div className="min-h-screen bg-gray-900">
          <SignedIn>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    onCardClick={handleCardClick} // ✅ pass card click
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
            </Routes>
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
        </div>
      )}
    </AnimatePresence>
  );
}

export default AppWrapper;