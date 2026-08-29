import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { Target, Eye, Zap, Smartphone, Users, TrendingUp } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { motion } from 'framer-motion';

const whyUsBenefits = [
  {
    title: 'Built Around Your Goal',
    description: 'We focus on what your business needs to grow revenue and connect with clients, not on selling unnecessary features.',
    icon: Target,
    color: '#7C3AED',
  },
  {
    title: 'Designed to Be Remembered',
    description: 'Every typography choice, layout grid, and visual frame is made to leave a lasting, high-end impression on visitors.',
    icon: Eye,
    color: '#D4AF37',
  },
  {
    title: 'Built for Speed',
    description: 'Fast digital experiences keep visitors engaged and ranking high on Google search engines.',
    icon: Zap,
    color: '#7C3AED',
  },
  {
    title: 'Mobile First',
    description: 'Your customers are everywhere. Your website, app, and media content work seamlessly across all mobile screens.',
    icon: Smartphone,
    color: '#D4AF37',
  },
  {
    title: 'One Team',
    description: 'Technology, SEO growth strategy, and commercial creative production work together under one unified agency roof.',
    icon: Users,
    color: '#7C3AED',
  },
  {
    title: 'Built to Grow',
    description: 'Clean, modular software code and scalable database structures built to expand as your business traffic grows.',
    icon: TrendingUp,
    color: '#D4AF37',
  },
];

export default function WhyUsSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg">
        <SectionHeading
          pill="THE NAGORA ADVANTAGE"
          title="Why Build With NAGORA?"
          subtitle="We combine high-performance software engineering with luxury creative production to produce real business results."
        />

        <Grid container spacing={3.5}>
          {whyUsBenefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    p: 1,
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: item.color,
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px -10px rgba(10, 17, 40, 0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        backgroundColor: `${item.color}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      <Icon size={26} color={item.color} />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1128', mb: 1.5, fontSize: '1.25rem' }}>
                      {item.title}
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
