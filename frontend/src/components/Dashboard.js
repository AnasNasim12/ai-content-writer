import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Dummy data for demonstration
const recentContent = [
  { id: 1, title: "My First AI Article", status: "Completed", date: "2023-10-26" },
  { id: 2, title: "Exploring New Topics", status: "In Progress", date: "2023-10-27" },
];

export default function Dashboard({ articles }) { // Accept articles as a prop
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Typography variant="body1">
          Welcome to your AI Content Writer dashboard.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View your generated articles below.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Generated Content
        </Typography>
        {articles && articles.length > 0 ? (
          <List>
            {articles.map((item, index) => (
              <Accordion key={item.id || index} sx={{ mb: 1}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}a-content`}
                  id={`panel${index}a-header`}
                >
                  <ListItemText 
                    primary={item.title}
                    secondary={`SEO Score: ${item.seoScore !== null && item.seoScore !== undefined ? item.seoScore : 'N/A'} - Created: ${item.date}`}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                    {item.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No content generated yet. Go to the Wizard to create your first article!
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
