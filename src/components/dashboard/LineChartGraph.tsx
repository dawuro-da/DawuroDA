"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";

const LineChartGraph = () => {
  const data = [
    { name: "Jan", pv: 240, amt: 400 },
    { name: "Feb", pv: 139, amt: 210 },
    { name: "Mar", pv: 580, amt: 290 },
    { name: "Apr", pv: 390, amt: 200 },
    { name: "May", pv: 480, amt: 181 },
    { name: "June", pv: 380, amt: 500 },
    { name: "July", pv: 430, amt: 100 },
    { name: "Aug", pv: 200, amt: 230 },
    { name: "Sep", pv: 120, amt: 140 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={data} margin={{ left:0, right: 10 }}>
        <CartesianGrid horizontal={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="linear"
          dataKey="pv"
          stroke="#34A858"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Area
          name={`total`}
          type="monotone"
          dataKey="investment_total_stock"
          stroke="#00a1e4"
          fillOpacity={1}
          fill="url(#colorStock)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartGraph;
