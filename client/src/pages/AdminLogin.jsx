import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { Lock, LogIn } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import NagoraLogo from '../components/NagoraLogo';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/admin/login', { username, password });
      if (res.data && res.data.token) {
        login(res.data.token);
        navigate('/admin');
      } else {
        setError('Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 12, backgroundColor: '#0A1128', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Helmet>
        <title>Admin Portal Login | NAGORA Digital Agency</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Container maxWidth="xs">
        <Card sx={{ p: 2, borderRadius: 4, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <CardContent component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, textAlign: 'center' }}>
            <Box sx={{ mx: 'auto', mb: 1 }}>
              <NagoraLogo height={45} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1128' }}>
              Admin Portal Login
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<LogIn size={18} />}
              sx={{ backgroundColor: '#7C3AED', color: '#FFFFFF', py: 1.4, fontWeight: 700, '&:hover': { backgroundColor: '#6B21A8' } }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
