import React from "react";

export default function Card({ name, image, onClick }) {
  return (
    <div
      className="w-96 h-[420px] rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 border-2 border-black relative"
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />
      {/* Text overlay on image */}
      <div className="absolute bottom-6 left-6">
        <h2 className="text-3xl font-extrabold text-white drop-shadow-xl">
          {name}
        </h2>
      </div>
    </div>
  );
}
