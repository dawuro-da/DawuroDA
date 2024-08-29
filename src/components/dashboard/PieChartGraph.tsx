"use client";

import { formatNumberToKOrM } from "@/util/date";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";

const PieChartGraph = ({ pieChartData }: { pieChartData: any }) => {
  const totalMembersCount = pieChartData?.totalMemberCount ?? 0;

  const data = [
    {
      name: "Paid Members",
      value: pieChartData?.totalMemberPaid ?? 0,
      color: "#34A858",
    },
    {
      name: "Unpaid Members",
      value: pieChartData?.totalMemberUnpaid ?? 0,
      color: "#98D4A4",
    },
  ];

  const CustomLabel = ({ viewBox, labelText, value }: any) => {
    const { cx, cy } = viewBox;
    return (
      <g style={{ boxShadow: "10px 10px 10px 0px rgba(0, 0, 0, 0.5)" }}>
        <text
          x={cx}
          y={cy}
          className="recharts-text recharts-label"
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="middle"
          fill="#555555"
          fontSize="28"
          fontWeight="800"
        >
          {value}
        </text>
        <text
          x={cx}
          y={cy + 20}
          className="recharts-text recharts-label"
          textAnchor="middle"
          dominantBaseline="central"
          alignmentBaseline="middle"
          fontSize="15"
          fill="#555555"
        >
          {labelText}
        </text>
      </g>
    );
  };

  // Formatter function for the legend to show name and value
  const renderLegendText = (value: string, entry: any) => {
    const correspondingData = data.find((item) => item.name === value);
    return `${value} (${formatNumberToKOrM(correspondingData?.value) ?? 0})`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart startAngle={180}>
        <defs>
          <radialGradient id="shadow" cx="50%" cy="50%" r="80%">
            <stop offset="10%" stopColor="rgba(0, 0, 0, 0.5)" />
            <stop offset="90%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>
        <Pie
          data={data ?? []}
          dataKey="value"
          cx={window?.innerWidth <= 450 ? "140%" : "70%"}
          cy={window?.innerWidth <= 450 ? "40%" : "50%"}
          innerRadius={window?.innerWidth <= 450 ? "80%" : "47%"}
          outerRadius={window?.innerWidth <= 450 ? "150%" : "92%"}
          paddingAngle={0}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label
            content={
              <CustomLabel labelText="Members" value={totalMembersCount} />
            }
            position="center"
          />
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="bottom"
          wrapperStyle={{ right: 0, bottom: 5 }}
          formatter={renderLegendText}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartGraph;
