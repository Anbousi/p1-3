// Function to dynamically update form fields based on selected plot type
function updateFormFields() {
  const plotType = document.getElementById("plotType").value;
  const dynamicFieldsDiv = document.getElementById("dynamicFields");

  // Clear any existing fields
  dynamicFieldsDiv.innerHTML = "";

  let fields = [];

  // Define the fields for each plot type
  switch (plotType) {
    case "solar_electricity":
      fields = [
        { label: "Country:", id: "country", type: "text", required: true },
        { label: "Start Year (optional):", id: "start_year", type: "number" },
        { label: "End Year (optional):", id: "end_year", type: "number" },
      ];
      break;
    case "energy_consumption_pie":
      fields = [
        { label: "Country:", id: "country", type: "text", required: true },
        { label: "Year:", id: "year", type: "number", required: true },
      ];
      break;
    case "renewable_vs_non":
      fields = [
        { label: "Country:", id: "country", type: "text", required: true },
        { label: "Start Year (optional):", id: "start_year", type: "number" },
        { label: "End Year (optional):", id: "end_year", type: "number" },
      ];
      break;
    case "energy_consumption_trend":
      fields = [
        { label: "Country:", id: "country", type: "text", required: true },
        { label: "Start Year (optional):", id: "start_year", type: "number" },
        { label: "End Year (optional):", id: "end_year", type: "number" },
      ];
      break;
  }

  // Create input fields dynamically
  fields.forEach((field) => {
    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;
    dynamicFieldsDiv.appendChild(label);

    const input = document.createElement("input");
    input.setAttribute("type", field.type);
    input.setAttribute("id", field.id);
    input.setAttribute("name", field.id);
    if (field.required) input.setAttribute("required", true);
    dynamicFieldsDiv.appendChild(input);
  });
}

// Function to fetch and display data based on route
async function fetchData(url) {
  try {
    // Ensure the URL starts with http://127.0.0.1:5000/ if it's a local server
    if (!url.startsWith("http")) {
      url = `http://127.0.0.1:5000${url}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    // Call the displayResults function
    displayResults(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to fetch data. Please try again.");
  }
}

// Function to display the results on the page
function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h3>Results:</h3>";

  // Check if the response contains a plot URL or other data to display
  if (data.img) {
    resultsDiv.innerHTML += data.img;
  } else {
    // If no valid data is returned
    resultsDiv.innerHTML += "<p>No data available.</p>";
  }
}

// Handle form submission
document
  .getElementById("plotForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const plotType = document.getElementById("plotType").value;
    const country = document.getElementById("country").value;
    const startYear = document.getElementById("start_year")
      ? document.getElementById("start_year").value
      : "";
    const endYear = document.getElementById("end_year")
      ? document.getElementById("end_year").value
      : "";
    const year = document.getElementById("year")
      ? document.getElementById("year").value
      : "";

    let url = "";

    switch (plotType) {
      case "solar_electricity":
        url = `/plot_solar_electricity?country=${country}`;
        if (startYear) url += `&start_year=${startYear}`;
        if (endYear) url += `&end_year=${endYear}`;
        break;
      case "energy_consumption_pie":
        url = `/plot_energy_consumption_pie?country=${country}&year=${year}`;
        break;
      case "renewable_vs_non":
        url = `/plot_renewable_vs_non?country=${country}`;
        if (startYear) url += `&start_year=${startYear}`;
        if (endYear) url += `&end_year=${endYear}`;
        break;
      case "energy_consumption_trend":
        url = `/plot_energy_consumption_trend?country=${country}`;
        if (startYear) url += `&start_year=${startYear}`;
        if (endYear) url += `&end_year=${endYear}`;
        break;
    }
    fetchData(url);
  });

// Update the form when the page loads or when the plot type is changed
document
  .getElementById("plotType")
  .addEventListener("change", updateFormFields);
window.onload = updateFormFields; // Ensure the form fields are updated when the page loads
