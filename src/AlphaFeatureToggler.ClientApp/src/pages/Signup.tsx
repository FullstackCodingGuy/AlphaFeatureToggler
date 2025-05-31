import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real signup logic
    if (email && password) {
      localStorage.setItem('auth', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <form onSubmit={handleSignup}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
        </form>
        <Button color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>Back to Login</Button>
      </Paper>
    </Box>
  );
}
