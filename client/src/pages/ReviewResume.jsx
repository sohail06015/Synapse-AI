import { FileText, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
// Set baseURL from env
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [review, setReview] = useState("");
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
      toast.error("You must be logged in to review your resume.");
      return;
    }

    if (!user.isPremium) {
      toast.error("Upgrade to premium to access resume review.");
      return;
    }

    if (!input) {
      toast.error("Please upload a resume PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", input);

    try {
      setLoading(true);
      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Resume review response:", data); // ✅ for debugging

      if (data.success) {
        setReview(
          data.review || data.feedback || "No review content received."
        );
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Resume Review Error:", error);
      toast.error(error.response?.data?.message || "Failed to review resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg bg-white p-4 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Review Resume</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Resume</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF resumes only.
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-tr from-[#00da83] to-[#009bb3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        {!review ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600 whitespace-pre-wrap">
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
