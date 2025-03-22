import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/dashboard";
import Game from "./pages/Game";
import InvestmentTracker from "./pages/InvestmenGuide";
import FinanceEducator from "./pages/FinanceEducator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/investment-guide" element={<InvestmentTracker />} />
        <Route path="/finance-educator" element={<FinanceEducator />} />
      </Routes>
    </Router>
  );
}

export default App;
