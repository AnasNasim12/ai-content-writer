# AI Content Writer - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Backend APIs](#backend-apis)
3. [LLM Service Integration](#llm-service-integration)
4. [Frontend API Client](#frontend-api-client)
5. [Authentication Flow](#authentication-flow)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Environment Setup](#environment-setup)

## Overview

The AI Content Writer application consists of three main components:
- **Frontend**: React application with Material-UI
- **Backend**: Node.js/Express server with Firebase authentication
- **LLM Service**: Python service for AI content generation

## Backend APIs

### Base URL
```
http://localhost:3001/api
```

### Content Creation Endpoint

#### POST `/content-creation`
Generates AI content using the LLM service.

**Request Body:**
```json
{
  "topicInfo": "string",  // Topic or outline information
  "keyword": "string"     // SEO keyword to focus on
}
```

**Response:**
```json
{
  "content": "string",    // Generated content
  "seoScore": "number"    // SEO score (0-100)
}
```

**Example Request:**
```javascript
fetch('/api/content-creation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    topicInfo: "Introduction to Machine Learning",
    keyword: "machine learning basics"
  })
})
```

**Example Response:**
```json
{
  "content": "Machine learning is a subset of artificial intelligence...",
  "seoScore": 85
}
```

### Error Responses
All endpoints return errors in the following format:
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

## LLM Service Integration

### Python Service Endpoint
The backend communicates with a Python service running on `http://localhost:5000`

#### POST `/generate-content`
Internal endpoint called by the Node.js backend.

**Request:**
```json
{
  "topic_info": "string",
  "keyword": "string"
}
```

**Response:**
```json
{
  "content": "string",
  "seo_score": "number"
}
```

### LLM Service Setup

The Python service (`backend/python_scripts/llm_service.py`) handles:
- Content generation using AI models
- SEO optimization
- Keyword integration
- Content scoring

**Dependencies:**
```
flask==2.3.3
requests==2.31.0
openai==0.28.1
```

## Frontend API Client

### API Client (`src/utils/apiClient.js`)

#### Base Configuration
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

#### Content Creation
```javascript
import { generateContent } from '../utils/apiClient';

// Usage
const result = await generateContent(topicInfo, keyword);
```

### React Components API

#### Wizard Component
```javascript
import Wizard from './components/Wizard';

<Wizard onArticleGenerated={handleArticleGenerated} />
```

**Props:**
- `onArticleGenerated`: Function called when article is completed and saved

#### Dashboard Component
```javascript
import Dashboard from './components/Dashboard';

<Dashboard articles={generatedArticles} />
```

**Props:**
- `articles`: Array of generated articles to display

## Authentication Flow

### Firebase Authentication
The application uses Firebase for user authentication.

#### Login Process
1. User submits email/password
2. Firebase validates credentials
3. AuthContext provides user state
4. Protected routes become accessible

#### Configuration
Firebase config is stored in `src/firebaseConfig.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... other config
};
```

#### AuthContext Usage
```javascript
import { useAuth } from '../contexts/AuthContext';

const { currentUser, login, signup, logout } = useAuth();
```

## Data Models

### Article Model
```typescript
interface Article {
  title: string;          // Generated or selected title
  content: string;        // AI-generated content
  seoScore: number;       // SEO score (0-100)
  date: string;          // Creation date
  keywords?: string[];   // Associated keywords
}
```

### Wizard Data Model
```typescript
interface WizardData {
  keywords: string[];           // Research keywords
  selectedTitle: string;        // Chosen title
  selectedTopics: string[];     // Selected topics/outline
  generatedContent: string;     // Final content
  seoScore: number | null;     // SEO score
}
```

### User Model (Firebase)
```typescript
interface User {
  uid: string;           // Firebase user ID
  email: string;         // User email
  displayName?: string;  // Optional display name
}
```

## Error Handling

### Frontend Error Handling
```javascript
try {
  const result = await generateContent(topicInfo, keyword);
  // Handle success
} catch (error) {
  console.error('Content generation failed:', error);
  // Handle error - show user message
}
```

### Backend Error Responses
```javascript
// Success Response
{
  "content": "Generated content...",
  "seoScore": 85
}

// Error Response
{
  "error": "Failed to generate content",
  "code": "GENERATION_ERROR"
}
```

### Common Error Codes
- `MISSING_PARAMETERS`: Required parameters not provided
- `GENERATION_ERROR`: LLM service failed to generate content
- `SERVICE_UNAVAILABLE`: Python service not responding
- `AUTHENTICATION_ERROR`: Firebase authentication failed

## Environment Setup

### Backend Environment Variables
Create `.env` file in backend directory:
```env
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
```

### Frontend Environment Variables
Create `.env` file in frontend directory:
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Running the Services

1. **Start Backend Server:**
```powershell
cd backend
npm install
npm start
```

2. **Start Python LLM Service:**
```powershell
cd backend/python_scripts
pip install -r requirements.txt
python llm_service.py
```

3. **Start Frontend:**
```powershell
cd frontend
npm install
npm start
```

## API Testing

### Test Content Generation
```powershell
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/content-creation" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"topicInfo": "Benefits of renewable energy", "keyword": "solar power advantages"}'
```

### Test Python Service Directly
```powershell
# Using PowerShell  
Invoke-RestMethod -Uri "http://localhost:5000/generate-content" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"topic_info": "Climate change solutions", "keyword": "carbon footprint reduction"}'
```

## Content Generation Workflow

### 4-Step Wizard Process

1. **Keyword Research**: Input seed keyword → Generate related keywords
2. **Title Generation**: Select keyword → Generate SEO-optimized titles
3. **Topic Selection**: Choose title → Create content outline
4. **Content Creation**: Finalize outline + keyword → Generate full article with SEO score

### API Call Sequence
```
Frontend → Backend → Python Service → LLM API → Response Chain
```

## Component Integration

### Wizard Steps Integration

Each wizard step corresponds to specific API calls and data flow:

#### Step 1: KeywordResearch Component
- **Input**: Seed keyword from user
- **Process**: Generate related keywords (mock implementation)
- **Output**: Array of related keywords
- **Data Flow**: `wizardData.keywords`

#### Step 2: TitleGeneration Component  
- **Input**: Selected keyword from Step 1
- **Process**: Generate SEO-optimized titles (mock implementation)
- **Output**: Array of potential titles
- **Data Flow**: `wizardData.selectedTitle`

#### Step 3: TopicSelection Component
- **Input**: Selected title from Step 2
- **Process**: Create content outline/topics
- **Output**: Content structure/outline
- **Data Flow**: `wizardData.selectedTopics`

#### Step 4: ContentCreation Component
- **Input**: Outline + keyword
- **API Call**: `/api/content-creation`
- **Process**: Generate full article with SEO scoring
- **Output**: Complete article + SEO score
- **Data Flow**: `wizardData.generatedContent`, `wizardData.seoScore`

### State Management

#### Wizard Data Flow
```javascript
// Initial state
const [wizardData, setWizardData] = useState({
  keywords: [],           // Step 1 output
  selectedTitle: '',      // Step 2 output  
  selectedTopics: [],     // Step 3 output
  generatedContent: '',   // Step 4 output
  seoScore: null         // Step 4 output
});

// Update function
const updateWizardData = (newData) => {
  setWizardData(prevData => ({ ...prevData, ...newData }));
};
```

## Rate Limiting & Performance

### Considerations
- LLM API calls can be slow (10-30 seconds)
- Implement loading states in frontend
- Consider caching for repeated requests
- Monitor API usage for cost management

### Best Practices
- Show progress indicators during generation
- Implement retry logic for failed requests
- Cache successful responses when appropriate
- Validate inputs before API calls

### Loading States Implementation
```javascript
// In ContentCreation component
const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
  setLoading(true);
  try {
    const result = await generateContent(topicInfo, keyword);
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

## Security Considerations

### Firebase Authentication
- User authentication handled by Firebase
- Protected routes prevent unauthorized access
- User session management via AuthContext

### API Security
- CORS configuration for frontend-backend communication
- Input validation on backend endpoints
- Environment variables for sensitive configuration

### Data Privacy
- User-generated content stored locally in browser state
- No persistent storage of user content without explicit save
- Firebase handles user data security

---

*Last Updated: June 2, 2025*
*Version: 1.0.0*