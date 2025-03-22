import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = ({ portfolio = {}, priceHistory = {}, fixedDeposits = [], goldInvestments = [], cryptoInvestments = [] }) => {
    const [stockData, setStockData] = useState([]);
    const [fdData, setFdData] = useState([]);
    const [goldData, setGoldData] = useState([]);
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
        // Stock Investment Trend
        const stockTrend = Object.keys(portfolio).map(stock => ({
            name: stock,
            value: (portfolio[stock]?.quantity || 0) * (priceHistory[stock]?.slice(-1)[0]?.price || 0),
        }));
        setStockData(stockTrend);

        // Fixed Deposits Trend
        const fdTrend = fixedDeposits.map((fd, index) => ({
            name: `FD-${index + 1}`,
            value: fd.maturityAmount || 0,
        }));
        setFdData(fdTrend);

        // Gold Investment Trend
        const goldTrend = goldInvestments.map((gold, index) => ({
            name: `Gold-${index + 1}`,
            value: (gold.amount || 0) * (gold.pricePerGram || 0),
        }));
        setGoldData(goldTrend);

        // Crypto Investment Trend
        const cryptoTrend = cryptoInvestments.map((crypto, index) => ({
            name: crypto.name.toUpperCase(),
            value: crypto.amount * crypto.price,
        }));
        setCryptoData(cryptoTrend);
    }, [portfolio, priceHistory, fixedDeposits, goldInvestments, cryptoInvestments]);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {/* Stocks Graph */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">📈 Stocks Investment Trend</Typography>
                        {stockData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stockData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography>No stock investments</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Fixed Deposits Graph */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">🏦 Fixed Deposits Growth</Typography>
                        {fdData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={fdData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography>No fixed deposits</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Gold Investments Graph */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">🏆 Gold Investment Trend</Typography>
                        {goldData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={goldData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography>No gold investments</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Cryptocurrency Graph */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">💰 Cryptocurrency Investments</Typography>
                        {cryptoData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={cryptoData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography>No cryptocurrency investments</Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Analytics;
