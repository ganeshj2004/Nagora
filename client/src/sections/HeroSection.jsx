import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Chip } from '@mui/material';
import { ArrowRight, Sparkles, Code, Smartphone, Camera, Video, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'relative',
        pt: { xs: 6, md: 10 },
        pb: { xs: 8, md: 14 },
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Ambient Radial Gradients */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 500,
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, rgba(212, 175, 55, 0.04) 50%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Column: Headlines & Call to Actions */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Chip
                icon={<Sparkles size={14} color="#7C3AED" />}
                label="GROWING YOUR PROFIT, TOGETHER"
                size="small"
                sx={{
                  backgroundColor: 'rgba(124, 58, 237, 0.08)',
                  color: '#7C3AED',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  mb: 3,
                  px: 1,
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: '#0A1128',
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.4rem', md: '4.2rem' },
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                }}
              >
                BUILD YOUR BRAND.{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#7C3AED', 
                    position: 'relative',
                    display: 'inline-block' 
                  }}
                >
                  GROW
                </Box>{' '}
                YOUR BUSINESS. STAND OUT.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#475569',
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  lineHeight: 1.65,
                  mb: 4,
                  maxWidth: 600,
                }}
              >
                From websites and apps to SEO, photography and video — we create digital experiences that help businesses get noticed, connect with customers and grow profit.
              </Typography>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/contact')}
                  endIcon={<ArrowRight size={20} />}
                  sx={{
                    backgroundColor: '#0A1128',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    px: 4,
                    py: 1.6,
                    fontSize: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(10, 17, 40, 0.3)',
                    '&:hover': {
                      backgroundColor: '#7C3AED',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Start Your Project
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/portfolio')}
                  sx={{
                    borderColor: '#CBD5E1',
                    color: '#0A1128',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.6,
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: '#7C3AED',
                      backgroundColor: 'rgba(124, 58, 237, 0.04)',
                    },
                  }}
                >
                  Explore Our Work
                </Button>
              </Box>
            </motion.div>

            {/* Micro Tags */}
            <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 3, opacity: 0.85 }}>
              {[
                { label: 'Web & Mobile', icon: <Code size={16} color="#7C3AED" /> },
                { label: 'SEO Visibility', icon: <Smartphone size={16} color="#D4AF37" /> },
                { label: 'Photo & Film', icon: <Camera size={16} color="#7C3AED" /> },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right Column: Creative Multi-Device Mockup Showcase Graphic */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 360, sm: 440, md: 480 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Main Laptop/Browser UI Card Mockup */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '8%',
                    left: '5%',
                    right: '5%',
                    height: '75%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 4,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 25px 60px -15px rgba(10, 17, 40, 0.12)',
                    overflow: 'hidden',
                    zIndex: 2,
                  }}
                >
                  {/* Browser Bar */}
                  <Box sx={{ backgroundColor: '#F8FAFC', py: 1, px: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <Typography variant="caption" sx={{ color: '#94A3B8', ml: 1, fontSize: '0.7rem' }}>
                      nagoradigital.com
                    </Typography>
                  </Box>

                  {/* Mockup Inside Visual */}
                  <Box sx={{ p: 3, height: 'calc(100% - 32px)', display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#FAFAFA' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ width: 80, height: 12, borderRadius: 2, backgroundColor: '#0A1128' }} />
                      <Box sx={{ width: 60, height: 10, borderRadius: 2, backgroundColor: '#7C3AED' }} />
                    </Box>

                    <Box sx={{ mt: 1, p: 2, borderRadius: 3, backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                      <Box sx={{ width: '70%', height: 14, borderRadius: 2, backgroundColor: '#0A1128', mb: 1 }} />
                      <Box sx={{ width: '90%', height: 10, borderRadius: 2, backgroundColor: '#94A3B8', mb: 2 }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ width: 40, height: 20, borderRadius: 10, backgroundColor: '#7C3AED' }} />
                        <Box sx={{ width: 40, height: 20, borderRadius: 10, backgroundColor: '#D4AF37' }} />
                      </Box>
                    </Box>

                    {/* Analytics Chart Mock */}
                    <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#0A1128', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 700 }}>+340% GROWTH</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Revenue & Conversion</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 28 }}>
                        <Box sx={{ width: 6, height: 12, backgroundColor: '#7C3AED', borderRadius: 1 }} />
                        <Box sx={{ width: 6, height: 18, backgroundColor: '#7C3AED', borderRadius: 1 }} />
                        <Box sx={{ width: 6, height: 24, backgroundColor: '#D4AF37', borderRadius: 1 }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Floating Mobile Phone Mockup Overlay */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '2%',
                    width: 140,
                    height: 250,
                    backgroundColor: '#0A1128',
                    borderRadius: 24,
                    padding: 8,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                    zIndex: 3,
                    border: '2px solid rgba(212, 175, 55, 0.4)',
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%', borderRadius: 18, backgroundColor: '#FFFFFF', overflow: 'hidden', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ width: 30, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, mx: 'auto', mb: 1 }} />
                    <Box sx={{ width: '100%', height: 60, borderRadius: 2, backgroundColor: '#7C3AED' }} />
                    <Box sx={{ width: '80%', height: 8, backgroundColor: '#0A1128', borderRadius: 1 }} />
                    <Box sx={{ width: '60%', height: 6, backgroundColor: '#94A3B8', borderRadius: 1 }} />
                    <Box sx={{ mt: 'auto', p: 1, backgroundColor: '#F8FAFC', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#D4AF37', fontSize: '0.65rem' }}>NAGORA APP</Typography>
                    </Box>
                  </Box>
                </motion.div>

                {/* Floating Creative Lens / Camera Tag Overlay */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{
                    position: 'absolute',
                    top: '2%',
                    left: '0%',
                    padding: '10px 18px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 30,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    zIndex: 4,
                  }}
                >
                  <Camera size={18} color="#7C3AED" />
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0A1128' }}>
                    4K Photo & Video Studio
                  </Typography>
                </motion.div>

              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
