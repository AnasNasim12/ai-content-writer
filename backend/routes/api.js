const express = require('express');
const router = express.Router();
const axios = require('axios');
const admin = require('firebase-admin'); // This line is crucial and was missing or commented out.

// Firebase Admin SDK is initialized in server.js.
// The console.log for GOOGLE_APPLICATION_CREDENTIALS can be removed as it was for diagnostics.

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(403).json({ error: 'No token provided' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add user to request object
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Unauthorized' });
  }
}

// Keyword Research Route - Now calls Python service
router.post('/keyword-research', verifyToken, async (req, res) => {
  const { seedKeyword } = req.body;
  console.log('Keyword Research requested for user:', req.user.uid, 'with seed:', seedKeyword);

  if (!seedKeyword) {
    return res.status(400).json({ success: false, error: 'Seed keyword is required.' });
  }

  try {
    const pythonServiceUrl = 'http://localhost:5001/related_keywords'; // Python Flask service endpoint
    const response = await axios.post(pythonServiceUrl, {
      seed_keyword: seedKeyword // Ensure payload matches Python service expectation
    });

    // Assuming Python service returns { "related_keywords": [...] }
    if (response.data && response.data.related_keywords) {
      res.json({ success: true, keywords: response.data.related_keywords });
    } else {
      console.error('Unexpected response from Python keyword service:', response.data);
      res.status(500).json({ success: false, error: 'Failed to get keywords from AI service.' });
    }
  } catch (error) {
    console.error('Error calling Python keyword service:', error.message);
    if (error.response) {
      console.error('Python service response error:', error.response.data);
      res.status(error.response.status || 500).json({ success: false, error: error.response.data.error || 'Error from AI service.' });
    } else if (error.request) {
      res.status(503).json({ success: false, error: 'AI service is unavailable or not responding.' });
    } else {
      res.status(500).json({ success: false, error: 'Internal server error while contacting AI service.' });
    }
  }
});

// Placeholder for Title Generation
router.post('/title-generation', verifyToken, async (req, res) => { // Added verifyToken and async
  const { selectedKeyword } = req.body; // Changed from keywords to selectedKeyword to match workflow
  console.log('Title Generation requested for user:', req.user.uid, 'with keyword:', selectedKeyword);

  if (!selectedKeyword) {
    return res.status(400).json({ success: false, error: 'Selected keyword is required.' });
  }

  try {
    const pythonServiceUrl = 'http://localhost:5001/seo_titles';
    const response = await axios.post(pythonServiceUrl, {
      keyword: selectedKeyword // Python service expects 'keyword'
    });

    if (response.data && response.data.titles) {
      res.json({ success: true, titles: response.data.titles });
    } else {
      console.error('Unexpected response from Python title service:', response.data);
      res.status(500).json({ success: false, error: 'Failed to get titles from AI service.' });
    }
  } catch (error) {
    console.error('Error calling Python title service:', error.message);
    if (error.response) {
      console.error('Python service response error:', error.response.data);
      res.status(error.response.status || 500).json({ success: false, error: error.response.data.error || 'Error from AI service.' });
    } else if (error.request) {
      res.status(503).json({ success: false, error: 'AI service is unavailable or not responding.' });
    } else {
      res.status(500).json({ success: false, error: 'Internal server error while contacting AI service.' });
    }
  }
});

// Placeholder for Topic Selection (Outline Generation)
// Changed route to /generate-outline to be more descriptive
router.post('/generate-outline', verifyToken, async (req, res) => { // Added verifyToken and async
  const { title, keyword } = req.body; // Changed from selectedTitle, selectedKeyword to title, keyword
  console.log('Outline Generation requested for user:', req.user.uid, 'with title:', title, 'and keyword:', keyword);

  if (!title) { // Changed from selectedTitle to title
    return res.status(400).json({ success: false, error: 'Title is required.' }); // Updated error message slightly
  }

  try {
    const pythonServiceUrl = 'http://localhost:5001/topic_ideas'; 
    const payload = { title: title }; // Use the destructured title
    // If you intend to use the keyword in the Python service for /topic_ideas, uncomment and adjust:
    // if (keyword) payload.keyword = keyword; 

    const response = await axios.post(pythonServiceUrl, payload);

    // Python service returns { "topic_ideas": "outline string" }
    if (response.data && response.data.topic_ideas) {
      res.json({ success: true, outline: response.data.topic_ideas });
    } else {
      console.error('Unexpected response from Python outline service:', response.data);
      res.status(500).json({ success: false, error: 'Failed to get outline from AI service.' });
    }
  } catch (error) {
    console.error('Error calling Python outline service:', error.message);
    if (error.response) {
      console.error('Python service response error:', error.response.data);
      res.status(error.response.status || 500).json({ success: false, error: error.response.data.error || 'Error from AI service.' });
    } else if (error.request) {
      res.status(503).json({ success: false, error: 'AI service is unavailable or not responding.' });
    } else {
      res.status(500).json({ success: false, error: 'Internal server error while contacting AI service.' });
    }
  }
});

// Content Creation Route
router.post('/content-creation', verifyToken, async (req, res) => { // Added verifyToken and async
  const { topicInfo, keyword } = req.body; // Changed to topicInfo and keyword to match frontend
  console.log('Content Creation requested for user:', req.user.uid, 'with keyword:', keyword);

  if (!topicInfo || !keyword) { // Changed to topicInfo and keyword
    return res.status(400).json({ success: false, error: 'Outline (topicInfo) and keyword are required.' });
  }

  try {
    const pythonServiceUrl = 'http://localhost:5001/generate_content';
    const response = await axios.post(pythonServiceUrl, {
      topic: topicInfo, // Pass topicInfo as 'topic' to Python service
      keyword: keyword    // Pass keyword as 'keyword'
    });

    // Python service returns { "content": "...", "seo_score": ... }
    if (response.data && response.data.content) {
      res.json({ 
        success: true, 
        content: response.data.content,
        seo_score: response.data.seo_score 
      });
    } else {
      console.error('Unexpected response from Python content service:', response.data);
      res.status(500).json({ success: false, error: 'Failed to get content from AI service.' });
    }
  } catch (error) {
    console.error('Error calling Python content service:', error.message);
    if (error.response) {
      console.error('Python service response error:', error.response.data);
      res.status(error.response.status || 500).json({ success: false, error: error.response.data.error || 'Error from AI service.' });
    } else if (error.request) {
      res.status(503).json({ success: false, error: 'AI service is unavailable or not responding.' });
    } else {
      res.status(500).json({ success: false, error: 'Internal server error while contacting AI service.' });
    }
  }
});

module.exports = router;
