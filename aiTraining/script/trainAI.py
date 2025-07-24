from glob import glob
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

ACTION_MAP = {
    'ArrowUp': 0,
    'ArrowDown': 1,
    'none': 2,
}

class_weight = {
    0: 3.0,  # "ArrowUp"
    1: 2.0,  # "ArrowDown"
    2: 1.0   # "none"
}

def loadData(json_files):
    inputs = []
    labels = []
    for filename in json_files:
        with open(filename) as f:
            data = json.load(f)
        last_time = -1000
        for entry in data:
            features = [
                entry['ballX'],
                entry['ballY'],
                entry['ballDX'],
                entry['ballDY'],
                entry['paddleY'],
            ]
            inputs.append(features)
            labels.append(ACTION_MAP[entry['action']])
            last_time = entry['gameTime']
    return np.array(inputs, dtype=np.float32), np.array(labels, dtype=np.int32)

def build_model(input_shape, num_classes):
    model = models.Sequential([
        layers.Dense(128, activation='relu', input_shape=input_shape),
        layers.Dense(64, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def main():
    json_files = glob('../data/*.json')
    if not json_files:
        print("No JSON files found in ../data/ directory!")
        return
        
    X, y = loadData(json_files)
    print(f"Loaded {len(X)} samples.")
    
    if len(X) == 0:
        print("No training data found!")
        return
    
    model = build_model(input_shape=(X.shape[1],), num_classes=len(ACTION_MAP))
    
    print("Training model...")
    callback = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    history = model.fit(X, y, epochs=100, batch_size=32, validation_split=0.1, verbose=1, class_weight=class_weight)
    
    plt.plot(history.history['loss'], label='train loss')
    plt.plot(history.history['val_loss'], label='val loss')
    plt.legend()
    plt.show()

    # Save as SavedModel format
    print("Saving model...")
    model.save('../temp_model/model.h5')
    
    print("\n" + "="*50)
    print("SUCCESS! Model trained and saved.")
    print("="*50)
    print("\nTo convert to TensorFlow.js format, run:")
    print("tensorflowjs_converter --input_format=tf_saved_model ../temp_model ../aiModel")
    print("\nOr install the converter separately:")
    print("npm install -g @tensorflow/tfjs-converter")
    print("tensorflowjs_converter --input_format=tf_saved_model ../temp_model ../aiModel")

    probs = model.predict(X[:20])
    print(np.round(probs, 2))
    print("Predicted classes:", np.argmax(probs, axis=1))
    print("True labels:      ", y[:20])

if __name__ == '__main__':
    main()