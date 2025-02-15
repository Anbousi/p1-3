# p1-3
Hackathon, Spark

## Renewable Energy Consumption Tracker (RECT):

- Develop a tool/web app that visualizes renewable energy consumption trends across different regions. This system will use historical energy usage data and provide insights into patterns, challenges, and future opportunities for optimizing renewable energy adoption.


# Solution Outline:
- Data Analysis Group: Conduct an exploratory data analysis to uncover consumption trends and challenges in renewable energy adoption.
- AI Group: Develop predictive models to forecast future renewable energy usage.
- Web Development Group: Create an interactive platform visualizing renewable energy usage trends and predictions. 
Use HTML, Streamlit, or similar tools to design an interactive platform for data visualization.

# Data source
# https://nyc3.digitaloceanspaces.com/owid-public/data/energy/owid-energy-data.csv


pandas, numpy, and matplotlib are used

# Flask is sused to create a server-side
- Run the app using line command:
    python RECT.py

    The app will check if 'owid-energy-data.csv' is exist, if not, it will download the dataset.


Access the API: Open your web browser and navigate to http://127.0.0.1:5000/plot_solar_electricity?country=Country_Name&start_year=Start_Year&end_year=End_Year to see the plot for the specified country and year range.

e.g: http://127.0.0.1:5000/plot_solar_electricity?country=Palsetine&start_year=2003&end_year=2023

country is Palsetine
start_year is 2003
end_year is 2023

this will return a plot for solar solar generation over the years

if the start_year or the end_year are invalid, it will return an error as json object
