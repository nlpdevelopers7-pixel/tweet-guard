# 🚀 GCP Deployment Guide - Tweet Guard

## 📋 Prerequisites

1. **Google Cloud Account** (with $300 free credit)
2. **Trained Model** (run the Jupyter notebook first)
3. **gcloud CLI** installed

---

## 🚀 Step-by-Step Deployment

### **Step 1: Setup Google Cloud**

#### 1.1 Create Google Cloud Account
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Sign up with Google account
- You get $300 free credit

#### 1.2 Create New Project
```bash
# In Google Cloud Console:
# 1. Click "Select a project" → "New Project"
# 2. Name: "tweet-guard-project"
# 3. Click "Create"
```

#### 1.3 Install gcloud CLI
```bash
# On macOS/Linux:
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# On Windows:
# Download from: https://cloud.google.com/sdk/docs/install
```

#### 1.4 Authenticate and Set Project
```bash
# Login to Google Cloud
gcloud auth login

# Set your project (replace with your project ID)
gcloud config set project YOUR_PROJECT_ID

# Verify setup
gcloud config list
```

---

### **Step 2: Prepare Your Code**

#### 2.1 Train the Model (if not done)
```bash
cd notebooks/
jupyter notebook hate_speech_model_training.ipynb
# Run all cells to train and save the model
```

#### 2.2 Verify Model Exists
```bash
# Check if model file exists
ls -la models/saved/hate_speech_model.pkl
# Should show the model file
```

---

### **Step 3: Deploy to GCP**

#### **Option A: Cloud Run (Recommended - Easiest)**

```bash
# Navigate to your project
cd /Users/hassantahir/BAU-NLP/Lecture\ 2/tweet-guard-organized/

# Run the deployment script
./scripts/deployment/deploy-gcp.sh

# Choose option 1 (Cloud Run)
# Wait for deployment to complete
# You'll get a URL like: https://tweet-guard-xxx-uc.a.run.app
```

#### **Option B: Manual Cloud Run Deployment**

```bash
# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Build and deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tweet-guard

gcloud run deploy tweet-guard \
    --image gcr.io/YOUR_PROJECT_ID/tweet-guard \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi \
    --cpu 1 \
    --max-instances 10
```

#### **Option C: App Engine (Alternative)**

```bash
# Enable App Engine API
gcloud services enable appengine.googleapis.com

# Deploy to App Engine
gcloud app deploy app.yaml

# Your app will be at: https://YOUR_PROJECT_ID.appspot.com
```

---

### **Step 4: Test Your Deployment**

#### 4.1 Test the API
```bash
# Test health endpoint
curl https://YOUR_APP_URL/api/health

# Test prediction
curl -X POST https://YOUR_APP_URL/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test tweet"}'
```

#### 4.2 Test the Frontend
- Open your app URL in browser
- You should see the React frontend
- Try entering some text and clicking "Analyze"

---

### **Step 5: Monitor and Manage**

#### 5.1 View Logs
```bash
# Cloud Run logs
gcloud run services logs read --region=us-central1

# App Engine logs
gcloud app logs tail
```

#### 5.2 Monitor Performance
- Go to Google Cloud Console
- Navigate to "Cloud Run" or "App Engine"
- View metrics, logs, and performance

#### 5.3 Update Deployment
```bash
# Make changes to your code
# Then redeploy:
gcloud run deploy tweet-guard --source .
```

---

## 🎯 **Quick Start Commands**

```bash
# 1. Setup (one time)
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Deploy (from project root)
cd /Users/hassantahir/BAU-NLP/Lecture\ 2/tweet-guard-organized/
./scripts/deployment/deploy-gcp.sh

# 3. Test
curl https://YOUR_APP_URL/api/health
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **Issue: "Model not found"**
```bash
# Solution: Train the model first
cd notebooks/
jupyter notebook hate_speech_model_training.ipynb
# Run all cells
```

#### **Issue: "Permission denied"**
```bash
# Solution: Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

#### **Issue: "Build failed"**
```bash
# Solution: Check Dockerfile and dependencies
# Make sure all files are in the right place
```

#### **Issue: "App not loading"**
```bash
# Solution: Check logs
gcloud run services describe tweet-guard --region=us-central1
gcloud run services logs read tweet-guard --region=us-central1
```

---

## 💰 **Cost Management**

### **Free Tier Limits:**
- **Cloud Run**: 2 million requests/month
- **App Engine**: 28 frontend instance hours/day
- **Compute Engine**: 1 f1-micro instance/month

### **Estimated Costs (if you exceed free tier):**
- **Cloud Run**: ~$0.10 per 1000 requests
- **App Engine**: ~$0.05 per hour
- **Compute Engine**: ~$5-10 per month

---

## 🎉 **Success!**

Once deployed, you'll have:
- ✅ **Public URL** for your app
- ✅ **Automatic scaling** based on traffic
- ✅ **SSL certificate** (HTTPS)
- ✅ **Global CDN** for fast loading
- ✅ **Monitoring and logging**

**Your hate speech detection app is now live on the internet!** 🚀
