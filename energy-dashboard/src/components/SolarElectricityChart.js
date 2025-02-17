import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SolarElectricityChart = ({ data }) => {
  return (
    <div className="h-96">
      <h3 className="text-lg font-semibold mb-2">Solar Electricity Generation</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toFixed(2)} TWh`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="solar_electricity"
            stroke="#FFBB28"
            activeDot={{ r: 8 }}
            name="Solar Electricity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SolarElectricityChart;