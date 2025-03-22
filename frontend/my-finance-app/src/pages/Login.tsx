import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect after login
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">🎮 Welcome Back, Player! 🎮</h2>
        <p className="text-gray-600">Log in to continue your finance adventure.</p>
        {message && <p className="text-red-500">{message}</p>}

        <form onSubmit={handleLogin} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
            🚀 Log In
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          New here? <a href="/signup" className="text-purple-700">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
