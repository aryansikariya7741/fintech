import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const CryptoMarket = () => {
    const [cryptoPrices, setCryptoPrices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const response = await axios.get(
                    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,cardano,solana,binancecoin,ripple,polkadot,shiba-inu,litecoin&vs_currencies=inr"
                );
                setCryptoPrices(response.data);
            } catch (error) {
                console.error("Error fetching crypto prices:", error);
                setError("Failed to load cryptocurrency prices.");
            } finally {
                setLoading(false);
            }
        };

        fetchCryptoPrices();
        const interval = setInterval(fetchCryptoPrices, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2, textAlign: "center" }}>
            {loading ? (
                <Grid item xs={12}>
                    <CircularProgress color="primary" />
                    <Typography variant="body2">Fetching Crypto Data...</Typography>
                </Grid>
            ) : error ? (
                <Grid item xs={12}>
                    <Typography variant="h6" color="error">{error}</Typography>
                </Grid>
            ) : (
                Object.entries(cryptoPrices).map(([crypto, price]) => (
                    <Grid item xs={12} md={4} key={crypto}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{crypto.toUpperCase()}</Typography>
                                <Typography variant="body2">Price: ₹{price.inr.toFixed(2)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default CryptoMarket;
