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

  return (
    <Box>
      <Helmet>
        <title>NAGORA Digital Agency — Growing Your Profit, Together</title>
        <meta name="description" content="NAGORA is a digital & creative service agency providing Website Development, SEO, App Development, Photography, Videography, Video Editing, and Branding." />
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
