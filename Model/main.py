from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib

# Load the trained model
model = load_model('neural_network_model.h5')

# Load the scaler used during training
scaler = joblib.load('scaler.pkl')

# Initialize Flask app
app = Flask(__name__)

@app.route("/")
def hello():
    """Return a friendly HTTP greeting."""
    return "Hello World!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Log received data
        print(f"Received data: {data}")

        # Extract features from data
        age = data.get('age')
        gender = data.get('gender')
        stress_level = data.get('stress_level')
        sleep_duration = data.get('sleep_duration')
        bmi_underweight = data.get('bmi_underweight')
        bmi_normal = data.get('bmi_normal')
        bmi_overweight = data.get('bmi_overweight')
        bmi_obese = data.get('bmi_obese')

        # Ensure all necessary fields are provided
        if age is None or gender is None or stress_level is None or sleep_duration is None or bmi_underweight is None or bmi_normal is None or bmi_overweight is None or bmi_obese is None:
            raise KeyError("Missing one or more required parameters")

        # Ensure gender is an integer
        if not isinstance(gender, int):
            raise ValueError('Gender must be an integer')

        # Convert all inputs to float and create DataFrame
        input_features = pd.DataFrame([[
            float(age), 
            float(gender), 
            float(stress_level), 
            float(sleep_duration), 
            float(bmi_underweight), 
            float(bmi_normal), 
            float(bmi_overweight), 
            float(bmi_obese)
        ]], columns=[
            'age', 'gender', 'stress_level', 'sleep_duration', 'bmi_underweight', 
            'bmi_normal', 'bmi_overweight', 'bmi_obese'
        ])

        # Log input features before scaling
        print(f"Input features before scaling: {input_features}")

        # Normalize input features
        input_features_scaled = scaler.transform(input_features)

        # Log input features after scaling
        print(f"Input features after scaling: {input_features_scaled}")

        # Predict quality score
        predicted_quality_score = model.predict(input_features_scaled)[0][0]

        # Log the prediction before formatting
        print(f"Raw predicted quality score: {predicted_quality_score}")

        # Format the quality score to 2 decimal places
        formatted_quality_score = float(f"{predicted_quality_score:.2f}")

        # Log the formatted prediction
        print(f"Formatted predicted quality score: {formatted_quality_score}")

        # Return result as JSON
        return jsonify({'quality_score': formatted_quality_score})

    except KeyError as e:
        return jsonify({'error': f'Missing parameter: {str(e)}'}), 400
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Log any other errors
        print(f"Error: {str(e)}")
        return jsonify({'error': 'An error occurred during prediction'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)