# AI Content Writer - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Backend APIs](#backend-apis)
3. [LLM Service IntegrThe backend communicates with a Python service running on `http://localhost:5001`tion](#llm-service-integration)
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

### Authentication
All endpoints require Firebase authentication via Bearer token in Authorization header.

### Keyword Research Endpoint

#### POST `/keyword-research`
Generates related keywords from a seed keyword.

**Request Body:**
```json
{
  "seedKeyword": "string"  // Seed keyword for research
}
```

**Response:**
```json
{
  "success": true,
  "keywords": ["string"]   // Array of related keywords
}
```

### Title Generation Endpoint

#### POST `/title-generation`
Generates SEO-optimized titles for a selected keyword.

**Request Body:**
```json
{
  "selectedKeyword": "string"  // Selected keyword from research
}
```

**Response:**
```json
{
  "success": true,
  "titles": ["string"]     // Array of SEO-optimized titles
}
```

### Generate Outline Endpoint

#### POST `/generate-outline`
Creates content outline from a selected title.

**Request Body:**
```json
{
  "title": "string",       // Selected title
  "keyword": "string"      // Selected keyword (optional)
}
```

**Response:**
```json
{
  "success": true,
  "outline": "string"      // Generated content outline
}
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
  "success": true,
  "content": "string",    // Generated content
  "seo_score": "number"   // SEO score (0-100)
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
  "success": true,
  "content": "Machine learning is a subset of artificial intelligence...",
  "seo_score": 85
}
```

### Advanced SEO Scoring Endpoint

#### POST `/score-seo`
Scores existing text content for SEO effectiveness using the LLM.

**Request Body:**
```json
{
  "text": "string",     // The text content to be scored
  "keyword": "string"   // The primary keyword to score against
}
```

**Response:**
```json
{
  "success": true,
  "seo_score": "number", // Advanced SEO score (0-100)
  "warning": "string"   // Optional warning if fallback scoring was used
}
```

**Example Request:**
```javascript
fetch('/api/score-seo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer <FIREBASE_ID_TOKEN>'
  },
  body: JSON.stringify({
    text: "This is an example article about the benefits of solar power...",
    keyword: "solar power"
  })
})
```

**Example Response (Success):**
```json
{
  "success": true,
  "seo_score": 92,
  "warning": null
}
```

**Example Response (Success with Warning):**
```json
{
  "success": true,
  "seo_score": 75,
  "warning": "Advanced SEO scoring returned out-of-range score, used basic scoring."
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

### Python Service Endpoints
The backend communicates with a Python service running on `http://localhost:5001`

#### POST `/related_keywords`
Generates related keywords from a seed keyword.

**Request:**
```json
{
  "seed_keyword": "string"
}
```

**Response:**
```json
{
  "related_keywords": ["string"]
}
```

#### POST `/seo_titles`
Generates SEO-optimized titles for a keyword.

**Request:**
```json
{
  "keyword": "string"
}
```

**Response:**
```json
{
  "titles": ["string"]
}
```

#### POST `/topic_ideas`
Generates content outline from a title.

**Request:**
```json
{
  "title": "string"
}
```

**Response:**
```json
{
  "topic_ideas": "string"
}
```

#### POST `/generate_content`
Generates AI content from topic and keyword.

**Request:**
```json
{
  "topic": "string",
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

#### POST `/score_seo`
Scores content for SEO effectiveness.

**Request:**
```json
{
  "text": "string",
  "keyword": "string"
}
```

**Response:**
```json
{
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
Flask==2.3.3
Flask-CORS==4.0.0
python-dotenv==1.0.0
google-generativeai>=0.7.0,<0.8.0
langchain-google-genai==1.0.10
langchain-core
markdown==3.5.1
beautifulsoup4==4.12.2
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
GOOGLE_APPLICATION_CREDENTIALS=./config/firebase-service-account-key.json
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
python -m venv venv
venv\Scripts\activate
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
Invoke-RestMethod -Uri "http://localhost:5001/generate-content" `
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

*Last Updated: June 4, 2025*
*Version: 1.1.0*