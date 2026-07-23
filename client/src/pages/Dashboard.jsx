import React, { useEffect, useState } from "react";
import { Gem, Sparkles, FileText, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [filteredType, setFilteredType] = useState("all");
  const [activePlan, setActivePlan] = useState("Free");
  const [expandedId, setExpandedId] = useState(null);

  const { user } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/ai/user/creations", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCreations(data.creations || []);
      setActivePlan(user?.isPremium ? "Premium" : "Free");
    } catch (err) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    if (user) getDashboardData();
  }, [user]);

  const filteredCreations =
    filteredType === "all"
      ? creations
      : creations.filter((item) => item.type === filteredType);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">{activePlan}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C6] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 mb-4 flex gap-3 flex-wrap items-center">
        {["all", "image", "article"].map((type) => (
          <button
            key={type}
            onClick={() => setFilteredType(type)}
            className={`px-4 py-1 rounded-full text-sm border capitalize ${
              filteredType === type
                ? "bg-blue-100 text-blue-600 border-blue-300"
                : "text-gray-600 border-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Creations */}
      <div className="space-y-3">
        <p className="mb-2 text-lg font-medium text-slate-700">Recent Creations</p>
        {filteredCreations.length === 0 ? (
          <p className="text-gray-400 text-sm">No creations yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCreations.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg border p-4 shadow-sm cursor-pointer"
                onClick={() =>
                  setExpandedId((prev) => (prev === item._id ? null : item._id))
                }
              >
                <div className="flex justify-between items-center text-slate-600 mb-2">
                  <span className="text-sm font-medium capitalize">{item.type}</span>
                  {item.type === "image" ? (
                    <ImageIcon className="w-4 h-4 text-sky-500" />
                  ) : (
                    <FileText className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-xs mb-2 text-gray-500 line-clamp-2">{item.prompt}</p>
                {item.type === "image" ? (
                  <img
                    src={item.result}
                    alt="Generated"
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="text-xs text-slate-600 whitespace-pre-wrap mt-2">
                    <ReactMarkdown>
                      {expandedId === item._id
                        ? item.result
                        : item.result.slice(0, 200) + (item.result.length > 200 ? "..." : "")}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
