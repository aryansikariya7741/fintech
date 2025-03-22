import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const Wallet = ({ wallet }) => {
    return (
        <Card sx={{ bgcolor: "#121212", color: "#fff", marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h5">
                    <AccountBalanceIcon /> Wallet Balance: ₹{wallet.toFixed(2)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Wallet;
