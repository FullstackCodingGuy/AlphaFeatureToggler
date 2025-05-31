import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, ThemeProvider } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './components/DashboardLayout';
import theme from './theme/theme';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

function App() {
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                path="/*"
                element={
                  <DashboardLayout>
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="features" element={<Features />} />
                      <Route path="analytics" element={<Box p={3}>Analytics (Coming Soon)</Box>} />
                      <Route path="settings" element={<Box p={3}>Settings (Coming Soon)</Box>} />
                    </Routes>
                  </DashboardLayout>
                }
              />
            </Route>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}><Login /></Box>} />
              <Route path="/signup" element={<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}><Signup /></Box>} />
            </Route>
            <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
