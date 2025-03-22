import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Button, Tabs, Tab } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";

const TradingDashboard = ({ wallet, setWallet, portfolio, setPortfolio }) => {
    const [stocks, setStocks] = useState([]);
    const [priceHistory, setPriceHistory] = useState({});
    const [tabIndex, setTabIndex] = useState(0);
    const [transactions, setTransactions] = useState([]); // Stores transaction history

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get("/stocks.json"); 
                setStocks(response.data);

                const initialHistory = response.data.reduce((acc, stock) => {
                    acc[stock.name] = [{ time: new Date().toLocaleTimeString(), price: stock.price }];
                    return acc;
                }, {});
                setPriceHistory(initialHistory);
            } catch (error) {
                console.error("Error loading stock data:", error);
            }
        };
        fetchStocks();
    }, []);

    useEffect(() => {
        const updatePrices = setInterval(() => {
            setStocks(stocks.map(stock => {
                const fluctuation = stock.fluctuation;
                const newPrice = Math.max(stock.price + stock.price * (Math.random() * fluctuation * 2 - fluctuation), 10);

                setPriceHistory(prev => ({
                    ...prev,
                    [stock.name]: [...(prev[stock.name] || []), { time: new Date().toLocaleTimeString(), price: newPrice }]
                }));

                return { ...stock, price: newPrice };
            }));
        }, 5000);

        return () => clearInterval(updatePrices);
    }, [stocks]);

    const buyStock = (stock) => {
        if (wallet >= stock.price) {
            setWallet(wallet - stock.price);
            setPortfolio(prev => ({
                ...prev,
                [stock.name]: prev[stock.name] 
                    ? { 
                        quantity: prev[stock.name].quantity + 1, 
                        purchasePrice: prev[stock.name].purchasePrice 
                    }
                    : { 
                        quantity: 1, 
                        purchasePrice: stock.price 
                    }
            }));

            // Add to transaction history
            setTransactions(prev => [...prev, { 
                type: "BUY", 
                stock: stock.name, 
                price: stock.price.toFixed(2), 
                time: new Date().toLocaleString() 
            }]);
        } else {
            alert("Not enough money!");
        }
    };

    const sellStock = (stock) => {
        if (portfolio[stock.name] && portfolio[stock.name].quantity > 0) {
            const newQuantity = portfolio[stock.name].quantity - 1;

            setWallet(wallet + stock.price);
            setPortfolio(prev => {
                const updatedPortfolio = { ...prev };
                if (newQuantity > 0) {
                    updatedPortfolio[stock.name] = { 
                        quantity: newQuantity, 
                        purchasePrice: prev[stock.name].purchasePrice 
                    };
                } else {
                    delete updatedPortfolio[stock.name]; // Removes stock completely when quantity is 0
                }
                return updatedPortfolio;
            });

            // Add to transaction history
            setTransactions(prev => [...prev, { 
                type: "SELL", 
                stock: stock.name, 
                price: stock.price.toFixed(2), 
                time: new Date().toLocaleString() 
            }]);
        } else {
            alert("You don’t own this stock!");
        }
    };

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
                                        details ? ( // Only show stocks that still exist
                                            <li key={stock}>{stock}: {details.quantity} shares</li>
                                        ) : null
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No stocks owned</Typography>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transaction History Panel */}
                    <Card sx={{ bgcolor: "#232323", color: "#fff", marginTop: 2 }}>
                        <CardContent>
                            <Typography variant="h5"><ReceiptIcon /> Transaction History</Typography>
                            {transactions.length > 0 ? (
                                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                    <ul>
                                        {transactions.map((tx, index) => (
                                            <li key={index}>
                                                <Typography variant="body2" sx={{ color: tx.type === "BUY" ? "green" : "red" }}>
                                                    {tx.type} {tx.stock} @ ₹{tx.price} ({tx.time})
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <Typography>No transactions yet</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Stock Market & Performance */}
                <Grid item xs={12} md={8}>
                    <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} textColor="primary">
                        <Tab label="Stock Market" />
                        <Tab label="Stock Performance" />
                    </Tabs>

                    {tabIndex === 0 && (
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            {stocks.map(stock => {
                                const priceChange = ((stock.price - (priceHistory[stock.name]?.[0]?.price || stock.price)) / stock.price) * 100;

                                return (
                                    <Grid item xs={12} md={6} key={stock.name}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{stock.name} ({stock.sector})</Typography>
                                                <Typography variant="body2">Price: ₹{stock.price.toFixed(2)}</Typography>
                                                <Typography variant="body2" sx={{ color: priceChange > 0 ? "green" : "red" }}>
                                                    {priceChange.toFixed(2)}% {priceChange > 0 ? "▲" : "▼"}
                                                </Typography>
                                                <Button variant="contained" color="success" onClick={() => buyStock(stock)}>Buy</Button>
                                                <Button variant="contained" color="error" onClick={() => sellStock(stock)} sx={{ marginLeft: 2 }}>Sell</Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default TradingDashboard;
