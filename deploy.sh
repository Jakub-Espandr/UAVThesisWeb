#!/bin/bash

# UAV App Deployment Script for VPS
# Run this script on your VPS after uploading uav-app-deploy.tar.gz

set -e

echo "🚀 Starting UAV App deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="uav-app"
APP_DIR="/var/www/uav-app"
APP_PORT="3001"
DOMAIN="uav.flycamczech-imageprocessor.eu"

echo -e "${GREEN}📁 Creating application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${GREEN}📦 Extracting application files...${NC}"
tar -xzf uav-app-deploy.tar.gz -C $APP_DIR --strip-components=0

echo -e "${GREEN}🔧 Setting permissions...${NC}"
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

echo -e "${GREEN}�� Installing Node.js dependencies...${NC}"
cd $APP_DIR
npm install --production

echo -e "${GREEN}🔧 Installing PM2 globally...${NC}"
sudo npm install -g pm2

echo -e "${GREEN}🚀 Starting application with PM2...${NC}"
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start app.js --name $APP_NAME --port $APP_PORT
pm2 save
pm2 startup

echo -e "${GREEN}�� Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<'NGINX_EOF'
server {
    listen 80;
    server_name uav.flycamczech-imageprocessor.eu;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Static files optimization
    location /data/ {
        alias /var/www/uav-app/public/data/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        gzip on;
        gzip_types image/jpeg image/png image/gif;
    }
    
    location /assets/ {
        alias /var/www/uav-app/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location /icons/ {
        alias /var/www/uav-app/public/icons/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_EOF

echo -e "${GREEN}🔗 Enabling Nginx site...${NC}"
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

echo -e "${GREEN}✅ Testing Nginx configuration...${NC}"
sudo nginx -t

echo -e "${GREEN}🔄 Reloading Nginx...${NC}"
sudo systemctl reload nginx

echo -e "${YELLOW}🔒 SSL Certificate Setup${NC}"
echo -e "${YELLOW}Run the following command to get SSL certificate:${NC}"
echo -e "${GREEN}sudo certbot --nginx -d $DOMAIN${NC}"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your app will be available at: http://$DOMAIN${NC}"
echo -e "${GREEN}📊 PM2 Status: pm2 status${NC}"
echo -e "${GREEN}📋 PM2 Logs: pm2 logs $APP_NAME${NC}"
echo -e "${GREEN}🔄 Restart: pm2 restart $APP_NAME${NC}"

# Show current status
echo -e "${GREEN}📊 Current PM2 status:${NC}"
pm2 status
