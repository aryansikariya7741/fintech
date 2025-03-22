import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const response = await fetch("http://localhost:5001/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data.user);
      } catch {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-green-500 text-white text-center">
      {user ? (
        <h1>Welcome, {user.name}! 🎉 Your financial journey begins!</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default Dashboard;
