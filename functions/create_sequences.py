import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

def create_sequences(data, country, sequence_length, target_column):
    
    print(country, sequence_length, target_column)
    
    country_data = data[data['country'] == country].sort_values(by='year')
    if country_data.empty or len(country_data) < sequence_length:
        print(f"Warning: Insufficient data for {country} to create sequences of length {sequence_length}.")
        return None, None, None

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(country_data[[target_column]])

    X_sequences, y_sequences = [], []
    for i in range(len(scaled_data) - sequence_length):
        X_sequences.append(scaled_data[i:i+sequence_length])
        y_sequences.append(scaled_data[i+sequence_length])
        
    return np.array(X_sequences), np.array(y_sequences), scaler
    