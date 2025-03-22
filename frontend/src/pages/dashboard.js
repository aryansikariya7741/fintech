import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { motion } from "framer-motion";
import { auth, db } from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Wallet, TrendingUp, DollarSign, CreditCard, Trophy } from "lucide-react";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    };

    const fetchLeaderboard = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      let usersData = [];
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const sessionsCollectionRef = collection(db, "users", userDoc.id, "sessions");
        const sessionsQuery = query(sessionsCollectionRef, orderBy("wallet", "desc"), limit(1));
        const sessionsSnapshot = await getDocs(sessionsQuery);
        let walletBalance = 0;
        if (!sessionsSnapshot.empty) {
          walletBalance = sessionsSnapshot.docs[0].data().wallet || 0;
        }
        usersData.push({ id: userDoc.id, username: userData.username, balance: walletBalance });
      }

      usersData.sort((a, b) => b.balance - a.balance);
      setLeaderboard(usersData.slice(0, 5));
    };

    fetchUsername();
    fetchLeaderboard();
  }, []);

  const areaData = [
    { name: "Jan", amount: 4000 },
    { name: "Feb", amount: 3000 },
    { name: "Mar", amount: 5000 },
    { name: "Apr", amount: 2780 },
    { name: "May", amount: 6890 },
    { name: "Jun", amount: 5390 },
  ];

  const pieData = [
    { name: "Stocks", value: 400 },
    { name: "Crypto", value: 300 },
    { name: "Savings", value: 300 },
    { name: "Others", value: 200 },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#6366F1", "#8B5CF6"];

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#000000",
      padding: "20px",
      fontFamily: "Poppins, sans-serif",
      color: "#ffffff",
    },
    section: { marginBottom: "20px" },
    card: {
      background: "#1c1c1c",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "5px 5px 15px rgba(0, 255, 153, 0.3)",
      textAlign: "center",
      width: "250px",
      cursor: "pointer", // Make cards clickable
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    cardHover: {
      transform: "scale(1.05)",
      boxShadow: "5px 5px 20px rgba(0, 255, 153, 0.5)",
    },
    leaderboardCard: {
      background: "#1c1c1c",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "5px 5px 10px rgba(255, 215, 0, 0.3)",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Welcome Message */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>Welcome, {username || "User"}! 🚀</h1>
        <p style={{ color: "#9CA3AF" }}>Here's your financial dashboard.</p>
      </motion.div>

      {/* Finance Playground Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, boxShadow: "5px 5px 20px rgba(0, 255, 153, 0.5)" }}
          onClick={() => navigate("/game")} // Redirect to /games on click
        >
          <h2>Finance Playground</h2>
          <p>Explore investment opportunities and strategies.</p>
        </motion.div>
        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, boxShadow: "5px 5px 20px rgba(0, 255, 153, 0.5)" }}
          onClick={() => navigate("/expenses")} // Redirect to /expenses on click
        >
          <h2>Expense Tracker</h2>
          <p>Track and categorize your spending.</p>
        </motion.div>
        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, boxShadow: "5px 5px 20px rgba(0, 255, 153, 0.5)" }}
          onClick={() => navigate("/investment-guide")}
        >
          <h2>Investment Guide</h2>
          <p>Learn about smart investing.</p>
        </motion.div>
        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, boxShadow: "5px 5px 20px rgba(0, 255, 153, 0.5)" }}
          onClick={() => navigate("/finance-educator")}
        >
          <h2>Financial Education</h2>
          <p>Boost your knowledge with curated courses.</p>
        </motion.div>
        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, boxShadow: "5px 5px 20px rgba(0, 255, 153, 0.5)" }}
          onClick={() => navigate("/money-life")}
        >
          <h2>Life Money Simulation Game</h2>
          <p>Simulate life and financial decisions.</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
        <div style={styles.card}>
          <h2>Spending Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#10B981" fillOpacity={1} fill="#10B98133" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h2>Portfolio Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#FFD700" }}>🏆 Leaderboard</h2>
        {leaderboard.length > 0 ? (
          leaderboard.map((user, index) => (
            <div key={user.id} style={styles.leaderboardCard}>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                {index + 1}. {user.username || "Unknown User"}
              </p>
              <p style={{ color: "#9CA3AF" }}>Balance: ₹{user.balance?.toLocaleString() || "0.00"}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#9CA3AF" }}>No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;