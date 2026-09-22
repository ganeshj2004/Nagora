import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashPreloader({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: init, 1: logo bloom, 2: text reveal, 3: exit zoom
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if intro has already played in this browser session
    const hasPlayed = sessionStorage.getItem('nagora_intro_played');
    if (hasPlayed) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Sequence timelines (Hotstar / Netflix style timing)
    const timer1 = setTimeout(() => setStage(1), 200);   // Logo scale-in & glow
    const timer2 = setTimeout(() => setStage(2), 1000);  // Text & tagline reveal
    const timer3 = setTimeout(() => setStage(3), 2200);  // Cinematic portal zoom exit
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('nagora_intro_played', 'true');
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          component={motion.div}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#040711',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          {/* Ambient Pulsing Radial Aura */}
          <Box
            component={motion.div}
            animate={{
              scale: [1, 1.35, 1.1],
              opacity: [0.3, 0.75, 0.4],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            sx={{
              position: 'absolute',
              width: { xs: '320px', md: '550px' },
              height: { xs: '320px', md: '550px' },
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(212, 175, 55, 0.25) 45%, rgba(4, 7, 17, 0) 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          {/* Shimmer Light Rays / Horizontal Flare */}
          <Box
            component={motion.div}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: stage >= 1 ? [0, 1.4, 1] : 0,
              opacity: stage >= 1 ? [0, 0.8, 0.4] : 0,
            }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.9) 35%, #7C3AED 50%, rgba(212, 175, 55, 0.9) 65%, transparent 100%)',
              boxShadow: '0 0 25px 4px rgba(124, 58, 237, 0.8)',
              pointerEvents: 'none',
            }}
          />

          {/* Main Logo Container with Hotstar Cinematic Zoom */}
          <Box
            component={motion.div}
            initial={{ scale: 0.3, opacity: 0, filter: 'blur(20px)' }}
            animate={
              stage === 3
                ? { scale: 3.2, opacity: 0, filter: 'blur(25px)' }
                : stage >= 1
                ? { scale: 1, opacity: 1, filter: 'blur(0px)' }
                : {}
            }
            transition={
              stage === 3
                ? { duration: 0.65, ease: [0.7, 0, 0.84, 0] }
                : { duration: 0.9, cubicBezier: [0.16, 1, 0.3, 1] }
            }
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              px: 3,
            }}
          >
            {/* Logo Emblem Image with Golden/Purple Drop Shadow Glow */}
            <Box
              component={motion.div}
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.3))',
                  'drop-shadow(0 0 35px rgba(124, 58, 237, 0.95)) drop-shadow(0 0 65px rgba(212, 175, 55, 0.6))',
                  'drop-shadow(0 0 20px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 40px rgba(212, 175, 55, 0.3))',
                ],
              }}
              transition={{ duration: 2.0, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              sx={{
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="NAGORA Logo"
                sx={{
                  height: { xs: 80, sm: 110, md: 140 },
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>

            {/* NAGORA Brand Title — Shimmering Gradient Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Cinzel", "Plus Jakarta Sans", serif',
                  fontWeight: 900,
                  fontSize: { xs: '2.2rem', sm: '3.4rem', md: '4.2rem' },
                  letterSpacing: { xs: '0.18em', md: '0.24em' },
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #D4AF37 45%, #A78BFA 80%, #FFFFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(124, 58, 237, 0.5)',
                  lineHeight: 1.1,
                }}
              >
                NAGORA
              </Typography>
            </motion.div>

            {/* Subtitle / Tagline Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0.95 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.8 }}>
                <Box
                  sx={{
                    height: '1px',
                    width: { xs: 30, sm: 60, md: 90 },
                    background: 'linear-gradient(90deg, transparent, #D4AF37)',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '0.68rem', sm: '0.85rem', md: '0.98rem' },
                    letterSpacing: { xs: '0.2em', md: '0.28em' },
                    color: '#D4AF37',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  GROWING YOUR PROFIT, TOGETHER
                </Typography>
                <Box
                  sx={{
                    height: '1px',
                    width: { xs: 30, sm: 60, md: 90 },
                    background: 'linear-gradient(90deg, #D4AF37, transparent)',
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}
