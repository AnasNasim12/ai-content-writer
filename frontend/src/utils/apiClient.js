
// filepath: d:\AI ContentWriter\frontend\src\utils\apiClient.js
import { getAuth } from 'firebase/auth';

export const callAuthenticatedApi = async (endpoint, method = 'GET', body = null, customHeaders = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated. Please log in.');
  }

  try {
    const token = await user.getIdToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...customHeaders,
    };

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    // Assuming your backend API is running on port 3001 and accessible via /api prefix
    // Adjust the base URL if your backend setup is different.
    const response = await fetch(`http://localhost:3001${endpoint}`, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use text
        errorData = { message: await response.text() || response.statusText };
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // If the response has no content, return a success indication or an empty object
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json(); // Return the parsed JSON
    } else {
      // For non-JSON responses (e.g., 204 No Content), return a generic success object or handle as needed
      // It's important to return an object that the calling code might expect, e.g., { success: true }
      // or an empty object if that's how it's handled.
      // For now, let's assume it might expect a data property for consistency with JSON responses.
      return { data: { success: true, message: 'Operation successful, no content returned.' } }; 
    }

  } catch (error) {
    console.error('API call error in apiClient.js:', error);
    // Re-throw the error so the calling component can handle it (e.g., display to user)
    // It might be useful to throw an object with a message property for consistency
    if (error instanceof Error) { // Ensure it's an error object
        throw error;
    } else {
        throw new Error(String(error)); // Convert to string if it's not an error object
    }
  }
};
