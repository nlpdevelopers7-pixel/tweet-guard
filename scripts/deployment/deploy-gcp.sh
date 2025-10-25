#!/bin/bash

# GCP Deployment Script for Tweet Guard
echo "🚀 Tweet Guard - GCP Deployment Script"
echo "======================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   curl https://sdk.cloud.google.com | bash"
    echo "   exec -l \$SHELL"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud:"
    echo "   gcloud auth login"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project selected. Please set a project:"
    echo "   gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Project: $PROJECT_ID"

# Check if model exists
if [ ! -f "models/saved/hate_speech_model.pkl" ]; then
    echo "❌ Model not found! Please train the model first:"
    echo "   1. cd notebooks/"
    echo "   2. jupyter notebook"
    echo "   3. Run all cells in hate_speech_model_training.ipynb"
    exit 1
fi

echo "✅ Model found"

# Choose deployment method
echo ""
echo "🎯 Choose deployment method:"
echo "1) Cloud Run (Recommended - Serverless)"
echo "2) App Engine (Easy - Platform as a Service)"
echo "3) Compute Engine (VM - More control)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Cloud Run..."
        
        # Enable required APIs
        gcloud services enable cloudbuild.googleapis.com
        gcloud services enable run.googleapis.com
        
        # Build and deploy
        gcloud builds submit --tag gcr.io/$PROJECT_ID/tweet-guard
        gcloud run deploy tweet-guard \
            --image gcr.io/$PROJECT_ID/tweet-guard \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated \
            --port 8080 \
            --memory 2Gi \
            --cpu 1 \
            --max-instances 10
        
        # Get the URL
        URL=$(gcloud run services describe tweet-guard --platform managed --region us-central1 --format 'value(status.url)')
        echo "🎉 Deployment complete!"
        echo "🌐 Your app is available at: $URL"
        ;;
        
    2)
        echo "🚀 Deploying to App Engine..."
        
        # Enable App Engine API
        gcloud services enable appengine.googleapis.com
        
        # Deploy
        gcloud app deploy app.yaml --quiet
        
        # Get the URL
        URL="https://$PROJECT_ID.appspot.com"
        echo "🎉 Deployment complete!"
        echo "🌐 Your app is available at: $URL"
        ;;
        
    3)
        echo "🚀 Deploying to Compute Engine..."
        
        # Enable required APIs
        gcloud services enable compute.googleapis.com
        
        # Create VM
        gcloud compute instances create tweet-guard-vm \
            --image-family=ubuntu-2004-lts \
            --image-project=ubuntu-os-cloud \
            --machine-type=e2-medium \
            --zone=us-central1-a \
            --tags=http-server,https-server \
            --metadata-from-file startup-script=scripts/deployment/vm-startup.sh
        
        echo "🎉 VM created! Setting up application..."
        echo "⏳ Please wait 2-3 minutes for setup to complete"
        echo "🌐 Your app will be available at: http://VM_EXTERNAL_IP"
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📋 Next steps:"
echo "1. Test your deployment"
echo "2. Set up custom domain (optional)"
echo "3. Configure monitoring and alerts"
echo ""
echo "🚀 Happy deploying!"
