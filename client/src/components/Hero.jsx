import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";
import Example from "./HeroExample";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate("/ai");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative">
      <div className="px-4 sm:px-20 xl:px-32 flex flex-col justify-center items-center text-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-5xl font-semibold leading-tight font-logo">
            AI Tools to <br />
            <span className="text-[#283389]">Supercharge Your Creativity</span>
          </h1>
          <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl text-gray-600 text-sm sm:text-base mx-auto font-body">
            Effortlessly create blogs, generate visuals, and streamline your
            work with our powerful suite of AI tools.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
          <button
            onClick={handleStartClick}
            className="bg-[#283389] text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition font-body"
          >
            Start Creating Now
          </button>

          <button className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition font-body">
            Watch Demo
          </button>
        </div>

        <br />
        <br />
        <Example />
      </div>

      {/* Gradient fade to blend Hero with next section */}
      <div className="h-10 bg-gradient-to-b from-transparent to-[#f3f4fa]" />
    </div>
  );
};

export default Hero;
