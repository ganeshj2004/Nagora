import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { Code, Search, Smartphone, Camera, Video, Film, Palette } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';

export const servicesData = [
  {
    number: '01',
    title: 'Website Development',
    heading: 'Your Business Deserves More Than Just a Website.',
    description: 'We build fast, modern and responsive websites designed to make a strong first impression and turn visitors into customers.',
    features: [
      'Business Websites',
      'E-commerce Solutions',
      'Landing Pages',
      'Custom Web Applications',
      'Responsive Mobile Layouts',
      'SEO-ready architecture',
      'Performance optimization',
    ],
    ctaText: 'Build My Website →',
    slug: 'website-development',
    icon: Code,
  },
  {
    number: '02',
    title: 'SEO & Search Growth',
    heading: 'Be Seen Where Your Customers Are Searching.',
    description: 'We help your business improve its online visibility and reach the people actively looking for your products or services.',
    features: [
      'Technical SEO Audits',
      'On-page SEO Optimization',
      'Targeted Keyword Research',
      'Local Business SEO',
      'Content & Copy Optimization',
      'Performance & Speed Fixes',
      'Transparent Monthly Reporting',
    ],
    ctaText: 'Grow My Visibility →',
    slug: 'seo',
    icon: Search,
  },
  {
    number: '03',
    title: 'App Development',
    heading: 'From Your Idea to an App People Love to Use.',
    description: 'We create intuitive, reliable applications designed around your customers and business goals.',
    features: [
      'iOS & Android Applications',
      'Customer-facing Apps',
      'Custom Business Tools',
      'REST API Integration',
      'Secure User Authentication',
      'Admin Control Panels',
      'Scalable Cloud Backend',
    ],
    ctaText: 'Build My App →',
    slug: 'app-development',
    icon: Smartphone,
  },
  {
    number: '04',
    title: 'Photography',
    heading: 'Make Your Brand Look as Good as It Really Is.',
    description: 'Professional photography that captures your products, people, events and brand with clarity and personality.',
    features: [
      'Commercial Product Photography',
      'Brand & Corporate Portraits',
      'Event & Conference Coverage',
      'Wedding Photography',
      'Social Media Visual Assets',
      'High-resolution Retouching',
    ],
    ctaText: 'Book a Shoot →',
    slug: 'photography',
    icon: Camera,
  },
  {
    number: '05',
    title: 'Videography',
    heading: 'Don\'t Just Show Your Story. Make People Feel It.',
    description: 'Professional video production designed to capture attention and communicate your story.',
    features: [
      'Cinematic Brand Films',
      'Commercial Promotional Videos',
      'Full Event Coverage',
      'Wedding & Ceremony Films',
      'Product Feature Videos',
      'High-impact Social Media Reels',
    ],
    ctaText: 'Plan My Video →',
    slug: 'videography',
    icon: Video,
  },
  {
    number: '06',
    title: 'Video Editing',
    heading: 'Turn Raw Footage Into Something Worth Watching.',
    description: 'We transform your footage into polished, engaging videos built for your audience and platform.',
    features: [
      'Instagram Reels & TikTok Shorts',
      'YouTube Long-form Content',
      'Promotional Ad Edits',
      'Wedding Feature Highlights',
      'Corporate & Interview Cuts',
      'Color Grading & Sound Design',
    ],
    ctaText: 'Edit My Video →',
    slug: 'video-editing',
    icon: Film,
  },
  {
    number: '07',
    title: 'Branding',
    heading: 'Build a Brand People Remember.',
    description: 'We create consistent visual identities that help your business look professional, recognizable and trustworthy.',
    features: [
      'Custom Logo Design',
      'Complete Brand Identity',
      'Social Media Templates',
      'Print & Marketing Materials',
      'Brand Strategy & Guidelines',
      'Typography & Color Palette',
    ],
    ctaText: 'Build My Brand →',
    slug: 'branding',
    icon: Palette,
  },
];

export default function ServicesSection() {
  return (
    <Box id="services" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg">
        <SectionHeading
          pill="OUR SERVICES"
          title="Everything You Need to Build, Grow & Stand Out."
          subtitle="From websites and apps to search growth and cinematic visual production, NAGORA provides end-to-end creative and technology solutions."
        />

        <Grid container spacing={3.5}>
          {servicesData.map((service, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={index === 0 ? 12 : index < 3 ? 6 : 4} 
              key={service.slug}
            >
              <ServiceCard
                number={service.number}
                title={service.title}
                heading={service.heading}
                description={service.description}
                features={service.features}
                ctaText={service.ctaText}
                slug={service.slug}
                icon={service.icon}
                delay={index}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
