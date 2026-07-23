import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200-1600 words)" },
  ];

  const { user, token } = useAuth();
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/ai/generate-article",
        {
          prompt: input,
          length: selectedLength.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent(data.article || "No content received.");
      toast.success("Article generated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while generating"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Input Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-tr from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <>
              <Edit className="w-5" />
              Generate Article
            </>
          )}
        </button>
      </form>

      {/* Output Display */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3 mb-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        <div className="h-[480px] overflow-y-auto pr-2 text-sm text-slate-600 whitespace-pre-wrap">
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <div className="flex-1 flex justify-center items-center h-full text-gray-400 flex-col gap-3">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and click “Generate article” to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
