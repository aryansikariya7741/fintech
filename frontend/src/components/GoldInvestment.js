import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const GoldInvestment = () => {
    const [goldPrice, setGoldPrice] = useState(5000); // Default gold price per gram

    useEffect(() => {
        const updateGoldPrice = setInterval(() => {
            setGoldPrice(prev => prev + (Math.random() * 200 - 100));
        }, 60000);
        return () => clearInterval(updateGoldPrice);
    }, []);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Gold Investment</Typography>
                        <Typography variant="body2">Gold Price per gram: ₹{goldPrice.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default GoldInvestment;
