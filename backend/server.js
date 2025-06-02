require('dotenv').config(); // Load environment variables from .env file

const admin = require('firebase-admin');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (serviceAccountPath) {
  try {
    const serviceAccount = require(serviceAccountPath); // require() can load JSON files directly
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully in server.js.');
  } catch (e) {
    console.error('Error initializing Firebase Admin SDK in server.js with service account:', e.message);
    console.error('Please ensure GOOGLE_APPLICATION_CREDENTIALS in your .env file points to a valid service account JSON key file.');
    process.exit(1); // Exit if Firebase Admin cannot be initialized
  }
} else {
  console.error('GOOGLE_APPLICATION_CREDENTIALS is not set in your .env file. Firebase Admin SDK cannot be initialized.');
  process.exit(1); // Exit if the env variable is not set
}

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
