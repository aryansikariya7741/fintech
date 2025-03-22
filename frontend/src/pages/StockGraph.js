import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StockGraph = ({ stockName, priceHistory }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceHistory[stockName]}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StockGraph;
