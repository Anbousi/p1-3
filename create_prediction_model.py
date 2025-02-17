import numpy as np
import tensorflow as tf
import os
import matplotlib.pyplot as plt
import joblib

from functions.load_and_process_data import load_and_preprocess_data
from functions.create_sequences import create_sequences
from functions.create_lstm_model import build_lstm_model
from functions.create_lstm_model import train_model
from functions.create_lstm_model import save_model_and_scaler
from functions.create_lstm_model import load_model_and_scaler

from functions.predict_energy_year import predict_energy_year

def create_country_energy_type_model( country_name, energy_type, csv_file_path='owid-energy-data.csv', sequence_length = 5):

    # Load and Preprocess Data
    energy_data = load_and_preprocess_data(csv_file_path, (energy_type+'_consumption'))
    if energy_data is None:
        exit()

    X_train, y_train, scaler = create_sequences(energy_data, country_name, sequence_length, energy_type+'_consumption')

    if X_train is None:
        return (f"Could not create training data for {country_name}. Check if data exists and sequence length is appropriate.")
    
    # print(X_train)
    # print(y_train)

    # Build the lstm model
    model = build_lstm_model(lstm_units = 50, sequence_length = 5)
    
    # Train the LSTM Model
    print(f"Training LSTM model for {country_name}...")
    history = train_model(model, X_train, y_train)

    # Plotting training history
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Training History ' + country_name + ' ' + energy_type+'_consumption')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend()
    plt.show()
    
    model_save_path = os.path.join("saved_models", country_name, energy_type, f"{country_name}_{energy_type}_consumption.h5")
    scaler_save_path = os.path.join("saved_models", country_name, energy_type, f"{country_name}_{energy_type}_consumption_scaler.pkl")
    save_model_and_scaler(model, scaler, model_save_path, scaler_save_path)

    # Save Model and Scaler
    # save_model_and_scaler(model, scaler, model_save_path=((country_name + '_' + energy_type+'_consumption')+'.h5'), scaler_save_path=(country_name + '_' + energy_type+'_consumption_scaler.pkl'))

    print("\n--- Model Training and Saving Complete ---")


    # # Load Model and Scaler
    # loaded_model, loaded_scaler = load_model_and_scaler((country_name + '_' + energy_type+'_consumption')+'.h5', country_name + '_' + energy_type+'_consumption_scaler.pkl')
    # if loaded_model is None or loaded_scaler is None:
    #     return 'No model found'
    
    # # Predict for a Specific Year
    # prediction_year = 2030
    # predicted_wind_2028 = predict_energy_year(loaded_model, loaded_scaler, energy_data, country_name, prediction_year, sequence_length, energy_type)
    # print(predicted_wind_2028)

# create_country_energy_type_model(sequence_length = 5, country_name = 'Germany', energy_type='wind')
# 
countries = [ 'Germany', 'France', 'Asia']
energy_types = [ 'wind', 'solar', 'biofuel', 'hydro', 'renewables', 'gas', 'coal', 'fossil_fuel']
for country in countries:
    for energy_type in energy_types:
        create_country_energy_type_model(country_name=country, energy_type=energy_type , sequence_length=5)