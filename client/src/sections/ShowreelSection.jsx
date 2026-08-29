import React, { useState } from 'react';
import { Box, Container, Typography, Button, CardMedia } from '@mui/material';
import { Play } from 'lucide-react';
import ShowreelModal from '../components/ShowreelModal';

export default function ShowreelSection() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0A1128', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: '0.15em' }}>
            CREATIVE PRODUCTION
          </Typography>
          <Typography variant="h2" sx={{ color: '#FFFFFF', fontWeight: 800, mt: 1, mb: 2 }}>
            See NAGORA in Motion.
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto' }}>
            Watch a quick montage of our high-end videography, commercial photography, website animations, and brand film productions.
          </Typography>
        </Box>

        {/* Poster Card Container */}
        <Box
          sx={{
            position: 'relative',
            maxWidth: 960,
            mx: 'auto',
            borderRadius: 5,
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            cursor: 'pointer',
            '&:hover .play-btn': {
              transform: 'scale(1.15)',
              backgroundColor: '#7C3AED',
            },
            '&:hover .showreel-poster': {
              transform: 'scale(1.03)',
            },
          }}
          onClick={() => setOpenModal(true)}
        >
          {/* Lightweight Video Poster Image */}
          <CardMedia
            component="img"
            image="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
            alt="NAGORA Showreel Poster"
            className="showreel-poster"
            sx={{
              height: { xs: 260, sm: 380, md: 480 },
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
            }}
          />

          {/* Dark Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(10, 17, 40, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {/* Play Button Icon */}
            <Box
              className="play-btn"
              sx={{
                width: { xs: 64, md: 84 },
                height: { xs: 64, md: 84 },
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: '#0A1128',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pl: 0.5,
              }}
            >
              <Play size={36} fill="#0A1128" />
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Watch Showreel →
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Video Player Modal */}
      <ShowreelModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
}
