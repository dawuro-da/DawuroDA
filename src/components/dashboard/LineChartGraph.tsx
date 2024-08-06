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

const LineChartGraph = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ left: 0, right: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => (Number.isInteger(value) ? value : "")}
          allowDecimals={false}
        />
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
