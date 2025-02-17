
import os
from functions.load_and_process_data import load_and_preprocess_data
from functions.create_lstm_model import load_model_and_scaler
from functions.predict_energy_year import predict_energy_year

def predict_consumption(country_name, prediction_year, energy_type, csv_file_path, sequence_length = 5):
    
    # Load and Preprocess Data
    energy_data = load_and_preprocess_data(csv_file_path, (energy_type+'_consumption'))
    if energy_data is None:
        return 'Energy data is none'
    
    # Load Model and Scaler
    model_save_path = os.path.join("saved_models", country_name, energy_type, f"{country_name}_{energy_type}_consumption.h5")
    scaler_save_path = os.path.join("saved_models", country_name, energy_type, f"{country_name}_{energy_type}_consumption_scaler.pkl")
    
    loaded_model, loaded_scaler = load_model_and_scaler(model_save_path, scaler_save_path)

    
    # loaded_model, loaded_scaler = load_model_and_scaler((country_name + '_' + energy_type+'_consumption')+'.h5', country_name + '_' + energy_type+'_consumption_scaler.pkl')
    if loaded_model is None or loaded_scaler is None:
        return 'No model found'
    
    # Predict for a Specific Year
    prediction_year = prediction_year
    predicted_consumption = predict_energy_year(loaded_model, loaded_scaler, energy_data, country_name, prediction_year, sequence_length, energy_type)
    print(predicted_consumption)

    return predicted_consumption


    # predict_consumption(country_name = 'Germany', prediction_year = 2030, energy_type = 'wind', csv_file_path = 'owid-energy-data.csv')

