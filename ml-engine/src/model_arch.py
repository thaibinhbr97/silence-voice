import tensorflow as tf
from tensorflow.keras import layers

def build_model(input_shape, num_classes):
    """
    TODO: [ML TEAM]
    Define the architecture (e.g., Conv3D or LSTM)
    """
    model = tf.keras.Sequential([
        layers.Input(shape=input_shape),
        layers.LSTM(64, return_sequences=False),
        layers.Dense(num_classes, activation='softmax')
    ])
    return model
