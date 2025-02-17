import numpy as np
import pandas as pd

def predict_energy_year(model, scaler, data, country, prediction_year, sequence_length, target_column):
    target_column = target_column + '_consumption'
    # Get the last year for the country
    last_known_year = data[data['country'] == country]['year'].max() 

    # if LSTM model predict only the next step value, if there are many steps to reach the required year
    # the model should calculate all the steps till reach the required year
    predictions = []

    for year in range(last_known_year + 1, prediction_year + 1):
        
        # i got an error: ValueError: cannot reshape array of size 124 into shape (1,5,1)
        # solved by .tail, as the data has a 
        country_data_hist = data[(data['country'] == country) & (data['year'] < year)].sort_values(by='year').tail(sequence_length)

        if len(country_data_hist) < sequence_length:
            print(f"Error: Not enough historical data for {country} before {year} to make a prediction.")
            return None

        input_sequence = scaler.transform(country_data_hist[[target_column]]) 
        input_sequence = np.array([input_sequence])
        input_sequence = input_sequence.reshape(1, sequence_length, 1) 

        predicted_scaled_value = model.predict(input_sequence)
        predicted_value = scaler.inverse_transform(predicted_scaled_value)

        predictions.append({'country': country, 'year': year, 'energy_type': target_column, 'prediction': float(predicted_value[0][0])})
        # Update the historical data for the next prediction (autoregressive)
        new_data_point = pd.DataFrame({'country': [country], 'year': [year], target_column: [float(predicted_value[0][0])]})
        data = pd.concat([data, new_data_point], ignore_index=True)


    return predictions




