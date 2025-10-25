# 🚨 Tweet Guard - Hate Speech Detection System

A complete machine learning pipeline for detecting hate speech and offensive language in tweets, with a Flask API and React frontend.

## 📁 Project Structure

```
tweet-guard-organized/
├── 📊 data/                          # Dataset and raw data
│   └── dataset.csv                   # Training dataset
├── 📓 notebooks/                     # Jupyter notebooks
│   └── hate_speech_model_training.ipynb
├── 🔧 src/                           # Source code utilities
├── 🌐 api/                          # Flask API backend
│   ├── src/
│   │   └── app.py                    # Main Flask application
│   ├── requirements.txt              # Python dependencies
│   ├── templates/                    # HTML templates
│   └── static/                       # Static files
├── ⚛️ frontend/                     # React frontend
│   ├── src/
│   ├── public/
│   ├── components/
│   └── package.json
├── 🤖 models/                       # Model artifacts
│   ├── trained/                     # Trained models
│   └── saved/                       # Saved model files
├── 🧪 tests/                        # Test files
│   └── test_api.py
├── 📚 docs/                         # Documentation
├── 🚀 scripts/                      # Utility scripts
│   ├── setup/                       # Setup scripts
│   └── deployment/                  # Deployment scripts
├── 🐳 Dockerfile                    # Docker configuration
├── 🐳 docker-compose.yml            # Docker Compose
└── 📋 README.md                     # This file
```

## 🚀 Quick Start

### 1. Train the Model
```bash
cd notebooks/
jupyter notebook hate_speech_model_training.ipynb
# Run all cells to train and save the model
# Model will be saved to ../models/saved/hate_speech_model.pkl
```

### 2. Check Model Setup
```bash
python scripts/setup/check_model.py
# Verify model is saved correctly
```

### 3. Start the API
```bash
cd api/
pip install -r requirements.txt
python src/app.py
# API will start on http://localhost:5004
```

### 4. Start the Frontend
```bash
cd frontend/
npm install
npm start
# Frontend will start on http://localhost:3000
```

### 5. Test the System
```bash
cd tests/
python test_api.py
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📊 Model Performance

- **Accuracy**: 96.03%
- **F1-Score**: 97.60%
- **Precision**: 98.02%
- **Recall**: 97.19%

## 🛠️ Tech Stack

- **ML**: scikit-learn, pandas, numpy
- **Backend**: Flask, Python
- **Frontend**: React.js, Axios
- **Deployment**: Docker, Docker Compose
- **Testing**: pytest

## 📝 Features

- ✅ Fair model comparison (3 algorithms)
- ✅ Grid search optimization
- ✅ Threshold tuning
- ✅ RESTful API
- ✅ React frontend
- ✅ Docker deployment
- ✅ Comprehensive testing

## 🎯 Usage

1. **Train Model**: Run the Jupyter notebook
2. **Start API**: Flask server on port 5004
3. **Open Frontend**: React app on port 3000
4. **Test**: Use the web interface or API directly

## 📞 API Endpoints

- `POST /predict` - Predict hate speech
- `GET /health` - Health check
- `GET /model-info` - Model information

## 🔧 Development

See individual README files in each directory for detailed setup instructions.
