import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message || "OTP sent to your email");

      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className=" text-gray-500 max-w-96 w-full mx-4 md:py-10 md:px-6 px-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10 transition-all"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#283389]">
          Forgot Password?
        </h2>
        <p className="mb-4 text-center text-gray-600 text-sm">
          We'll send you a 6-digit OTP to your registered email to reset your password.
        </p>

        <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#283389] text-sm mb-4 transition"
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#283389] hover:bg-[#1e2766] text-white py-2.5 rounded-full active:scale-95 transition"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
