import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const plans = [
  {
    title: "Free",
    price: "₹0",
    description: "Ideal for individuals getting started",
    features: [
      "Write articles",
      "Generate blog titles",
      "Limited image generation",
    ],
    buttonText: "Start for Free",
    highlight: false,
    action: "free",
  },
  {
    title: "Premium",
    price: "₹599/mo",
    description: "Best for teams & heavy creators",
    features: [
      "All Free features",
      "Unlimited article generation",
      "Advanced image styles",
      "Resume review access",
      "Priority support",
      "Team access (coming soon)",
      "Remove background & objects",
    ],
    buttonText: "Go Premium",
    highlight: true,
    action: "premium",
  },
];

const Plan = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = (type) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      if (type === "premium") {
        navigate("/ai/upgrade");
      } else {
        navigate("/ai");
      }
    }
  };

  return (
    <div
      className="w-full p-10"
      style={{
        background: "linear-gradient(135deg, #f9f9fc, #f3f4fa)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 my-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-800">
            Choose Your Plan
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Start with a free plan or go premium to unlock the full potential of
            Synapse AI.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 justify-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative max-w-sm w-full mx-auto group transition-transform duration-300 hover:scale-105"
            >
              {plan.highlight && (
                <div className="absolute inset-x-0 -top-3 flex justify-center z-10">
                  <span className="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`mt-5 rounded-xl border-2 bg-white shadow-md group-hover:shadow-xl transition-shadow duration-300 ${
                  plan.highlight ? "border-[#283389]" : "border-gray-300"
                }`}
              >
                <div className="border-b p-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {plan.title}
                  </h3>
                  <p className="text-gray-500">{plan.description}</p>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">
                      {plan.price}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-600">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-[#283389]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t p-6">
                  <button
                    onClick={() => handleClick(plan.action)}
                    className={`w-full rounded-lg px-4 py-2 text-white font-medium transition-all duration-300 transform active:scale-95 cursor-pointer ${
                      plan.highlight
                        ? "bg-[#283389] hover:bg-[#1e2766]"
                        : "bg-gray-800 hover:bg-gray-900"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plan;
