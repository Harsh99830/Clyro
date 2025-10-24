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
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  const cards = [
    { 
      name: "Sunset Vista", 
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      date: "OCT 22, 2025",
      location: "Beachfront, California"
    },
    { 
      name: "Mountain Peak", 
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&w=1200&q=80",
      date: "NOV 15, 2025",
      location: "Rocky Mountains, CO"
    },
    { 
      name: "City Lights", 
      image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&w=1200&q=80",
      date: "DEC 5, 2025",
      location: "Downtown, New York"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30"></div>
      </div>

      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex pt-20 relative z-10">
        <Sidebar isOpen={sidebarOpen} />

        <div className={`flex-1 transition-all duration-500 p-4 sm:p-8 ${sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-4">
                Discover Amazing Events
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Explore our curated collection of upcoming events. Find something that excites you!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card, index) => (
                <div key={index} className="flex justify-center">
                  <Card
                    name={card.name}
                    image={card.image}
                    date={card.date}
                    location={card.location}
                    onClick={() => onCardClick(card)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}