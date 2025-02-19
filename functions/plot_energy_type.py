import io, os
import base64
import matplotlib.pyplot as plt

from functions.save_plot import save_plot

from functions.filter_energy_data import filter_energy_data

# Function to plot the relationship between year and solar electricity for a specific country
def plot_energy_type(dataset, country_name, energy_type = 'solar_electricity',start_year=None, end_year=None):
    # Filter the data for the specific country
    country_data, new_start_year, new_end_year = filter_energy_data(dataset, country_name, start_year, end_year)
    
    # Plot the data
    plt.figure(figsize=(10, 6))
    plt.plot(country_data['year'], country_data[energy_type], marker='o')
    plt.xlabel('Year')
    plt.ylabel('(TWh)')
    title = f'{energy_type} for {country_name}'
    if start_year is not None and end_year is not None:
        title = f'{energy_type} ({new_start_year}-{new_end_year}) for {country_name}'
    plt.title(title)
    plt.grid(True)
    
    # Save the plot to a bytes object and encode it as a base64 string
    plot_url = save_plot(plt)
    
    energy_type_data = {
        'year': country_data['year'].tolist(),
        'energy_type': country_data[energy_type].tolist()
    }
    # Return the plot as an HTML <img> tag
    return {"data": energy_type_data, "img": f"<img src='data:image/png;base64,{plot_url}'/>"}