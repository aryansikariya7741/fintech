import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/dashboard";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
