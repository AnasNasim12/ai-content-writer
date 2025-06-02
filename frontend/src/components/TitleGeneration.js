import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, List, ListItem, FormControlLabel, Radio, RadioGroup, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { callAuthenticatedApi } from '../utils/apiClient';

export default function TitleGeneration({ wizardData, updateWizardData, handleNext }) {
  const { currentUser } = useAuth();
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTitles = async () => {
    if (!wizardData.selectedKeyword) {
      setError('Please select a keyword from the previous step first.');
      return;
    }
    if (!currentUser) {
      setError('You must be logged in to generate titles.');
      return;
    }
    setLoading(true);
    setError('');
    setTitles([]);
    try {
      const token = await currentUser.getIdToken();
      const response = await callAuthenticatedApi(
        '/api/title-generation',
        'POST',
        { selectedKeyword: wizardData.selectedKeyword },
        token
      );

      if (response.success && response.titles && response.titles.length > 0) {
        setTitles(response.titles);
        updateWizardData({ selectedTitle: response.titles[0], titles: response.titles, titlesGeneratedForKeyword: wizardData.selectedKeyword });
      } else if (response.success && response.titles && response.titles.length === 0) {
        setError('No titles were generated for this keyword.');
        updateWizardData({ selectedTitle: '', titles: [], titlesGeneratedForKeyword: wizardData.selectedKeyword });
      } else {
        setError(response.error || 'Failed to fetch titles.');
        updateWizardData({ selectedTitle: '', titles: [], titlesGeneratedForKeyword: wizardData.selectedKeyword });
      }
    } catch (err) {
      console.error("Title generation API error:", err);
      setError(err.message || 'An error occurred during title generation.');
      updateWizardData({ selectedTitle: '', titles: [] });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (wizardData.selectedKeyword && wizardData.selectedKeyword !== wizardData.titlesGeneratedForKeyword) {
      generateTitles();
    } else if (wizardData.titles && wizardData.titles.length > 0 && wizardData.selectedKeyword === wizardData.titlesGeneratedForKeyword) {
      setTitles(wizardData.titles);
    } else if (!wizardData.selectedKeyword) {
        setTitles([]);
        updateWizardData({ selectedTitle: '', titles: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardData.selectedKeyword]);

  useEffect(() => {
    if (wizardData.titles && wizardData.titles.length > 0) {
        setTitles(wizardData.titles);
    }
  }, [wizardData.titles]);


  const handleTitleSelection = (event) => {
    const title = event.target.value;
    updateWizardData({ selectedTitle: title });
  };

  if (!wizardData.selectedKeyword) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>Step 2: Title Generation</Typography>
            <Typography sx={{my: 2}}>Please complete the Keyword Research step and select a keyword first.</Typography>
        </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Step 2: Title Generation</Typography>
      <Typography variant="subtitle2" gutterBottom sx={{mb:1}}>Using keyword: <em>{wizardData.selectedKeyword}</em></Typography>
      
      {error && <Typography color="error" sx={{my: 2}}>{error}</Typography>}

      {loading && <CircularProgress sx={{my: 2, display: 'block', margin: 'auto'}}/>}

      {!loading && titles.length > 0 && (
        <RadioGroup
            aria-label="title-selection"
            name="title-selection-group"
            value={wizardData.selectedTitle || ''}
            onChange={handleTitleSelection}
        >
          <List>
            {titles.map((title, index) => (
              <ListItem key={index} disablePadding>
                <FormControlLabel 
                    value={title} 
                    control={<Radio />} 
                    label={title} 
                    sx={{width: '100%', ml: 0}}
                />
              </ListItem>
            ))}
          </List>
        </RadioGroup>
      )}
      {!loading && titles.length === 0 && !error && (
        <Typography sx={{my: 2}}>No titles generated yet. Click "Generate Titles" to start.</Typography>
      )}
      
      <Box sx={{mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Button variant="outlined" onClick={generateTitles} disabled={loading || !wizardData.selectedKeyword}>
          {loading && <CircularProgress size={24} sx={{mr:1}} />}
          {loading ? 'Generating...' : (titles.length > 0 ? 'Re-generate Titles' : 'Generate Titles')}
        </Button>
      </Box>
    </Box>
  );
}
