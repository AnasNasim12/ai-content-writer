# AI Content Writer

**Intelligent Content Creation Platform with 4-Step Wizard**

A comprehensive React-based application that leverages AI to create SEO-optimized content through an intuitive 4-step wizard process. Built with Firebase authentication, Material-UI design system, and integrated LLM services.

[![React](https://img.shields.io/badge/React-17.0.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.2.8-purple.svg)](https://mui.com/)
[![Python](https://img.shields.io/badge/Python-Flask-red.svg)](https://flask.palletsprojects.com/)

## Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Security](#-security)
- [Changelog](#-changelog)
- [License](#-license)

## Features

### **Core Functionality**
- **4-Step Content Creation Wizard**
  -  Keyword Research & Analysis
  -  SEO-Optimized Title Generation
  -  Topic Selection & Outline Creation
  -  AI-Powered Content Generation with SEO Scoring

### **Authentication & Security**
- Firebase Email/Password Authentication
- Protected Routes & User Session Management
- Secure API Endpoints

### **User Interface**
- Modern Material-UI Design System
- Responsive Layout for All Devices
- Custom Theme with Consistent Branding
- Intuitive Step-by-Step Wizard Interface

### **Content Management**
- Real-time Content Generation
- SEO Score Display (0-100)
- Export Content as .txt Files
- Copy to Clipboard Functionality
- Dashboard with Generated Articles History

### **Technical Features**
- React 17 with Hooks & Context API
- Node.js/Express Backend Server
- Python Flask LLM Service Integration
- RESTful API Architecture
- Error Handling & Loading States

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │────│  Node.js API    │────│  Python LLM     │
│   (Frontend)    │    │   (Backend)     │    │   Service       │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │Firebase │             │Express  │             │Flask +  │
    │Auth     │             │Routes   │             │LLM APIs │
    └─────────┘             └─────────┘             └─────────┘
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Firebase Project with Authentication enabled
- Git

### One-Command Setup
```powershell
git clone https://github.com/AnasNasim12/ai-content-writer.git
cd ai-content-writer
```

## Installation

### 1. Backend Setup
```powershell
cd backend
npm install
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
```

### 3. Python LLM Service Setup
```powershell
cd backend/python_scripts
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

### 1. Firebase Configuration
Create `frontend/.env` file:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 2. Backend Configuration
Create `backend/.env` file:
```env
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./config/firebase-service-account-key.json
```

### 3. LLM Service Configuration
Create `backend/python_scripts/.env` file:
```env
GEMINI_API_KEY=your-gemini-api-key
# or
OPENAI_API_KEY=your-openai-api-key
```

## Usage

### Starting the Application

**Start all services in order:**

1. **Python LLM Service:**
```powershell
cd backend/python_scripts
venv\Scripts\activate
python llm_service.py
```

2. **Backend Server:**
```powershell
cd backend
npm start
```

3. **Frontend Application:**
```powershell
cd frontend
npm start
```

### Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **LLM Service:** http://localhost:5001
- **API Documentation:** http://localhost:3000/docs

### Using the Content Creation Wizard

1. **Sign Up/Login** with email and password
2. **Step 1 - Keyword Research:** Enter a seed keyword
3. **Step 2 - Title Generation:** Select from AI-generated titles
4. **Step 3 - Topic Selection:** Choose topics and create outline
5. **Step 4 - Content Creation:** Generate SEO-optimized article
6. **Export/Save:** Download as .txt or save to dashboard

## API Documentation

Comprehensive API documentation is available at `/docs` when running the application, or view the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file.

### Key Endpoints

```javascript
POST /api/content-creation
{
  "topicInfo": "string",
  "keyword": "string"
}
```

## Project Structure

```
ai-content-writer/
├── 📄 README.md
├── 📄 API_DOCUMENTATION.md
├── 📄 package.json
├── 📁 backend/
│   ├── 📄 server.js
│   ├── 📄 package.json
│   ├── 📁 routes/
│   │   └── 📄 api.js
│   ├── 📁 config/
│   │   └── 📄 firebase-service-account-key.json
│   └── 📁 python_scripts/
│       ├── 📄 llm_service.py
│       └── 📄 requirements.txt
└── 📁 frontend/
    ├── 📄 package.json
    ├── 📁 public/
    │   └── 📄 index.html
    └── 📁 src/
        ├── 📄 App.js
        ├── 📄 index.js
        ├── 📄 theme.js
        ├── 📁 components/
        │   ├── 📄 Wizard.js
        │   ├── 📄 Dashboard.js
        │   ├── 📄 ContentCreation.js
        │   ├── 📄 Login.js
        │   └── 📄 Documentation.js
        ├── 📁 contexts/
        │   └── 📄 AuthContext.js
        └── 📁 utils/
            └── 📄 apiClient.js
```

## Development

### Available Scripts

**Frontend:**
```powershell
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

**Backend:**
```powershell
npm start          # Start server
npm run dev        # Development with nodemon
```

**Python Service:**
```powershell
python llm_service.py    # Start Flask server
```

### Key Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | React | 17.0.2 | UI Framework |
| UI Library | Material-UI | 5.2.8 | Component Library |
| Routing | React Router | 6.2.1 | Navigation |
| Backend | Node.js + Express | Latest | API Server |
| Authentication | Firebase Auth | Latest | User Management |
| LLM Service | Python + Flask | Latest | AI Integration |
| Markdown | react-markdown | 8.0.7 | Documentation |

## Testing

### Manual Testing Endpoints

**Test Content Generation:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/content-creation" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"topicInfo": "AI in Healthcare", "keyword": "medical AI"}'
```

## Deployment

For detailed deployment instructions to various cloud platforms, see our comprehensive [Deployment Guide](DEPLOYMENT.md).

### Quick Production Deployment

**Frontend (Netlify/Vercel):**
```powershell
cd frontend
npm run build
# Deploy build/ folder to your hosting platform
```

**Backend (Railway/Heroku):**
```powershell
# Set environment variables on your platform
# Deploy backend/ folder
```

**Supported Platforms:**
- **Frontend:** Netlify, Vercel, GitHub Pages
- **Backend:** Railway, Heroku, Render
- **Python Service:** Railway, Heroku, Google Cloud Run

### Environment Setup

Copy and configure environment files:
```powershell
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp backend/python_scripts/.env.example backend/python_scripts/.env
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**Quick Start:**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Before Contributing:**
- Read our [Code of Conduct](CONTRIBUTING.md#code-of-conduct)
- Check existing [Issues](https://github.com/AnasNasim12/ai-content-writer/issues)
- Review our [Development Guidelines](CONTRIBUTING.md#coding-standards)

## Security

Security is a top priority. Please see our [Security Policy](SECURITY.md) for:
- Reporting vulnerabilities
- Security best practices
- Supported versions

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and updates.

### Development Guidelines

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure cross-browser compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Project overview and setup guide |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [SECURITY.md](SECURITY.md) | Security policy and best practices |
| [CHANGELOG.md](CHANGELOG.md) | Version history and changes |

---


**Made with ❤️ by [Anas Nasim](https://github.com/AnasNasim12)**
