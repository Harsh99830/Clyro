import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function Home({ onCardClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const cards = [
    {
      name: "Sunset Vista",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Mountain Peak",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&w=800&q=80",
    },
    {
      name: "City Lights",
      image:
        "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&w=800&q=80",
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-50 to-cyan-200 relative overflow-x-hidden">
      {/* Navbar fixed */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex pt-20">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 p-6 sm:p-8 ${
            sidebarOpen ? "ml-0 lg:ml-0" : "ml-0"
          }`}
        >
          {/* Centered Heading */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-wide">
            Events
          </h1>

          {/* Cards container */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-12 mt-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex-1 min-w-[280px] max-w-[350px] flex justify-center"
              >
                <Card
                  name={card.name}
                  image={card.image}
                  onClick={() => onCardClick(card)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




