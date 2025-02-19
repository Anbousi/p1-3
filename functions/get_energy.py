# The following functions have been created
# by Malik

renewable_types = ["wind_share_elec", "solar_share_energy", "hydro_share_elec"]

fossil_types = ["coal_share_elec", "oil_share_elec", "gas_share_elec", "nuclear_share_elec"]

energy_types = {
    'Coal': 'coal_consumption',
    'Oil': 'oil_consumption',
    'Gas': 'gas_consumption',
    'Nuclear': 'nuclear_consumption',
    'Hydro': 'hydro_consumption',
    'Solar': 'solar_consumption',
    'Wind': 'wind_consumption',
}

def get_energy_consumption(data, year):
    """
    Returns energy consumption for all types in a given year.

    :param df: DataFrame containing the energy data.
    :param year: The year for which to extract the data.
    :return: A Series containing energy consumption values for that year.
    """
    filtered_df = data[data["year"] == year]

    if filtered_df.empty:
        return f"No data available for the year {year}"

    energy_columns = [col for col in data.columns if "consumption" in col.lower()]
    
    data_merged = filtered_df[["year", "country"] + energy_columns]
    json_data = data_merged.set_index("country").to_dict(orient="index")

    return json_data

def get_energy_consumption_by_year(data, year):
    """
    Returns the energy consumption for each type of energy for the given year.

    :param year: The year for which to extract the energy consumption data.
    :return: A dictionary containing the energy consumption values for each type of energy.
    """
    filtered_data = data[data["year"] == year]

    if filtered_data.empty:
        return f"No data available for the year {year}"

    energy_consumption = {}

    for energy_type, col in energy_types.items():
        if col in filtered_data.columns:
            energy_consumption[energy_type] = filtered_data[col].sum()  # Sum all values for that year
        else:
            energy_consumption[energy_type] = None  # If the column is missing, set it to None
    
    return energy_consumption


def get_top_renewable_countries_by_year(data, year):
    """
    Returns the top 5 countries for each type of renewable energy in a given year.

    :param year: The year for which to extract the top renewable energy countries.
    :return: A dictionary containing top 5 countries for each renewable energy type.
    """
    filtered_data = data[data["year"] == year]

    if filtered_data.empty:
        return f"No data available for the year {year}"

    top_countries = {}
   
    for energy_type in renewable_types:
        if energy_type in filtered_data.columns:
            top_countries[energy_type] = (
                filtered_data[["country", energy_type]]
                .nlargest(5, energy_type)["country"]
                .tolist()
            )

    return top_countries


def get_renewable_energy_shares_by_year(data, year):
    """
    Returns the share of each renewable energy source in a given year.

    :param year: The year for which to extract the energy shares.
    :return: A dictionary containing the average share of each renewable energy type in that year.
    """
    filtered_data = data[data["year"] == year]

    if filtered_data.empty:
        return f"No data available for the year {year}"

    renewable_shares = {}
    for energy_type in renewable_types:
        if energy_type in filtered_data.columns:
            renewable_shares[energy_type] = filtered_data[energy_type].mean()

    return renewable_shares


def get_top_fossil_countries_by_year(data, year):
    """
    Returns the top 5 countries for each type of non-renewable (fossil and nuclear) energy in a given year.

    :param year: The year for which to extract the top non-renewable energy countries.
    :return: A dictionary containing the top 5 countries for each non-renewable energy type.
    """
    filtered_data = data[data["year"] == year]

    if filtered_data.empty:
        return f"No data available for the year {year}"

    top_countries = {}

    for energy_type in fossil_types:
        if energy_type in filtered_data.columns:
            top_countries[energy_type] = (
                filtered_data[["country", energy_type]]
                .nlargest(5, energy_type)["country"]
                .tolist()
            )

    return top_countries


def get_energy_consumption_by_type_and_year_for_country(data, year, energy_type, country):
    """
    Returns energy consumption for a specific energy type in a given year for a specific country.

    :param year: The year for which to extract the energy consumption data.
    :param energy_type: The energy type (e.g., 'coal', 'oil', 'gas', etc.) for which to extract the consumption.
    :param country: The country for which to extract the energy consumption data.
    :return: A DataFrame containing the energy consumption for the given type, year, and country.
    """
    filtered_df = data[(data["year"] == year) & (data["country"].str.lower() == country.lower())]

    if filtered_df.empty:
        return f"No data available for {country} in the year {year}"

    energy_column = f"{energy_type}_consumption"

    if energy_column not in filtered_df.columns:
        return f"No data available for the energy type {energy_type} in {country} for the year {year}"
    
    data_merged = filtered_df[["year", "country", energy_column]].copy()
    data_merged = data_merged.rename(columns={energy_column: "consumption"})
    data_merged["type"] = energy_type
    json_data = data_merged.set_index("country").to_dict(orient="index")
    # examplee of the return
    # {
    #     "Germany": {
    #     "consumption": 871.075,
    #     "type": "gas",
    #     "year": 2020
    #     }
    # }
    return json_data