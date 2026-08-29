import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  return (
    <Box>
      <Helmet>
        <title>Contact NAGORA — Start Your Digital Growth Project</title>
        <meta name="description" content="Get in touch with NAGORA Digital Agency. Request a consultation for website development, SEO, apps, photography, videography, or branding." />
      </Helmet>

      {/* Hero Header */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0A1128', color: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: '#D4AF37', fontWeight: 800, letterSpacing: '0.15em' }}>
            GET IN TOUCH
          </Typography>
          <Typography variant="h1" sx={{ color: '#FFFFFF', fontWeight: 800, mt: 1, mb: 2 }}>
            Let's Talk About Your Next Project.
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: 650 }}>
            Have a question, a new project idea, or need a customized quote? Send us your requirements and our team will get back to you within 24 hours.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Left Side: Contact Cards */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card sx={{ borderRadius: 4, border: '1px solid #E2E8F0', p: 1 }}>
                  <CardContent sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, backgroundColor: 'rgba(124, 58, 237, 0.08)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageSquare size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128', mb: 0.5 }}>
                        Instant WhatsApp Chat
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                        Connect directly with our agency team for immediate inquiries.
                      </Typography>
                      <Typography component="a" href="https://wa.me/918072443590" target="_blank" rel="noreferrer" sx={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                        +91 8072443590 →
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, border: '1px solid #E2E8F0', p: 1 }}>
                  <CardContent sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128', mb: 0.5 }}>
                        Email Direct
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                        Send detailed briefs or RFPs to our project inbox.
                      </Typography>
                      <Typography component="a" href="mailto:contact@nagoradigital.com" sx={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>
                        contact@nagoradigital.com →
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, border: '1px solid #E2E8F0', p: 1 }}>
                  <CardContent sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: 3, backgroundColor: 'rgba(10, 17, 40, 0.06)', color: '#0A1128', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0A1128', mb: 0.5 }}>
                        Working Hours
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Monday – Saturday: 9:00 AM – 7:00 PM IST
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Right Side: Form */}
            <Grid item xs={12} md={7}>
              <ContactForm />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
