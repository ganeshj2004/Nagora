import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Avatar, Rating } from '@mui/material';
import SectionHeading from '../components/SectionHeading';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    name: 'Vikramaditya Sharma',
    company: 'Aura Properties',
    service: 'Website Development & SEO',
    review: 'NAGORA transformed our entire online presence. Their web development was remarkably fast, and within 3 months of technical SEO work, our organic leads doubled. Truly strategic partners.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    name: 'Ananya Roy',
    company: 'Kinetic Apparel',
    service: 'Brand Film & Photography',
    review: 'The photos and promotional video NAGORA created for our seasonal launch were breathtaking. The lighting, tone, and editing captured our brand identity with absolute luxury quality.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    name: 'Rohan Mehta',
    company: 'Apex Fit',
    service: 'App Development',
    review: 'From initial wireframes to cloud deployment, NAGORA delivered a sleek mobile application our members love using daily. Their focus on mobile performance and UI detail is exceptional.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg">
        <SectionHeading
          pill="CLIENT TESTIMONIALS"
          title="Good Work Is Better When Clients Can Feel It."
          subtitle="Read real stories from business owners who partnered with NAGORA to scale their digital reach and brand authority."
        />

        <Grid container spacing={3.5}>
          {testimonialsData.map((item, idx) => (
            <Grid item xs={12} md={4} key={item.name}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 30px -10px rgba(10, 17, 40, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Rating value={item.rating} readOnly size="small" sx={{ color: '#D4AF37' }} />
                    <Quote size={28} color="#7C3AED" style={{ opacity: 0.3 }} />
                  </Box>

                  <Typography variant="body1" sx={{ color: '#334155', fontStyle: 'italic', mb: 3, lineHeight: 1.7, flexGrow: 1 }}>
                    "{item.review}"
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto', pt: 2, borderTop: '1px solid #F1F5F9' }}>
                    <Avatar src={item.avatar} alt={item.name} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0A1128' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.8rem' }}>
                        {item.company} • {item.service}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
