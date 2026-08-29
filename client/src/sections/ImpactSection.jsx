import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { ShieldCheck, TrendingUp, Cpu, Award } from 'lucide-react';

const impactPillars = [
  {
    title: 'Ideas',
    description: 'Strategic vision tailored to your target audience & market goals.',
    icon: <ShieldCheck size={26} color="#7C3AED" />,
  },
  {
    title: 'Creativity',
    description: 'High-end design, brand identity, photo & cinematic video production.',
    icon: <Award size={26} color="#D4AF37" />,
  },
  {
    title: 'Technology',
    description: 'Fast, secure, scalable websites, custom web apps & mobile software.',
    icon: <Cpu size={26} color="#7C3AED" />,
  },
  {
    title: 'Results',
    description: 'Data-driven SEO growth, higher traffic, higher lead conversion.',
    icon: <TrendingUp size={26} color="#D4AF37" />,
  },
];

export default function ImpactSection() {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 6 },
        backgroundColor: '#F8FAFC',
        borderTop: '1px solid #F1F5F9',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {impactPillars.map((pillar, idx) => (
            <Grid item xs={12} sm={6} md={3} key={pillar.title}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 20px -5px rgba(10, 17, 40, 0.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: 'rgba(124, 58, 237, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {pillar.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128', mb: 0.5, fontSize: '1.1rem' }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {pillar.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
