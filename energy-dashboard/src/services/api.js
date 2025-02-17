import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchEnergyData = async (country, startYear, endYear) => {
  try {
    const response = await axios.get(`${API_URL}/energy_data`, {
      params: {
        country,
        start_year: startYear,
        end_year: endYear
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching energy data:', error);
    throw error;
  }
};