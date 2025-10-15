import React from "react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  return (
    <div
      onClick={handleClick} // CLICK HERE
      className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-md shadow-md transition-all"
    >
      <h3 className="text-xl font-bold">{event.name}</h3>
      <p>{event.date}</p>
    </div>
  );
}