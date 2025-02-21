import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
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

const CountryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countryName, setCountryName] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const COLORS = [
    "#2e7d32",
    "#d32f2f",
    "#1976d2",
    "#ed6c02",
    "#9c27b0",
    "#ffeb3b",
  ];

  useEffect(() => {
    if (!location.state?.country) {
      navigate("/");
    } else {
      setCountryName(location.state.country);
    }
  }, [location, navigate]);

  useEffect(() => {
    if (countryName) {
      fetchChartData();
    }
  }, [countryName]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      // console.log("Fetching Data for:", countryName);

      const urls = [
        {
          url: `http://localhost:5000/plot_energy_type?country=${countryName}&energy_type=solar_electricity&start_year=2000&end_year=2023`,
          type: "line",
          title: "Solar Electricity",
          lineName: "Solar Capacity",
        },
        {
          url: `http://localhost:5000/plot_energy_type?country=${countryName}&energy_type=wind_electricity&start_year=2000&end_year=2023`,
          type: "line",
          title: "Wind Electricity",
          lineName: "Wind Capacity",
        },
        {
          url: `http://localhost:5000/plot_energy_type?country=${countryName}&energy_type=hydro_electricity&start_year=2000&end_year=2023`,
          type: "line",
          title: "Hydro Electricity",
          lineName: "Hydro Capacity",
        },
        {
          url: `http://localhost:5000/plot_renewable_vs_non?country=${countryName}&&start_year=2000&end_year=2023`,
          type: "line",
          title: "Renewable vs Non-Renewable Energy",
        },
        {
          url: `http://localhost:5000/plot_energy_consumption_pie?country=${countryName}&year=2023&energy_type=renewable`,
          type: "pie",
          title: "Energy Sources Breakdown",
        },
      ];

      const responses = await Promise.all(urls.map(({ url }) => fetch(url)));
      const jsonData = await Promise.all(responses.map((res) => res.json()));

      const formattedData = jsonData
        .map((data, index) => {
          const { type, title, lineName } = urls[index];
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
    } catch (err) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (chartConfig, index) => {
    switch (chartConfig.type) {
      case "line":
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
                  stroke={COLORS[index % COLORS.length]} // Color for renewable energy
                  name="Renewable Energy"
                />
              )}

              {chartConfig.data[0].non_renewable_energy !== undefined && (
                <Line
                  type="monotone"
                  dataKey="non_renewable_energy"
                  stroke={COLORS[(index + 1) % COLORS.length]} // Color for non-renewable energy
                  name="Non-Renewable Energy"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartConfig.data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill={COLORS[index % COLORS.length]}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartConfig.data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <Typography>No chart available</Typography>;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Energy Data Analysis for {countryName}
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
            <Grid container spacing={3}>
              {chartData.map((chartConfig, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {chartConfig.title}
                        </Typography>
                        {renderChart(chartConfig, index)}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CountryPage;
