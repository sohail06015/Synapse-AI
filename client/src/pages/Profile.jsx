import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    isPremium: user?.isPremium || false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put("/api/user/update", form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetRedirect = () => {
    navigate(`/reset-password?email=${form.email}`);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full px-4 py-2 border rounded mt-1 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Plan</label>
          <input
            type="text"
            name="plan"
            value={form.isPremium ? "Premium" : "Free"}
            disabled
            className="w-full px-4 py-2 border rounded mt-1 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Reset Password */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-2">
          We will send an OTP to your email to reset password.
        </p>
        <button
          onClick={handleResetRedirect}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Reset Password
        </button>
      </div>

      {/* Upgrade Plan */}
      {!form.isPremium && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
          <p className="text-sm text-gray-600 mb-3">
            Unlock all premium features and benefits.
          </p>
          <button
            onClick={() => navigate("/ai/upgrade")}
            className="bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white px-6 py-2 rounded"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
