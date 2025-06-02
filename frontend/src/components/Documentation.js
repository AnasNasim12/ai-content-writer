import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function Documentation() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the API documentation content
    fetch('/API_DOCUMENTATION.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load documentation');
        }
        return response.text();
      })
      .then(content => {
        setMarkdownContent(content);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error Loading Documentation
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box 
          sx={{ 
            '& h1': { 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: 1,
              marginBottom: 3
            },
            '& h2': { 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'primary.dark',
              marginTop: 4,
              marginBottom: 2
            },
            '& h3': { 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: 'secondary.main',
              marginTop: 3,
              marginBottom: 1.5
            },
            '& h4': { 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginTop: 2,
              marginBottom: 1
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              padding: '2px 4px',
              borderRadius: '4px',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace'
            },
            '& pre': {
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
              border: '1px solid #e0e0e0'
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: 0
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              paddingLeft: 2,
              marginLeft: 0,
              fontStyle: 'italic'
            },
            '& ul': {
              paddingLeft: 3
            },
            '& li': {
              marginBottom: 0.5
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              marginTop: 2,
              marginBottom: 2
            },
            '& th, & td': {
              border: '1px solid #ddd',
              padding: 1,
              textAlign: 'left'
            },
            '& th': {
              backgroundColor: 'primary.light',
              fontWeight: 'bold'
            }
          }}
        >
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
}
