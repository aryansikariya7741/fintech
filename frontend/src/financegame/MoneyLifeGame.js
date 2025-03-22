import React, { useState, useEffect } from "react";

const MoneyLifeGame = () => {
  const [money, setMoney] = useState(5000);
  const [displayMoney, setDisplayMoney] = useState(5000);
  const [job, setJob] = useState("Unemployed");
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState(1000);
  const [message, setMessage] = useState("");
  const [age, setAge] = useState(18); // Start at 18 years old
  const [married, setMarried] = useState(false);
  const [children, setChildren] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  const [stocks, setStocks] = useState(0);
  const [crypto, setCrypto] = useState(0);
  const [realEstate, setRealEstate] = useState(0);
  const [loan, setLoan] = useState(0);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [savings, setSavings] = useState(0);

  const [stockPrice, setStockPrice] = useState(100); // Initial stock price

  // Job List (Some jobs require minimum age)
  const jobList = [
    { name: "Intern", salary: 3000, upgrade: "Junior Engineer", newSalary: 5000, minAge: 18 },
    { name: "Software Engineer", salary: 6000, upgrade: "Senior Engineer", newSalary: 9000, minAge: 22 },
    { name: "Doctor", salary: 8000, upgrade: "Specialist", newSalary: 15000, minAge: 25 },
    { name: "Entrepreneur", salary: 5000, upgrade: "Startup Founder", newSalary: 12000, minAge: 20 },
    { name: "Investor", salary: 7000, upgrade: "Hedge Fund Manager", newSalary: 20000, minAge: 30 },
    { name: "Freelancer", salary: 4000, upgrade: "Consultant", newSalary: 8000, minAge: 18 },
  ];

  // Random Life Events
  const lifeEvents = [
    { message: "💍 You got married! Expenses increased by $2000.", effect: () => { setMarried(true); setExpenses(expenses + 2000); } },
    { message: "👶 You had a child! Expenses increased by $1500.", effect: () => { setChildren(children + 1); setExpenses(expenses + 1500); } },
    { message: "🏥 Medical Emergency! Lost $3000.", effect: () => setMoney(money - 3000) },
    { message: "🎉 You won a small lottery! Gained $5000.", effect: () => setMoney(money + 5000) },
    { message: "🎓 You went back to college. Expenses increased by $1000.", effect: () => setExpenses(expenses + 1000) },
  ];

  // Auto-increase age every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAge((prev) => prev + 1);

      // Trigger life events at certain ages
      if (age === 25 && !married) lifeEvents[0].effect();
      if (age === 28 && children === 0) lifeEvents[1].effect();
      if (age % 10 === 0) {
        const randomEvent = lifeEvents[Math.floor(Math.random() * lifeEvents.length)];
        randomEvent.effect();
        setMessage(randomEvent.message);
      }
    }, 5000); // Every 5 seconds = 1 year in-game

    return () => clearInterval(interval);
  }, [age]);

  // Select Job
  const selectJob = (selectedJob) => {
    if (age >= selectedJob.minAge) {
      setJob(selectedJob.name);
      setSalary(selectedJob.salary);
      setMessage(`✅ You are now a ${selectedJob.name}, earning $${selectedJob.salary} per month!`);
      setSelectedJob(selectedJob);
    } else {
      setMessage("❌ You are too young for this job!");
    }
  };

  // Upgrade Job
  const upgradeJob = () => {
    if (selectedJob?.upgrade) {
      setJob(selectedJob.upgrade);
      setSalary(selectedJob.newSalary);
      setMessage(`🚀 Promoted to ${selectedJob.upgrade}! New salary: $${selectedJob.newSalary}`);
    } else {
      setMessage("❌ No upgrade available for this job.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMoney((prev) => prev + salary + passiveIncome + realEstate * 2000 - expenses);
    }, 3000);

    return () => clearInterval(interval);
  }, [money, salary, expenses, passiveIncome, realEstate]);

  return (
    <div style={{ textAlign: "center", backgroundColor: "#1e1e1e", color: "white", padding: "20px", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#00ffcc", marginBottom: "10px" }}>💰 Money Life Simulator</h1>

      <div style={{ background: "#2a2a2a", padding: "15px", borderRadius: "10px", width: "80%", margin: "10px auto", boxShadow: "0px 0px 10px rgba(0, 255, 204, 0.5)" }}>
        <h2>💵 Money: <span style={{ fontSize: "24px", fontWeight: "bold", color: "#00ffcc" }}>${money.toFixed(2)}</span></h2>
        <p>👶 Age: {age} years</p>
        <p>👔 Job: {job} | 💸 Salary: ${salary} | 📉 Expenses: ${expenses}</p>
        <p>💍 Married: {married ? "Yes" : "No"} | 👶 Children: {children}</p>
        <p>🏡 Properties Owned: {realEstate} (Rent: ${realEstate * 2000}/month)</p>
        <p>📈 Stock Price: ${stockPrice.toFixed(2)}</p>
        <p>🏦 Savings: ${savings.toFixed(2)} (Interest: 1%/month)</p>
        <p style={{ fontSize: "16px", fontWeight: "bold", color: "yellow", marginTop: "10px" }}>{message}</p>
      </div>

      <h3>🏢 Choose Your Job:</h3>
      {jobList.map((job) => (
        <button key={job.name} onClick={() => selectJob(job)} style={{ padding: "10px", margin: "5px", backgroundColor: "#007bff", color: "white", borderRadius: "5px", cursor: "pointer" }}>
          {job.name} (${job.salary}/month, Age {job.minAge}+)
        </button>
      ))}

      <button onClick={upgradeJob} style={{ padding: "10px", margin: "5px", backgroundColor: "#ff9800", color: "white", borderRadius: "5px", cursor: "pointer" }}>
        🚀 Upgrade Job
      </button>
    </div>
  );
};

export default MoneyLifeGame;
