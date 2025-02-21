import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./map.css";

const placeholderImage = "https://via.placeholder.com/50";
const categories = ["Country", "Solar Energy", "Wind Energy", "Hydro Energy"];

const redIcon = new L.Icon({
  iconUrl: "./image.png",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const MapComponent = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [graphsData, setGraphsData] = useState([]); // State to store graph data
  const [prediction, setPrediction] = useState(null); // State to store prediction data
  const [topRenewableCountries, setTopRenewableCountries] = useState(null); // State to store top renewable countries data
  const [renewableEnergyData, setRenewableEnergyData] = useState([]); // State to store renewable energy data

  // Helper function to fetch data
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch countries data
      const countriesData = await fetchData(
        "https://restcountries.com/v3.1/all"
      );
      if (countriesData) {
        const countryMarkers = countriesData
          .filter((country) => country.latlng)
          .map((country) => ({
            name: country.name.common,
            lat: country.latlng[0],
            lng: country.latlng[1],
            flag: country.flags?.png || placeholderImage,
          }));
        setCountries(countryMarkers);
      }

      // Fetch basic graphs data
      const apiEndpoints = [
        {
          url: `http://localhost:5000/plot_energy_type?country=World&energy_type=solar_electricity&start_year=2000&end_year=2023`,
          type: "line",
          title: "Solar Electricity",
          lineName: "Solar Capacity",
        },
        {
          url: `http://localhost:5000/plot_energy_type?country=World&energy_type=wind_electricity&start_year=2000&end_year=2023`,
          type: "line",
          title: "Wind Electricity",
          lineName: "Wind Capacity",
        },
        {
          url: `http://localhost:5000/plot_energy_type?country=World&energy_type=hydro_electricity&start_year=2000&end_year=2023`,
          type: "line",
          title: "Hydro Electricity",
          lineName: "Hydro Capacity",
        },
        {
          url: `http://localhost:5000/plot_renewable_vs_non?country=World&&start_year=2000&end_year=2023`,
          type: "line",
          title: "Renewable vs Non-Renewable Energy",
        },
      ];

      const responses = await Promise.all(
        apiEndpoints.map(({ url }) => fetch(url))
      );
      const jsonData = await Promise.all(responses.map((res) => res.json()));
      const formattedData = jsonData
        .map((data, index) => {
          const { type, title, lineName } = apiEndpoints[index];
          // console.log(data);
          if (type === "line") {
            if (data.data.renewable_energy && data.data.non_renewable_energy) {
              // For line charts that have renewable and non-renewable energy
              return {
                type: "line",
                title,
                data: data.data.year.map((year, i) => ({
                  year,
                  renewable_energy: data.data.renewable_energy[i],
                  non_renewable_energy: data.data.non_renewable_energy[i],
                })),
                xAxisKey: "year",
                yAxisKey: ["renewable_energy", "non_renewable_energy"], // You might want to show both lines for renewable and non-renewable
                lineName,
              };
            } else {
              // Default line chart with only consumption data
              return {
                type: "line",
                title,
                data: data.data.year.map((year, i) => ({
                  year,
                  consumption: data.data.consumption[i],
                })),
                xAxisKey: "year",
                yAxisKey: "consumption",
                lineName,
              };
            }
          } else if (type === "pie" && data.data.year) {
            return {
              type: "pie",
              title,
              data: data.data.year
                .map((year, i) => [
                  {
                    name: "Renewable Energy",
                    value: data.data.renewable_energy[i],
                  },
                  {
                    name: "Non-Renewable Energy",
                    value: data.data.non_renewable_energy[i],
                  },
                ])
                .flat(),
            };
          } else if (type === "pie" && data.data.energy_sources) {
            return {
              type: "pie",
              title,
              data: data.data.energy_sources.map((source, i) => ({
                name: source,
                value: data.data.consumption[i],
              })),
            };
          }

          return null;
        })
        .filter(Boolean); // Remove null values if any API fails

      // console.log("Formatted Data:", formattedData);
      setChartData(formattedData);

      // Fetch top renewable countries data
      const topCountriesData = await fetchData();
      // "http://localhost:5000/get_top_renewable_countries_by_year?year=2023"
      setTopRenewableCountries(topCountriesData);
    };

    fetchAllData();
  }, []);

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
      default:
        break;
    }
  };

  const handleCountryClick = (countryName) => {
    navigate("/energy-by-country-year", { state: { country: countryName } });
  };

  // Animation variants for Framer Motion
  const graphVariants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Function to format data for the chart
  const formatChartData = (data, valueKey, yearKey) => {
    return data.map((item) => ({
      year: item[yearKey],
      value: item[valueKey],
    }));
  };
  const COLORS = [
    "#2e7d32",
    "#d32f2f",
    "#1976d2",
    "#ed6c02",
    "#9c27b0",
    "#ffeb3b",
  ];
  const renderChart = (chartConfig, index) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartConfig.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Case 1: If the chart is for consumption */}
          {chartConfig.data[0].consumption !== undefined && (
            <Line
              type="monotone"
              dataKey="consumption"
              stroke={COLORS[index % COLORS.length]} // Color for consumption
              name={chartConfig.lineName}
            />
          )}
          {/* Case 2: If the chart is for renewable vs non-renewable energy */}
          {chartConfig.data[0].renewable_energy !== undefined && (
            <Line
              type="monotone"
              dataKey="renewable_energy"
              stroke={COLORS[1]} // Color for renewable energy
              name="Renewable Energy"
            />
          )}

          {chartConfig.data[0].non_renewable_energy !== undefined && (
            <Line
              type="monotone"
              dataKey="non_renewable_energy"
              stroke={COLORS[4]} // Color for non-renewable energy
              name="Non-Renewable Energy"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const solarData = chartData
    .filter((item) => item.title && item.title.toLowerCase().includes("solar"))
    .map((item) => ({
      title: item.title,
      lineName: item.lineName,
      data: item.data, // Assuming 'data' is the key that holds the actual values
      xAxisKey: item.xAxisKey,
      yAxisKey: item.yAxisKey,
    }))[0];

  const windData = chartData
    .filter((item) => item.title && item.title.toLowerCase().includes("wind"))
    .map((item) => ({
      title: item.title,
      lineName: item.lineName,
      data: item.data, // Assuming 'data' is the key that holds the actual values
      xAxisKey: item.xAxisKey,
      yAxisKey: item.yAxisKey,
    }))[0];

  const hydroData = chartData
    .filter((item) => item.title && item.title.toLowerCase().includes("hydro"))
    .map((item) => ({
      title: item.title,
      lineName: item.lineName,
      data: item.data, // Assuming 'data' is the key that holds the actual values
      xAxisKey: item.xAxisKey,
      yAxisKey: item.yAxisKey,
    }))[0];

  const renewableData = chartData
    .filter(
      (item) => item.title && item.title.toLowerCase().includes("renewable")
    )
    .map((item) => ({
      title: item.title,
      lineName: item.lineName,
      data: item.data, // Assuming 'data' is the key that holds the actual values
      xAxisKey: item.xAxisKey,
      yAxisKey: item.yAxisKey,
    }))[0];

  console.log("heere", renewableData);

  return (
    <div className="container">
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

      {/* Top Row Graphs */}
      <div className="graph-grid">
        {/* Graph 1: Solar Electricity Growth */}
        {solarData && (
          <motion.div
            className="graph-card"
            variants={graphVariants}
            initial="hiddenLeft"
            animate="visible"
            transition={{ delay: 0 }}
          >
            <div className="graph-content">
              <h3>Solar Electricity Growth</h3>
              {renderChart(solarData, 1)}
            </div>
          </motion.div>
        )}

        {/* Graph 2: Wind Energy Growth */}
        {windData && (
          <motion.div
            className="graph-card"
            variants={graphVariants}
            initial="hiddenRight"
            animate="visible"
            transition={{ delay: 10 }}
          >
            <div className="graph-content">
              <h3>Wind Energy Growth</h3>
              {renderChart(windData, 2)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Section */}
      <div className="map-container">
        <MapContainer
          center={[20, 10]}
          zoom={2}
          style={{ width: "100%", height: "400px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          {countries.map((country, index) => (
            <Marker
              key={index}
              position={[country.lat, country.lng]}
              icon={redIcon}
              eventHandlers={{
                click: () => handleCountryClick(country.name),
              }}
              className="marker-animation"
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <img
                    src={country.flag}
                    alt={country.name}
                    style={{
                      width: "40px",
                      height: "24px",
                      marginBottom: "4px",
                    }}
                  />
                  <p>{country.name}</p>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Top Row Graphs */}
      <div className="graph-grid">
        {/* Graph 3: Hydro Energy Growth */}
        {hydroData && (
          <motion.div
            className="graph-card"
            variants={graphVariants}
            initial="hiddenLeft"
            animate="visible"
            transition={{ delay: 20 }}
          >
            <div className="graph-content">
              <h3>Hydro Energy Growth</h3>
              {renderChart(hydroData, 3)}
            </div>
          </motion.div>
        )}

        {/* Graph 4: Hydro Energy Growth */}
        {renewableData && (
          <motion.div
            className="graph-card"
            variants={graphVariants}
            initial="hiddenLeft"
            animate="visible"
            transition={{ delay: 20 }}
          >
            <div className="graph-content">
              <h3>Renewable vs Non Renewable Energy Growth</h3>
              {renderChart(renewableData, 4)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Prediction Section */}
      {prediction && (
        <motion.div
          className="prediction-section"
          variants={graphVariants}
          initial="hiddenLeft"
          animate="visible"
          transition={{ delay: 60 }}
        >
          <div className="prediction-content">
            <h3>Renewable Energy Production Trend</h3>
            <p>
              From <strong>{prediction.previous_year}</strong> to{" "}
              <strong>{prediction.latest_year}</strong>, renewable energy
              production has <strong>{prediction.message}</strong>.
            </p>
            <div className="prediction-stats">
              <p>
                <strong>Latest Year:</strong> {prediction.latest_year}
              </p>
              <p>
                <strong>Latest Production:</strong>{" "}
                {prediction.latest_production.toFixed(2)} units
              </p>
              <p>
                <strong>Previous Year:</strong> {prediction.previous_year}
              </p>
              <p>
                <strong>Previous Production:</strong>{" "}
                {prediction.previous_production.toFixed(2)} units
              </p>
              <p>
                <strong>Difference:</strong> {prediction.difference.toFixed(2)}{" "}
                units
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Section */}
      <div className="content-section">
        <div className="content-box">
          <h3 className="content-title">Renewable Energy</h3>
          <p className="content-text">
            Renewable energy sources are sustainable power solutions that
            naturally replenish themselves. These include solar, wind,
            hydroelectric, and biomass energy. These sources are environmentally
            friendly and help reduce carbon emissions. With ongoing
            technological advancements, renewable energy production costs have
            become increasingly competitive, making them an attractive economic
            option for investors and nations pursuing sustainability in their
            energy sectors. The transition to renewable energy represents a
            crucial step towards combating climate change and ensuring a
            sustainable future for generations to come.
          </p>
        </div>

        <div className="content-box">
          <h3 className="content-title">Non-Renewable Energy</h3>
          <p className="content-text">
            Non-renewable energy sources, including fossil fuels like oil,
            natural gas, and coal, remain a significant part of the global
            energy mix. However, these sources face major challenges due to
            their finite nature and negative environmental impact. The
            non-renewable energy sector is under increasing pressure to
            transition towards more sustainable alternatives, particularly in
            light of growing environmental awareness and regulations supporting
            clean energy. This transition presents both challenges and
            opportunities for investors and energy companies as the world moves
            towards a more sustainable energy future.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-info">
          <p>info@greenvester.com</p>
          <p>+1 (123) 456-7890</p>
          <p>123 Green Street, Eco City</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
