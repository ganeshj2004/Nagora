import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

export default function SectionHeading({ 
  pill, 
  title, 
  subtitle, 
  align = 'center',
  titleColor,
  subtitleColor,
  lightMode = true
}) {
  const actualTitleColor = titleColor || (lightMode ? '#0A1128' : '#FFFFFF');
  const actualSubtitleColor = subtitleColor || (lightMode ? '#475569' : 'rgba(255, 255, 255, 0.7)');
  const pillBg = lightMode ? 'rgba(124, 58, 237, 0.08)' : 'rgba(212, 175, 55, 0.12)';
  const pillColor = lightMode ? '#7C3AED' : '#D4AF37';
  const pillBorder = lightMode ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(212, 175, 55, 0.35)';

  return (
    <Box 
      sx={{ 
        textAlign: align, 
        mb: { xs: 5, md: 7 },
        maxWidth: align === 'center' ? 760 : '100%',
        mx: align === 'center' ? 'auto' : 0
      }}
    >
      {pill && (
        <Chip
          label={pill}
          size="medium"
          sx={{
            backgroundColor: pillBg,
            color: pillColor,
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            mb: 2,
            px: 1,
            border: pillBorder,
          }}
        />
      )}

      <Typography
        variant="h2"
        sx={{
          color: actualTitleColor,
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          mb: subtitle ? 2 : 0,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="subtitle1"
          sx={{
            color: actualSubtitleColor,
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.6,
            maxWidth: 650,
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
