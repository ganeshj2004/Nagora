import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 14, textAlign: 'center', backgroundColor: '#FFFFFF', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <Helmet>
        <title>404 — Page Not Found | NAGORA Digital Agency</title>
      </Helmet>

      <Container maxWidth="sm">
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(124, 58, 237, 0.08)', color: '#7C3AED', mx: 'auto', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Compass size={44} />
        </Box>

        <Typography variant="h1" sx={{ fontSize: '4rem', fontWeight: 900, color: '#0A1128', mb: 1 }}>
          404
        </Typography>

        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0A1128', mb: 2, fontSize: '1.8rem' }}>
          Looks Like This Page Took a Different Route.
        </Typography>

        <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.6 }}>
          The link you followed might be broken, or the page may have been moved. Return to our main website to explore our services and portfolio.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          endIcon={<ArrowRight size={18} />}
          sx={{ backgroundColor: '#0A1128', color: '#FFFFFF', fontWeight: 700, px: 4, py: 1.4, '&:hover': { backgroundColor: '#7C3AED' } }}
        >
          Back Home →
        </Button>
      </Container>
    </Box>
  );
}
