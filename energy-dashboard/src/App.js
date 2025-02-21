import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/MapComponent";
import EnergyByCountryYear from "./components/CountryPage";
import EnergyPage from "./components/EnergyPage";
import GetPrediction from "./components/GetPrediction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/energy-by-country-year"
          element={<EnergyByCountryYear />}
        />
        <Route path="/solar-energy" element={<EnergyPage />} />
        <Route path="/wind-energy" element={<EnergyPage />} />
        <Route path="/hydro-energy" element={<EnergyPage />} />
        <Route path="/get-predictions" element={<GetPrediction />} />
      </Routes>
    </Router>
  );
}

export default App;
