import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography, Tabs, Tab } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CryptoMarket from "./CryptoMarket";
import FixedDeposits from "./FixedDeposits";
import GoldInvestment from "./GoldInvestment";
import Analytics from "./Analytics";
import Stocks from "./Stocks";

const TradingDashboard = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [wallet, setWallet] = useState(() => {
        return Number(localStorage.getItem("wallet")) || 10000; // Default ₹10,000
    });
    const [portfolio, setPortfolio] = useState(() => {
        return JSON.parse(localStorage.getItem("portfolio")) || {};
    });
    const [transactions, setTransactions] = useState(() => {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    });
    const [priceHistory, setPriceHistory] = useState(() => {
        return JSON.parse(localStorage.getItem("priceHistory")) || {};
    });

    useEffect(() => {
        localStorage.setItem("wallet", wallet);
    }, [wallet]);

    useEffect(() => {
        localStorage.setItem("portfolio", JSON.stringify(portfolio));
    }, [portfolio]);

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem("priceHistory", JSON.stringify(priceHistory));
    }, [priceHistory]);

    return (
        <Container maxWidth="lg" style={{ marginTop: "20px" }}>
            <Grid container spacing={3}>
                
                {/* Wallet & Portfolio Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: "#121212", color: "#fff" }}>
                        <CardContent>
                            <Typography variant="h5">
                                <AccountBalanceIcon /> Wallet Balance: ₹{wallet.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Portfolio Section */}
                    <Card sx={{ bgcolor: "#1E1E1E", color: "#fff", marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h5"><ShoppingCartIcon /> Portfolio</Typography>
                            {Object.keys(portfolio).length > 0 ? (
                                <ul>
                                    {Object.entries(portfolio).map(([stock, details]) => (
                                        <li key={stock}>{stock}: {details.quantity} shares</li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No stocks owned</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transaction History */}
                    <Card sx={{ bgcolor: "#232323", color: "#fff", marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h5"><ReceiptIcon /> Transaction History</Typography>
                            {transactions.length > 0 ? (
                                <ul>
                                    {transactions.map((tx, index) => (
                                        <li key={index}>
                                            <Typography variant="body2" sx={{ color: tx.type === "BUY" ? "green" : "red" }}>
                                                {tx.type} {tx.stock} @ ₹{tx.price} ({tx.time})
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No transactions yet</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Market Tabs */}
                <Grid item xs={12} md={8}>
                    <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} textColor="primary">
                        <Tab label="Stocks" />
                        <Tab label="Cryptocurrency" />
                        <Tab label="Fixed Deposits" />
                        <Tab label="Gold" />
                        <Tab label="Analytics" />
                    </Tabs>

                    {/* Render Different Components Based on Tab Selection */}
                    {tabIndex === 0 && (
                        <Stocks 
                            wallet={wallet} 
                            setWallet={setWallet} 
                            portfolio={portfolio} 
                            setPortfolio={setPortfolio}
                            transactions={transactions}
                            setTransactions={setTransactions}
                        />
                    )}
                    {tabIndex === 1 && <CryptoMarket />}
                    {tabIndex === 2 && <FixedDeposits wallet={wallet} setWallet={setWallet} />}
                    {tabIndex === 3 && <GoldInvestment />}
                    {tabIndex === 4 && (
                        <Analytics 
                        portfolio={portfolio || {}} 
                        priceHistory={priceHistory || {}} 
                        fixedDeposits={JSON.parse(localStorage.getItem("fixedDeposits")) || []}
                        goldInvestments={JSON.parse(localStorage.getItem("goldInvestments")) || []}
                        cryptoInvestments={JSON.parse(localStorage.getItem("cryptoInvestments")) || []}
                        />
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default TradingDashboard;
