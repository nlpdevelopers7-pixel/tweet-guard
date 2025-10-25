# Multi-stage build for React frontend and Flask backend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Python backend
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY api/src/app.py .
COPY models/saved/hate_speech_model.pkl .

# Copy data folder
COPY data/ ./data/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./static

# Create a simple Flask app to serve both API and frontend
RUN echo 'from flask import Flask, send_from_directory\n\
from flask_cors import CORS\n\
import os\n\
\n\
app = Flask(__name__, static_folder="static")\n\
CORS(app)\n\
\n\
@app.route("/")\n\
def serve_frontend():\n\
    return send_from_directory("static", "index.html")\n\
\n\
@app.route("/<path:path>")\n\
def serve_static(path):\n\
    return send_from_directory("static", path)\n\
\n\
if __name__ == "__main__":\n\
    app.run(host="0.0.0.0", port=5000)\n' > serve_frontend.py

# Expose port
EXPOSE 5000

# Run both the main API and frontend server
CMD ["python", "app.py"]
