import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Button, TextField } from "@mui/material";

const FixedDeposits = ({ wallet, setWallet }) => {
    const [fixedDeposits, setFixedDeposits] = useState(() => {
        const savedFDs = JSON.parse(localStorage.getItem("fixedDeposits")) || [];
        return savedFDs.map(fd => ({
            ...fd,
            maturityTime: new Date(fd.maturityTime).getTime()
        }));
    });

    const [amount, setAmount] = useState(5000);
    const [tenure, setTenure] = useState(5); // In minutes
    const [rate, setRate] = useState(7); // Interest rate

    const investInFD = () => {
        if (wallet >= amount) {
            setWallet(wallet - amount);
            const maturityAmount = amount * Math.pow(1 + rate / 100, tenure / 60); // Converted minutes to hours
            const maturityTime = new Date().getTime() + tenure * 60000; // Convert minutes to milliseconds

            const newFD = { amount, tenure, rate, maturityAmount, maturityTime };
            const updatedFDs = [...fixedDeposits, newFD];

            setFixedDeposits(updatedFDs);
            localStorage.setItem("fixedDeposits", JSON.stringify(updatedFDs));
        } else {
            alert("Insufficient balance to invest in FD.");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            setFixedDeposits(prev => {
                const updatedFDs = prev
                    .map(fd => {
                        const timeLeft = Math.max(0, fd.maturityTime - currentTime);
                        return { ...fd, timeLeft };
                    })
                    .filter(fd => {
                        if (fd.timeLeft === 0) {
                            setWallet(prevWallet => prevWallet + fd.maturityAmount);
                            return false;
                        }
                        return true;
                    });

                localStorage.setItem("fixedDeposits", JSON.stringify(updatedFDs));
                return updatedFDs;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [setWallet]);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
                <Card sx={{ padding: "20px" }}>
                    <Typography variant="h6">📈 Fixed Deposits</Typography>
                    <TextField
                        label="Investment Amount (₹)"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        sx={{ marginRight: 2, marginTop: 2 }}
                    />
                    <TextField
                        label="Tenure (minutes)"
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        sx={{ marginRight: 2, marginTop: 2 }}
                    />
                    <TextField
                        label="Interest Rate (%)"
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        sx={{ marginRight: 2, marginTop: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={investInFD}
                        sx={{ marginTop: 2 }}
                    >
                        Invest
                    </Button>
                </Card>
            </Grid>

            {fixedDeposits.length > 0 &&
                fixedDeposits.map((fd, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="body2">Investment: ₹{fd.amount}</Typography>
                                <Typography variant="body2">Interest Rate: {fd.rate}%</Typography>
                                <Typography variant="body2">Maturity Amount: ₹{fd.maturityAmount.toFixed(2)}</Typography>
                                <Typography variant="body2">
                                    Time Left: {Math.ceil(fd.timeLeft / 1000)} seconds
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    );
};

export default FixedDeposits;
