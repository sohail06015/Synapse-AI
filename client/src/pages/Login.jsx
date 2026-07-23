import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:3000";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      const { token, user, message } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(token, user);

      toast.success(message || "Login successful");
      navigate("/ai");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center text-sm text-slate-800 min-h-screen justify-center px-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"
      >
        <p className="text-s bg-[#d9dbf7] text-[#283389] font-medium px-3 py-1 rounded-2xl">
          Welcome Back
        </p>
        <h1 className="text-4xl font-bold py-4 text-center">
          Log in to <span className="text-[#283389]">SynapseAI</span>
        </h1>
        <p className="max-md:text-sm text-gray-600 pb-8 text-center">
          Don’t have an account?{" "}
          <span
            className="text-[#283389] font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up here
          </span>
        </p>

        <div className="max-w-96 w-full px-4">
          {/* Email */}
          <label htmlFor="email" className="font-medium">
            Email Address
          </label>
          <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-[#283389] transition-all overflow-hidden">
            <svg
              width="20"
              height="20"
              fill="#475569"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z" />
            </svg>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="h-full px-2 w-full outline-none bg-transparent"
              placeholder="Enter your email address"
              required
            />
          </div>

          {/* Password */}
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <div className="flex items-center mt-2 mb-2 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-[#283389] transition-all overflow-hidden">
            <svg
              width="20"
              height="20"
              fill="#475569"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 9.375H5a.938.938 0 0 0-.938.938v5.625c0 .518.42.937.938.937h10a.938.938 0 0 0 .938-.937v-5.625a.938.938 0 0 0-.938-.938m-5 5.625a.938.938 0 1 1 0-1.875.938.938 0 0 1 0 1.875M13.125 7.5A3.125 3.125 0 0 0 6.875 7.5V9.375h6.25V7.5Z" />
            </svg>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="h-full px-2 w-full outline-none bg-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-sm text-right mb-4">
            <span
              className="text-[#283389] font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-1 mt-2 bg-[#283389] hover:bg-[#1e2766] text-white py-2.5 w-full rounded-full transition"
          >
            Log In
            <svg
              className="mt-0.5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m18.038 10.663-5.625 5.625a.94.94 0 0 1-1.328-1.328l4.024-4.023H3.625a.938.938 0 0 1 0-1.875h11.484l-4.022-4.025a.94.94 0 0 1 1.328-1.328l5.625 5.625a.935.935 0 0 1-.002 1.33"
                fill="#fff"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
