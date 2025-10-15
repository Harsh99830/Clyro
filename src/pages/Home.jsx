import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function Home({ sidebarOpen, toggleSidebar, onCardClick }) {
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) toggleSidebar();
      else if (window.innerWidth >= 1024 && !sidebarOpen) toggleSidebar();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, toggleSidebar]);

  // 🔒 Scroll lock for mobile & small screens
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [sidebarOpen]);

  const cards = [
    { name: "Sunset Vista", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" },
    { name: "Mountain Peak", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&w=800&q=80" },
    { name: "City Lights", image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&w=800&q=80" },
  ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-50 to-cyan-200 relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex pt-20">
        <Sidebar isOpen={sidebarOpen} />

        <div className={`flex-1 transition-all duration-300 p-6 sm:p-8 ${sidebarOpen ? "ml-0 lg:ml-0" : "ml-0"}`}>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-wide">
            Events
          </h1>

          <div className="flex flex-wrap justify-center gap-x-10 gap-y-12 mt-6">
            {cards.map((card, index) => (
              <div key={index} className="flex-1 min-w-[280px] max-w-[350px] flex justify-center">
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