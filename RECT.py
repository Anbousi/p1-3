# import necessary libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import seaborn as sb

import os

from functions.plot_solar_electricity import plot_solar_electricity
from functions.plot_energy_consumption_pie import plot_energy_consumption_pie
from functions.plot_renewable_vs_non import plot_renewable_vs_non
from functions.plot_energy_consumption_trend import plot_energy_consumption_trend
from cols_to_check import cols_to_check

# import flask to create a server and send api
from flask import Flask, request, jsonify, render_template_string

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

# Inspect the data
print('Dataset info>>>>')
print(dataset.info())
print('<<<<<')
total_rows = dataset.shape[0]  # Number of rows
print(f"Total rows in dataset: {total_rows}")


# Drop unnecessary columns:
dataset.drop(columns=['iso_code'], inplace=True)

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

# Keep only the columns that actually exist in the DataFrame
existing_cols = [col for col in cols_to_check if col in dataset.columns]

# Drop rows where all these columns are 0
if existing_cols:
    dataset = dataset[dataset[existing_cols].ne(0).any(axis=1)]
total_rows = dataset.shape[0]  # Number of rows
print(f"Total rows in dataset: {total_rows}")
# Save Cleaned Data: Save the cleaned dataset.
dataset.to_csv('cleaned_dataset.csv', index=False)

renewable_sources = ['wind_consumption', 'solar_consumption', 'hydro_consumption', 'biofuel_consumption']
non_renewable_sources = ['coal_consumption', 'oil_consumption', 'gas_consumption', 'nuclear_consumption', 'fossil_fuel_consumption']

# Initialize the Flask app
app = Flask(__name__)

@app.route('/')
def home():
    available_links = [
        "/plot_solar_electricity?country=Germany&start_year=2000&end_year=2023",
        "/plot_energy_consumption_pie?country=Germany&year=2000",
        "/plot_renewable_vs_non?country=Germany&start_year=2000&end_year=2023",
        "/plot_energy_consumption_trend?country=Germany&start_year=2000&end_year=2023",
        
    ]
    
    # add list of <a> tags to available routes
    #just for checking results when running server
    #TODO: delete this after creating the ui
    links_html = "".join([f'<a href="{link}">{link}</a><br>' for link in available_links])
    
    return render_template_string(f'''
    <html>
        <head><title>Available Links</title></head>
        <body>
            <h1>Available Links</h1>
            {links_html}
        </body>
    </html>
    ''')


# Define the API endpoint
@app.route('/plot_solar_electricity', methods=['GET'])
def plot_solar_electricity_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400

    plot_html = plot_solar_electricity(dataset, country, start_year, end_year)
    return plot_html

@app.route('/plot_energy_consumption_pie', methods=['GET'])
def plot_energy_consumption_pie_api():
    country = request.args.get('country')
    year = request.args.get('year', type=int)

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400
    if not year:
        return jsonify({"error": "Year parameter is required"}), 400
    
    energy_sources = renewable_sources + non_renewable_sources

    plot_html = plot_energy_consumption_pie(dataset, energy_sources, country, year)
    return plot_html

@app.route('/plot_renewable_vs_non', methods=['GET'])
def plot_renewable_vs_non_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)

    plot_html = plot_renewable_vs_non(dataset, country, start_year, end_year)
    return plot_html

@app.route('/plot_energy_consumption_trend', methods=['GET'])
def plot_energy_consumption_trend_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)
    
    plot_html = plot_energy_consumption_trend(dataset, country, start_year, end_year)
    return plot_html

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)