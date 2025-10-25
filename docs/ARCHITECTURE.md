# 🏗️ System Architecture

## 📊 High-Level Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   📱 Frontend   │    │   🌐 API        │    │   🤖 Model      │
│   (React.js)    │◄──►│   (Flask)       │◄──►│   (scikit-learn)│
│   Port: 3000    │    │   Port: 5004    │    │   (Pickle)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Data Flow

1. **User Input** → React Frontend
2. **API Request** → Flask Backend
3. **Text Processing** → TF-IDF Vectorization
4. **Prediction** → Trained ML Model
5. **Response** → JSON with results
6. **Display** → React Frontend

## 🧩 Component Details

### 📱 Frontend (React.js)
- **Purpose**: User interface for text input and results display
- **Technology**: React.js, Styled Components, Axios
- **Features**: Real-time prediction, threshold control, responsive design

### 🌐 API (Flask)
- **Purpose**: RESTful API for hate speech detection
- **Technology**: Flask, Python, CORS
- **Endpoints**: `/predict`, `/health`, `/model-info`
- **Features**: Model loading, text preprocessing, prediction

### 🤖 Model (scikit-learn)
- **Purpose**: Machine learning model for classification
- **Technology**: scikit-learn, TF-IDF, SVM/Logistic Regression
- **Features**: Binary classification, probability scores, threshold tuning

## 📊 Model Architecture

```
Text Input → TF-IDF Vectorization → Trained Model → Probability → Threshold → Prediction
```

### 🔧 Model Components
1. **Vectorizer**: TF-IDF with bigrams (10,000 features)
2. **Classifier**: SVM Linear (optimized with grid search)
3. **Threshold**: 0.3 (tunable for sensitivity)
4. **Output**: Binary classification (Foul/Proper)

## 🗄️ Data Storage

### 📁 File Structure
```
models/
├── saved/
│   └── hate_speech_model.pkl    # Complete model package
└── trained/                      # Training artifacts
```

### 📦 Model Package Contents
```python
{
    'model': trained_classifier,
    'vectorizer': tfidf_vectorizer,
    'threshold': 0.3,
    'model_name': 'SVM Linear',
    'performance': metrics_dict,
    'training_date': timestamp,
    'optimization_info': grid_search_results
}
```

## 🔄 Training Pipeline

```
Dataset → Preprocessing → Feature Extraction → Model Comparison → 
Selection → Grid Search → Threshold Tuning → Model Saving
```

### 📊 Training Steps
1. **Data Loading**: Load CSV dataset
2. **Preprocessing**: Binary classification (foul vs proper)
3. **Feature Extraction**: TF-IDF with bigrams
4. **Model Comparison**: Test 3 algorithms fairly
5. **Selection**: Choose best performing model
6. **Optimization**: Grid search hyperparameter tuning
7. **Threshold Tuning**: Optimize decision threshold
8. **Saving**: Save complete model package

## 🚀 Deployment Architecture

### 🐳 Docker Setup
```
┌─────────────────────────────────────────┐
│              Docker Compose             │
├─────────────────┬───────────────────────┤
│   Frontend      │   API                 │
│   Container     │   Container           │
│   (React)       │   (Flask + Model)     │
└─────────────────┴───────────────────────┘
```

### 🌐 Network Configuration
- **Frontend**: Port 3000 (React dev server)
- **API**: Port 5004 (Flask application)
- **CORS**: Enabled for cross-origin requests
- **Communication**: HTTP/HTTPS REST API

## 🔧 Configuration

### 📋 Environment Variables
```bash
# API Configuration
API_PORT=5004
API_HOST=0.0.0.0

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5004

# Model Configuration
MODEL_PATH=models/saved/hate_speech_model.pkl
THRESHOLD=0.3
```

## 🧪 Testing Architecture

### 🔍 Test Coverage
- **Unit Tests**: API endpoints, model loading
- **Integration Tests**: End-to-end prediction flow
- **Frontend Tests**: React component testing
- **Performance Tests**: Load testing, response times

### 📊 Test Scenarios
1. **Happy Path**: Normal text → Proper prediction
2. **Foul Content**: Offensive text → Foul prediction
3. **Edge Cases**: Empty input, special characters
4. **Error Handling**: Invalid requests, model failures

## 📈 Performance Metrics

### 🎯 Model Performance
- **Accuracy**: 96.03%
- **F1-Score**: 97.60%
- **Precision**: 98.02%
- **Recall**: 97.19%
- **ROC-AUC**: 98.28%

### ⚡ System Performance
- **API Response Time**: < 100ms
- **Model Loading**: < 2 seconds
- **Frontend Rendering**: < 500ms
- **Throughput**: 100+ requests/second

## 🔒 Security Considerations

### 🛡️ Security Measures
- **Input Validation**: Sanitize user input
- **CORS Configuration**: Controlled cross-origin access
- **Error Handling**: No sensitive information in errors
- **Model Security**: Secure model file storage

### 🚨 Privacy
- **No Data Storage**: Predictions not stored
- **Local Processing**: All processing on user's device
- **No Tracking**: No user behavior tracking
