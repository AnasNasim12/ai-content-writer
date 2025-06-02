import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Wizard from './components/Wizard';
import Dashboard from './components/Dashboard';
import Documentation from './components/Documentation';

function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Content Writer
        </Typography>        {currentUser ? (
          <>
            {currentUser.email && (
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {currentUser.email}
              </Typography>
            )}
            <Button color="inherit" component={RouterLink} to="/">Wizard</Button>
            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={RouterLink} to="/docs">API Docs</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/signup">Sign Up</Button>
            <Button color="inherit" component={RouterLink} to="/docs">API Docs</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [generatedArticles, setGeneratedArticles] = useState([]);

  const handleArticleGenerated = (article) => {
    setGeneratedArticles(prev => [...prev, article]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navigation />
      <Container sx={{ marginTop: 4 }}>        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Wizard onArticleGenerated={handleArticleGenerated} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard articles={generatedArticles} />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
