import matplotlib.pyplot as plt
import pandas as pd
from functions.save_plot import save_plot

def plot_energy_consumption_over_time(data, country=None, start_year=None, end_year=None, energy_types=None ):
    plt.figure(figsize=(12, 6))

    if country:
        data = data[data['country'] == country]

        if start_year:
            data = data[data['year'] >= start_year]

        if end_year:
            data = data[data['year'] <= end_year]

        if energy_types is None:
            energy_types = ['biofuel_consumption', 'hydro_consumption', 'solar_consumption', 'wind_consumption']

        for energy_type in energy_types:
            plt.plot(data['year'], data[energy_type], label=energy_type)

        plt.xlabel('Year')
        plt.ylabel('Energy Consumption (units depend on your data)')
        title = f'Renewable Energy Consumption Over Time ({country or "Global"})'
        if start_year and end_year:
            title += f' ({start_year}-{end_year})'
        elif start_year:
            title += f' (From {start_year})'
        elif end_year:
            title += f' (Up to {end_year})'

        plt.title(title)
        plt.legend()
        plt.grid(True)

        plot_url = save_plot(plt)
        
        energy_consumption_over_time_data = {
        'year': data['year'].tolist(),
        'energy_consumption': data[energy_type].tolist()
        }
        # Return the plot as an HTML <img> tag
        return {"data": energy_consumption_over_time_data, "img": f"<img src='data:image/png;base64,{plot_url}'/>"}
