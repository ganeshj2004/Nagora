import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';

// Always-visible shell components loaded eagerly
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SplashPreloader from './components/SplashPreloader';

// Route-level code splitting — each page JS loads only when visited
const Home            = lazy(() => import('./pages/Home'));
const About           = lazy(() => import('./pages/About'));
const Services        = lazy(() => import('./pages/Services'));
const ServiceDetail   = lazy(() => import('./pages/ServiceDetail'));
const PortfolioPage   = lazy(() => import('./pages/PortfolioPage'));
const ContactPage     = lazy(() => import('./pages/ContactPage'));
const PaymentPage     = lazy(() => import('./pages/PaymentPage'));
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage'));
const AdminLogin      = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const NotFound        = lazy(() => import('./pages/NotFound'));

// Minimal page-transition fallback
function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={36} sx={{ color: '#7C3AED' }} />
    </Box>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <SplashPreloader />
            <ScrollToTop />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/payment-status" element={<PaymentStatusPage />} />
                    <Route path="/payment-status/:token" element={<PaymentStatusPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Box>
              <Footer />
              <WhatsAppButton />
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
