import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AiTools = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="px-4 sm:px-20 xl:px-32 py-16"
      style={{
        background: "linear-gradient(135deg, #f9f9fc, #f3f4fa)",
      }}
    >
      <div className="text-center">
        <h2 className="text-[#283389] text-3xl sm:text-4xl font-bold font-logo mb-2">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto font-body text-sm sm:text-base">
          Everything you need to create, enhance, and optimize your content
          using cutting-edge AI.
        </p>
      </div>

      <div className="flex flex-wrap mt-12 justify-center gap-6">
        {AiToolsData.map((tool, index) => {
          const IconComponent = tool.Icon;
          return (
            <div
              key={index}
              className="group p-6 sm:p-8 max-w-xs w-full rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
              onClick={() =>
                isAuthenticated ? navigate(tool.path) : navigate("/login")
              }
            >
              <div
                className="w-14 h-14 flex items-center justify-center rounded-xl text-white mb-6 shadow-md"
                style={{
                  background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
                }}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold text-[#283389] font-body mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-500 text-sm font-body">
                {tool.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiTools;
