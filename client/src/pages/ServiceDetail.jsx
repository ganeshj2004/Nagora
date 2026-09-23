import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight, 
  Code, 
  Search, 
  Smartphone, 
  Camera, 
  Video, 
  Film, 
  Palette 
} from 'lucide-react';
import PreFooterCTA from '../sections/PreFooterCTA';

const serviceDetailsMap = {
  'website-development': {
    title: 'Website Development',
    heroTagline: 'Your Business Deserves More Than Just a Website.',
    subtitle: 'We build fast, modern and responsive websites designed to make a strong first impression and turn visitors into paying customers.',
    icon: Code,
    problem: 'Many businesses waste money on sluggish, outdated websites built on heavy templates that take forever to load and fail to convert visitors into inquiries.',
    solution: 'NAGORA engineers custom, clean React websites with lightning-fast load times, responsive mobile layouts, SEO-ready structure, and conversion-focused UX.',
    features: [
      'Custom Corporate & Business Websites',
      'High-conversion E-commerce Platforms',
      'Lead Generation Landing Pages',
      'Custom Web Applications & Admin Panels',
      '100% Mobile Responsive Layouts',
      'Technical SEO & Core Web Vitals Optimization',
    ],
    faqs: [
      { q: 'How long does a website project take?', a: 'Standard business websites take 2 to 4 weeks, while complex web applications take 4 to 8 weeks depending on features.' },
      { q: 'Will my website work well on mobile phones?', a: 'Yes! We design mobile-first so your website looks and works flawlessly on iPhones, Android devices, tablets, and desktops.' },
      { q: 'Can NAGORA manage website hosting and maintenance?', a: 'Absolutely. We offer complete cloud hosting, security monitoring, and regular maintenance packages.' },
    ],
    ctaText: 'Build My Website →',
  },
  'seo': {
    title: 'SEO & Search Growth',
    heroTagline: 'Be Seen Where Your Customers Are Searching.',
    subtitle: 'We help your business improve its online visibility and reach the people actively looking for your products or services on Google.',
    icon: Search,
    problem: 'Without proper SEO, your website remains hidden on page 5 of search results while your competitors take all the valuable traffic and customer leads.',
    solution: 'We conduct comprehensive technical audits, optimize on-page signals, target high-value search keywords, and build organic authority that drives recurring sales.',
    features: [
      'Technical SEO Audits & Core Web Vitals Fixes',
      'On-Page Optimization & Meta Architecture',
      'High-Intent Keyword & Competitor Research',
      'Google My Business & Local SEO Optimization',
      'Content Optimization & Copy Editing',
      'Transparent Monthly Analytics & Ranking Reports',
    ],
    faqs: [
      { q: 'How soon will I see SEO results?', a: 'Initial technical improvements reflect within 3 to 6 weeks, with significant keyword movement typically occurring between months 3 and 6.' },
      { q: 'Do you use safe, white-hat SEO techniques?', a: 'Always. We adhere 100% to Google Webmaster Guidelines to build sustainable, long-term search rankings.' },
    ],
    ctaText: 'Grow My Visibility →',
  },
  'app-development': {
    title: 'App Development',
    heroTagline: 'From Your Idea to an App People Love to Use.',
    subtitle: 'We create intuitive, reliable applications designed around your customers and business goals.',
    icon: Smartphone,
    problem: 'Clunky, slow mobile apps frustrate users and result in high uninstall rates and negative brand reviews.',
    solution: 'NAGORA crafts native and cross-platform mobile apps with smooth navigation, secure user authentication, fast APIs, and scalable cloud databases.',
    features: [
      'iOS & Android Mobile Applications',
      'Custom Customer Loyalty & Service Apps',
      'B2B Enterprise Mobile Software',
      'Secure REST API & Microservice Integration',
      'User Authentication & Push Notifications',
      'Admin Control Panels & Analytics Dashboards',
    ],
    faqs: [
      { q: 'Do you build for both iPhone and Android?', a: 'Yes, we specialize in cross-platform development so your app launches simultaneously on both the Apple App Store and Google Play Store.' },
      { q: 'Can you help deploy the app to app stores?', a: 'Yes! We handle the entire submission, review, and app store compliance process.' },
    ],
    ctaText: 'Build My App →',
  },
  'photography': {
    title: 'Photography',
    heroTagline: 'Make Your Brand Look as Good as It Really Is.',
    subtitle: 'Professional photography that captures your products, people, events and brand with clarity and personality.',
    icon: Camera,
    problem: 'Poor quality or stock photography instantly lowers brand credibility and makes your products look cheap.',
    solution: 'Our studio camera crew shoots crisp, color-graded commercial product photos, executive portraits, and lifestyle imagery tailored for web and print.',
    features: [
      'E-commerce Product Photography',
      'Brand & Executive Headshots',
      'Corporate Event & Conference Coverage',
      'Wedding & Celebration Photography',
      'Social Media Visual Content Packs',
      'Professional Color Retouching',
    ],
    faqs: [
      { q: 'Where do the shoots take place?', a: 'We can shoot at your office location, on-site event venues, or in our professional lighting studio.' },
      { q: 'How quickly do we receive edited photos?', a: 'High-resolution retouched digital files are typically delivered within 5 to 7 business days.' },
    ],
    ctaText: 'Book a Shoot →',
  },
  'videography': {
    title: 'Videography',
    heroTagline: 'Don\'t Just Show Your Story. Make People Feel It.',
    subtitle: 'Professional 4K video production designed to capture attention and communicate your story.',
    icon: Video,
    problem: 'Generic video footage fails to hold audience attention in a fast-scrolling digital world.',
    solution: 'NAGORA produces cinematic 4K brand films, commercial promotional videos, and aerial drone footage designed to inspire trust and emotion.',
    features: [
      'Cinematic Brand Story Films',
      'Commercial Product Launch Videos',
      'Full Multi-Camera Event Coverage',
      'Wedding & Ceremony Films',
      'Customer Testimonial & Interview Videos',
      'Social Media Video Ads',
    ],
    faqs: [
      { q: 'Do you provide scriptwriting and storyboarding?', a: 'Yes! We guide the entire pre-production phase, including concept script, storyboard, location scouting, and voiceover.' },
    ],
    ctaText: 'Plan My Video →',
  },
  'video-editing': {
    title: 'Video Editing',
    heroTagline: 'Turn Raw Footage Into Something Worth Watching.',
    subtitle: 'We transform your footage into polished, engaging videos built for your audience and platform.',
    icon: Film,
    problem: 'Having hours of raw video footage is useless if it isn\'t edited with tight pacing, engaging captions, and visual polish.',
    solution: 'Our post-production team edits raw video into captivating Instagram Reels, YouTube videos, wedding highlight films, and promo edits.',
    features: [
      'Instagram Reels, TikTok & Shorts Edits',
      'YouTube Long-form Content Editing',
      'Wedding Feature Highlights & Teasers',
      'Commercial & Ad Video Post-Production',
      'Kinetic Subtitles & Motion Graphics',
      'Color Grading & Professional Audio Mixing',
    ],
    faqs: [
      { q: 'Can I send raw footage online?', a: 'Yes! You can upload footage directly to Google Drive, Dropbox, or Frame.io for editing.' },
    ],
    ctaText: 'Edit My Video →',
  },
  'branding': {
    title: 'Branding & Design',
    heroTagline: 'Build a Brand People Remember.',
    subtitle: 'We create consistent visual identities that help your business look professional, recognizable and trustworthy.',
    icon: Palette,
    problem: 'Inconsistent logos, weak visual colors, and amateur marketing materials hurt customer trust before they even try your service.',
    solution: 'We craft comprehensive brand guidelines, custom vector logo marks, color schemes, typography rules, and marketing collateral.',
    features: [
      'Custom Vector Logo Design',
      'Brand Identity Guidelines System',
      'Social Media Graphic Templates',
      'Business Cards & Print Marketing Assets',
      'Brand Strategy & Positioning',
      'Typography & Color Palette Curation',
    ],
    faqs: [
      { q: 'What files are provided upon branding completion?', a: 'You receive full ownership of vector source files (AI, EPS, SVG, PNG, PDF) along with a detailed Brand Style Guide PDF.' },
    ],
    ctaText: 'Build My Brand →',
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activeSlug = slug && serviceDetailsMap[slug] ? slug : 'website-development';
  const details = serviceDetailsMap[activeSlug];
  const IconComponent = details.icon;
  const canonicalUrl = `https://www.nagora.solutions/services/${activeSlug}`;
  const pageTitle = `${details.title} | NAGORA Digital Agency`;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': details.title,
    'description': details.subtitle,
    'provider': {
      '@type': 'Organization',
      'name': 'NAGORA Digital Agency',
      'url': 'https://www.nagora.solutions/',
      'logo': 'https://www.nagora.solutions/logo.png'
    },
    'url': canonicalUrl
  };

  return (
    <Box>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={details.subtitle} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={details.subtitle} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.nagora.solutions/emi-hero-banner.png" />
        <meta property="og:site_name" content="NAGORA Digital Agency" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={details.subtitle} />
        <meta name="twitter:image" content="https://www.nagora.solutions/emi-hero-banner.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0A1128', color: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label={details.title}
                size="small"
                sx={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', fontWeight: 800, mb: 2 }}
              />
              <Typography variant="h1" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                {details.heroTagline}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#94A3B8', fontSize: '1.15rem', maxWidth: 680, mb: 4 }}>
                {details.subtitle}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/contact')}
                endIcon={<ArrowRight size={18} />}
                sx={{ backgroundColor: '#7C3AED', color: '#FFFFFF', fontWeight: 800, py: 1.5, px: 4 }}
              >
                {details.ctaText}
              </Button>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: 6,
                  backgroundColor: 'rgba(124, 58, 237, 0.15)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                }}
              >
                <IconComponent size={64} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Problem & Solution Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid #F1F5F9', backgroundColor: '#FFF5F5' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#DC2626', mb: 2 }}>
                  The Challenge Most Businesses Face
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  {details.problem}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(124, 58, 237, 0.2)', backgroundColor: 'rgba(124, 58, 237, 0.04)' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#7C3AED', mb: 2 }}>
                  The NAGORA Solution
                </Typography>
                <Typography variant="body1" sx={{ color: '#0A1128', lineHeight: 1.7 }}>
                  {details.solution}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features List */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ textAlign: 'center', fontWeight: 800, color: '#0A1128', mb: 6 }}>
            What's Included in {details.title}
          </Typography>

          <Grid container spacing={3}>
            {details.features.map((feat, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle2 size={24} color="#7C3AED" style={{ flexShrink: 0 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0A1128', fontSize: '1rem' }}>
                    {feat}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQs */}
      {details.faqs && details.faqs.length > 0 && (
        <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
          <Container maxWidth="md">
            <Typography variant="h2" sx={{ textAlign: 'center', fontWeight: 800, color: '#0A1128', mb: 5 }}>
              Frequently Asked Questions
            </Typography>

            {details.faqs.map((faq, i) => (
              <Accordion key={i} sx={{ mb: 2, borderRadius: 3, '&:before': { display: 'none' }, border: '1px solid #E2E8F0' }}>
                <AccordionSummary expandIcon={<ChevronDown color="#7C3AED" />}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0A1128' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.6 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </Box>
      )}

      <PreFooterCTA />
    </Box>
  );
}
