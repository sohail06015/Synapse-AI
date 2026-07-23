import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email") || "";

  const [form, setForm] = useState({
    email: emailFromQuery,
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  // Handle OTP box changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1); // Only digit
    const otpArray = form.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").padEnd(6, "");
    setForm({ ...form, otp: newOtp });

    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !form.otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasteData.length === 6) {
      setForm({ ...form, otp: pasteData });
      pasteData.split("").forEach((char, idx) => {
        if (otpRefs.current[idx]) {
          otpRefs.current[idx].value = char;
        }
      });
      otpRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", form);
      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 max-w-96 mx-4 md:py-10 md:px-6 px-4 py-8 text-left text-sm rounded-lg transition-all shadow-[0px_0px_10px_0px] shadow-black/10 w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#283389]">
          Reset Password
        </h2>
        <p className="mb-1">Enter the OTP sent to your email</p>
        <p className="text-gray-500/60 text-sm mb-4 break-all">{form.email}</p>

        {/* OTP Input */}
        <div
          className="flex items-center justify-between gap-2 mb-6"
          onPaste={handlePaste}
        >
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-input w-10 h-10 border border-gray-300 outline-none rounded text-center text-lg focus:border-[#283389] transition duration-300"
              ref={(el) => (otpRefs.current[index] = el)}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              required
            />
          ))}
        </div>

        {/* New Password Input */}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#283389] text-sm mb-4"
          required
          disabled={loading}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#283389] py-2.5 rounded text-white active:scale-95 transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
