from glob import glob
import json
import numpy as np
import tensorflowjs as tfjs
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
						entry['gameTime'] / 1000, #convert ms to seconds
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
	return np.array(inputs, dtype=np.float32), np.array(labels, dtype=np.int32)

def build_model(input_shape, num_classes):
	model = models.Sequential([
		layers.InputLayer(input_shape=input_shape),
		layers.Dense(64, activation='relu'),
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

	X, y = loadData(json_files)
	print(f"loaded {len(X)} samples.")

	model = build_model(input_shape=(X.shape[1],), num_classes=len(ACTION_MAP))

	model.fit(X, y, epochs=10, batch_size=32, validation_split=0.1)

	tfjs.converters.save_keras_model(model, '../aiModel')

if __name__ == '__main__':
	main()
	