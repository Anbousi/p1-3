import matplotlib.pyplot as plt
from functions.save_plot import save_plot

# Plots a pie chart for energy consumption by source for a specific country and year.
def plot_energy_consumption_pie(data, energy_sources, country_name, year):

    # Filter the dataset for the given country and year
    country_year_data = data[(data['country'] == country_name) & (data['year'] == year)]

    # Check if data for the country and year exists
    if country_year_data.empty:
        raise ValueError(f"No data available for {country_name} in {year}.")

    # Calculate the total consumption for each energy source
    energy_consumption = country_year_data[energy_sources].sum()

    # Plot the pie chart
    plt.figure(figsize=(8, 8))
    wedges, texts, autotexts = plt.pie(energy_consumption, labels=None, autopct='%1.1f%%', startangle=90, textprops={'color': 'black'})

    # Create the legend (key map) outside the pie chart
    plt.legend(wedges, energy_sources, title="Energy Sources", loc="center left", bbox_to_anchor=(1, 0.5))

    plt.title(f'Energy Consumption by Source in {country_name} ({year})')
    plt.grid(True)
    
    plot_url = save_plot(plt)
    # Return the plot as an HTML <img> tag
    return f"<img src='data:image/png;base64,{plot_url}'/>"
