import React, { useState } from 'react';
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

const EnergyTrendChart = ({ data }) => {
  const [visibleLines, setVisibleLines] = useState({
    renewables_consumption: true,
    coal_consumption: true,
    biofuel_consumption: true,
    fossil_fuel_consumption: true,
    gas_consumption: true,
    hydro_consumption: true,
    nuclear_consumption: true,
    oil_consumption: true,
    wind_consumption: true,
    solar_consumption: true
  });

  const toggleLine = (dataKey) => {
    setVisibleLines({
      ...visibleLines,
      [dataKey]: !visibleLines[dataKey]
    });
  };

  const energySources = [
    { key: 'renewables_consumption', color: '#8884d8', name: 'Renewables' },
    { key: 'coal_consumption', color: '#808080', name: 'Coal' },
    { key: 'biofuel_consumption', color: '#82ca9d', name: 'Biofuel' },
    { key: 'fossil_fuel_consumption', color: '#ffc658', name: 'Fossil Fuel' },
    { key: 'gas_consumption', color: '#ff8042', name: 'Gas' },
    { key: 'hydro_consumption', color: '#0088FE', name: 'Hydro' },
    { key: 'nuclear_consumption', color: '#00C49F', name: 'Nuclear' },
    { key: 'oil_consumption', color: '#d0ed57', name: 'Oil' },
    { key: 'wind_consumption', color: '#a4de6c', name: 'Wind' },
    { key: 'solar_consumption', color: '#FFBB28', name: 'Solar' }
  ];

  return (
    <div className="h-96">
      <h3 className="text-lg font-semibold mb-2">Energy Consumption Trends</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {energySources.map(source => (
          <button
            key={source.key}
            onClick={() => toggleLine(source.key)}
            className={`px-2 py-1 text-xs rounded-full ${
              visibleLines[source.key] 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            {source.name}
          </button>
        ))}
      </div>
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
          {energySources.map(source => (
            visibleLines[source.key] && (
              <Line
                key={source.key}
                type="monotone"
                dataKey={source.key}
                name={source.name}
                stroke={source.color}
                activeDot={{ r: 8 }}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyTrendChart;