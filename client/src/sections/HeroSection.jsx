import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Chip, Stack } from '@mui/material';
import { ArrowRight, Sparkles, Code, Smartphone, Camera, Zap, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const navigate = useNavigate();

  // 3D Tilt interactive state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt range +- 16 deg
    const rY = ((x - centerX) / centerX) * 16;
    const rX = -((y - centerY) / centerY) * 16;

    setRotateX(rX);
    setRotateY(rY);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlowPos({ x: 50, y: 50 });
  };

  const scrollToEmi = () => {
    const el = document.getElementById('emi-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/payment');
    }
  };

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
              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1 }}>
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
                    px: 1,
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                />
                {/* <Chip
                  label="✨ PAY HALF NOW • PAY HALF LATER"
                  size="small"
                  onClick={scrollToEmi}
                  sx={{
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    color: '#B8860B',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    px: 1,
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.22)',
                    }
                  }}
                /> */}
              </Stack>
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

          {/* Right Column: Interactive 3D EMI Offer Banner Poster */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ width: '100%' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  perspective: '1200px', // True 3D depth context
                  py: 3,
                }}
              >
                {/* Dynamic Ambient Neon Glow Orbs behind the 3D card */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '5%',
                    left: '5%',
                    width: '90%',
                    height: '90%',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(212, 175, 55, 0.35) 50%, transparent 75%)',
                    filter: 'blur(45px)',
                    opacity: isHovered ? 0.95 : 0.65,
                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.5s ease-out',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />

                {/* 3D Tilt Card Wrapper */}
                <motion.div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={scrollToEmi}
                  animate={isHovered ? {} : { y: [-8, 8, -8] }}
                  transition={isHovered ? {} : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 440,
                    borderRadius: 24,
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
                    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                    boxShadow: isHovered
                      ? '0 30px 60px -12px rgba(124, 58, 237, 0.45), 0 20px 40px -15px rgba(212, 175, 55, 0.5), 0 0 0 2px rgba(212, 175, 55, 0.8)'
                      : '0 20px 45px -15px rgba(10, 17, 40, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                    zIndex: 1,
                  }}
                >
                  {/* Glowing 3D Glass Border & Container */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      borderRadius: 6,
                      overflow: 'hidden',
                      backgroundColor: '#0A1128',
                      border: '2.5px solid rgba(212, 175, 55, 0.6)',
                      backgroundClip: 'padding-box',
                    }}
                  >
                    {/* The 2nd Image: Pay 50% Upfront, 0% EMI Banner Poster */}
                    <Box
                      component="img"
                      src="/emi-hero-banner.png"
                      alt="Nagora Pay 50% Upfront 0% EMI Payment Plan"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                        filter: isHovered ? 'brightness(1.05) contrast(1.02)' : 'brightness(1)',
                        transition: 'filter 0.3s ease',
                      }}
                    />

                    {/* Dynamic Holographic Light Reflection Overlay on Mouse Hover */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 75%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Dynamic Shimmer Light Flare Bar */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '60%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                        transform: 'skewX(-20deg)',
                        animation: 'shimmer 4s infinite',
                        '@keyframes shimmer': {
                          '0%': { left: '-100%' },
                          '30%': { left: '200%' },
                          '100%': { left: '200%' },
                        },
                        pointerEvents: 'none',
                      }}
                    />
                  </Box>

                  {/* 3D Floating Pop-out Badge 1: Top Right */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      right: '-12px',
                      transform: 'translateZ(50px)',
                      zIndex: 10,
                    }}
                  >
                    <Chip
                      icon={<Zap size={14} color="#FFD700" />}
                      label="0% EMI FLEXIBLE PLAN"
                      sx={{
                        backgroundColor: '#0A1128',
                        color: '#FFD700',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                        px: 1.5,
                        py: 2.2,
                        borderRadius: 30,
                        border: '2px solid #FFD700',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(255, 215, 0, 0.4)',
                      }}
                    />
                  </motion.div>

                  {/* 3D Floating Pop-out Badge 2: Bottom Left */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    style={{
                      position: 'absolute',
                      bottom: '-16px',
                      left: '-12px',
                      transform: 'translateZ(40px)',
                      zIndex: 10,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'rgba(124, 58, 237, 0.95)',
                        backdropFilter: 'blur(10px)',
                        color: '#FFFFFF',
                        px: 2,
                        py: 1,
                        borderRadius: 30,
                        border: '1.5px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: '0 12px 30px rgba(124, 58, 237, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <CreditCard size={16} color="#FFFFFF" />
                      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                        ✨ PAY 50% UPFRONT • EASY BALANCE
                      </Typography>
                    </Box>
                  </motion.div>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

