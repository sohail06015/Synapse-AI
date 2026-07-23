import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // your own auth
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="fixed z-50 w-full backdrop-blur-md bg-white/60 border-b border-gray-200 shadow-sm flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      {/* Logo */}
      <img
        src={assets.syn}
        alt="synapse"
        className="w-28 sm:w-40 cursor-pointer font-logo transition-transform duration-300 hover:scale-105"
        onClick={() => navigate("/")}
      />

      {/* Right side */}
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 font-body">
            Hi, <span className="font-semibold">{user?.name || "User"}</span>
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition duration-300 font-body"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-2xl text-sm px-6 py-3 bg-gradient-to-r from-[#283389] to-[#1f2a6e] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out "
        >
          Get started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
