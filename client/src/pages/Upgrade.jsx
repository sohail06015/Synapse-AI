import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRedirectToPayment = () => {
    navigate("/ai/payment"); // 🔁 Navigate to payment page
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Upgrade to Premium</h1>

      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2">Premium Plan - ₹499</h2>
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          <li>✅ Unlimited Image Generation</li>
          <li>✅ Background Remover</li>
          <li>✅ Resume Review</li>
          <li>✅ Priority Support</li>
        </ul>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-1">Billed to:</h3>
          <p className="text-sm">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <button
          onClick={handleRedirectToPayment}
          className="mt-6 w-full bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white py-2 rounded hover:opacity-90"
        >
          Pay Now ₹499
        </button>
      </div>
    </div>
  );
};

export default Upgrade;
