import React, { useState } from 'react';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, CircularProgress, ListItemButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext'; // Added
import { callAuthenticatedApi } from '../utils/apiClient'; // Added

export default function KeywordResearch({ wizardData, updateWizardData, handleNext }) {
  const { currentUser } = useAuth(); // Added
  const [seedKeyword, setSeedKeyword] = useState(wizardData.seedKeyword || ''); // Initialize with wizardData
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResearch = async () => {
    if (!seedKeyword.trim()) {
      setError('Please enter a seed keyword.');
      return;
    }
    if (!currentUser) { // Added check
      setError('You must be logged in to research keywords.');
      return;
    }
    setLoading(true);
    setError('');
    updateWizardData({ seedKeyword }); // Save the seed keyword used for research
    try {
      const token = await currentUser.getIdToken(); // Added
      const response = await callAuthenticatedApi( // Changed to use callAuthenticatedApi
        '/api/keyword-research', // Ensure this matches your Node.js backend route
        'POST',
        { seedKeyword },
        token
      );

      if (response.success && response.keywords) {
        updateWizardData({ keywords: response.keywords, selectedKeyword: null }); // Reset selected keyword on new research
      } else {
        setError(response.error || 'Failed to fetch keywords.');
        updateWizardData({ keywords: [], selectedKeyword: null }); // Clear keywords on error
      }
    } catch (err) {
      console.error("Keyword research API error:", err);
      setError(err.message || 'An error occurred during keyword research.');
      updateWizardData({ keywords: [], selectedKeyword: null }); // Clear keywords on error
    }
    setLoading(false);
  };

  const handleKeywordSelect = (keyword) => {
    updateWizardData({ selectedKeyword: keyword });
    // Optionally, if you want to automatically proceed to the next step upon selection:
    // handleNext(); 
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 1: Keyword Research</Typography>
      <TextField
        label="Enter Seed Keyword"
        variant="outlined"
        fullWidth
        value={seedKeyword}
        onChange={(e) => setSeedKeyword(e.target.value)}
        margin="normal"
        disabled={loading}
      />
      <Button variant="contained" onClick={handleResearch} disabled={loading} sx={{mb: 2}}>
        {loading ? <CircularProgress size={24} /> : 'Research Keywords'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {wizardData.keywords && wizardData.keywords.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1">Suggested Keywords: (Click to select)</Typography>
          <List>
            {wizardData.keywords.map((kw, index) => (
              <ListItem 
                key={index} 
                disablePadding 
                selected={wizardData.selectedKeyword === kw} // Visually indicate selection
              >
                <ListItemButton onClick={() => handleKeywordSelect(kw)}>
                  <ListItemText primary={kw} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {wizardData.selectedKeyword && (
            <Typography variant="body1" sx={{mt: 1}}>Selected: <strong>{wizardData.selectedKeyword}</strong></Typography>
          )}
        </Box>
      )}
      <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
            variant="contained" 
            onClick={handleNext} 
            disabled={!wizardData.selectedKeyword || loading}
        >
            Next
        </Button>
      </Box>
    </Box>
  );
}
