import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RenewableVsNonRenewableChart = ({ data }) => {
  // Process data to calculate renewable and non-renewable totals
  const chartData = data.map(item => {
    const renewable = (
      (item.wind_consumption || 0) +
      (item.solar_consumption || 0) +
      (item.hydro_consumption || 0) +
      (item.biofuel_consumption || 0)
    );
    
    const nonRenewable = (
      (item.coal_consumption || 0) +
      (item.oil_consumption || 0) +
      (item.gas_consumption || 0) +
      (item.nuclear_consumption || 0) +
      (item.fossil_fuel_consumption || 0)
    );
    
    return {
      year: item.year,
      renewable,
      nonRenewable
    };
  });

  return (
    <div className="h-96">
      <h3 className="text-lg font-semibold mb-2">Renewable vs Non-Renewable Energy</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toFixed(2)} TWh`} />
          <Legend />
          <Area
            type="monotone"
            dataKey="renewable"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Renewable Energy"
          />
          <Area
            type="monotone"
            dataKey="nonRenewable"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
            name="Non-Renewable Energy"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RenewableVsNonRenewableChart;