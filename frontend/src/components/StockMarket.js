import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const StockMarket = ({ wallet, setWallet, portfolio, setPortfolio }) => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            const response = await axios.get("/stocks.json");
            setStocks(response.data);
        };
        fetchStocks();
    }, []);

    useEffect(() => {
        const updatePrices = setInterval(() => {
            setStocks(stocks.map(stock => ({
                ...stock,
                price: Math.max(stock.price + stock.price * (Math.random() * stock.fluctuation * 2 - stock.fluctuation), 10),
            })));
        }, 5000);

        return () => clearInterval(updatePrices);
    }, [stocks]);

    const buyStock = (stock) => {
        if (wallet >= stock.price) {
            setWallet(wallet - stock.price);
            setPortfolio(prev => ({
                ...prev,
                [stock.name]: (prev[stock.name] || 0) + 1,
            }));
        }
    };

    const sellStock = (stock) => {
        if (portfolio[stock.name] > 0) {
            setWallet(wallet + stock.price);
            setPortfolio(prev => ({
                ...prev,
                [stock.name]: prev[stock.name] - 1,
            }));
        }
    };

    const columns = [
        { field: "name", headerName: "Stock", flex: 1 },
        { field: "sector", headerName: "Sector", flex: 1 },
        { field: "price", headerName: "Price (₹)", flex: 1, type: "number" },
        { field: "fluctuation", headerName: "Fluctuation (%)", flex: 1 },
        { 
            field: "actions", 
            headerName: "Actions", 
            flex: 1, 
            renderCell: (params) => (
                <>
                    <Button size="small" variant="contained" color="success" onClick={() => buyStock(params.row)}>Buy</Button>
                    <Button size="small" variant="contained" color="error" onClick={() => sellStock(params.row)} style={{ marginLeft: 8 }}>Sell</Button>
                </>
            )
        }
    ];

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={stocks} columns={columns} getRowId={(row) => row.name} pageSize={10} />
        </div>
    );
};

export default StockMarket;
