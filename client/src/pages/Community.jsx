import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ImagePlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Community = () => {
  const { user, token } = useAuth();
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized fetch function with error handling
  const fetchCreations = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/ai/community/images", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      // Normalize all IDs to strings and ensure likes array exists
      const normalizedCreations = (data.images || []).map(creation => ({
        ...creation,
        _id: creation._id?.toString(),
        likes: (creation.likes || []).map(id => id?.toString()),
        createdAt: new Date(creation.createdAt)
      }));

      setCreations(normalizedCreations);
    } catch (err) {
      console.error("Fetch creations error:", err);
      setError(err.response?.data?.message || "Failed to load community images");
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Optimized like handler with loading state
  const handleLikeToggle = async (imageId) => {
    if (!user?._id || !token) {
      toast.error("Please log in to like images");
      return;
    }

    try {
      // Optimistic UI update
      setCreations(prev => prev.map(item => {
        if (item._id !== imageId) return item;
        
        const isLiked = item.likes.includes(user._id.toString());
        return {
          ...item,
          likes: isLiked 
            ? item.likes.filter(id => id !== user._id.toString())
            : [...item.likes, user._id.toString()]
        };
      }));

      const { data } = await axios.post(
        `/api/ai/community/like/${imageId}`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      // Sync with server response
      setCreations(prev => prev.map(item => 
        item._id === imageId ? { 
          ...item, 
          likes: (data.likes || []).map(String) 
        } : item
      ));

      toast.success(
        data.likes.includes(user._id.toString()) ? "Liked!" : "Like removed"
      );
    } catch (err) {
      console.error("Like error:", err);
      
      // Revert optimistic update
      fetchCreations();
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to update like");
      }
    }
  };

  // Fetch data on mount and when token changes
  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  // Sort creations by like count and date
  const sortedCreations = React.useMemo(() => {
    return [...creations].sort((a, b) => {
      // Sort by like count (descending)
      const likeDiff = b.likes.length - a.likes.length;
      if (likeDiff !== 0) return likeDiff;
      
      // Then by creation date (newest first)
      return b.createdAt - a.createdAt;
    });
  }, [creations]);

  if (error) {
    return (
      <div className="flex-1 h-full flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error Loading Content</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={fetchCreations}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-700">
          Community Creations
        </h1>
        <button 
          onClick={fetchCreations}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedCreations.length === 0 ? (
        <div className="bg-white h-full flex flex-col justify-center items-center rounded-xl border border-dashed border-gray-300 p-10 text-gray-500 text-center">
          <ImagePlus className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-lg font-medium">No community images available</p>
          <p className="text-sm mt-2">
            Generate an image and publish it to appear here
          </p>
        </div>
      ) : (
        <div className="bg-white w-full rounded-xl overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCreations.map((creation) => {
            const isLiked = creation.likes.includes(user?._id?.toString());
            return (
              <div
                key={creation._id}
                className="relative group overflow-hidden rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <img
                  src={creation.result}
                  alt={`AI Creation: ${creation.prompt}`}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col justify-end p-4 text-white">
                  <p className="text-sm hidden group-hover:block line-clamp-2">
                    {creation.prompt}
                  </p>
                  <div className="flex gap-1 items-center justify-end mt-2">
                    <p className="text-xs">{creation.likes.length}</p>
                    <Heart
                      className={`w-5 h-5 cursor-pointer transition ${
                        isLiked ? "fill-red-500 text-red-500" : "text-white hover:text-red-400"
                      }`}
                      onClick={() => handleLikeToggle(creation._id)}
                      aria-label={isLiked ? "Unlike" : "Like"}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;