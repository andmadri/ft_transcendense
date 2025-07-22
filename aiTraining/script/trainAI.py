from glob import glob
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

ACTION_MAP = {
    'arrowUp': 0,
    'arrowDown': 1,
    'none': 2,
}

def loadData(json_files):
    inputs = []
    labels = []
    for filename in json_files:
        with open(filename) as f:
            data = json.load(f)
        last_time = -1000
        for entry in data:
            if entry['gameTime'] - last_time >= 1000:
                features = [
                    entry['gameTime'] / 1000,  # convert ms to seconds
                    entry['ballX'],
                    entry['ballY'],
                    entry['ballDX'],
                    entry['ballDY'],
                    entry['ballSpeed'],
                    entry['paddleY'],
                    entry['opponentY'],
                ]
                inputs.append(features)
                labels.append(ACTION_MAP[entry['action']])
                last_time = entry['gameTime']
    return np.array(inputs, dtype=np.float32), np.array(labels, dtype=np.int32)

def build_model(input_shape, num_classes):
    model = models.Sequential([
        layers.Dense(64, activation='relu', input_shape=input_shape),
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
    history = model.fit(X, y, epochs=10, batch_size=32, validation_split=0.1, verbose=1)
    
    # Save as SavedModel format
    print("Saving model...")
    model.save('../temp_model')
    
    print("\n" + "="*50)
    print("SUCCESS! Model trained and saved.")
    print("="*50)
    print("\nTo convert to TensorFlow.js format, run:")
    print("tensorflowjs_converter --input_format=tf_saved_model ../temp_model ../aiModel")
    print("\nOr install the converter separately:")
    print("npm install -g @tensorflow/tfjs-converter")
    print("tensorflowjs_converter --input_format=tf_saved_model ../temp_model ../aiModel")

if __name__ == '__main__':
    main()