import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace this with your actual API key
const apiKey = "AIzaSyDkztJoXq_9ZkSFsfCuvBHJ0MY-9fkggeM";
const genAI = new GoogleGenerativeAI(apiKey);

const InvestmentTracker = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chatSession = model.startChat({
        history: newMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chatSession.sendMessage(input);
      const botMessage = result.response.text();

      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Error fetching response.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Investment Guide Chatbot 💰</h1>

      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={styles.botMessage}>⌛ Typing...</div>}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Ask about investments..."
        />
        <button onClick={sendMessage} style={styles.sendButton}>🚀 Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0f0f0f",
    color: "#00ffcc",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "0px 0px 10px #00ffcc",
  },
  chatWindow: {
    width: "80%",
    height: "60vh",
    backgroundColor: "#1a1a1a",
    border: "2px solid #00ffcc",
    borderRadius: "10px",
    padding: "10px",
    overflowY: "auto",
    marginBottom: "20px",
  },
  userMessage: {
    backgroundColor: "#222",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    margin: "5px",
    textAlign: "right",
  },
  botMessage: {
    backgroundColor: "#00ffcc",
    color: "#000",
    padding: "10px",
    borderRadius: "5px",
    margin: "5px",
    textAlign: "left",
  },
  inputContainer: {
    display: "flex",
    width: "80%",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "2px solid #00ffcc",
    backgroundColor: "#1a1a1a",
    color: "#00ffcc",
    borderRadius: "5px",
    marginRight: "10px",
  },
  sendButton: {
    backgroundColor: "#00ffcc",
    color: "#000",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default InvestmentTracker;
