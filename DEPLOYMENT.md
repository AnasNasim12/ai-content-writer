# Deployment Guide

This guide covers deploying the AI Content Writer application to various cloud platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Python Service Deployment](#python-service-deployment)
- [Environment Configuration](#environment-configuration)
- [Production Considerations](#production-considerations)

## Prerequisites

- GitHub repository with your code
- Firebase project with Authentication enabled
- API keys for LLM services (OpenAI, Gemini, etc.)
- Domain name (optional)

## Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Connect Repository:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

3. **Environment Variables:**
   ```
   REACT_APP_FIREBASE_API_KEY=your-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_API_BASE_URL=https://your-backend-url.com
   ```

### Option 2: Vercel

1. **Deploy with Vercel CLI:**
   ```powershell
   npm install -g vercel
   cd frontend
   vercel
   ```

2. **Or via GitHub integration:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set build settings similar to Netlify

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Connect Repository:**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo

2. **Environment Variables:**
   ```
   PORT=3001
   NODE_ENV=production
   FIREBASE_PROJECT_ID=your-project-id
   PYTHON_SERVICE_URL=https://your-python-service-url.com
   ```

3. **Build Settings:**
   - Root directory: `backend`
   - Start command: `npm start`

### Option 2: Heroku

1. **Create Heroku App:**
   ```powershell
   heroku create your-app-name
   ```

2. **Configure Buildpacks:**
   ```powershell
   heroku buildpacks:set heroku/nodejs
   ```

3. **Deploy:**
   ```powershell
   git subtree push --prefix backend heroku main
   ```

### Option 3: Render

1. **Create Web Service:**
   - Go to [Render](https://render.com)
   - Connect your repository
   - Set root directory to `backend`

## Python Service Deployment

### Option 1: Railway

1. **Create separate service:**
   - Add new service in Railway
   - Set root directory: `backend/python_scripts`
   - Start command: `python llm_service.py`

2. **Environment Variables:**
   ```
   FLASK_ENV=production
   GEMINI_API_KEY=your-key
   OPENAI_API_KEY=your-key
   HOST=0.0.0.0
   PORT=5000
   ```

### Option 2: Heroku

1. **Create Python App:**
   ```powershell
   heroku create your-python-service
   heroku buildpacks:set heroku/python
   ```

2. **Deploy:**
   ```powershell
   git subtree push --prefix backend/python_scripts heroku main
   ```

## Environment Configuration

### Production Environment Variables

**Frontend (.env.production):**
```env
REACT_APP_FIREBASE_API_KEY=prod-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-prod-domain
REACT_APP_FIREBASE_PROJECT_ID=your-prod-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-prod-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-prod-sender
REACT_APP_FIREBASE_APP_ID=your-prod-app-id
REACT_APP_API_BASE_URL=https://your-backend.railway.app
```

**Backend:**
```env
NODE_ENV=production
PORT=3001
FIREBASE_PROJECT_ID=your-prod-project
PYTHON_SERVICE_URL=https://your-python-service.railway.app
```

**Python Service:**
```env
FLASK_ENV=production
FLASK_DEBUG=False
GEMINI_API_KEY=your-production-key
HOST=0.0.0.0
PORT=5000
```

## Production Considerations

### Security

1. **Firebase Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

2. **CORS Configuration:**
   ```javascript
   // In backend/server.js
   const cors = require('cors');
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? 'https://your-frontend-domain.com'
       : 'http://localhost:3000'
   }));
   ```

### Performance

1. **Caching:**
   - Implement Redis for API caching
   - Use CDN for static assets
   - Enable compression middleware

2. **Rate Limiting:**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

### Monitoring

1. **Error Tracking:**
   - Integrate Sentry for error monitoring
   - Set up logging with Winston

2. **Health Checks:**
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
   });
   ```

### Database

1. **Firebase Firestore:**
   - Set up production database
   - Configure proper indexes
   - Implement backup strategy

### SSL/HTTPS

- Most platforms (Netlify, Vercel, Railway) provide SSL automatically
- For custom domains, ensure SSL certificates are configured

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Firebase project set up for production
- [ ] API keys secured and rotated
- [ ] CORS configured for production domains
- [ ] Error monitoring set up
- [ ] SSL certificates configured
- [ ] Health check endpoints implemented
- [ ] Rate limiting configured
- [ ] Database backup strategy implemented
- [ ] DNS records configured (if using custom domain)

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for missing environment variables

2. **CORS Errors:**
   - Verify frontend and backend URLs in CORS configuration
   - Check environment variable values

3. **Authentication Issues:**
   - Verify Firebase configuration
   - Check authorized domains in Firebase console
   - Ensure API keys are correct

### Getting Help

- Check deployment platform documentation
- Review application logs
- Test locally with production environment variables
- Verify all services can communicate with each other

## Maintenance

- Regularly update dependencies
- Monitor performance metrics
- Review and rotate API keys
- Update SSL certificates if needed
- Monitor costs and usage

---

For specific platform guides and updates, refer to the official documentation of your chosen deployment platform.
