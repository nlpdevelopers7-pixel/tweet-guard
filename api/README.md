# 🌐 API Backend

Flask API for hate speech detection with trained machine learning model.

## 📁 Structure

```
api/
├── src/
│   └── app.py              # Main Flask application
├── requirements.txt        # Python dependencies
├── templates/              # HTML templates (if needed)
├── static/                # Static files (if needed)
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd api/
pip install -r requirements.txt
```

### 2. Ensure Model is Trained
Make sure `hate_speech_model.pkl` exists in the models/saved/ directory.

### 3. Start the API
```bash
python src/app.py
```

The API will start on `http://localhost:5004`

## 📡 API Endpoints

### Predict Hate Speech
```bash
POST /predict
Content-Type: application/json

{
    "text": "Your tweet text here",
    "threshold": 0.3
}
```

**Response:**
```json
{
    "prediction": "Foul",
    "confidence": 0.95,
    "probability": 0.95,
    "threshold": 0.3
}
```

### Health Check
```bash
GET /health
```

**Response:**
```json
{
    "status": "healthy",
    "model_loaded": true,
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### Model Information
```bash
GET /model-info
```

**Response:**
```json
{
    "model_name": "SVM Linear",
    "performance": {
        "accuracy": 0.9603,
        "f1_score": 0.9760
    },
    "threshold": 0.3
}
```

## 🔧 Configuration

- **Port**: 5004 (configurable in app.py)
- **CORS**: Enabled for all origins
- **Model Path**: `../models/saved/hate_speech_model.pkl`

## 🧪 Testing

```bash
# Run API tests
cd ../tests/
python test_api.py
```

## 🐳 Docker

```bash
# Build API container
docker build -t tweet-guard-api .

# Run API container
docker run -p 5004:5004 tweet-guard-api
```
