import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const EnergyPieChart = ({ data, year }) => {
  // Filter data for the selected year
  const yearData = data.find(item => item.year === year);
  
  if (!yearData) {
    return <div>No data available for the selected year</div>;
  }

  const energySources = [
    'renewables_consumption',
    'coal_consumption',
    'biofuel_consumption',
    'fossil_fuel_consumption',
    'gas_consumption',
    'hydro_consumption',
    'nuclear_consumption',
    'oil_consumption',
    'wind_consumption',
    'solar_consumption'
  ];

  const chartData = energySources
    .map(source => ({
      name: source.replace('_consumption', '').replace('_', ' '),
      value: yearData[source] || 0
    }))
    .filter(item => item.value > 0);

  return (
    <div className="h-96">
      <h3 className="text-lg font-semibold mb-2">Energy Consumption by Source ({year})</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(2)} TWh`} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyPieChart;