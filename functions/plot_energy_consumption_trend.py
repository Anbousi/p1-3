import matplotlib.pyplot as plt

from functions.filter_energy_data import filter_energy_data
from functions.save_plot import save_plot

def plot_energy_consumption_trend(dataset, country_name, start_year=None, end_year=None):
    # Define the country and time period
    country_data, new_start_year, new_end_year = filter_energy_data(dataset, country_name, start_year, end_year)
    
    # List of columns to plot
    consumption_columns = [
        'renewables_consumption', 'coal_consumption', 'biofuel_consumption',
        'fossil_fuel_consumption', 'gas_consumption', 'hydro_consumption',
        'nuclear_consumption', 'oil_consumption', 'wind_consumption', 'solar_consumption'
    ]

    plt.figure(figsize=(12, 7))

    # Plot each column
    for column in consumption_columns:
        plt.plot(country_data['year'], country_data[column], label=column.replace('_', ' ').title())

    plt.xlabel('Year')
    plt.ylabel('Consumption (TWh)')
    plt.legend()
    plt.title(f'Energy Consumption Trends in {country_name}')
    
    plot_url = save_plot(plt)
    
    plot_data = {}

    # Collect data for each column
    for column in consumption_columns:
        plot_data[column] = {
            'year': country_data['year'].tolist(),
            'consumption': country_data[column].tolist()
        }
        
    # Return the plot as an HTML <img> tag
    return {"data": plot_data, "img": f"<img src='data:image/png;base64,{plot_url}'/>"}