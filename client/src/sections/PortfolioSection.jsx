import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Tabs, 
  Tab, 
  Dialog, 
  DialogContent, 
  Typography, 
  IconButton, 
  Chip, 
  Button 
} from '@mui/material';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import PortfolioCard from '../components/PortfolioCard';

export const initialPortfolioItems = [
  {
    id: 1,
    title: 'Aura Luxury Real Estate Platform',
    category: 'Websites',
    description: 'Ultra-fast web platform with interactive virtual property views, high conversion landing flows, and custom CRM integration.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'MUI', 'SEO Optimized', 'Real Estate'],
    client: 'Aura Properties Ltd.',
    year: '2026',
    result: '+210% Inquiries generated in 60 days',
    fullDescription: 'Designed and engineered an exclusive luxury property discovery platform. Focused on high-speed page loads, responsive image delivery, and intuitive lead forms.',
  },
  {
    id: 2,
    title: 'Apex Fit Mobile Companion App',
    category: 'Apps',
    description: 'Cross-platform mobile application providing customized workout tracking, live trainer chats, and biometric statistics.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    tags: ['iOS & Android', 'Node.js API', 'Authentication', 'Fitness'],
    client: 'Apex Global Fitness',
    year: '2025',
    result: '4.9 Star Rating & 50,000+ Downloads',
    fullDescription: 'Full end-to-end mobile application architecture including real-time sync, push notifications, and subscription payment gateways.',
  },
  {
    id: 3,
    title: 'Kinetic E-Commerce SEO Scale',
    category: 'SEO',
    description: 'Complete technical SEO overhaul and content ranking campaign for an international fashion & lifestyle brand.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['Technical SEO', 'Keyword Strategy', 'Local SEO', 'E-Commerce'],
    client: 'Kinetic Apparel',
    year: '2026',
    result: '#1 Rank for 45 High-Intent Keywords',
    fullDescription: 'Resolved crawl errors, restructured website canonical architecture, optimized core web vitals, and implemented high-conversion structured data.',
  },
  {
    id: 4,
    title: 'Verve Commercial Product Shoot',
    category: 'Photography',
    description: 'High-end studio product photography for premium consumer electronics, highlighting metallic textures and refined details.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tags: ['Product Photography', 'Studio Lighting', 'Commercial Retouching'],
    client: 'Verve Audio Gear',
    year: '2026',
    result: 'Featured on Global E-Commerce & Print Ads',
    fullDescription: 'Shot over 150 unique high-resolution product setups with custom lighting setups tailored for digital billboards and online catalogs.',
  },
  {
    id: 5,
    title: 'Zenith Brand Cinematic Documentary Film',
    category: 'Videography',
    description: 'Captivating 4K brand story video capturing the heritage, craftsmanship, and technology behind industrial manufacturing.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    tags: ['Brand Film', '4K Cinema', 'Drone Aerials', 'Color Grading'],
    client: 'Zenith Industries',
    year: '2025',
    result: 'Over 1M Views across YouTube & Social',
    fullDescription: 'Directed, filmed, and produced a cinematic documentary film utilizing 4K cinema cameras, aerial drones, and custom sound scores.',
  },
  {
    id: 6,
    title: 'Urban Roots Social Reels Campaign',
    category: 'Editing',
    description: 'High-energy, fast-paced video editing campaign for social media platforms generating viral engagement.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    tags: ['Reels & Shorts', 'Motion Graphics', 'Sound Design'],
    client: 'Urban Roots Co.',
    year: '2026',
    result: '+450% Social Reach Growth',
    fullDescription: 'Transformed hours of raw footage into crisp, engaging short-form video reels with custom animated overlays and kinetic captions.',
  },
  {
    id: 7,
    title: 'Solstice Luxury Brand Identity',
    category: 'Branding',
    description: 'Comprehensive brand identity system including logo design, color typography, stationery, and digital guidelines.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    tags: ['Logo Design', 'Brand Strategy', 'Visual Identity', 'Guidelines'],
    client: 'Solstice Retreats',
    year: '2026',
    result: 'Complete Rebrand Launch',
    fullDescription: 'Crafted a modern luxury brand mark and comprehensive design system that communicates elegance, trust, and premium hospitality.',
  },
];

const categories = ['All', 'Websites', 'Apps', 'SEO', 'Photography', 'Videography', 'Editing', 'Branding'];

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredItems = selectedCategory === 'All'
    ? initialPortfolioItems
    : initialPortfolioItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <Box id="portfolio" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <SectionHeading
          pill="FEATURED PORTFOLIO"
          title="Work That Speaks Before We Do."
          subtitle="Take a look at what we've created for businesses seeking strong design, fast performance, and measurable growth."
        />

        {/* Category Tabs Filter */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs
            value={selectedCategory}
            onChange={(e, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#7C3AED',
                height: 3,
                borderRadius: 2,
              },
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat}
                label={cat}
                value={cat}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: selectedCategory === cat ? '#7C3AED' : '#64748B',
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Portfolio Grid */}
        <Grid container spacing={3.5}>
          {filteredItems.map((project, idx) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <PortfolioCard project={project} onSelect={setSelectedProject} index={idx} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Project Detail Modal */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' }
        }}
      >
        {selectedProject && (
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setSelectedProject(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: '#FFFFFF',
                zIndex: 10,
                '&:hover': { backgroundColor: '#7C3AED' }
              }}
            >
              <X size={20} />
            </IconButton>

            <Box
              component="img"
              src={selectedProject.image}
              alt={selectedProject.title}
              sx={{ width: '100%', height: { xs: 240, md: 360 }, objectFit: 'cover' }}
            />

            <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={selectedProject.category} color="secondary" size="small" sx={{ fontWeight: 700 }} />
                <Chip label={`Client: ${selectedProject.client}`} variant="outlined" size="small" />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0A1128', mb: 2, fontSize: '1.8rem' }}>
                {selectedProject.title}
              </Typography>

              <Box sx={{ p: 2.5, backgroundColor: 'rgba(212, 175, 55, 0.08)', borderRadius: 3, border: '1px solid rgba(212, 175, 55, 0.3)', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#B8860B', fontWeight: 800 }}>KEY OUTCOME:</Typography>
                <Typography variant="body1" sx={{ color: '#0A1128', fontWeight: 700 }}>
                  {selectedProject.result}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, mb: 3 }}>
                {selectedProject.fullDescription || selectedProject.description}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {selectedProject.tags.map((t, idx) => (
                  <Chip key={idx} label={t} sx={{ backgroundColor: '#F1F5F9', color: '#334155', fontWeight: 600 }} />
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setSelectedProject(null);
                  window.location.href = '/contact';
                }}
                endIcon={<ArrowRight size={18} />}
                sx={{ backgroundColor: '#0A1128', color: '#FFFFFF', fontWeight: 700 }}
              >
                Discuss Similar Project
              </Button>
            </DialogContent>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
