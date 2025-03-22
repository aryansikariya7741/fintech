import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        // Create user with email & password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(collection(db, "users"), user.uid), {
          username,
          email,
          createdAt: new Date(),
        });

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/dashboard"); // Redirect to dashboard after successful login/signup
    } catch (err) {
      setError(err.message);
    }
  };

  // 🎨 Inline Styles (3D Fintech Theme)
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#000000",
      fontFamily: "Poppins, sans-serif",
    },
    box: {
      background: "linear-gradient(145deg, #0e0e0e, #1c1c1c)",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "10px 10px 20px #0a0a0a, -10px -10px 20px #2a2a2a",
      textAlign: "center",
      width: "400px",
      border: "2px solid #00ff99",
    },
    title: {
      color: "#00ff99",
      fontSize: "24px",
      fontWeight: "bold",
    },
    subtitle: {
      color: "#cccccc",
      fontSize: "14px",
      marginBottom: "10px",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginBottom: "10px",
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "2px solid #0080ff",
      outline: "none",
      background: "#121212",
      color: "white",
      fontSize: "16px",
      boxShadow: "inset 5px 5px 10px #0a0a0a, inset -5px -5px 10px #1f1f1f",
      transition: "all 0.3s ease",
    },
    button: {
      width: "100%",
      padding: "12px",
      marginTop: "12px",
      borderRadius: "6px",
      border: "none",
      background: "linear-gradient(145deg, #00ccff, #0080ff)",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "5px 5px 10px #000000, -5px -5px 10px #2a2a2a",
      transition: "transform 0.2s ease",
    },
    buttonHover: {
      transform: "scale(1.05)",
    },
    toggleText: {
      color: "#00ff99",
      fontSize: "14px",
      marginTop: "12px",
      cursor: "pointer",
      transition: "color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p style={styles.subtitle}>
          {isSignup ? "Join our financial learning journey 🚀" : "Login to continue 📈"}
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleAuth}>
          {isSignup && (
            <input
              type="text"
              placeholder="Username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => (e.target.style.transform = styles.buttonHover.transform)}
            onMouseLeave={(e) => (e.target.style.transform = "none")}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p style={styles.toggleText} onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
