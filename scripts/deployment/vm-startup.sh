#!/bin/bash

# VM Startup Script for GCP Compute Engine
echo "🚀 Setting up Tweet Guard on VM..."

# Update system
apt-get update
apt-get upgrade -y

# Install Python 3.9
apt-get install -y python3.9 python3.9-pip python3.9-venv

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install nginx
apt-get install -y nginx

# Install git
apt-get install -y git

# Create app directory
mkdir -p /opt/tweet-guard
cd /opt/tweet-guard

# Clone or copy your code here
# For now, we'll assume the code is uploaded
# You can upload your code using gcloud compute scp

# Setup Python environment
python3.9 -m venv venv
source venv/bin/activate

# Install Python dependencies
cd api/
pip install -r requirements.txt

# Setup frontend
cd ../frontend/
npm install
npm run build

# Configure nginx
cat > /etc/nginx/sites-available/tweet-guard << 'EOF'
server {
    listen 80;
    server_name _;

    # Serve React frontend
    location / {
        root /opt/tweet-guard/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Flask
    location /api/ {
        proxy_pass http://localhost:5004/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/tweet-guard /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Create systemd service for API
cat > /etc/systemd/system/tweet-guard-api.service << 'EOF'
[Unit]
Description=Tweet Guard API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/tweet-guard/api
Environment=PATH=/opt/tweet-guard/venv/bin
ExecStart=/opt/tweet-guard/venv/bin/python src/app.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable tweet-guard-api
systemctl start tweet-guard-api

echo "✅ Setup complete!"
echo "🌐 Your app should be available at: http://VM_EXTERNAL_IP"
