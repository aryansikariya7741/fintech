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
  const [loanInterestRate, setLoanInterestRate] = useState(0.05); // 5% interest rate
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [savings, setSavings] = useState(0);

  const [stockPrice, setStockPrice] = useState(100); // Initial stock price
  const [propertyValue, setPropertyValue] = useState(50000); // Initial property value

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
    { message: "🚗 Car repair needed! Lost $2000.", effect: () => setMoney(money - 2000) },
    { message: "🏠 Home renovation! Lost $4000.", effect: () => setMoney(money - 4000) },
    { message: "💼 Business investment failed! Lost $5000.", effect: () => setMoney(money - 5000) },
    { message: "🛠️ Appliance repair needed! Lost $1000.", effect: () => setMoney(money - 1000) },
    { message: "🚑 Health insurance premium increased! Expenses increased by $500.", effect: () => setExpenses(expenses + 500) },
  ];

  // Auto-increase age every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAge((prev) => prev + 1);

      // Trigger life events at certain ages
      if (age === 25 && !married) lifeEvents[0].effect();
      if (age === 28 && children === 0) lifeEvents[1].effect();
      if (age % 5 === 0) {
        const randomEvent = lifeEvents[Math.floor(Math.random() * lifeEvents.length)];
        randomEvent.effect();
        setMessage(randomEvent.message);
      }

      // Check for retirement condition
      if (age === 60) {
        if (money >= 1000000) {
          setMessage("🎉 Congratulations! You have successfully retired with sufficient money to enjoy your retirement!");
        } else {
          setMessage("😢 You have reached retirement age but do not have enough money to enjoy your retirement.");
        }
        clearInterval(interval);
      }
    }, 2000); // Every 2 seconds = 1 year in-game

    return () => clearInterval(interval);
  }, [age, money]);

  // Increase property value over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPropertyValue((prev) => prev * 1.02); // Increase property value by 2% every interval
    }, 6000); // Every 6 seconds

    return () => clearInterval(interval);
  }, []);

  // Deduct loan amount with interest periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (loan > 0) {
        const interest = loan * loanInterestRate;
        setLoan(loan + interest);
        setMoney(money - interest);
        setMessage(`💸 Loan interest deducted: $${interest.toFixed(2)}`);
      }
    }, 6000); // Every 6 seconds

    return () => clearInterval(interval);
  }, [loan, loanInterestRate, money]);

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

  // Buy Property
  const buyProperty = () => {
    if (money >= propertyValue) {
      setRealEstate(realEstate + 1);
      setMoney(money - propertyValue);
      setMessage("🏡 You bought a property!");
    } else {
      setMessage("❌ Not enough money to buy a property.");
    }
  };

  // Sell Property
  const sellProperty = () => {
    if (realEstate > 0) {
      setRealEstate(realEstate - 1);
      setMoney(money + propertyValue);
      setMessage("🏡 You sold a property!");
    } else {
      setMessage("❌ No properties to sell.");
    }
  };

  // Take Loan
  const takeLoan = (amount) => {
    setLoan(loan + amount);
    setMoney(money + amount);
    setMessage(`💰 You took a loan of $${amount}`);
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
        <p>🏠 Property Value: ${propertyValue.toFixed(2)}</p>
        <p>💳 Loan: ${loan.toFixed(2)} (Interest: {loanInterestRate * 100}%/month)</p>
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

      <h3>🏡 Manage Properties:</h3>
      <button onClick={buyProperty} style={{ padding: "10px", margin: "5px", backgroundColor: "#4caf50", color: "white", borderRadius: "5px", cursor: "pointer" }}>
        🏠 Buy Property (${propertyValue.toFixed(2)})
      </button>
      <button onClick={sellProperty} style={{ padding: "10px", margin: "5px", backgroundColor: "#f44336", color: "white", borderRadius: "5px", cursor: "pointer" }}>
        🏠 Sell Property (${propertyValue.toFixed(2)})
      </button>

      <h3>💳 Manage Loans:</h3>
      <button onClick={() => takeLoan(10000)} style={{ padding: "10px", margin: "5px", backgroundColor: "#9c27b0", color: "white", borderRadius: "5px", cursor: "pointer" }}>
        💰 Take Loan ($10,000)
      </button>
      <button onClick={() => takeLoan(50000)} style={{ padding: "10px", margin: "5px", backgroundColor: "#9c27b0", color: "white", borderRadius: "5px", cursor: "pointer" }}>
        💰 Take Loan ($50,000)
      </button>
    </div>
  );
};

export default MoneyLifeGame;