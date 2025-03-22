import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

const Stocks = ({ wallet, setWallet, portfolio, setPortfolio, transactions, setTransactions }) => {
    const [stocks, setStocks] = useState([]);
    const [priceHistory, setPriceHistory] = useState({});

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
                    ? { quantity: prev[stock.name].quantity + 1, purchasePrice: prev[stock.name].purchasePrice }
                    : { quantity: 1, purchasePrice: stock.price }
            }));

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
                    delete updatedPortfolio[stock.name];
                }
                return updatedPortfolio;
            });

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
    );
};

export default Stocks;
