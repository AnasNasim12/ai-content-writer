import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, CircularProgress, Paper, TextareaAutosize } from '@mui/material';
import { callAuthenticatedApi } from '../utils/apiClient'; // Corrected import path

export default function ContentCreation({ wizardData, updateWizardData, handleNext, handlePrev }) { // Added handlePrev
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seoScore, setSeoScore] = useState(wizardData.seoScore || null); // Initialize from wizardData
  const [currentContent, setCurrentContent] = useState(wizardData.generatedContent || '');
  const [advancedSeoScore, setAdvancedSeoScore] = useState(wizardData.advancedSeoScore || null);
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    // Update local state if wizardData changes from outside (e.g., navigating back and forth)
    if (wizardData.generatedContent) {
      setCurrentContent(wizardData.generatedContent);
    }
    if (wizardData.seoScore) {
      setSeoScore(wizardData.seoScore);
    }
    if (wizardData.advancedSeoScore) {
      setAdvancedSeoScore(wizardData.advancedSeoScore);
    }

    // Auto-generate content when step is reached, outline and keyword are available, and content hasn't been generated for current inputs
    if (wizardData.selectedTitle && 
        wizardData.outlineContent && 
        wizardData.selectedKeyword && 
        (!wizardData.generatedContent || 
         wizardData.currentOutlineForContent !== wizardData.outlineContent || 
         wizardData.currentKeywordForContent !== wizardData.selectedKeyword)
      ) {
      generateContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardData.selectedTitle, wizardData.outlineContent, wizardData.selectedKeyword]); // Removed generatedContent from deps to avoid loop, added selectedKeyword

  const generateContent = async () => {
    if (!wizardData.outlineContent) {
      setError("Outline is required to generate content.");
      return;
    }
    if (!wizardData.selectedKeyword) {
      setError("A selected keyword is required to generate content.");
      return;
    }

    setLoading(true);
    setError('');
    // setSeoScore(null); // Don't reset score until new one is fetched
    // setCurrentContent(''); // Don't clear content immediately, wait for new content

    try {
      console.log("Requesting content for outline and keyword:", wizardData.selectedKeyword);
      const response = await callAuthenticatedApi('/api/content-creation', 'POST', {
        topicInfo: wizardData.outlineContent, // Send the outline as topicInfo
        keyword: wizardData.selectedKeyword,   // Send the selected keyword
      });

      if (response && response.content) { // Check for response.content directly
        setCurrentContent(response.content);
        setSeoScore(response.seo_score !== undefined ? response.seo_score : null); // Access response.seo_score
        updateWizardData({
          generatedContent: response.content, // Use response.content
          seoScore: response.seo_score !== undefined ? response.seo_score : null, // Use response.seo_score
          advancedSeoScore: null, // Reset advanced score when new content is generated
          currentOutlineForContent: wizardData.outlineContent, // Track what outline was used
          currentKeywordForContent: wizardData.selectedKeyword // Track what keyword was used
        });
      } else {
        // If response.content is not present, it implies an error or unexpected format.
        // The backend (api.js) sends { success: false, error: "message" } for errors.
        setError(response.error || 'Failed to generate content. The response was not in the expected format.');
        // updateWizardData({ generatedContent: '', seoScore: null }); // Don't clear if there was an error, keep old data
      }
    } catch (err) {
      console.error("Error generating content:", err);
      // err is what callAuthenticatedApi throws:
      // - error.response?.data (e.g., { success: false, error: "message from backend" })
      // - or new Error('API request failed')
      setError(err.error || err.message || 'An error occurred while generating the content.');
      // updateWizardData({ generatedContent: '', seoScore: null });
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSeoScore = async () => {
    if (!currentContent || !wizardData.selectedKeyword) {
      setError('Content and keyword are required to get an advanced SEO score.');
      return;
    }
    setIsScoring(true);
    setError('');
    try {
      const response = await callAuthenticatedApi('/api/score-seo', 'POST', {
        text: currentContent,
        keyword: wizardData.selectedKeyword,
      });
      if (response && typeof response.seo_score !== 'undefined') {
        setAdvancedSeoScore(response.seo_score);
        updateWizardData({ advancedSeoScore: response.seo_score });
        if(response.warning) {
          setError(`Advanced SEO Score Warning: ${response.warning}`); // Display warning as a non-blocking error
        }
      } else {
        setError(response.error || 'Failed to get advanced SEO score.');
      }
    } catch (err) {
      console.error("Error getting advanced SEO score:", err);
      setError(err.error || err.message || 'An error occurred while fetching the advanced SEO score.');
    } finally {
      setIsScoring(false);
    }
  };

  // Update generatedContent in wizardData when currentContent changes
  useEffect(() => {
    updateWizardData({ generatedContent: currentContent });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContent]);

  if (!wizardData.selectedTitle || !wizardData.outlineContent) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Step 4: Content Creation</Typography>
        <Typography sx={{my: 2}}>Please complete the Outline Generation step first.</Typography>
        <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between'}}>
            <Button variant="outlined" onClick={handlePrev} disabled={loading}>Previous</Button>
            <Button variant="contained" onClick={handleNext} disabled>Next</Button> {/* Or Finish if this is the last step */} 
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 4: Content Creation</Typography>
      <Typography variant="subtitle2" gutterBottom sx={{mb: 1}}>
        Using title: <em>{wizardData.selectedTitle}</em>
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{mb: 2}}>
        Using keyword: <em>{wizardData.selectedKeyword || "Not specified"}</em>
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={generateContent} 
        disabled={loading || !wizardData.outlineContent || !wizardData.selectedKeyword}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} sx={{mr:1}} /> : null}
        {loading ? 'Generating...' : (currentContent ? 'Re-generate Content' : 'Generate Content')}
      </Button>
      
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      
      {loading && !currentContent && <CircularProgress sx={{display: 'block', margin: '20px auto'}}/>}

      {currentContent && (
        <Paper elevation={1} sx={{ padding: 2, mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
          {/* <Typography variant="h5" gutterBottom>{wizardData.selectedTitle}</Typography> */}
          <Box sx={{ mb: 2 }}>
          {seoScore !== null && (
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Basic SEO Score (Keyword Presence): {seoScore > 0 ? 'Keyword Present' : 'Keyword Not Found'}
            </Typography>
          )}
          {advancedSeoScore !== null && (
            <Typography variant="subtitle1" sx={{ mt: 1, color: 'primary.main' }}>
              Advanced SEO Score: {advancedSeoScore}/100
            </Typography>
          )}
        </Box>
        <Button 
          variant="outlined" 
          onClick={handleAdvancedSeoScore} 
          disabled={loading || isScoring || !currentContent || !wizardData.selectedKeyword}
          sx={{mt: 2}}
        >
          {isScoring ? <CircularProgress size={24} /> : 'Get Advanced SEO Score'}
        </Button>
          <TextareaAutosize
            minRows={10}
            style={{ width: '100%', padding: '10px', fontFamily: 'monospace', border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)} // Allow editing and update local state
            // readOnly // If you don't want to allow edits directly in this textarea
          />
        </Paper>
      )}
      {!loading && !currentContent && !error && (
        <Typography sx={{my: 2}}>No content generated yet. Click "Generate Content" to start.</Typography>
      )}

      <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between'}}>
        <Button variant="outlined" onClick={handlePrev} disabled={loading}>
            Previous
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={loading || !currentContent}>
            Finish & View
        </Button>
      </Box>
    </Box>
  );
}
