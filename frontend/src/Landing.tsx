import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <div className="text-center max-w-2xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight">
          Automate Your CI/CD Workflow
        </h1>

        <p className="text-grey-700 text-lg max-w-lg mx-auto">
          FixFlow AI intelligently monitors pipelines, analyzes failures, and triggers automated actions to keep engineering moving fast.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-4 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-blue-900/40"
        >
          Get Started
        </button>
      </div>

      {/* Optional: small footer note */}
      <p className="absolute bottom-6 text-xs text-gray-600">
        Built for Developers & DevOps Teams 
      </p>
    </div>
  );
}
