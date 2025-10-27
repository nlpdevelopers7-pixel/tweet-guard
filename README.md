# 🚨 TweetGuard - Hate Speech Detection System

A complete machine learning pipeline for detecting hate speech and offensive language in tweets, featuring a Flask API backend and React frontend with modern UI.

## 📁 Project Structure

```
tweet-guard-organized/
├── 📊 data/                          # Dataset and raw data
│   └── dataset.csv                   # Training dataset (24,783 tweets)
├── 📓 notebooks/                     # Jupyter notebooks
│   └── hate_speech_model_training.ipynb  # Complete ML pipeline
├── 🌐 api/                          # Flask API backend
│   ├── src/
│   │   └── app.py                    # Main Flask application
│   └── requirements.txt              # Python dependencies
├── ⚛️  frontend/                     # React frontend
│   ├── src/
│   │   ├── App.js                    # Main React component
│   │   └── index.js                  # Entry point
│   ├── public/
│   └── package.json                  # Node dependencies
├── 🤖 models/                       # Model artifacts
│   └── saved/
│       └── hate_speech_model.pkl     # Trained model file
├── 📚 docs/                         # Documentation
│   ├── tfidf_diagram.png             # TF-IDF visualization
│   └── architecture_diagram.png      # System architecture
├── 🐳 Dockerfile.gcp                # Docker configuration for GCP
├── 🐳 docker-compose.yml            # Docker Compose (local)
└── 📋 README.md                     # This file
```

## 🚀 Quick Start Guide

### Prerequisites

- Python 3.9+
- Node.js 14+
- pip and npm
- Jupyter Notebook

---

## 📋 Step-by-Step Instructions

### **STEP 1: Train the Model**

First, you need to train and save the machine learning model.

```bash
# Navigate to the project root
cd "/Users/hassantahir/BAU-NLP/Lecture 2/tweet-guard-organized"

# Open the Jupyter notebook
jupyter notebook notebooks/hate_speech_model_training.ipynb
```

**In the Jupyter notebook:**
1. Run all cells from top to bottom (Cell → Run All)
2. The notebook will:
   - Load and preprocess the dataset
   - Compare 4 different models (Logistic Regression, SVM Linear, SVM RBF, Naive Bayes)
   - Allow you to manually select a model for optimization
   - Perform Grid Search optimization
   - Tune the prediction threshold
   - Save the final model to `models/saved/hate_speech_model.pkl`

**Expected Output:**
```
✅ Optimized model saved successfully!
📁 File: hate_speech_model.pkl
🤖 Model: [Your Selected Model]
📊 F1-Score: ~0.97
🎯 Accuracy: ~0.96
```

---

### **STEP 2: Run Locally**

#### **Option A: Run Backend and Frontend Separately**

##### **2A.1: Start the Flask API Backend**

```bash
# Navigate to API directory
cd "/Users/hassantahir/BAU-NLP/Lecture 2/tweet-guard-organized/api"

# Install Python dependencies
pip3 install -r requirements.txt

# Start the Flask API
python3 src/app.py
```

**Expected Output:**
```
✅ Model loaded successfully!
📁 From: ../models/saved/hate_speech_model.pkl
🤖 Model Type: [Your Model]
📊 Performance: F1=0.97
🎯 Threshold: 0.3

 * Running on http://127.0.0.1:8080
 * Running on http://[your-ip]:8080
```

**API will be available at:** `http://localhost:8080`

##### **2A.2: Start the React Frontend**

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd "/Users/hassantahir/BAU-NLP/Lecture 2/tweet-guard-organized/frontend"

# Install Node dependencies (first time only)
npm install

# Set the API URL (if running locally)
export REACT_APP_API_URL=http://localhost:8080

# Start the React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view tweet-guard in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://[your-ip]:3000
```

**Frontend will automatically open at:** `http://localhost:3000`

---

#### **Option B: Run with Docker Compose (All-in-One)**

This method runs both backend and frontend in Docker containers.

```bash
# Navigate to project root
cd "/Users/hassantahir/BAU-NLP/Lecture 2/tweet-guard-organized"

# Build and start all services
docker-compose up --build
```

**Expected Output:**
```
✅ Backend running on http://localhost:8080
✅ Frontend running on http://localhost:3000
```

**Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

**To stop Docker:**
```bash
# Press Ctrl+C, then run:
docker-compose down
```

---

### **STEP 3: Using the Application**

1. **Open your browser** and go to `http://localhost:3000`
2. **Enter text** in the text area (e.g., "This is a great day!")
3. **Click "Analyze Text"**
4. **View results:**
   - Prediction: Foul or Proper
   - Confidence level with visual bar
   - Probability percentage
   - Statistics counter

---

## 🌐 Production Deployment (GCP)

The application is currently deployed on Google Cloud Platform.

**Live URLs:**
- **Frontend**: Deployed on Vercel
- **Backend API**: `https://tweet-guard-435287385741.us-central1.run.app`

### Deploy to GCP Cloud Run

```bash
# Navigate to project root
cd "/Users/hassantahir/BAU-NLP/Lecture 2/tweet-guard-organized"

# Build and deploy to GCP
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly
gcloud run deploy tweet-guard \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📊 Model Performance

The trained model achieves excellent performance:

| Metric | Value |
|--------|-------|
| **Accuracy** | 97.04% |
| **F1-Score** | 97.07% |
| **Precision** | 94.82% |
| **Recall** | 99.44% |
| **ROC-AUC** | 82.93% |

**Model Details:**
- **Algorithm**: SVM Linear (Grid Search Optimized)
- **Vectorizer**: TF-IDF with Bigrams
- **Threshold**: 0.3 (optimized for recall)
- **Training Data**: 19,826 tweets
- **Test Data**: 4,957 tweets

---

## 🛠️ Tech Stack

### **Machine Learning**
- scikit-learn (SVM, Logistic Regression, Naive Bayes)
- TF-IDF Vectorization with bigrams
- GridSearchCV for hyperparameter tuning

### **Backend**
- Flask 2.3.0
- Python 3.9
- CORS enabled for cross-origin requests

### **Frontend**
- React 18.2
- styled-components for CSS-in-JS
- Axios for API calls
- react-icons for UI icons
- Modern dark theme with glass morphism

### **Deployment**
- Docker & Docker Compose
- Google Cloud Run (Backend)
- Vercel (Frontend)
- Cloud Build for CI/CD

---

## 📞 API Endpoints

### **POST /predict**
Analyze text for hate speech detection.

**Request:**
```bash
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "You are awesome!"}'
```

**Response:**
```json
{
  "prediction": "Proper",
  "confidence": 0.89,
  "probability": 0.11
}
```

### **GET /health**
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### **GET /model-info**
Get information about the loaded model.

**Response:**
```json
{
  "model_name": "SVM Linear",
  "threshold": 0.3,
  "performance": {
    "accuracy": 0.9704,
    "f1": 0.9707,
    "precision": 0.9482,
    "recall": 0.9944
  }
}
```

---

## 🧪 Testing

### **Test the API**

```bash
# Navigate to project root
cd "/Users/hassantahir/BAU-NLP/Lecture 2/tweet-guard-organized"

# Run API tests
python3 tests/test_api.py
```

### **Manual Testing**

```bash
# Test prediction endpoint
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Go kill yourself"}'

# Test health endpoint
curl http://localhost:8080/health

# Test model info endpoint
curl http://localhost:8080/model-info
```

---

## 🔧 Development

### **Backend Development**

```bash
cd api/
pip3 install -r requirements.txt
python3 src/app.py
```

The API will auto-reload on code changes if you run with:
```bash
FLASK_ENV=development python3 src/app.py
```

### **Frontend Development**

```bash
cd frontend/
npm install
npm start
```

React will auto-reload on code changes.

### **Rebuilding the Model**

To retrain the model with different parameters:
1. Open `notebooks/hate_speech_model_training.ipynb`
2. Modify the `SELECTED_MODEL` variable in Cell 11
3. Adjust threshold in Cell 15
4. Run all cells
5. Restart the API to load the new model

---

## 📝 Features

- ✅ **Fair Model Comparison**: Tests 4 algorithms with default parameters
- ✅ **Manual Model Selection**: Choose which model to optimize
- ✅ **Grid Search Optimization**: Hyperparameter tuning
- ✅ **Threshold Optimization**: Adjustable prediction threshold
- ✅ **RESTful API**: Clean Flask API with CORS support
- ✅ **Modern UI**: Dark-themed React frontend with glass morphism
- ✅ **Real-time Stats**: Track analyzed texts
- ✅ **Docker Support**: Easy containerized deployment
- ✅ **Cloud Ready**: Deployed on GCP Cloud Run

---

## 🐛 Troubleshooting

### **Issue: Model not found**
```bash
# Ensure you've trained the model first
jupyter notebook notebooks/hate_speech_model_training.ipynb
# Run all cells
```

### **Issue: Port already in use**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or change the port in api/src/app.py
```

### **Issue: CORS errors**
The API is configured to allow all origins. If you still get CORS errors:
```python
# In api/src/app.py, verify:
CORS(app, origins="*")
```

### **Issue: Frontend can't connect to API**
```bash
# Set the correct API URL
export REACT_APP_API_URL=http://localhost:8080
npm start
```

---

## 📄 License

This project is developed for educational purposes at BAU University.

---

## 👥 Contributors

- Hassan Tahir - BAU-NLP Lecture 2

---

## 🎯 Project Goals

1. ✅ Train multiple ML models and compare performance
2. ✅ Select and optimize the best model
3. ✅ Build a production-ready Flask API
4. ✅ Create a modern React frontend
5. ✅ Deploy to cloud infrastructure
6. ✅ Document the entire process

---

**Happy Coding! 🚀**
