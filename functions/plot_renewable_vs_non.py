import matplotlib.pyplot as plt

from functions.filter_energy_data import filter_energy_data
from functions.save_plot import save_plot

def plot_renewable_vs_non(dataset, country_name, start_year=None, end_year=None):
    # Define the country and time period
    country_data, new_start_year, new_end_year = filter_energy_data(dataset, country_name, start_year, end_year)
    print(country_data)

    # Define renewable and non-renewable energy sources
    renewable_sources = ['wind_consumption', 'solar_consumption', 'hydro_consumption', 'biofuel_consumption']
    non_renewable_sources = ['coal_consumption', 'oil_consumption', 'gas_consumption', 'nuclear_consumption', 'fossil_fuel_consumption']

    # Create new columns for summed values
    country_data['renewable_energy'] = country_data[renewable_sources].sum(axis=1)
    country_data['non_renewable_energy'] = country_data[non_renewable_sources].sum(axis=1)

    # Plot renewable vs non-renewable energy
    plt.figure(figsize=(12, 7))
    plt.plot(country_data['year'], country_data['renewable_energy'], label='Renewable Energy', color='green', linewidth=2)
    plt.plot(country_data['year'], country_data['non_renewable_energy'], label='Non-Renewable Energy', color='red', linewidth=2)

    # Labels and title
    plt.xlabel('Year')
    plt.ylabel('Consumption (TWh)')
    plt.legend()
    plt.title(f'Renewable vs Non-Renewable Energy in {country_name} ({new_start_year}-{new_end_year})')
    plt.grid(True)
    
    # Save the plot to a bytes object and encode it as a base64 string
    plot_url = save_plot(plt)
    # Return the plot as an HTML <img> tag
    return f"<img src='data:image/png;base64,{plot_url}'/>"