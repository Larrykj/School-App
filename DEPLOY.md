# Deployment Guide

## 1. Prerequisites

- Node.js (v18+)
- MySQL Database
- A server (VPS like DigitalOcean/Linode/AWS EC2 or PaaS like Vercel/Render/Heroku)

## 2. Environment Variables

Ensure your production `.env` files are set up.

### Backend `.env`
```env
PORT=5000
DATABASE_URL="mysql://user:password@host:3306/school_db"
JWT_SECRET="your-secure-secret-key"
MPESA_CONSUMER_KEY="..."
MPESA_CONSUMER_SECRET="..."
MPESA_PASSKEY="..."
MPESA_SHORTCODE="..."
AT_API_KEY="..."
AT_USERNAME="..."
FRONTEND_URL="https://your-school-app.com"
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL="https://api.your-school-app.com/api"
```

## 3. Build for Production

We have a unified build script `build-prod.ps1` (Windows) or `build.sh` (Linux).

### Windows Build
```powershell
.\build-prod.ps1
```

### Linux/Manual Build

**Backend:**
```bash
cd backend
npm install
npm run build
npx prisma migrate deploy
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
```

## 4. Running in Production

### Using PM2 (Recommended)

Install PM2 globally:
```bash
npm install -g pm2
```

Start the services:

```bash
# Backend
cd backend
pm2 start dist/index.js --name "school-api"

# Frontend
cd frontend
pm2 start npm --name "school-web" -- start
```

Save the process list:
```bash
pm2 save
pm2 startup
```

## 5. Reverse Proxy (Nginx)

It's recommended to use Nginx to serve the frontend and proxy API requests.

```nginx
server {
    listen 80;
    server_name your-school-app.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## 6. PWA Validation

Once deployed with HTTPS:
1. Open the app in Chrome
2. Open DevTools -> Application -> Lighthouse
3. Run a "Progressive Web App" audit
4. It should pass and be installable!

