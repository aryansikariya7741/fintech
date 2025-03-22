import React, { useState } from "react";
import TradingDashboard from "./TradingDashboard";

const Game = () => {
    const [wallet, setWallet] = useState(10000);
    const [portfolio, setPortfolio] = useState({});
    
    return (
        <TradingDashboard 
            wallet={wallet} 
            setWallet={setWallet} 
            portfolio={portfolio} 
            setPortfolio={setPortfolio} 
        />
    );
};

export default Game;
