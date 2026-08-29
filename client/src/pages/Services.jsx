import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';
import ServicesSection from '../sections/ServicesSection';
import PreFooterCTA from '../sections/PreFooterCTA';

export default function Services() {
  return (
    <Box>
      <Helmet>
        <title>Services — NAGORA Digital Agency</title>
        <meta name="description" content="Explore NAGORA's full suite of services: Website Development, SEO, App Development, Photography, Videography, Video Editing, and Branding." />
      </Helmet>

      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0A1128', color: '#FFFFFF', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: '0.15em' }}>
            WHAT WE DO
          </Typography>
          <Typography variant="h1" sx={{ color: '#FFFFFF', fontWeight: 800, mt: 1, mb: 2 }}>
            Complete Digital & Creative Capabilities
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#94A3B8', fontSize: '1.1rem' }}>
            Everything your business needs to build a modern online infrastructure, reach new customers, and project an unforgettable brand image.
          </Typography>
        </Container>
      </Box>

      <ServicesSection />
      <PreFooterCTA />
    </Box>
  );
}
