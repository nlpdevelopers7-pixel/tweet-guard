#!/usr/bin/env python3
"""
Model Path Checker
Verifies that the model is saved in the correct location for the API
"""

import os
import sys
import pickle

def check_model_path():
    """Check if model exists in the correct location"""
    
    # Expected model path
    model_path = "models/saved/hate_speech_model.pkl"
    
    print("🔍 Checking model path...")
    print(f"Expected path: {model_path}")
    
    # Check if file exists
    if not os.path.exists(model_path):
        print(f"❌ Model not found at {model_path}")
        print("\n📋 To fix this:")
        print("1. Run the training notebook: cd notebooks/ && jupyter notebook")
        print("2. Execute all cells to train and save the model")
        print("3. The model will be saved to models/saved/hate_speech_model.pkl")
        return False
    
    print(f"✅ Model found at {model_path}")
    
    # Try to load and verify the model
    try:
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        print(f"✅ Model loaded successfully")
        print(f"🤖 Model type: {model_data.get('model_name', 'Unknown')}")
        print(f"📊 Performance: F1={model_data.get('performance', {}).get('f1', 'Unknown'):.4f}")
        print(f"🎯 Threshold: {model_data.get('threshold', 'Unknown')}")
        
        # Check if all required components are present
        required_keys = ['model', 'vectorizer', 'threshold', 'model_name', 'performance']
        missing_keys = [key for key in required_keys if key not in model_data]
        
        if missing_keys:
            print(f"⚠️  Missing keys: {missing_keys}")
            return False
        
        print("✅ All required model components present")
        return True
        
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return False

def check_api_path():
    """Check if API can find the model"""
    
    print("\n🌐 Checking API model path...")
    
    # Check from API directory
    api_model_path = "api/src/../../models/saved/hate_speech_model.pkl"
    if os.path.exists(api_model_path):
        print(f"✅ API can access model at {api_model_path}")
        return True
    else:
        print(f"❌ API cannot access model at {api_model_path}")
        return False

if __name__ == "__main__":
    print("🚨 Tweet Guard - Model Path Checker")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("README.md"):
        print("❌ Please run this script from the tweet-guard-organized root directory")
        sys.exit(1)
    
    # Check model
    model_ok = check_model_path()
    
    # Check API path
    api_ok = check_api_path()
    
    print("\n" + "=" * 50)
    if model_ok and api_ok:
        print("🎉 Everything looks good! The API should work correctly.")
        print("\n🚀 Next steps:")
        print("1. Start the API: cd api/ && python src/app.py")
        print("2. Start the frontend: cd frontend/ && npm start")
    else:
        print("❌ Issues found. Please fix them before running the API.")
        sys.exit(1)
