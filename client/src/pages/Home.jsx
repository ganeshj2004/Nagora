import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import HeroSection from '../sections/HeroSection';
import ImpactSection from '../sections/ImpactSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import EmiCalculatorSection from '../sections/EmiCalculatorSection';
import PortfolioSection from '../sections/PortfolioSection';
import ShowreelSection from '../sections/ShowreelSection';
import WhyUsSection from '../sections/WhyUsSection';
import ProcessSection from '../sections/ProcessSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import PreFooterCTA from '../sections/PreFooterCTA';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'NAGORA Digital Agency',
    'url': 'https://www.nagora.solutions/',
    'logo': 'https://www.nagora.solutions/logo.png',
    'description': 'NAGORA Digital Agency provides website development, mobile app development, SEO, photography, video and digital solutions for growing businesses.',
    'email': 'contact.nagora26@gmail.com',
    'telephone': '+91 8072443590',
    'sameAs': [
      'https://www.instagram.com/nagora.digital?stkn=M2lmOHJiMHI3OHAz'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'NAGORA Digital Agency',
    'url': 'https://www.nagora.solutions/'
  };

  return (
    <Box>
      <Helmet>
        <title>NAGORA Digital Agency | Website & App Development</title>
        <meta name="description" content="NAGORA Digital Agency provides website development, mobile app development, SEO, photography, video and digital solutions for growing businesses." />
        <link rel="canonical" href="https://www.nagora.solutions/" />

        {/* Open Graph */}
        <meta property="og:title" content="NAGORA Digital Agency | Website & App Development" />
        <meta property="og:description" content="NAGORA Digital Agency provides website development, mobile app development, SEO, photography, video and digital solutions for growing businesses." />
        <meta property="og:url" content="https://www.nagora.solutions/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.nagora.solutions/emi-hero-banner.png" />
        <meta property="og:site_name" content="NAGORA Digital Agency" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NAGORA Digital Agency | Website & App Development" />
        <meta name="twitter:description" content="NAGORA Digital Agency provides website development, mobile app development, SEO, photography, video and digital solutions for growing businesses." />
        <meta name="twitter:image" content="https://www.nagora.solutions/emi-hero-banner.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      <HeroSection />
      <ImpactSection />
      <AboutSection />
      <ServicesSection />
      <EmiCalculatorSection />
      <PortfolioSection />
      <ShowreelSection />
      <WhyUsSection />
      <ProcessSection />
      <TestimonialsSection />
      <PreFooterCTA />
    </Box>
  );
}
