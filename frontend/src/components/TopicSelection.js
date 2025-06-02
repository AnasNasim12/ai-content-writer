import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, CircularProgress, Paper } from '@mui/material';
import { callAuthenticatedApi } from '../utils/apiClient'; // Corrected import path

export default function TopicSelection({ wizardData, updateWizardData, handleNext, handlePrev }) {
  const [generatedOutline, setGeneratedOutline] = useState(wizardData.outlineContent || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callGenerateOutlineAPI = async () => {
    if (!wizardData.selectedTitle) {
      setError('A selected title is required to generate an outline.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log("Requesting outline for title:", wizardData.selectedTitle, "and keyword:", wizardData.selectedKeyword);
      const response = await callAuthenticatedApi('/api/generate-outline', 'POST', {
        title: wizardData.selectedTitle,
        keyword: wizardData.selectedKeyword,
      });

      // Corrected: Check for response.outline directly, as apiClient.js returns the parsed JSON body.
      if (response && response.outline) { 
        const outline = response.outline;
        setGeneratedOutline(outline);
        updateWizardData({ outlineContent: outline, currentTitleForOutline: wizardData.selectedTitle });
      } else {
        // Log the actual response for debugging if the expected structure is not found.
        console.error("Debug: Unexpected response structure from /api/generate-outline:", response);
        setError('Failed to generate outline. The response was not in the expected format.');
        setGeneratedOutline('');
      }
    } catch (err) {
      console.error("Error generating outline:", err);
      setError(err.message || 'An error occurred while generating the outline.');
      setGeneratedOutline('');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (wizardData.selectedTitle && 
        (!wizardData.outlineContent || wizardData.currentTitleForOutline !== wizardData.selectedTitle)) {
      callGenerateOutlineAPI();
    } else if (wizardData.outlineContent && wizardData.currentTitleForOutline === wizardData.selectedTitle) {
      setGeneratedOutline(wizardData.outlineContent); 
    } else if (!wizardData.selectedTitle) {
        setGeneratedOutline(''); // Clear outline if title is cleared
        updateWizardData({ outlineContent: '', currentTitleForOutline: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardData.selectedTitle]); // Removed wizardData.outlineContent as callGenerateOutlineAPI depends on selectedTitle and will fetch if needed.

  if (!wizardData.selectedTitle) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Step 3: Outline Generation</Typography>
        <Typography sx={{my: 2}}>Please complete the Title Generation step first.</Typography>
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between'}}>
            <Button variant="outlined" onClick={handlePrev} disabled={loading}>Previous</Button>
            <Button variant="contained" onClick={handleNext} disabled>Next</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 3: Outline Generation</Typography>
      <Typography variant="subtitle2" gutterBottom sx={{mb: 2}}>
        For title: <em>{wizardData.selectedTitle}</em>
        {wizardData.selectedKeyword && <><br/>Using keyword: <em>{wizardData.selectedKeyword || "Not specified"}</em></>}
      </Typography>
      
      {error && <Typography color="error" sx={{my: 2}}>{error}</Typography>}

      {loading && <CircularProgress sx={{my: 2, display: 'block', margin: 'auto'}}/>}

      {!loading && generatedOutline && (
        <Paper elevation={1} sx={{ padding: 2, mt: 2, mb: 2, whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto', border: '1px solid #e0e0e0' }}>
          <Typography component="div"> 
            {generatedOutline}
          </Typography>
        </Paper>
      )}
      
      {!loading && !generatedOutline && !error && (
        <Typography sx={{my: 2}}>No outline generated yet. Click "Generate Outline" to start or if the selected title has changed.</Typography>
      )}

      <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between'}}>
        <Button variant="outlined" onClick={handlePrev} disabled={loading}> 
            Previous
        </Button>
        <Box>
            <Button 
                variant="contained" 
                onClick={callGenerateOutlineAPI} 
                disabled={loading || !wizardData.selectedTitle} 
                sx={{mr:1}}
            >
                {loading && generatedOutline ? <CircularProgress size={24} sx={{mr:1}} /> : null}
                {loading ? 'Generating...' : (generatedOutline ? 'Re-generate Outline' : 'Generate Outline')}
            </Button>
            <Button 
                variant="contained" 
                onClick={handleNext} 
                disabled={loading || !generatedOutline}
            >
                Next
            </Button>
        </Box>
      </Box>
    </Box>
  );
}
