import React, { useState } from "react";
import axios from "axios";
import styles from "./GetPrediction.module.css"; // Importing scoped CSS module
import { useNavigate } from "react-router-dom";

function GetPrediction() {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [energy, setEnergy] = useState("wind");
  const [country, setCountry] = useState("Germany");
  const [showAllPredictions, setShowAllPredictions] = useState(true);
  const [showAllYears, setShowAllYears] = useState(true);
  const [prediction, setPrediction] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let singlePredictionResponse;
      let allPredictionResponse;

      // Fetch predictions based on whether the user wants all or a single energy type
      if (showAllPredictions) {
        allPredictionResponse = await axios.get(
          `http://localhost:5000/predict_all_consumptions?country=${country}&year=${year}`
        );
      } else {
        singlePredictionResponse = await axios.get(
          `http://localhost:5000/predict_consumption?country=${country}&year=${year}&energy=${energy}`
        );
      }

      const formattedSinglePrediction =
        singlePredictionResponse?.data.map((item) => ({
          ...item,
          energy_type: formatEnergyType(item.energy_type),
        })) || [];

      const formattedAllPredictions =
        Object.entries(allPredictionResponse?.data || {}).flatMap(
          ([key, values]) =>
            values.map((item) => ({
              ...item,
              energy_type: formatEnergyType(item.energy_type),
            }))
        ) || [];

      setPrediction({
        single: formattedSinglePrediction,
        all: formattedAllPredictions,
      });
      setError(null);
    } catch (err) {
      setError("Error fetching prediction data. Please try again.");
      setPrediction([]);
    }
  };

  const categories = [
    "Country",
    "Solar Energy",
    "Wind Energy",
    "Hydro Energy",
    "Get Predictions",
  ];

  const handleCategoryClick = (category) => {
    switch (category) {
      case "Country":
        navigate("/energy-by-country-year");
        break;
      case "Solar Energy":
        navigate("/solar-energy");
        break;
      case "Wind Energy":
        navigate("/wind-energy");
        break;
      case "Hydro Energy":
        navigate("/hydro-energy");
        break;
      case "Get Predictions":
        navigate("/get-predictions");
      default:
        break;
    }
  };

  // Helper function to format energy type
  const formatEnergyType = (type) => {
    return type
      .replace(/_/g, " ") // Replace underscores with space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (
    <>
      {/* Header Section */}
      <div className="header">
        <h1 className="title">Green Vester</h1>
        <p className="subtitle">Invest in a Greener World</p>
      </div>

      {/* Navbar */}
      <div className="navbar">
        {categories.map((category, index) => (
          <div
            key={index}
            className="nav-item"
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: "pointer" }}
          >
            <p>{category}</p>
          </div>
        ))}
      </div>
      <div className={styles.container}>
        <h2>Energy Consumption Prediction</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>

          <div>
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(Math.max(2025, e.target.value))}
              min="2025"
              required
            />
          </div>

          <div>
            <label htmlFor="energy">Energy Type</label>
            <select
              id="energy"
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
            >
              <option value="wind">Wind</option>
              <option value="solar">Solar</option>
              <option value="biofuel">Biofuel</option>
              <option value="hydro">Hydro</option>
              <option value="renewables">Renewables</option>
              <option value="gas">Gas</option>
              <option value="coal">Coal</option>
              <option value="fossil_fuel">Fossil Fuel</option>
            </select>
          </div>

          <div>
            <label htmlFor="allPredictions">
              <input
                type="checkbox"
                id="allPredictions"
                checked={showAllPredictions}
                onChange={(e) => setShowAllPredictions(e.target.checked)}
              />
              Show all predictions (all energy types)
            </label>
          </div>

          <button type="submit" disabled={!year}>
            Get Prediction
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {prediction.single && (
          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>
              Predicted Energy Consumption
            </h3>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Energy Type</th>
                  <th>Year</th>
                  <th>Prediction</th>
                </tr>
              </thead>
              <tbody>
                {prediction.single.map((item, index) => (
                  <tr key={index} className={styles.resultRow}>
                    <td>{item.country}</td>
                    <td>{item.energy_type}</td>
                    <td>{item.year}</td>
                    <td>{item.prediction.toFixed(2)} kWh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {prediction.all && (
          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>
              All Predicted Energy Consumptions
            </h3>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Energy Type</th>
                  <th>Year</th>
                  <th>Prediction</th>
                </tr>
              </thead>
              <tbody>
                {prediction.all
                  .filter((item) => (showAllYears ? true : item.year === 2025))
                  .map((item, index) => (
                    <tr key={index} className={styles.resultRow}>
                      <td>{item.country}</td>
                      <td>{item.energy_type}</td>
                      <td>{item.year}</td>
                      <td>{item.prediction.toFixed(2)} kWh</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default GetPrediction;
