import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

const EnergyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [energyType, setEnergyType] = useState("");
  const [chartData, setChartData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const COLORS = ["#2e7d32", "#1976d2", "#ed6c02", "#d32f2f", "#9c27b0"];

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

  useEffect(() => {
    const path = location.pathname;
    const type = path.split("/")[1].split("-")[0];
    setEnergyType(type);
  }, [location]);

  useEffect(() => {
    if (energyType) {
      fetchData();
    }
  }, [energyType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // These would be your actual API endpoints
      const apiEndpoints = [
        `http://localhost:5000/${energyType}/global-trend`,
        `http://localhost:5000/${energyType}/regional-distribution`,
        `http://localhost:5000/${energyType}/efficiency-metrics`,
        `http://localhost:5000/${energyType}/cost-analysis`,
        `http://localhost:5000/${energyType}/environmental-impact`,
        `http://localhost:5000/${energyType}/prediction`,
      ];

      // Simulated data for demonstration
      const simulatedData = [
        // Global Trend Data
        Array.from({ length: 10 }, (_, i) => ({
          year: 2014 + i,
          value: Math.random() * 1000 + 500,
        })),
        // Regional Distribution
        Array.from({ length: 5 }, (_, i) => ({
          region: [
            "North America",
            "Europe",
            "Asia",
            "Africa",
            "South America",
          ][i],
          value: Math.random() * 100,
        })),
        // Efficiency Metrics
        Array.from({ length: 12 }, (_, i) => ({
          month: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][i],
          efficiency: Math.random() * 30 + 70,
        })),
        // Cost Analysis
        Array.from({ length: 8 }, (_, i) => ({
          year: 2016 + i,
          cost: Math.random() * 200 + 100,
        })),
        // Environmental Impact
        Array.from({ length: 5 }, (_, i) => ({
          metric: [
            "CO2 Reduction",
            "Water Saved",
            "Land Usage",
            "Wildlife Impact",
            "Noise Level",
          ][i],
          value: Math.random() * 100,
        })),
      ];

      setChartData(simulatedData);
      setPrediction({
        nextYearValue: Math.round(Math.random() * 1000 + 1000),
        growthRate: Math.round(Math.random() * 20 + 5),
        confidence: Math.round(Math.random() * 20 + 80),
      });
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const renderChart = (data, index) => {
    if (!data) return null;

    switch (index) {
      case 0: // Global Trend
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={COLORS[0]}
                name="Global Capacity"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 1: // Regional Distribution
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 2: // Efficiency Metrics
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke={COLORS[2]}
                name="Efficiency %"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 3: // Cost Analysis
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill={COLORS[3]} name="Cost per Unit" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 4: // Environmental Impact
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="metric" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[4]} name="Impact Score" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
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
      <Box sx={{ padding: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {energyType.charAt(0).toUpperCase() + energyType.slice(1)} Energy
              Analysis
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={400}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {chartData.map((data, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {
                                [
                                  "Global Trend",
                                  "Regional Distribution",
                                  "Efficiency Metrics",
                                  "Cost Analysis",
                                  "Environmental Impact",
                                ][index]
                              }
                            </Typography>
                            {renderChart(data, index)}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Card sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Predictions and Forecasts
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                              Predicted Value (Next Year):{" "}
                              {prediction.nextYearValue} MW
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                              Expected Growth Rate: {prediction.growthRate}%
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                              Confidence Level: {prediction.confidence}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default EnergyPage;
