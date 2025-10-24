import React from "react";

export default function Login({ onStart }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-96 text-center border-2 border-white transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-200">Welcome to Clyro</h1>
        <p className="text-gray-400 mb-6">Enter your email and password to get started</p>

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-600 w-full mb-4 p-3 rounded-xl bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-600 w-full mb-6 p-3 rounded-xl bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
        />

        <button
          onClick={onStart}
          className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl w-full hover:bg-gray-400 font-semibold transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
