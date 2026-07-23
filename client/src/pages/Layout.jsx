import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext"; // ✅ Your own context

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useAuth(); // ✅ use custom auth

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      {/* Top Navigation Bar */}
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img
          src={assets.syn}
          alt="Logo"
          className="cursor-pointer w-32 sm:w-44"
          onClick={() => navigate("/")}
        />

        {/* Mobile Menu Toggle */}
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      {/* Main Layout Body */}
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        {/* Page Content */}
        <div className="flex-1 bg-[#F4F7FB] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-sm">Please login to access this page.</p>
    </div>
  );
};

export default Layout;
