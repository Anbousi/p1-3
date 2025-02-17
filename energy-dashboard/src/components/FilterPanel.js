import React, { useState, useEffect } from 'react';

const FilterPanel = ({ onFilterChange, countries }) => {
  const [country, setCountry] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  useEffect(() => {
    if (countries.length > 0) {
      setCountry(countries[0]);
    }
  }, [countries]);

  const handleApplyFilter = () => {
    onFilterChange({
      country,
      startYear: startYear ? parseInt(startYear) : null,
      endYear: endYear ? parseInt(endYear) : null
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h2 className="text-lg font-semibold mb-3">Filter Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            placeholder="e.g., 2000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            placeholder="e.g., 2020"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button
        onClick={handleApplyFilter}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPanel;