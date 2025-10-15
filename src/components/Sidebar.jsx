import React from "react";
import {
  FaHome,
  FaPhotoVideo,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { SignOutButton } from "@clerk/clerk-react";

export default function Sidebar({ isOpen }) {
  return (
    <div
  className={`bg-gray-900 text-gray-200 h-screen transition-all duration-300 ${
    isOpen
      ? `${window.innerWidth < 1024 ? "w-54 p-5 pt-8" : "w-64 p-5 pt-8"}`
      : "w-0 p-0 overflow-hidden"
  }`}
>

      {isOpen && (
        <ul className="space-y-6">
          <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
            <FaHome size={24} />
            <span className="font-medium text-lg">Home</span>
          </li>

          <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
            <FaPhotoVideo size={24} />
            <span className="font-medium text-lg">Gallery</span>
          </li>

          <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
            <FaCog size={24} />
            <span className="font-medium text-lg">Settings</span>
          </li>

          <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
            <FaUser size={24} />
            <span className="font-medium text-lg">Profile</span>
          </li>

          {/* ✅ Logout Button (Smooth Clerk Integration) */}
          <li className="flex items-center gap-4 hover:bg-red-400 hover:text-black rounded-md p-3 cursor-pointer transition">
            <FaArrowLeft size={24} />
            <SignOutButton redirectUrl="/">
              <span className="font-medium text-lg">Logout</span>
            </SignOutButton>
          </li>
        </ul>
      )}
    </div>
  );
}

// import React, { useState } from "react";
// import {
//   FaHome,
//   FaPhotoVideo,
//   FaCog,
//   FaUser,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { SignOutButton } from "@clerk/clerk-react";
// import Loader from "./Loader.jsx"; // Ensure Loader component is imported

// export default function Sidebar({ isOpen }) {
//   const [loggingOut, setLoggingOut] = useState(false);

//   return (
//     <div
//       className={`bg-gray-900 text-gray-200 h-screen transition-all duration-300 ${
//         isOpen ? "w-64 p-5 pt-8" : "w-0 p-0 overflow-hidden"
//       }`}
//     >
//       {loggingOut && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
//           <Loader />
//         </div>
//       )}

//       {isOpen && (
//         <ul className="space-y-6 relative z-10">
//           <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
//             <FaHome size={24} />
//             <span className="font-medium text-lg">Home</span>
//           </li>

//           <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
//             <FaPhotoVideo size={24} />
//             <span className="font-medium text-lg">Gallery</span>
//           </li>

//           <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
//             <FaCog size={24} />
//             <span className="font-medium text-lg">Settings</span>
//           </li>

//           <li className="flex items-center gap-4 hover:bg-blue-100 hover:text-black rounded-md p-3 cursor-pointer transition">
//             <FaUser size={24} />
//             <span className="font-medium text-lg">Profile</span>
//           </li>

//           {/* ✅ Smooth Logout Button */}
//           <li
//             className="flex items-center gap-4 hover:bg-red-400 hover:text-black rounded-md p-3 cursor-pointer transition"
//             onClick={() => setLoggingOut(true)}
//           >
//             <FaArrowLeft size={24} />
//             <SignOutButton redirectUrl="/">
//               <span className="font-medium text-lg">Logout</span>
//             </SignOutButton>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// }