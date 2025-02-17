import pandas as pd
import sys
import os

# use the sys path, so the cols_to_check could be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from cols_to_check import features


# from ..cols_to_check import features

def load_and_preprocess_data(csv_path, energy_type):
    print('status: load_and_preprocess_data...' )
    try:
        data = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_path}")
        return None

    # Drop unnecessary columns
    columns_to_drop = ['iso_code', 'population', 'gdp']
    data = data.drop(columns=columns_to_drop, errors='ignore')

    # Fill missing wind_consumption with 0, i think the empty values represent that the country was not using this type on energy
    data[energy_type] = data[energy_type].fillna(0)

    # remove the target energy type from the data
    # relevant_columns = [feature for feature in features if feature != energy_type]
    
    relevant_columns = features
    
    # relevant_columns = ['country', 'year', energy_type] 
    
    data = data[relevant_columns]

    return data