import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';
import PortfolioSection from '../sections/PortfolioSection';
import PreFooterCTA from '../sections/PreFooterCTA';

export default function PortfolioPage() {
  return (
    <Box>
      <Helmet>
        <title>Portfolio — NAGORA Digital Agency</title>
        <meta name="description" content="Explore NAGORA's portfolio of websites, mobile apps, SEO campaigns, commercial photography, brand videos, and visual identities." />
      </Helmet>

      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0A1128', color: '#FFFFFF', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: '0.15em' }}>
            AGENCY SHOWCASE
          </Typography>
          <Typography variant="h1" sx={{ color: '#FFFFFF', fontWeight: 800, mt: 1, mb: 2 }}>
            Featured Digital & Creative Projects
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#94A3B8', fontSize: '1.1rem' }}>
            Browse through our client success stories across web development, mobile applications, search optimization, photo shoots, and brand visual design.
          </Typography>
        </Container>
      </Box>

      <PortfolioSection />
      <PreFooterCTA />
    </Box>
  );
}
