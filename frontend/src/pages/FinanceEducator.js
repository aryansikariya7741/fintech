import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// API Keys
const GEMINI_API_KEY = "AIzaSyDkztJoXq_9ZkSFsfCuvBHJ0MY-9fkggeM"; // Replace with your actual API key
const NEWS_API_KEY = "c94bc6d8524143e88a181a5890b8466a"; // Replace with your actual API key

// Google AI Setup
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are a finance educator. When asked for course recommendations, 
    always return a list of courses in bullet points (•) without additional text. 
    Each course should include:
    - Course name
    - Platform (e.g., Coursera, Udemy, edX)
    - A short description (one sentence)
    - A URL (if available)

    Example Response:
    • **Investing 101** - Coursera: Learn the basics of stock market investing. [Link](https://www.coursera.org)
    • **Personal Finance for Beginners** - Udemy: Master budgeting, saving, and debt management. [Link](https://www.udemy.com)
    • **Financial Markets** - Yale University (edX): Understand market forces and investment strategies. [Link](https://www.edx.org)

    Do not add explanations, greetings, or extra information. Just return the course list in this format.
  `,
});

const FinanceEducator = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch finance news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${NEWS_API_KEY}`
        );
        setNews(res.data.articles.slice(0, 5)); // Show top 5 news
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  // Handle AI response
  const getFinanceCourses = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const chatSession = model.startChat({
        history: [{ role: "user", parts: [{ text: query }] }],
      });

      const result = await chatSession.sendMessage(query);
      setResponse(result.response.text());
    } catch (error) {
      console.error("AI Error:", error);
      setResponse("Error fetching response.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📈 Finance Educator</h1>

      {/* Course Search Section */}
      <div style={styles.inputSection}>
        <input
          type="text"
          placeholder="Ask for finance courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={getFinanceCourses} style={styles.button}>🎓 Search</button>
      </div>

      {/* AI Response */}
      <div style={styles.response}>
        {loading ? <p>⌛ Loading...</p> : <p dangerouslySetInnerHTML={{ __html: response }}></p>}
      </div>

      {/* Finance News Section */}
      <h2 style={styles.newsTitle}>📰 Latest Finance News</h2>
      <ul style={styles.newsList}>
        {news.map((article, index) => (
          <li key={index} style={styles.newsItem}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={styles.newsLink}>
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#00ffcc",
    height: "100vh",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textShadow: "0px 0px 10px #00ffcc",
  },
  inputSection: {
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    border: "2px solid #00ffcc",
    backgroundColor: "#1a1a1a",
    color: "#00ffcc",
    borderRadius: "5px",
    width: "60%",
    marginRight: "10px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#00ffcc",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  response: {
    marginTop: "20px",
    fontSize: "16px",
  },
  newsTitle: {
    marginTop: "40px",
    fontSize: "20px",
  },
  newsList: {
    listStyle: "none",
    padding: "0",
  },
  newsItem: {
    marginTop: "10px",
  },
  newsLink: {
    color: "#00ffcc",
    textDecoration: "none",
    fontSize: "16px",
  },
};

export default FinanceEducator;
