#!/bin/bash

# 🚀 Tweet Guard Deployment Script
# Deploy the complete system using Docker

echo "🚨 Tweet Guard - Deployment Script"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "🐳 Building Docker containers..."

# Build the containers
docker-compose build

echo "✅ Containers built successfully"

echo "🚀 Starting services..."

# Start the services
docker-compose up -d

echo "✅ Services started successfully"

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Services:"
echo "- API: http://localhost:5004"
echo "- Frontend: http://localhost:3000"
echo ""
echo "📊 Check status:"
echo "docker-compose ps"
echo ""
echo "📝 View logs:"
echo "docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "docker-compose down"
echo ""
echo "🚀 System is ready!"
