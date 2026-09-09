import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export default function PreFooterCTA() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 6,
            backgroundColor: '#0A1128',
            color: '#FFFFFF',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(10, 17, 40, 0.25)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Accents */}
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              {/* BUILD. GROW. SHOW. Brand Badge */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {[
                  { tag: 'BUILD', text: 'Websites & Apps' },
                  { tag: 'GROW', text: 'SEO & Reach' },
                  { tag: 'SHOW', text: 'Photo, Video & Brand' },
                ].map((pill, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em' }}>
                      {pill.tag}
                    </Typography>
                    {i < 2 && <Typography variant="caption" sx={{ color: '#64748B' }}>•</Typography>}
                  </Box>
                ))}
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
                  lineHeight: 1.15,
                  mb: 2,
                }}
              >
                Have an Idea? <br />
                <Box component="span" sx={{ color: '#D4AF37' }}>
                  Let's Build Something Great.
                </Box>
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ color: '#94A3B8', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 620, mb: 1 }}
              >
                Tell us what you're planning. We'll help you turn it into something your customers can see, use and remember.
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1.05rem', mt: 2 }}
              >
                “Whatever you're building, NAGORA can help you bring it to life.”
              </Typography>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  backgroundColor: '#7C3AED',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  py: 1.8,
                  px: 4,
                  fontSize: '1.05rem',
                  boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)',
                  '&:hover': {
                    backgroundColor: '#6B21A8',
                  },
                }}
              >
                LET'S BUILD TOGETHER →
              </Button>

              <Button
                variant="outlined"
                size="large"
                component="a"
                href="https://wa.me/918072443590?text=Hi%20NAGORA%20Team!%20%F0%9F%9A%80%20I'm%20interested%20in%20scaling%20my%20brand%20with%20NAGORA%20and%20exploring%20your%2050%3A50%20Flexi-Pay%20(0%25%20EMI)%20options.%20Let's%20talk!"
                target="_blank"
                rel="noreferrer"
                startIcon={<MessageSquare size={20} color="#25D366" />}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  py: 1.6,
                  px: 3,
                  '&:hover': {
                    borderColor: '#25D366',
                    backgroundColor: 'rgba(37, 211, 102, 0.1)',
                  },
                }}
              >
                Chat on WhatsApp
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
