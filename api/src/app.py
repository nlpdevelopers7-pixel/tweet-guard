"""
Hate Speech Detection API
Flask API for detecting hate speech and offensive language in text
"""

import pickle
import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins="*")  # Enable CORS for all origins

# Global variables for model
model_data = None

def load_model():
    """Load the trained model and vectorizer"""
    global model_data
    try:
        # Model is saved in the organized structure
        # Try multiple possible paths
        possible_paths = [
            'models/saved/hate_speech_model.pkl',  # From root directory
            '../models/saved/hate_speech_model.pkl',  # From api directory
            '../../models/saved/hate_speech_model.pkl'  # From api/src directory
        ]
        
        model_path = None
        for path in possible_paths:
            if os.path.exists(path):
                model_path = path
                break
        
        if model_path is None:
            raise FileNotFoundError("Model not found in any expected location")
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        logger.info(f"Model loaded successfully from {model_path}")
        logger.info(f"Model: {model_data.get('model_name', 'Unknown')}")
        logger.info(f"Performance: F1={model_data.get('performance', {}).get('f1', 'Unknown'):.4f}")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.error("Make sure to run the training notebook first to generate the model")
        logger.error("Expected model path: ../models/saved/hate_speech_model.pkl")
        return False

def predict_hate_speech(text):
    """
    Predict if text contains hate speech or offensive language
    
    Args:
        text (str): Input text to classify
    
    Returns:
        dict: Prediction results
    """
    if model_data is None:
        return {"error": "Model not loaded"}
    
    try:
        # Transform text
        text_vectorized = model_data['vectorizer'].transform([text])
        
        # Get probability
        probability = model_data['model'].predict_proba(text_vectorized)[0, 1]
        
        # Apply threshold
        prediction = 1 if probability >= model_data['threshold'] else 0
        
        return {
            'text': text,
            'prediction': int(prediction),
            'probability': float(probability),
            'label': 'Foul' if prediction == 1 else 'Proper',
            'confidence': float(probability if prediction == 1 else 1 - probability),
            'threshold': float(model_data['threshold'])
        }
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return {"error": f"Prediction failed: {str(e)}"}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_data is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict hate speech in text
    
    Expected JSON payload:
    {
        "text": "Your text here"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        if 'text' not in data:
            return jsonify({"error": "Missing 'text' field"}), 400
        
        text = data['text']
        
        if not isinstance(text, str):
            return jsonify({"error": "Text must be a string"}), 400
        
        if len(text.strip()) == 0:
            return jsonify({"error": "Text cannot be empty"}), 400
        
        if len(text) > 1000:  # Reasonable limit
            return jsonify({"error": "Text too long (max 1000 characters)"}), 400
        
        # Make prediction
        result = predict_hate_speech(text)
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    """Get model information and performance metrics"""
    if model_data is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    return jsonify({
        'model_type': 'Logistic Regression',
        'vectorizer_type': 'TF-IDF with bigrams',
        'threshold': float(model_data['threshold']),
        'performance': model_data['performance']
    })

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """
    Predict hate speech for multiple texts
    
    Expected JSON payload:
    {
        "texts": ["text1", "text2", ...]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        if 'texts' not in data:
            return jsonify({"error": "Missing 'texts' field"}), 400
        
        texts = data['texts']
        
        if not isinstance(texts, list):
            return jsonify({"error": "Texts must be a list"}), 400
        
        if len(texts) == 0:
            return jsonify({"error": "Texts list cannot be empty"}), 400
        
        if len(texts) > 100:  # Reasonable limit
            return jsonify({"error": "Too many texts (max 100)"}), 400
        
        results = []
        for text in texts:
            if not isinstance(text, str):
                results.append({"error": "Text must be a string"})
                continue
            
            if len(text.strip()) == 0:
                results.append({"error": "Text cannot be empty"})
                continue
            
            if len(text) > 1000:
                results.append({"error": "Text too long"})
                continue
            
            result = predict_hate_speech(text)
            results.append(result)
        
        return jsonify({"results": results})
        
    except Exception as e:
        logger.error(f"Error in batch_predict endpoint: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Load model on startup
    if load_model():
        logger.info("Starting Hate Speech Detection API...")
        app.run(host='0.0.0.0', port=5004, debug=True)
    else:
        logger.error("Failed to load model. Exiting...")
