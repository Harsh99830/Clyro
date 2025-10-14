import React, { useState, useEffect } from "react";
import Loader from "./components/Loader.jsx";
import Login from "./components/Login.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [loading, setLoading] = useState(true); // Loader ke liye
  const [started, setStarted] = useState(false); // Login page ke liye
  const [selectedCard, setSelectedCard] = useState(null);

  const user = { name: "Dhruv" };

  // Loader 2 sec
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Loader dikhega
  if (loading) return <Loader />;

  // Login page dikhega
  if (!started) return <Login onStart={() => setStarted(true)} />;

  // Get Started ke baad Home page dikhega
  return (
    <Home
      user={user}
      onCardClick={(card) => {
        setSelectedCard(card);
        // Future: card detail page flow
      }}
    />
  );
}
