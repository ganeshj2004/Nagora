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
  Menu,
  MenuItem,
  Collapse,
  Typography
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  X as CloseIcon, 
  ArrowRight, 
  ChevronDown, 
  CreditCard, 
  Search, 
  Calculator,
  ChevronRight
} from 'lucide-react';
import NagoraLogo from './NagoraLogo';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePaymentOpen, setMobilePaymentOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [paymentMenuAnchor, setPaymentMenuAnchor] = useState(null);

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

  const handleOpenPaymentMenu = (event) => {
    setPaymentMenuAnchor(event.currentTarget);
  };

  const handleClosePaymentMenu = () => {
    setPaymentMenuAnchor(null);
  };

  const handleNavClick = (path) => {
    handleClosePaymentMenu();
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

  const isPaymentActive = ['/payment', '/payment-status'].includes(location.pathname);

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 3 : 0}
      sx={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid #F1F5F9',
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
            {/* Home */}
            <Box
              onClick={() => handleNavClick('/')}
              sx={{
                fontWeight: location.pathname === '/' ? 700 : 600,
                fontSize: '0.95rem',
                color: location.pathname === '/' ? '#7C3AED' : '#0A1128',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              Home
            </Box>

            {/* Services */}
            <Box
              onClick={() => handleNavClick('/services')}
              sx={{
                fontWeight: location.pathname.startsWith('/services') ? 700 : 600,
                fontSize: '0.95rem',
                color: location.pathname.startsWith('/services') ? '#7C3AED' : '#0A1128',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              Services
            </Box>

            {/* Payments Dropdown Trigger */}
            <Box
              onClick={handleOpenPaymentMenu}
              sx={{
                fontWeight: isPaymentActive ? 700 : 600,
                fontSize: '0.95rem',
                color: isPaymentActive ? '#7C3AED' : '#0A1128',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              Payment <ChevronDown size={16} style={{ transform: Boolean(paymentMenuAnchor) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </Box>

            {/* Payment Dropdown Menu */}
            <Menu
              anchorEl={paymentMenuAnchor}
              open={Boolean(paymentMenuAnchor)}
              onClose={handleClosePaymentMenu}
              elevation={4}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: '16px',
                  p: 1,
                  minWidth: 230,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF'
                }
              }}
            >
              <MenuItem
                onClick={() => handleNavClick('/payment')}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.08)' }
                }}
              >
                <CreditCard size={18} color="#7C3AED" />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A1128' }}>
                    Quick UPI Payment
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Pay via GPay, PhonePe, Paytm QR
                  </Typography>
                </Box>
              </MenuItem>

              <MenuItem
                onClick={() => handleNavClick('/payment-status')}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.08)' }
                }}
              >
                <Search size={18} color="#059669" />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A1128' }}>
                    Check Payment Status
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                    View Balance & Download Receipts
                  </Typography>
                </Box>
              </MenuItem>

              <MenuItem
                onClick={() => handleNavClick('/#emi-calculator')}
                sx={{
                  borderRadius: '10px',
                  py: 1.2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.08)' }
                }}
              >
                <Calculator size={18} color="#D97706" />
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A1128' }}>
                    Pay Half Later Plans
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Calculate Easy Monthly Parts
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>

            {/* About */}
            <Box
              onClick={() => handleNavClick('/about')}
              sx={{
                fontWeight: location.pathname === '/about' ? 700 : 600,
                fontSize: '0.95rem',
                color: location.pathname === '/about' ? '#7C3AED' : '#0A1128',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              About
            </Box>

            {/* Portfolio */}
            <Box
              onClick={() => handleNavClick('/portfolio')}
              sx={{
                fontWeight: location.pathname === '/portfolio' ? 700 : 600,
                fontSize: '0.95rem',
                color: location.pathname === '/portfolio' ? '#7C3AED' : '#0A1128',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              Portfolio
            </Box>

            {/* Process */}
            <Box
              onClick={() => handleNavClick('/#process')}
              sx={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#0A1128',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              Process
            </Box>

            {/* Contact */}
            <Box
              onClick={() => handleNavClick('/contact')}
              sx={{
                fontWeight: location.pathname === '/contact' ? 700 : 600,
                fontSize: '0.95rem',
                color: location.pathname === '/contact' ? '#7C3AED' : '#0A1128',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#7C3AED' }
              }}
            >
              Contact
            </Box>
          </Box>

          {/* Right CTA Button */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(10, 17, 40, 0.15)',
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
          sx: { width: '82%', maxWidth: 360, p: 3, backgroundColor: '#FFFFFF' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <NagoraLogo height={35} />
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#0A1128' }}>
            <CloseIcon size={24} />
          </IconButton>
        </Box>

        <List sx={{ pt: 0 }}>
          <ListItem button onClick={() => handleNavClick('/')} sx={{ borderRadius: 2, mb: 1, py: 1.2 }}>
            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 700, color: location.pathname === '/' ? '#7C3AED' : '#0A1128' }} />
          </ListItem>

          <ListItem button onClick={() => handleNavClick('/services')} sx={{ borderRadius: 2, mb: 1, py: 1.2 }}>
            <ListItemText primary="Services" primaryTypographyProps={{ fontWeight: 700, color: location.pathname.startsWith('/services') ? '#7C3AED' : '#0A1128' }} />
          </ListItem>

          {/* Mobile Payments Collapsible Accordion */}
          <ListItem 
            button 
            onClick={() => setMobilePaymentOpen(!mobilePaymentOpen)} 
            sx={{ borderRadius: 2, mb: 1, py: 1.2, backgroundColor: 'rgba(124, 58, 237, 0.05)' }}
          >
            <ListItemText primary="Payment Options" primaryTypographyProps={{ fontWeight: 800, color: '#7C3AED' }} />
            <ChevronDown size={18} color="#7C3AED" style={{ transform: mobilePaymentOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </ListItem>

          <Collapse in={mobilePaymentOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2, mb: 1 }}>
              <ListItem button onClick={() => handleNavClick('/payment')} sx={{ borderRadius: 2, py: 1 }}>
                <ListItemText primary="💳 Pay Online (UPI)" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A1128' }} />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/payment-status')} sx={{ borderRadius: 2, py: 1 }}>
                <ListItemText primary="🔍 Track Payment Status" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A1128' }} />
              </ListItem>
              <ListItem button onClick={() => handleNavClick('/#emi-calculator')} sx={{ borderRadius: 2, py: 1 }}>
                <ListItemText primary="📊 0% Payment Plans" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A1128' }} />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={() => handleNavClick('/about')} sx={{ borderRadius: 2, mb: 1, py: 1.2 }}>
            <ListItemText primary="About" primaryTypographyProps={{ fontWeight: 700, color: location.pathname === '/about' ? '#7C3AED' : '#0A1128' }} />
          </ListItem>

          <ListItem button onClick={() => handleNavClick('/portfolio')} sx={{ borderRadius: 2, mb: 1, py: 1.2 }}>
            <ListItemText primary="Portfolio" primaryTypographyProps={{ fontWeight: 700, color: location.pathname === '/portfolio' ? '#7C3AED' : '#0A1128' }} />
          </ListItem>

          <ListItem button onClick={() => handleNavClick('/#process')} sx={{ borderRadius: 2, mb: 1, py: 1.2 }}>
            <ListItemText primary="Process" primaryTypographyProps={{ fontWeight: 700, color: '#0A1128' }} />
          </ListItem>

          <ListItem button onClick={() => handleNavClick('/contact')} sx={{ borderRadius: 2, mb: 1, py: 1.2 }}>
            <ListItemText primary="Contact" primaryTypographyProps={{ fontWeight: 700, color: location.pathname === '/contact' ? '#7C3AED' : '#0A1128' }} />
          </ListItem>
        </List>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavClick('/contact')}
            endIcon={<ArrowRight size={18} />}
            sx={{
              backgroundColor: '#0A1128',
              color: '#FFFFFF',
              py: 1.5,
              fontWeight: 700,
              borderRadius: '12px',
              '&:hover': { backgroundColor: '#7C3AED' }
            }}
          >
            Start Your Project
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
