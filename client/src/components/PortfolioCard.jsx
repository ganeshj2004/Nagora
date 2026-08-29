import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PortfolioCard({ project, onSelect, index = 0 }) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 40px -10px rgba(10, 17, 40, 0.1)',
          '& .portfolio-img': {
            transform: 'scale(1.06)',
          },
          '& .portfolio-overlay': {
            opacity: 1,
          },
        },
      }}
      onClick={() => onSelect && onSelect(project)}
    >
      {/* Project Image Container */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: '65%' }}>
        <CardMedia
          component="img"
          image={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
          alt={project.title}
          className="portfolio-img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        {/* Category Chip */}
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
          <Chip
            label={project.category}
            size="small"
            sx={{
              backgroundColor: 'rgba(10, 17, 40, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          />
        </Box>

        {/* Hover Overlay */}
        <Box
          className="portfolio-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(124, 58, 237, 0.35)',
            backdropFilter: 'blur(3px)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<ExternalLink size={16} />}
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#0A1128',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#D4AF37',
                color: '#FFFFFF',
              },
            }}
          >
            View Project
          </Button>
        </Box>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0A1128', mb: 1, fontSize: '1.2rem' }}>
          {project.title}
        </Typography>

        <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6, flexGrow: 1 }}>
          {project.description}
        </Typography>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 'auto' }}>
            {project.tags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  height: 22,
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
