import { Image, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const ImageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && !user.isPremium) {
      toast.error("Upgrade to premium to access AI image generation");
    }
  }, [user]);

  if (!user?.isPremium) return null;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to use this feature");
      return;
    }

    try {
      setLoading(true);
      const prompt = `Generate a ${selectedStyle} image of: ${input}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        {
          prompt,
          imageStyle: selectedStyle,
          isPublic: publish,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (data.success) {
        setImage(data.imageUrl); // ✅ fixed
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    window.open(image, "_blank"); // ✅ opens in new tab
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column - Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00ad25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe what you want to see in the image..."
          required
        />

        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {ImageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer inline-block w-9 h-5">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-all duration-300"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-4"></span>
          </label>
          <p>Make this image Public</p>
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-tr from-[#00ad25] to-[#04ff50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right Column - Result */}
      <div className="w-full md:max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-[#00ad25]" />
            <h1 className="text-xl font-semibold">Processed Image</h1>
          </div>
          {image && (
            <button
              onClick={handleDownload}
              className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
            >
              Open
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
              Click “Open” to view and download the image.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p className="text-center">
                Enter a prompt and click <br />
                “Generate Image” to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
