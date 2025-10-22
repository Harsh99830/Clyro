import React from "react";

export default function Card({ name, image, date, location, onClick }) {
  return (
    <div
      className="w-full max-w-sm rounded-2xl overflow-hidden cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] transform transition-all duration-500 group-hover:scale-105 bg-gray-700">
        {/* Image with gradient overlay */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/10 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-600/50 backdrop-blur-sm rounded-full text-gray-200 border border-gray-500/30">
              {date}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 group-hover:text-gray-200 transition-colors duration-300 text-gray-100">
            {name}
          </h2>
          
          <div className="flex items-center text-sm text-gray-300">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/10 to-gray-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
    </div>
  );
}
