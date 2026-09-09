import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Box, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useScrollTrigger
} from '@mui/material';
import { Menu as MenuIcon, X as CloseIcon, ArrowRight, PhoneCall } from 'lucide-react';
import NagoraLogo from './NagoraLogo';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: '0% EMI', path: '/#emi-calculator' },
  { label: 'About', path: '/about' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Process', path: '/#process' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path) => {
    setMobileOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: elementId } });
      } else {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 3 : 0}
      sx={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid #F1F5F9' : '1px solid transparent',
        transition: 'all 0.3s ease',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: { xs: 70, md: 80 } }}>
          {/* Logo */}
          <Box onClick={() => handleNavClick('/')} sx={{ cursor: 'pointer' }}>
            <NagoraLogo height={42} showTagline={false} />
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3.5 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Box
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.95rem',
                    color: isActive ? '#7C3AED' : '#0A1128',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.25s ease',
                    '&:hover': {
                      color: '#7C3AED',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: isActive ? '100%' : '0%',
                      height: '2px',
                      backgroundColor: '#7C3AED',
                      transition: 'width 0.25s ease',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {item.label}
                </Box>
              );
            })}
          </Box>

          {/* Right CTA Button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleNavClick('/contact')}
              endIcon={<ArrowRight size={18} />}
              sx={{
                backgroundColor: '#0A1128',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                py: 1.2,
                '&:hover': {
                  backgroundColor: '#7C3AED',
                  '& .MuiButton-endIcon': {
                    transform: 'translateX(4px)',
                  },
                },
                '& .MuiButton-endIcon': {
                  transition: 'transform 0.25s ease',
                },
              }}
            >
              Let's Talk
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: '#0A1128' }}
              aria-label="open drawer"
            >
              <MenuIcon size={28} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { width: '80%', maxWidth: 360, p: 3, backgroundColor: '#FFFFFF' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <NagoraLogo height={35} />
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#0A1128' }}>
            <CloseIcon size={24} />
          </IconButton>
        </Box>

        <List sx={{ pt: 0 }}>
          {navItems.map((item) => (
            <ListItem 
              button 
              key={item.label} 
              onClick={() => handleNavClick(item.path)}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                py: 1.5,
                '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.08)' } 
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  color: location.pathname === item.path ? '#7C3AED' : '#0A1128' 
                }} 
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavClick('/contact')}
            endIcon={<ArrowRight size={18} />}
            sx={{
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Start Your Project
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
