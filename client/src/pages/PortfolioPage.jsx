import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';
import PortfolioSection from '../sections/PortfolioSection';
import PreFooterCTA from '../sections/PreFooterCTA';

export default function PortfolioPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Portfolio — NAGORA Digital Agency',
    'url': 'https://www.nagora.solutions/portfolio',
    'description': 'Explore NAGORA\'s portfolio of websites, mobile apps, SEO campaigns, commercial photography, brand videos, and visual identities.'
  };

  return (
    <Box>
      <Helmet>
        <title>Portfolio — NAGORA Digital Agency</title>
        <meta name="description" content="Explore NAGORA's portfolio of websites, mobile apps, SEO campaigns, commercial photography, brand videos, and visual identities." />
        <link rel="canonical" href="https://www.nagora.solutions/portfolio" />

        {/* Open Graph */}
        <meta property="og:title" content="Portfolio — NAGORA Digital Agency" />
        <meta property="og:description" content="Explore NAGORA's portfolio of websites, mobile apps, SEO campaigns, commercial photography, brand videos, and visual identities." />
        <meta property="og:url" content="https://www.nagora.solutions/portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.nagora.solutions/emi-hero-banner.png" />
        <meta property="og:site_name" content="NAGORA Digital Agency" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio — NAGORA Digital Agency" />
        <meta name="twitter:description" content="Explore NAGORA's portfolio of websites, mobile apps, SEO campaigns, commercial photography, brand videos, and visual identities." />
        <meta name="twitter:image" content="https://www.nagora.solutions/emi-hero-banner.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
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
