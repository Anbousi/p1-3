# import necessary libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import seaborn as sb

import io, os
import base64

# import flask to create a server and send api
from flask import Flask, request, jsonify

# Define the file path and URL
# Data source
# https://nyc3.digitaloceanspaces.com/owid-public/data/energy/owid-energy-data.csv

file_path = 'owid-energy-data.csv'
url = 'https://nyc3.digitaloceanspaces.com/owid-public/data/energy/owid-energy-data.csv'

# Check if the file exists
if not os.path.exists(file_path):
    print("File does not exist. Downloading...")
    # Download the file
    dataset = pd.read_csv(url)
    # Save the file locally
    dataset.to_csv(file_path, index=False)
    print("File downloaded and saved.")
else:
    print("File already exists.")

# Load the dataset
dataset = pd.read_csv(file_path)
print(dataset.head())


# Check for missing values and replace them with zeros
missing_values = dataset.isnull().sum()
dataset = dataset.fillna(0)

# Convert year to integer type
dataset['year'] = dataset['year'].astype(int)

# Columns to exclude from conversion
exclude_columns = ['country', 'year', 'iso_code', 'population', 'gdp']

# Convert all other columns to float
for col in dataset.columns:
    if col not in exclude_columns:
        dataset[col] = dataset[col].astype(float)
        
# Check for duplicate rows
duplicate_rows = dataset.duplicated()
num_duplicates = duplicate_rows.sum()
print(f"Number of duplicate rows: {num_duplicates}")

# Display duplicate rows if any
if num_duplicates > 0:
    print(dataset[duplicate_rows])
    dataset = dataset.drop_duplicates()
    
# Save Cleaned Data: Save the cleaned dataset.
# dataset.to_csv('cleaned_dataset.csv', index=False)

# Initialize the Flask app
app = Flask(__name__)

# Function to plot the relationship between year and solar electricity for a specific country
def plot_solar_electricity(country_name, start_year=None, end_year=None):
    # Filter the data for the specific country
    country_data = dataset[dataset['country'] == country_name]

    # Check if start_year and end_year are in the dataset for the specified country
    if start_year is not None and start_year not in country_data['year'].values:
        return jsonify({"error": f"Start year {start_year} is not available in the dataset for {country_name}."}), 400
    if end_year is not None and end_year not in country_data['year'].values:
        return jsonify({"error": f"End year {end_year} is not available in the dataset for {country_name}."}), 400

    # Apply year range filter if start_year and end_year are provided
    if start_year is not None:
        country_data = country_data[country_data['year'] >= start_year]
    if end_year is not None:
        country_data = country_data[country_data['year'] <= end_year]

    # Plot the data
    plt.figure(figsize=(10, 6))
    plt.plot(country_data['year'], country_data['solar_electricity'], marker='o')
    plt.xlabel('Year')
    plt.ylabel('Solar Electricity Generation (TWh)')
    title = f'Solar Electricity Generation for {country_name}'
    if start_year is not None and end_year is not None:
        title = f'Solar Electricity Generation ({start_year}-{end_year}) for {country_name}'
    plt.title(title)
    plt.grid(True)
    
    # Save the plot to a bytes object and encode it as a base64 string
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()

    return f"<img src='data:image/png;base64,{plot_url}'/>"

# Define the API endpoint
@app.route('/plot_solar_electricity', methods=['GET'])
def plot_solar_electricity_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400

    plot_html = plot_solar_electricity(country, start_year, end_year)
    return plot_html

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)