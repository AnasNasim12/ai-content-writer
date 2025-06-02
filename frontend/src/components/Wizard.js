import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material'; // Added Paper
import KeywordResearch from './KeywordResearch';
import TitleGeneration from './TitleGeneration';
import TopicSelection from './TopicSelection';
import ContentCreation from './ContentCreation';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material'; // Added IconButton and Tooltip

const steps = ['Keyword Research', 'Title Generation', 'Topic Selection', 'Content Creation'];

function getStepContent(step, commonProps) {
  switch (step) {
    case 0:
      return <KeywordResearch {...commonProps} />;
    case 1:
      return <TitleGeneration {...commonProps} />;
    case 2:
      return <TopicSelection {...commonProps} />;
    case 3:
      return <ContentCreation {...commonProps} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Wizard({ onArticleGenerated }) { // Accept onArticleGenerated prop
  const [activeStep, setActiveStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    keywords: [],
    selectedTitle: '',
    selectedTopics: [], // or outline
    generatedContent: '',
    seoScore: null // Ensure seoScore is initialized
  });
  const [copySuccess, setCopySuccess] = useState(''); // For copy to clipboard feedback
  const [saved, setSaved] = useState(false); // Track if article has been saved

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateWizardData = (newData) => {
    setWizardData(prevData => ({ ...prevData, ...newData }));
  };
  
  const handleExportTxt = () => {
    if (!wizardData.generatedContent) return;
    const element = document.createElement("a");
    const file = new Blob([wizardData.generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    const fileName = wizardData.selectedTitle ? wizardData.selectedTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'generated_content';
    element.download = `${fileName}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyToClipboard = () => {
    if (!wizardData.generatedContent) return;
    navigator.clipboard.writeText(wizardData.generatedContent).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
    }, (err) => {
      setCopySuccess('Failed to copy!');
      console.error('Could not copy text: ', err);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };  const handleFinishAndSave = () => {
    if (wizardData.generatedContent && wizardData.selectedTitle && !saved) {
      onArticleGenerated({
        title: wizardData.selectedTitle,
        content: wizardData.generatedContent,
        seoScore: wizardData.seoScore,
        date: new Date().toLocaleDateString(),
      });
      setSaved(true); // Mark as saved
    }
  };

  const commonProps = { wizardData, updateWizardData, handleNext };

  return (
    <Box> {/* Removed Paper from here, will be applied in App.js */}
      <Typography variant="h4" gutterBottom align="center" sx={{mb: 3}}>
        Content Creation Wizard
      </Typography>
      <Stepper activeStep={activeStep} sx={{ marginBottom: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center', padding: 3 }}>
            <Typography variant="h5" gutterBottom>All steps completed - Content Ready!</Typography>
            {wizardData.generatedContent && wizardData.seoScore !== null && (
              <Typography variant="subtitle1" sx={{mb: 1}}>
                SEO Score: {wizardData.seoScore}
              </Typography>
            )}
            <Typography variant="subtitle1">Your content has been generated:</Typography>
            <Paper elevation={2} sx={{ textAlign: 'left', background: '#f5f5f5', padding: '10px', my: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '300px', overflowY: 'auto' }}>
              {wizardData.generatedContent || "No content generated yet."}
            </Paper>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<FileDownloadIcon />} 
                onClick={handleExportTxt} 
                disabled={!wizardData.generatedContent}
              >
                Export as .txt
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ContentCopyIcon />} 
                onClick={handleCopyToClipboard} 
                disabled={!wizardData.generatedContent}
              >
                Copy to Clipboard
              </Button>
              {copySuccess && <Typography variant="caption">{copySuccess}</Typography>}
            </Box>            <Button onClick={() => { 
              setActiveStep(0); 
              setWizardData({ keywords: [], selectedTitle: '', selectedTopics: [], generatedContent: '', seoScore: null }); 
              setCopySuccess(''); 
              setSaved(false); // Reset saved state
            }} sx={{ mt: 3 }}>
              Start Over
            </Button>
          </Box>
        ) : (
          <Box>
            {getStepContent(activeStep, commonProps)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 3, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>              <Box sx={{ flex: '1 1 auto' }} />
              {saved && activeStep === steps.length - 1 && (
                <Typography variant="body2" color="success.main" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  ✓ Saved to Dashboard!
                </Typography>
              )}
              <Button 
                onClick={activeStep === steps.length - 1 ? handleFinishAndSave : handleNext} 
                variant="contained"
                disabled={(activeStep === steps.length - 1 && !wizardData.generatedContent) || saved}
                color={saved ? "success" : "primary"}
              >
                {activeStep === steps.length - 1 
                  ? (saved ? 'Saved ✓' : 'Finish & Save') 
                  : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
