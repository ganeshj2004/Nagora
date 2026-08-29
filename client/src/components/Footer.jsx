import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Button } from '@mui/material';
import {
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Instagram,
  Linkedin,
  Facebook,
  Youtube
} from 'lucide-react';
import NagoraLogo from './NagoraLogo';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0A1128',
        color: '#FFFFFF',
        pt: { xs: 8, md: 10 },
        pb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Subtle Purple & Gold Glow background effects */}
      <Box
        sx={{
          position: 'absolute',
          top: -150,
          right: -150,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)',
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
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ mb: 8 }}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <NagoraLogo height={45} showTagline={true} lightMode={false} />
            <Typography sx={{ color: '#94A3B8', mt: 3, mb: 3, maxWidth: 320, lineHeight: 1.7 }}>
              NAGORA brings technology, creativity, and digital strategy together to help businesses build a stronger presence and grow revenue.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[
                { icon: <Instagram size={18} />, href: 'https://instagram.com' },
                { icon: <Linkedin size={18} />, href: 'https://linkedin.com' },
                { icon: <Facebook size={18} />, href: 'https://facebook.com' },
                { icon: <Youtube size={18} />, href: 'https://youtube.com' },
              ].map((social, idx) => (
                <IconButton
                  key={idx}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: '#7C3AED',
                      borderColor: '#7C3AED',
                      transform: 'translateY(-3px)'
                    },
                    transition: 'all 0.25s ease'
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2.5 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'Contact', path: '/contact' },
                { name: 'Admin Portal', path: '/admin/login' },
              ].map((link) => (
                <Typography
                  key={link.name}
                  component={Link}
                  to={link.path}
                  onClick={scrollToTop}
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#D4AF37' }
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* 7 Services Links */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2.5 }}>
              Our Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { name: 'Website Development', path: '/services/website-development' },
                { name: 'SEO & Search Growth', path: '/services/seo' },
                { name: 'App Development', path: '/services/app-development' },
                { name: 'Photography', path: '/services/photography' },
                { name: 'Videography', path: '/services/videography' },
                { name: 'Video Editing', path: '/services/video-editing' },
                { name: 'Branding & Design', path: '/services/branding' },
              ].map((service) => (
                <Typography
                  key={service.name}
                  component={Link}
                  to={service.path}
                  onClick={scrollToTop}
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#7C3AED' }
                  }}
                >
                  {service.name}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact Direct */}
          <Grid item xs={12} sm={5} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2.5 }}>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Mail size={18} color="#D4AF37" />
                <Typography sx={{ color: '#94A3B8', fontSize: '0.95rem' }}>
                  contact@nagoradigital.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone size={18} color="#D4AF37" />
                <Typography sx={{ color: '#94A3B8', fontSize: '0.95rem' }}>
                  +91 8072443590
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MessageSquare size={18} color="#25D366" />
                <Typography
                  component="a"
                  href="https://wa.me/918072443590"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ color: '#25D366', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
                >
                  Chat on WhatsApp
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <MapPin size={18} color="#D4AF37" style={{ marginTop: 3 }} />
                <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  NAGORA Digital Hub, Tech City, India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            © {new Date().getFullYear()} NAGORA Digital Agency. All rights reserved. GROWING YOUR PROFIT, TOGETHER.
          </Typography>

          <Button
            onClick={scrollToTop}
            endIcon={<ArrowUpRight size={16} />}
            sx={{
              color: '#D4AF37',
              fontSize: '0.85rem',
              '&:hover': { color: '#FFFFFF', backgroundColor: 'transparent' }
            }}
          >
            Back to top
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
