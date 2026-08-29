import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import { CheckCircle, ArrowRight, Zap, Target, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Column Visual */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                  alt="NAGORA Digital Agency Team"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(10, 17, 40, 0.1)',
                    objectFit: 'cover',
                    height: { xs: 320, md: 450 },
                  }}
                />

                {/* Floating Stat Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    right: -10,
                    backgroundColor: '#0A1128',
                    color: '#FFFFFF',
                    p: 3,
                    borderRadius: 4,
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    maxWidth: 240,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  <Typography variant="h3" sx={{ color: '#D4AF37', fontWeight: 800, mb: 0.5 }}>
                    100%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem' }}>
                    Dedicated digital strategy, creative production & fast development under one roof.
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#7C3AED',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  display: 'block',
                  mb: 1.5,
                }}
              >
                OUR POSITIONING
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: '#0A1128',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  lineHeight: 1.15,
                  mb: 3,
                }}
              >
                More Than a Service Provider.{' '}
                <Box component="span" sx={{ color: '#7C3AED' }}>
                  Your Digital Growth Partner.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, mb: 3 }}
              >
                NAGORA brings technology, creativity and strategy together to help businesses build a stronger digital presence. We don't just complete checklist tasks — we build scalable digital assets and creative visual content engineered to generate profit for your brand.
              </Typography>

              {/* Key Bullet Points */}
              <Stack spacing={2} sx={{ mb: 4 }}>
                {[
                  { title: 'Unified Creative & Tech Stack', desc: 'No need to coordinate separate web devs, SEO managers, and video editors.' },
                  { title: 'Focus on Profit & Conversion', desc: 'Every line of code and frame of video is built to connect with customers.' },
                  { title: 'Transparent Communication', desc: 'Simple human language without confusing corporate jargon.' },
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                    <CheckCircle size={22} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#0A1128', fontWeight: 700, fontSize: '0.98rem' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="contained"
                onClick={() => navigate('/about')}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  backgroundColor: '#0A1128',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.4,
                  '&:hover': {
                    backgroundColor: '#7C3AED',
                  },
                }}
              >
                Discover Our Story
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
