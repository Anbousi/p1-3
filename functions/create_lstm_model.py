
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import mse
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import tensorflow as tf

def build_lstm_model(lstm_units = 50, sequence_length = 5):
    
    feature_count = 1
    activation_function = 'tanh'

    model = Sequential()
    model.add(LSTM(lstm_units, activation=activation_function, input_shape=(sequence_length, feature_count)))
    model.add(Dense(1))
    model.compile(optimizer=Adam(learning_rate=0.001), loss=mse)
    return model

def train_model(model, X_train, y_train, epochs=50, batch_size=32, validation_split=0.2, patience=5):
    early_stopping = EarlyStopping(monitor='val_loss', patience=patience, restore_best_weights=True)
    history = model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_split=validation_split, verbose=1, callbacks=early_stopping)
    return history

def save_model_and_scaler(model, scaler, model_save_path, scaler_save_path):
    model.save(model_save_path)
    joblib.dump(scaler, scaler_save_path)
    print(f"Model saved to {model_save_path}")
    print(f"Scaler saved to {scaler_save_path}")
    
def load_model_and_scaler(model_save_path, scaler_save_path):
    try:
        loaded_model = tf.keras.models.load_model(model_save_path)
    except OSError:
        print(f"Error: Model file not found at {model_save_path}")
        return None, None

    try:
        loaded_scaler = joblib.load(scaler_save_path)
    except FileNotFoundError:
        print(f"Error: Scaler file not found at {scaler_save_path}")
        return None, None

    return loaded_model, loaded_scaler