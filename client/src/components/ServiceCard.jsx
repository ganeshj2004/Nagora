import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceCard({
  number,
  title,
  heading,
  description,
  features = [],
  ctaText,
  slug,
  icon: IconComponent,
  delay = 0
}) {
  const navigate = useNavigate();

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="service-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 4,
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: 'rgba(124, 58, 237, 0.3)',
          boxShadow: '0 20px 40px -15px rgba(10, 17, 40, 0.08)',
          '& .service-arrow': {
            transform: 'translateX(6px)',
            color: '#7C3AED',
          },
          '& .service-number': {
            color: '#D4AF37',
          },
          '& .service-icon-bg': {
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
          }
        },
      }}
    >
      {/* Bottom Expanding Accent Line */}
      <div className="service-card-accent" />

      <CardContent sx={{ p: { xs: 3, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Row: Number & Icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            className="service-number"
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#94A3B8',
              letterSpacing: '0.05em',
              transition: 'color 0.3s ease',
            }}
          >
            {number}
          </Typography>

          {IconComponent && (
            <Box
              className="service-icon-bg"
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: 'rgba(124, 58, 237, 0.08)',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <IconComponent size={24} />
            </Box>
          )}
        </Box>

        {/* Category Badge & Main Heading */}
        <Typography
          variant="subtitle2"
          sx={{
            color: '#7C3AED',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.4rem' },
            fontWeight: 800,
            color: '#0A1128',
            lineHeight: 1.3,
            mb: 1.5,
          }}
        >
          {heading}
        </Typography>

        {/* Short Description */}
        <Typography
          variant="body1"
          sx={{
            color: '#475569',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          {description}
        </Typography>

        {/* Features Checklist */}
        {features.length > 0 && (
          <Box sx={{ mb: 4, mt: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {features.slice(0, 5).map((feature, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <CheckCircle2 size={16} color="#D4AF37" style={{ flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.875rem' }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Action Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(`/services/${slug}`)}
          endIcon={<ArrowRight size={18} className="service-arrow" style={{ transition: 'transform 0.25s ease' }} />}
          sx={{
            borderColor: '#E2E8F0',
            color: '#0A1128',
            fontWeight: 700,
            justifyContent: 'space-between',
            py: 1.2,
            px: 2.5,
            mt: 'auto',
            borderRadius: '50px',
            '&:hover': {
              borderColor: '#7C3AED',
              backgroundColor: 'rgba(124, 58, 237, 0.04)',
            },
          }}
        >
          {ctaText || 'Learn More'}
        </Button>
      </CardContent>
    </Card>
  );
}
