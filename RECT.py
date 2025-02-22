# import necessary libraries
import pandas as pd

import os

from functions.plot_energy_type import plot_energy_type
from functions.plot_energy_consumption_pie import plot_energy_consumption_pie
from functions.plot_renewable_vs_non import plot_renewable_vs_non
from functions.plot_energy_consumption_trend import plot_energy_consumption_trend
from functions.predict_consumption import predict_consumption
from cols_to_check import features
from functions.plot_energy_consumption_over_time import plot_energy_consumption_over_time
from functions.plot_renewable_energy_sources_over_time import plot_renewable_energy_sources_over_time
from functions.get_energy import (
    get_energy_consumption, 
    get_energy_consumption_by_type_and_year_for_country, 
    get_energy_consumption_by_year, 
    get_renewable_energy_shares_by_year, 
    get_top_fossil_countries_by_year,
    get_top_renewable_countries_by_year
)


# import flask to create a server and send api
from flask import Flask, request, jsonify, render_template_string

from flask_cors import CORS  # Import CORS

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
# print(dataset.head())

# # Inspect the data
# print('Dataset info>>>>')
# print(dataset.info())
# print('<<<<<')
total_rows = dataset.shape[0]  # Number of rows
# print(f"Total rows in dataset: {total_rows}")

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
existing_cols = [col for col in features if col in dataset.columns]

# Drop rows where all these columns are 0
if existing_cols:
    dataset = dataset[dataset[existing_cols].ne(0).any(axis=1)]
total_rows = dataset.shape[0]  # Number of rows
# print(f"Total rows in dataset: {total_rows}")
# Save Cleaned Data: Save the cleaned dataset.
dataset.to_csv('cleaned_dataset.csv', index=False)

renewable_sources = ['wind_consumption', 'solar_consumption', 'hydro_consumption', 'biofuel_consumption']
non_renewable_sources = ['coal_consumption', 'oil_consumption', 'gas_consumption', 'nuclear_consumption', 'fossil_fuel_consumption']

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    available_links = [
        "/plot_energy_type?country=Germany&energy_type=solar_electricity&start_year=2000&end_year=2023",
        "/plot_energy_consumption_pie?country=Germany&energy_type=renewable&year=2000",
        "/plot_renewable_vs_non?country=Germany&start_year=2000&end_year=2023",
        "/plot_energy_consumption_trend?country=Germany&start_year=2000&end_year=2023",
        "/plot_energy_consumption_over_time",
        "/plot_renewable_energy_sources_over_time",
        '/predict_all_consumptions_for_ten_years?country=Germany',
        '/predict_consumption?country=Germany&year=2025&energy=wind',
        '/predict_all_consumptions?country=Germany&year=2025'
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
@app.route('/plot_energy_type', methods=['GET'])
def plot_energy_type_api():
    country = request.args.get('country')
    energy_type = request.args.get('energy_type')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400
    
    plot_html = plot_energy_type(dataset, country, energy_type, start_year, end_year)
    #to return the image only => plot_html['img']
    return plot_html

@app.route('/plot_energy_consumption_pie', methods=['GET'])
def plot_energy_consumption_pie_api():
    country = request.args.get('country')
    year = request.args.get('year', type=int)
    energy_type = request.args.get('energy_type')

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400
    if not year:
        return jsonify({"error": "Year parameter is required"}), 400
    
    if energy_type == "renewable":
        energy_sources = renewable_sources
        pie_title = 'Renewable '
    elif energy_type == "non_renewable":
        energy_sources = non_renewable_sources
        pie_title = 'Non-Renewable '
    else:
        energy_sources = renewable_sources + non_renewable_sources
        pie_title = ''
    
    plot_html = plot_energy_consumption_pie(dataset, energy_sources, country, year, pie_title)
    #to return the image only => plot_html['img']
    return plot_html

@app.route('/plot_renewable_vs_non', methods=['GET'])
def plot_renewable_vs_non_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)

    plot_html = plot_renewable_vs_non(dataset, country, start_year, end_year)
    #to return the image only => plot_html['img']
    return plot_html

@app.route('/plot_energy_consumption_trend', methods=['GET'])
def plot_energy_consumption_trend_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)
    
    plot_html = plot_energy_consumption_trend(dataset, country, start_year, end_year)
    #to return the image only => plot_html['img']
    return plot_html


@app.route('/plot_energy_consumption_over_time', methods=['GET'])
def plot_energy_consumption_over_time_api():
    country = request.args.get('country')
    start_year = request.args.get('start_year', type=int)
    end_year = request.args.get('end_year', type=int)
    energy_types = request.args.getlist('energy_types') or None   
    plot_html = plot_energy_consumption_over_time(dataset, country, start_year=start_year, end_year=end_year, energy_types = energy_types)
    #to return the image only => plot_html['img']
    return plot_html


@app.route('/plot_renewable_energy_sources_over_time', methods=['GET'])
def plot_renewable_energy_sources_over_time_api():
    start_year = request.args.get('start_year', type=int)
    plot_html = plot_renewable_energy_sources_over_time(dataset, start_year=start_year)
    #to return the image only => plot_html['img']
    return plot_html


@app.route('/predict_consumption', methods=['GET'])
def predict_consumption_api():
    country = request.args.get('country')
    year = request.args.get('year', type=int)
    energy_type = request.args.get('energy')
    
    # data_path='owid-energy-data.csv'

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400
    if not year:
        return jsonify({"error": "Year parameter is required"}), 400
    if not energy_type:
        return jsonify({"error": "Energy type parameter is required"}), 400
    
    # return predict_consumption(country, year, energy_type, data_path)
    prediction_consumption = predict_consumption(country_name = country, prediction_year = year, energy_type = energy_type, csv_file_path = file_path)
    # print(prediction_consumption)
    return jsonify(prediction_consumption)

# List of energy types to predict
energy_types = [ 'wind', 'solar', 'biofuel', 'hydro', 'renewables', 'gas', 'coal', 'fossil_fuel']

@app.route('/predict_all_consumptions', methods=['GET'])
def predict_all_consumptions_api():
    country = request.args.get('country')
    year = request.args.get('year', type=int)
    data_path = 'owid-energy-data.csv'

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400
    if not year:
        return jsonify({"error": "Year parameter is required"}), 400

    # To store predictions for all energy types
    predictions = {}

    # Loop through each energy type and get predictions
    for energy_type in energy_types:
        prediction = predict_consumption(country_name = country, prediction_year = year, energy_type = energy_type, csv_file_path = file_path)
        predictions[energy_type] = prediction

    # Return the predictions as a JSON response
    return jsonify(predictions)


@app.route('/predict_all_consumptions_for_ten_years', methods=['GET'])
def predict_all_consumptions_for_ten_years_api():
    country = request.args.get('country')
    start_year = 2024
    data_path = 'owid-energy-data.csv'

    if not country:
        return jsonify({"error": "Country parameter is required"}), 400
    if not start_year:
        return jsonify({"error": "Start year parameter is required"}), 400

    # To store predictions for all energy types and years
    all_predictions = {}

    # Predict for the next 10 years
    for year in range(start_year, start_year + 10):
        yearly_predictions = {}
        for energy_type in energy_types:
            prediction = predict_consumption(country, year, energy_type, data_path)
            yearly_predictions[energy_type] = prediction
        
        all_predictions[year] = yearly_predictions

    # Return the predictions as a JSON response
    return jsonify(all_predictions)

@app.route('/get_energy_consumption', methods=['GET'])
def api_get_energy_consumption():
    year = request.args.get('year')
    result = get_energy_consumption(dataset, int(year))
    return jsonify(result)

@app.route('/get_energy_consumption_by_year', methods=['GET'])
def api_get_energy_consumption_by_year():
    year = request.args.get('year')
    result = get_energy_consumption_by_year(dataset, int(year))
    return jsonify(result)

@app.route('/get_top_renewable_countries_by_year', methods=['GET'])
def api_get_top_renewable_countries_by_year():
    year = request.args.get('year')
    result = get_top_renewable_countries_by_year(dataset, int(year))
    return jsonify(result)

@app.route('/get_renewable_energy_shares_by_year', methods=['GET'])
def api_get_renewable_energy_shares_by_year():
    year = request.args.get('year')
    result = get_renewable_energy_shares_by_year(dataset, int(year))
    return jsonify(result)

@app.route('/get_top_fossil_countries_by_year', methods=['GET'])
def api_get_top_fossil_countries_by_year():
    year = request.args.get('year')
    result = get_top_fossil_countries_by_year(dataset, int(year))
    return jsonify(result)

@app.route('/get_energy_consumption_by_type_and_year_for_country', methods=['GET'])
def api_get_energy_consumption_by_type_and_year_for_country():
    country = request.args.get('country')
    year = request.args.get('year')
    energy_type = request.args.get('energy_type')
    result = get_energy_consumption_by_type_and_year_for_country(dataset, int(year), energy_type, country)
    return jsonify(result)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)