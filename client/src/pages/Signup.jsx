import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:3000";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", form);
      toast.success(res.data.message || "OTP sent to your email");
      setIsOtpSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify", {
        email: form.email,
        otp,
      });

      const { token, user, message } = res.data;

      login(token, user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(message || "Signup successful");
      navigate("/ai");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={isOtpSent ? handleVerifyOtp : handleSignup}
      className="flex flex-col items-center text-sm text-slate-800 min-h-screen justify-center px-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
    >
      <p className="text-s bg-[#d9dbf7] text-[#283389] font-medium px-3 py-1 rounded-full">
        Join Us
      </p>
      <h1 className="text-4xl font-bold py-4 text-center">
        Sign up for <span className="text-[#283389]">Sunapse AI</span>
      </h1>
      <p className="max-md:text-sm text-gray-600 pb-8 text-center">
        Already have an account?{" "}
        <span
          className="text-[#283389] font-medium hover:underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Log in
        </span>
      </p>

      <div className="max-w-96 w-full px-4">
        {!isOtpSent ? (
          <>
            {/* Full Name */}
            <label htmlFor="name" className="font-medium">Full Name</label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-[#283389] transition-all overflow-hidden">
              <svg width="20" height="20" fill="#475569" viewBox="0 0 20 20">
                <path d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0" />
              </svg>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="h-full px-2 w-full outline-none bg-transparent"
                required
              />
            </div>

            {/* Email */}
            <label htmlFor="email" className="font-medium">Email Address</label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-[#283389] transition-all overflow-hidden">
              <svg width="20" height="20" fill="#475569" viewBox="0 0 20 20">
                <path d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z" />
              </svg>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="h-full px-2 w-full outline-none bg-transparent"
                required
              />
            </div>

            {/* Password */}
            <label htmlFor="password" className="font-medium">Password</label>
            <div className="flex items-center mt-2 mb-2 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-[#283389] transition-all overflow-hidden">
              <svg width="20" height="20" fill="#475569" viewBox="0 0 20 20">
                <path d="M15 9.375H5a.938.938 0 0 0-.938.938v5.625c0 .518.42.937.938.937h10a.938.938 0 0 0 .938-.937v-5.625a.938.938 0 0 0-.938-.938m-5 5.625a.938.938 0 1 1 0-1.875.938.938 0 0 1 0 1.875M13.125 7.5A3.125 3.125 0 0 0 6.875 7.5V9.375h6.25V7.5Z" />
              </svg>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="h-full px-2 w-full outline-none bg-transparent"
                required
              />
            </div>
          </>
        ) : (
          <>
            <label htmlFor="otp" className="font-medium">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP sent to your email"
              className="w-full mt-2 mb-4 border border-slate-300 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#283389] transition"
              required
            />
          </>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-1 mt-4 bg-[#283389] hover:bg-[#1e2766] text-white py-2.5 w-full rounded-full transition"
        >
          {loading ? "Processing..." : isOtpSent ? "Verify OTP" : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default Signup;
