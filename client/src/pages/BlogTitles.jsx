import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState([]);

  const { user, token } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to use this feature");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        {
          prompt: input,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Split string into array if needed
        const list = data.title
          .split(/\n|•|-|\d+\./)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        setTitles(list);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate titles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-tr from-[#c341f6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <>
              <Hash className="w-5" />
              Generate Title
            </>
          )}
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        {titles.length === 0 ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click “Generate Title” to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-4">
            {titles.map((title, idx) => (
              <div
                key={idx}
                className="prose prose-sm text-slate-700 max-w-none"
              >
                <ReactMarkdown>{title}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
