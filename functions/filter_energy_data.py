# Filters energy consumption data for a specific country and optional time period.
def filter_energy_data(data, country, start_year=None, end_year=None):
    
    country_data = data[data['country'] == country].copy() #make a new copy for this filtered dataset

    # Check if the dataset contains any records for the specified country
    if country_data.empty:
        raise ValueError(f"No data available for {country}. Please check the country name.")

    # Get the min and max available years
    available_years = country_data['year'].unique()
    available_years.sort()  # Sort years to make it easier to find the nearest

    min_year = available_years.min()
    max_year = available_years.max()

    # Adjust start_year and end_year if they are not in the available years
    if start_year is not None:
        if start_year not in available_years:
            # Find the nearest smaller year
            valid_start_years = [year for year in available_years if year < start_year]
            if valid_start_years:
                start_year = max(valid_start_years)
            else:
                start_year = min_year  # If no smaller year is available, set to min year
    if end_year is not None:
        if end_year not in available_years:
            # Find the nearest smaller year
            valid_end_years = [year for year in available_years if year < end_year]
            if valid_end_years:
                end_year = max(valid_end_years)
            else:
                end_year = max_year  # If no smaller year is available, set to max year

    # Apply filtering by year if start_year and end_year are provided
    if start_year is not None:
        country_data = country_data[country_data['year'] >= start_year]
    if end_year is not None:
        country_data = country_data[country_data['year'] <= end_year]

    return country_data, start_year, end_year