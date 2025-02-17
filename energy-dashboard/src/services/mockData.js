export const mockEnergyData = [
    {
      "country": "United States",
      "year": 2018,
      "renewables_consumption": 2.5,
      "coal_consumption": 10.0,
      "biofuel_consumption": 1.0,
      "fossil_fuel_consumption": 20.0,
      "gas_consumption": 8.0,
      "hydro_consumption": 2.8,
      "nuclear_consumption": 5.5,
      "oil_consumption": 12.0,
      "wind_consumption": 1.5,
      "solar_consumption": 0.8,
      "solar_electricity": 0.7
    },
    {
      "country": "United States",
      "year": 2019,
      "renewables_consumption": 3.0,
      "coal_consumption": 9.5,
      "biofuel_consumption": 1.2,
      "fossil_fuel_consumption": 19.5,
      "gas_consumption": 8.2,
      "hydro_consumption": 2.9,
      "nuclear_consumption": 5.6,
      "oil_consumption": 11.7,
      "wind_consumption": 1.8,
      "solar_consumption": 1.0,
      "solar_electricity": 0.9
    },
    {
      "country": "China",
      "year": 2018,
      "renewables_consumption": 1.5,
      "coal_consumption": 15.0,
      "biofuel_consumption": 0.5,
      "fossil_fuel_consumption": 25.0,
      "gas_consumption": 5.0,
      "hydro_consumption": 3.5,
      "nuclear_consumption": 2.0,
      "oil_consumption": 10.0,
      "wind_consumption": 1.0,
      "solar_consumption": 1.2,
      "solar_electricity": 1.1
    },
    {
      "country": "China",
      "year": 2019,
      "renewables_consumption": 2.0,
      "coal_consumption": 14.5,
      "biofuel_consumption": 0.7,
      "fossil_fuel_consumption": 24.0,
      "gas_consumption": 5.5,
      "hydro_consumption": 3.7,
      "nuclear_consumption": 2.2,
      "oil_consumption": 10.5,
      "wind_consumption": 1.3,
      "solar_consumption": 1.5,
      "solar_electricity": 1.4
    }
  ];
  
  export const getCountries = () => {
    const uniqueCountries = [...new Set(mockEnergyData.map(item => item.country))];
    return uniqueCountries;
  };
  
  export const getEnergyData = (country, startYear, endYear) => {
    let filteredData = mockEnergyData.filter(item => item.country === country);
    
    if (startYear) {
      filteredData = filteredData.filter(item => item.year >= startYear);
    }
    
    if (endYear) {
      filteredData = filteredData.filter(item => item.year <= endYear);
    }
    
    return {
      data: filteredData,
      country,
      start_year: startYear || Math.min(...filteredData.map(item => item.year)),
      end_year: endYear || Math.max(...filteredData.map(item => item.year))
    };
  };