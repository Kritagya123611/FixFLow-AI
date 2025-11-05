export default function Signup() {
  function loginGoogle() {
    window.location.href = "http://localhost:5000/auth/google";
  }
  function loginGithub() {
    window.location.href = "http://localhost:5000/auth/github";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>

        <button
          onClick={loginGoogle}
          className="w-full flex justify-center items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Sign In with Google
        </button>

        <button
          onClick={loginGithub}
          className="w-full flex justify-center items-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition"
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}
