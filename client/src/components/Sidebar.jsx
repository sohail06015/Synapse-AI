import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  PersonStanding,
  SquarePen,
  Users,
  MessageSquare,
} from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
   { to: "/ai/chat", label: "AI Chat", Icon: MessageSquare },
  { to: "/ai/profile", label: "Profile", Icon: Users },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: PersonStanding },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-100 flex flex-col justify-between items-center z-50
        max-sm:fixed top-14 bottom-0 max-sm:left-0 max-sm:backdrop-blur-md max-sm:bg-white/90
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} 
        transition-all duration-300 ease-in-out shadow-md`}
    >
      <div className="w-full">
        {user?.image && (
          <img
            src={user.image}
            alt="profile"
            className="w-14 h-14 rounded-full mx-auto mt-6 shadow"
          />
        )}

        <h1
          className="mt-2 text-center font-medium text-gray-800 cursor-pointer hover:text-[#5044E5] transition"
          onClick={() => {
            setSidebar(false);
            navigate("/ai/profile");
          }}
        >
          {user?.name}
        </h1>

        <div className="px-4 mt-6 text-sm text-gray-700 font-medium space-y-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
            >
              {({ isActive }) => (
                <div
                  className={`px-4 py-2.5 flex items-center gap-3 rounded-lg cursor-pointer transition-all group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-[#5044E5]"
                    } group-hover:scale-110`}
                  />
                  <span className="text-sm">{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full p-4 px-5 border-t border-gray-200">
        <div
          className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
          onClick={() => {
            setSidebar(false);
            navigate("/ai/profile");
          }}
        >
          {user?.image && (
            <img
              src={user.image}
              className="w-9 h-9 rounded-full shadow-sm"
              alt="profile"
            />
          )}
          <div>
            <h1 className="text-sm font-medium text-gray-800">{user?.name}</h1>
            <p className="text-xs text-gray-500">
              {user?.isPremium ? "Premium" : "Free"} Plan
            </p>
          </div>
          <LogOut
            onClick={logout}
            className="ml-auto w-4 h-4 text-gray-400 hover:text-red-500 transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
