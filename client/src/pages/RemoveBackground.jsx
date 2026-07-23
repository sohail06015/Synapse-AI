import { Eraser, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const { user, token } = useAuth(); // Make sure to destructure token

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Debug: Check auth status
    console.log("Current auth state:", { user, token });

    if (!token) {
      toast.error("You must be logged in to use this tool.");
      return;
    }

    if (!input) {
      toast.error("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", input);

    try {
      setLoading(true);
      toast.loading("Removing background...", { id: "bg-remove" });

      const { data } = await axios.post("/api/ai/remove-background", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token directly
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setImage(data.imageUrl || data.image); // Handle both response formats
        toast.success("Background removed successfully!", { id: "bg-remove" });
      } else {
        toast.error(data.message || "Something went wrong", {
          id: "bg-remove",
        });
      }
    } catch (error) {
      console.error("Background removal error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to process image";
      toast.error(errorMsg, { id: "bg-remove" });

      // If 401 Unauthorized, suggest re-login
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (!user.isPremium) {
    toast.error("Upgrade to premium to access Bg remover");
    return;
  }
  const handleDownload = () => {
    if (!image) return;
    window.open(image, "_blank");
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-col md:flex-row items-start gap-4 text-slate-700">
      {/* Upload Section */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:max-w-lg bg-white p-4 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            onChange={(e) => setInput(e.target.files?.[0])}
            type="file"
            accept="image/*"
            className="hidden"
            id="file-upload"
            required
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            {input ? (
              <img
                src={URL.createObjectURL(input)}
                alt="Preview"
                className="max-h-60 mb-2 rounded"
              />
            ) : (
              <>
                <Eraser className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB)
                </p>
              </>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !input}
          className={`w-full flex justify-center items-center gap-2 ${
            loading || !input
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-tr from-[#f6ab41] to-[#ff4938] hover:opacity-90"
          } text-white px-4 py-2 mt-4 text-sm rounded-lg transition-all`}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* Result Section */}
      <div className="w-full md:max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eraser className="w-5 h-5 text-[#ff4938]" />
            <h1 className="text-xl font-semibold">Processed Image</h1>
          </div>
          {image && (
            <button
              onClick={handleDownload}
              className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
            >
              Download
            </button>
          )}
        </div>

        {image ? (
          <div className="mt-4 flex-1 flex flex-col">
            <img
              src={image}
              alt="Processed Output"
              className="rounded border border-gray-200 max-h-[400px] object-contain"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Right click and "Save image as" to download
            </p>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
              <p className="text-center">
                Upload an image and click <br />
                "Remove Background" to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
