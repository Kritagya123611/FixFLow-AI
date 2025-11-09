import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Signup() {
  function loginGoogle() {
    window.location.href = "http://localhost:5000/auth/google";
  }
  function loginGithub() {
    window.location.href = "http://localhost:5000/auth/github";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Sign in to continue to FixFlow
        </p>

        {/* Google */}
        <button
          onClick={loginGoogle}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        {/* GitHub */}
        <button
          onClick={loginGithub}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition mt-3"
        >
          <FaGithub className="text-xl" />
          Continue with GitHub
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
