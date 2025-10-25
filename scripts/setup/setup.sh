#!/bin/bash

# 🚀 Tweet Guard Setup Script
# Complete setup for the hate speech detection system

echo "🚨 Tweet Guard - Setup Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the tweet-guard-organized root directory"
    exit 1
fi

echo "📁 Setting up project structure..."

# Create necessary directories
mkdir -p models/saved
mkdir -p models/trained
mkdir -p logs

echo "✅ Directories created"

# Setup Python environment
echo "🐍 Setting up Python environment..."
cd api/
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Python dependencies installed"

# Setup Node.js environment
echo "⚛️ Setting up Node.js environment..."
cd ../frontend/
if [ ! -d "node_modules" ]; then
    npm install
fi
echo "✅ Node.js dependencies installed"

# Setup Jupyter
echo "📓 Setting up Jupyter..."
cd ../notebooks/
pip install jupyter notebook ipykernel
echo "✅ Jupyter installed"

# Create environment file
echo "🔧 Creating environment configuration..."
cd ..
cat > .env << EOF
# API Configuration
API_PORT=5004
API_HOST=0.0.0.0

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5004

# Model Configuration
MODEL_PATH=models/saved/hate_speech_model.pkl
THRESHOLD=0.3

# Development
DEBUG=True
EOF

echo "✅ Environment file created"

# Make scripts executable
chmod +x scripts/setup/*.sh
chmod +x scripts/deployment/*.sh

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Train the model: cd notebooks/ && jupyter notebook"
echo "2. Start the API: cd api/ && python src/app.py"
echo "3. Start the frontend: cd frontend/ && npm start"
echo "4. Test the system: cd tests/ && python test_api.py"
echo ""
echo "🚀 Happy coding!"
