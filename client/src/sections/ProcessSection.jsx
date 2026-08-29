import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import SectionHeading from '../components/SectionHeading';
import { motion } from 'framer-motion';

const processSteps = [
  {
    step: '01',
    title: 'DISCOVER',
    description: 'We listen to your vision, analyze your target market, and understand your business goals.',
  },
  {
    step: '02',
    title: 'PLAN',
    description: 'We define the technical architecture, content strategy, user flow, and visual moodboard.',
  },
  {
    step: '03',
    title: 'CREATE',
    description: 'High-speed web/app coding, SEO setup, photoshoot production, video filming, or brand crafting begins.',
  },
  {
    step: '04',
    title: 'REFINE',
    description: 'Rigorous speed testing, multi-device QA, color correction, copy review, and fine-tuning.',
  },
  {
    step: '05',
    title: 'LAUNCH',
    description: 'Your digital platform or creative campaign goes live seamlessly with zero downtime.',
  },
  {
    step: '06',
    title: 'GROW',
    description: 'Continuous SEO performance tracking, content upgrades, and technical optimization to multiply profit.',
  },
];

export default function ProcessSection() {
  return (
    <Box id="process" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <SectionHeading
          pill="HOW WE WORK"
          title="From First Idea to Final Launch."
          subtitle="A disciplined 6-step agency workflow designed to deliver flawless quality on schedule."
        />

        <Grid container spacing={3}>
          {processSteps.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={item.step}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                  p: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px -10px rgba(124, 58, 237, 0.1)',
                    '& .process-step-num': {
                      color: '#7C3AED',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      className="process-step-num"
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 800,
                        fontSize: '2rem',
                        color: '#D4AF37',
                        lineHeight: 1,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {item.step}
                    </Typography>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#7C3AED',
                      }}
                    />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1128', mb: 1.5, fontSize: '1.2rem', letterSpacing: '0.05em' }}>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
