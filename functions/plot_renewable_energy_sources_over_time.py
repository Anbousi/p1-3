import matplotlib.pyplot as plt
import pandas as pd
from functions.save_plot import save_plot

def plot_renewable_energy_sources_over_time(data, start_year=None):
    plt.figure(figsize=(12, 6))

    if start_year:
        data = data[data['year'] >= start_year]

    energy_types = ['solar_consumption', 'wind_consumption', 'hydro_consumption']
    
    renewable_data = data.groupby('year')[['solar_consumption', 'wind_consumption', 'hydro_consumption']].sum().reset_index()

    for energy_type in energy_types:
        plt.plot(renewable_data['year'], renewable_data[energy_type], label=energy_type)

    plt.title('Share of Renewable Energy Sources Over Time')
    plt.xlabel('Year')
    plt.ylabel('Energy Consumption (TWh)')
    plt.legend()
    plt.grid(True)

    plot_url = save_plot(plt)
    
    renewable_energy_sources_over_time = {
    'year': data['year'].tolist(),
    'energy_consumption': data[energy_type].tolist()
    }
    # Return the plot as an HTML <img> tag
    return {"data": renewable_energy_sources_over_time, "img": f"<img src='data:image/png;base64,{plot_url}'/>"}
