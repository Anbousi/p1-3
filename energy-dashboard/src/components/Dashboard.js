import React, { useEffect, useState } from 'react';
import { fetchEnergyData } from '../services/api';
import FilterPanel from './FilterPanel';
import EnergyPieChart from './EnergyPieChart';
import EnergyTrendChart from './EnergyTrendChart';
import RenewableVsNonRenewableChart from './RenewableVsNonRenewableChart';
import SolarElectricityChart from './SolarElectricityChart';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [energyData, setEnergyData] = useState([]);
  const [countries, setCountries] = useState(['United States']);
  const [filters, setFilters] = useState({
    country: 'United States',
    startYear: null,
    endYear: null
  });
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    // Fetch data with current filters
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchEnergyData(
          filters.country,
          filters.startYear,
          filters.endYear
        );
        setEnergyData(result.data);
        
        // Set a default selected year if not set
        if (!selectedYear && result.data.length > 0) {
          setSelectedYear(result.data[result.data.length - 1].year);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load energy data');
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Energy Consumption Dashboard</h1>
      
      <FilterPanel
        onFilterChange={handleFilterChange}
        countries={countries}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {selectedYear && (
          <div className="bg-white p-4 rounded-lg shadow">
            <EnergyPieChart data={energyData} year={selectedYear} />
          </div>
        )}
        
        <div className="bg-white p-4 rounded-lg shadow">
          <EnergyTrendChart data={energyData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <RenewableVsNonRenewableChart data={energyData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <SolarElectricityChart data={energyData} />
        </div>
      </div>
      
      {selectedYear && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Year for Pie Chart:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {energyData.map(item => (
              <option key={item.year} value={item.year}>
                {item.year}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Dashboard;