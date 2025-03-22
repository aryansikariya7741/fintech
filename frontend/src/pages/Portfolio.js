import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Portfolio = ({ portfolio }) => {
    return (
        <Card sx={{ bgcolor: "#1E1E1E", color: "#fff" }}>
            <CardContent>
                <Typography variant="h5"><ShoppingCartIcon /> Portfolio</Typography>
                {Object.keys(portfolio).length > 0 ? (
                    <ul>
                        {Object.entries(portfolio).map(([stock, quantity]) => (
                            <li key={stock}>{stock}: {quantity} shares</li>
                        ))}
                    </ul>
                ) : (
                    <Typography>No stocks owned</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default Portfolio;
